import { PROJECT_PERMISSIONS } from "../config/projectPermissions.js";
import Project from "../models/Project.js";

// create project
export const createProject = async(req, res)=>{
  const {name, description, visibility, tags} = req.body;
  const tagsArray = tags.trim()!="" ? tags.split(',').map(tag => tag.trim()) : [];
  try{
     const project = await Project.create({
      name, 
      description, 
      visibility, 
      tags: tagsArray,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: 'owner'
        }
      ]
    });

    return res.status(201).json({success: true, message:"Project created succesfully", project}); // 201: resource successfully created.
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

// get user projects
export const getProjects = async(req, res)=>{
  const userId = req.user._id;
  try{
    const projects = await Project.find({
      deletedAt: null,
      $or:[
        {owner: req.user._id},
        {"members.user": req.user._id},
      ]
    }).sort({createdAt: -1}).lean(); // lean() converts mongoose object to plain JS objects

    projects.forEach((p)=>{
      const member = p.members.find((m)=> m.user.toString() === userId.toString());
      const role = member.role;
      console.log("inside map:", member, role);
      p.permissions = PROJECT_PERMISSIONS[role] || [];
    });

    console.log(projects);

    return res.status(200).json({success: true, projects}); // 200: resource successfully fetched (used when you retrieve or update a resource)
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

// get single project
export const getProjectById = async(req, res)=>{
  const projectId = req.params.projectId;
  try{
    const project = await Project.findOne({
      _id: projectId,
      deletedAt: null
    }).populate("members.user", "name, email"); // here populate: For each object in members, replace the user field (ObjectId) with the actual user document, but only include the name and email fields.”

    if(!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({success: true, project}); // 200: resource successfully fetched (used when you retrieve or update a resource)
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

// update project
export const updateProject = async(req, res)=>{
  const projectId = req.params.projectId;
  console.log(req.body);
  const {name, description, status, visibility, tags, members = [], managers = [], allowComments, allowAttachments} = req.body;
  try{
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const owner = project.members.find(m => m.role === "owner");

    const updatedMembers = [
      owner,
      ...members.map(userId=>({
        user: userId,
        role: "member"
      })),
      ...managers.map(userId => ({
        user: userId,
        role: "manager",
      })),
    ]

    project.name = name;
    project.description = description;
    project.visibility = visibility;
    project.tags = tags.split(",").map(t => t.trim());
    project.members = updatedMembers;
    project.settings = {
      allowComments,
      allowAttachments,
    };
    project.status = status;

    await project.save();

    return res.status(200).json({success: true, message:"Project updated successfully", project});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

// Soft delete project
export const deleteProject = async(req, res)=>{
  const projectId = req.params.projectId;
  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    project.deletedAt = new Date();
    project.status = 'archived';

    await project.save();

    res.status(200).json({success: true, message:"Project successfully deleted.", project});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

export const getProjectPermissions = async(req, res)=>{
  const projectRole = req.projectRole;
  const permissions = req.getProjectPermissions;
  res.status(200).json({role: projectRole, permissions});
}