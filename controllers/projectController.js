import Project from "../models/Project.js";

// create project
export const createProject = async(req, res)=>{
  const {name, description, visibility, tags} = req.body;
  try{
     const project = await Project.create({
      name, 
      description, 
      visibility, 
      tags,
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
  try{
    const projects = Project.find({
      deletedAt: null,
      $or:[
        {owner: req.user._id},
        {"members.user": req.user._id},
      ]
    }).sort({createdAt: -1});

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
  const projectId = req.params.projectId
  const {name, description, status, visibility, tags} = req.body;
  try{
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        name,
        description,
        status,
        visibility,
        tags,
      },
      {new: true}
    );

    if(!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({success: true, message:"Project updated successfully", project});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}

// Soft delete project
export const archiveProject = async(req, res)=>{
  const projectId = req.params.projectId;
  try{
    const project = await Project.findByIdAndDelete(
      projectId,
      {
        deletedAt: new Date(),
        status: "archived"
      },
      {new: true}
    );

    if(!project){
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({success: true, message:"Project successfully deleted.", project});
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Internal server error'});
  }
}