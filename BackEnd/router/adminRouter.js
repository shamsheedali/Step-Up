import express from 'express';
import { login, fetchUsers, blockUser, unBlockUser, searchUsers, searchProducts } from '../controller/adminController.js';
import verifyToken from '../middleware/middleware.js';
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

router.post('/admin-login', login);
router.get('/all-users', verifyToken, requireRole("admin"), fetchUsers);
router.patch('/:id/block', verifyToken, requireRole("admin"), blockUser);
router.patch('/:id/unblock', verifyToken, requireRole("admin"), unBlockUser);
router.get("/search-users", verifyToken, requireRole("admin"), searchUsers);
router.get("/search-products", verifyToken, requireRole("admin"), searchProducts);

export default router;