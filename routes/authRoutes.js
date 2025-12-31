import express from 'express';
import { login, register, verifyUser } from '../controllers/authController.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, authorize('user', 'admin'), verifyUser);

export default router;