import Task from "../models/Task.js";

export const canChangeStatus = async(req, res, next)=>{
  const taskId = req.params.taskId;
  const userId = req.user._id;

  try{
    const task = await Task.findById(taskId);

    if(!task || task.deletedAt){
      return res.status(404).json({success: false, message:"Task not found"});
    }

    // allow task creator, assigned users, or project manager/owner to modify status
    const isAllowed = task.createdBy.toString() === userId.toString() || 
      (task.assignedTo && task.assignedTo.some((item)=> item.toString() === userId.toString())) ||
      (req.project && (req.project.owner.toString()===userId.toString() ||
      req.project.members.some((item)=> item.user.toString()===userId.toString() && item.role==="manager")));
    
    if(!isAllowed){
      return res.status(403).json({success: false, message:"Access denied: Cannot modify task"})
    }

    req.task = task;
    next();
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

export const canModifyTask = async(req, res, next)=>{
  const taskId = req.params.taskId;
  const userId = req.user._id;

  try{
    const task = await Task.findById(taskId);

    if(!task || task.deletedAt){
      return res.status(404).json({success: false, message:"Task not found"});
    }

    // allow task creator or project manager/owner to modify the task
    const isAllowed = task.createdBy.toString() === userId.toString() || 
      (req.project && (req.project.owner.toString()===userId.toString() ||
      req.project.members.some((item)=> item.user.toString()===userId.toString() && item.role==="manager")));
    
    if(!isAllowed){
      return res.status(403).json({success: false, message:"Access denied: Cannot modify task"})
    }

    req.task = task;
    next();
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

