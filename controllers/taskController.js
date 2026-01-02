import Project from "../models/Project.js";
import Task from "../models/Task.js";

// create task
export const createTask = async(req, res)=>{
  const {title, description, priority, assignedTo, status, dueDate} = req.body;
  const projectId = req.params.projectId;

  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).status({success: false, message:"Project not found"});
    }

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      status,
      dueDate,
      project: projectId,
      createdBy: req.user._id
    });

    res.status(201).json({success: true, message:"Task created successfully", task});
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

// get tasks for a particular project
export const getTasksForProject = async(req, res)=>{
  const projectId = req.params.projectId;
  try{
    const project = await Project.findById(projectId);

    if(!project || project.deletedAt){
      return res.status(404).status({success: false, message:"Project not found"});
    }

    const tasks = await Task.find({
      project: projectId,
      deletedAt: null
    }).populate("assignedTo", "name email").sort({createdAt: -1});

    if(!task){
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({success: true, tasks});
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

// get task by Id
export const getTaskById = async(req, res)=>{
  const taskId = req.params.taskId;
  
  try{
    const task = await Task.findById(taskId).populate("assignedTo", "name email").populate("project", "name");

    if(!task || task.deletedAt){
      return res.status(404).json({success: false, message:"Task not found"});
    }

    res.status(200).json({success: true, task});
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

// update task
export const updateTask = async(req, res)=>{
  const taskId = req.params.taskId;
  const {title, description, priority, assignedTo, status, dueDate} = req.body;

  try{
    const task = await Task.findById(taskId);

    if(!task || task.deletedAt){
      return res.status(404).json({success: false, message:"Task not found"});
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo || task.assignedTo;
    task.dueDate = dueDate || task.dueDate;

    await task.save();

    res.status(200).json({success: true, message:"Task updated successfully", task});
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

// soft delete task
export const deleteTask = async(req,res)=>{
  const taskId = req.params.taskId;

  try{
    const task = await Task.findById(taskId);

    if (!task || task.deletedAt) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.deletedAt = new Date();
    await task.save();

    res.json({ success: true, message: "Task deleted successfully" });
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

// update task status
export const updateTaskStatus = async(req, res)=>{
  const taskId = req.params.taskId;
  const {status} = req.body;

  try{
    const task = await Task.findById(taskId);

    if(!task || task.deletedAt){
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = status;
    await task.save();

    res.status(200).json({success: true, mesage:"Satatus updated successfully", task});
  }
  catch(error){
    console.log("error", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}

