import express from 'express';
import { createTask, deleteTask, getTasksForProject, updateTask, updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isProjectMember } from '../middlewares/projectMiddleware.js';
import { canChangeStatus, canModifyTask } from '../middlewares/taskMiddleware.js';

const router =  express.Router();

router.use(protect);

router.post("/", isProjectMember, createTask);
router.get("/", isProjectMember, getTasksForProject);
router.put("/:taskId", isProjectMember, canModifyTask, updateTask);
router.delete("/:taskId", isProjectMember, canModifyTask, deleteTask);
router.patch("/:taskId/status", isProjectMember, canChangeStatus, updateTaskStatus);

export default router;