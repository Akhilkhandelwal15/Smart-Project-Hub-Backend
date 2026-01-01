import Project from "../models/Project.js";

export const isProjectMember = async(req, res, next)=>{
  const projectId = req.params.projectId;
  const userId = req.user._id;

  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).json({success: false, message:"Project not found"});
    }

    const isMember = project.owner.toString() === userId.toString() || 
      project.members.some((item)=> item.user.toString() === userId.toString());

    if(!isMember){
      return res.status(403).json({success: false, message:"Access denied"});
    }

    req.project = project;
    next();
  }
  catch(error){
    console.log("error:", error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
}

export const isProjectOwnerOrManager = async(req, res, next)=>{
  const projectId = req.params.projectId;
  const userId = req.user._id;
  
  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).json({success: false, message:"Project not found"});
    }

    const isOwnerOrManager = project.owner.toString() === userId.toString() || 
      project.members.some((item)=> item.user.toString() === userId.toString() && item.role==="manager");

    if(!isOwnerOrManager){
      return res.status(403).json({success: false, message:"Access denied"});
    }

    req.project = project;
    next();
  }
  catch(error){
    console.log("error:", error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
}