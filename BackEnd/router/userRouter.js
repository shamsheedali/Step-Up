import express from 'express'
import { signUp, login, storeGoogleUser, updateUserData, changePassword, forgotPassword, forgotPasswordVerify, fetchUsers } from '../controller/userController.js';
import verifyToken from '../middleware/middleware.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/googleUser', storeGoogleUser);
router.patch('/', verifyToken, requireRole("user"), updateUserData);
router.put('/change-password', verifyToken, requireRole("user"), changePassword)
router.post('/forgotPassword', forgotPassword);
router.post('/forgotPassword-verify', forgotPasswordVerify);
//fetch-all-users(for-users)
router.get('/users', fetchUsers);

export default  router;