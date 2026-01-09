import { PROJECT_PERMISSIONS } from "../config/projectPermissions.js";
import Project from "../models/Project.js";

export const isProjectMember = async(req, res, next)=>{
  const projectId = req.params.projectId;
  const userId = req.user._id;
  console.log("projectId:", projectId);
  console.log("userId", userId);
  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).json({success: false, message:"Project not found"});
    }

    const member = project.members.find((m)=> m.user.toString() === userId.toString());

    if(!member){
      return res.status(403).json({success: false, message:"Not a project member"});
    }

    req.project = project;
    req.projectRole = member.role;
    next();
  }
  catch(error){
    console.log("Error in project middleware:", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

export const resolveProjectPermissions = (req, res, next)=>{
  try{
    const role = req.projectRole;
    const permissions = PROJECT_PERMISSIONS[role];

    if(!permissions){
      return res.status(403).json({success: false, message:"Invalid project role"});
    }

    req.projectPermissions = permissions;
    next();
  }
  catch(error){
    console.log("Error in resolveProjectPermissions middleware:", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}


export const requireProjectPermission = (permission)=>{
  return (req, res, next)=>{
    const projectPermissions = req.projectPermissions;
    if(!projectPermissions?.[permission]){ //here kept permission inside the brackets because permission is dynamic.
      return res.status(403).json({success: false, message:"Insufficient project permissions."});
    }
    next();
  }
}