import express from 'express';
import { login, fetchUsers, blockUser, unBlockUser } from '../controller/adminController.js';
import verifyToken from '../middleware/middleware.js';
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

router.post('/admin_login', login);
router.get('/get_users',fetchUsers);
router.patch('/:id/block', verifyToken, requireRole("admin"), blockUser);
router.patch('/:id/unblock', verifyToken, requireRole("admin"), unBlockUser);

export default router;