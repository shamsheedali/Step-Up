import express from 'express';
import { login, fetchUsers, blockUser, unBlockUser } from '../controller/adminController.js';
import verifyToken from '../middleware/middleware.js';
const router = express.Router();

router.post('/admin_login', login);
router.get('/get_users', verifyToken,fetchUsers);
router.patch('/:id/block', verifyToken, blockUser);
router.patch('/:id/unblock', verifyToken, unBlockUser);

export default router;