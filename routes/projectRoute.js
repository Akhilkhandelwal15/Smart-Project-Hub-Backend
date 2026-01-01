import express from 'express';
import { archiveProject, createProject, getProjectById, getProjects, updateProject } from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isProjectMember, isProjectOwnerOrManager } from '../middlewares/projectMiddleware.js';

const router = express.Router();
router.use(protect); // using protect middleware for all project routes.

router.post("/", createProject);
router.get("/", getProjects);

router.get("/:projectId", isProjectMember, getProjectById);
router.put("/:projectId", isProjectOwnerOrManager, updateProject);
router.delete("/:projectId", isProjectOwnerOrManager, archiveProject);

export default router;