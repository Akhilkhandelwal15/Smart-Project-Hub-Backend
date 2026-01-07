import express from 'express';
import { createProject, deleteProject, getProjectById, getProjectPermissions, getProjects, updateProject } from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isProjectMember, requireProjectPermission, resolveProjectPermissions } from '../middlewares/projectMiddleware.js';

const router = express.Router();
router.use(protect); // using protect middleware for all project routes.

router.post("/", createProject);
router.get("/", getProjects);

router.get("/:projectId", isProjectMember, getProjectById);
// router.put("/:projectId", isProjectOwnerOrManager, updateProject);
// router.delete("/:projectId", isProjectOwnerOrManager, deleteProject);

router.put("/:projectId", isProjectMember, resolveProjectPermissions, requireProjectPermission("canEditProject"), updateProject);
router.delete("/:projectId", isProjectMember, resolveProjectPermissions, requireProjectPermission("canDeleteProject"), deleteProject);

router.get("/:projectId/permissions", isProjectMember, resolveProjectPermissions, getProjectPermissions);

export default router;