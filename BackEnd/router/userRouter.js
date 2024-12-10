import express from 'express'
import { signUp, login, storeGoogleUser, updateUserData, changePassword, forgotPassword, forgotPasswordVerify } from '../controller/userController.js';
import verifyToken from '../middleware/middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/googleUser', storeGoogleUser);
router.post('/update-userdata', verifyToken, updateUserData);
router.post('/change-password', verifyToken, changePassword)
router.post('/forgotPassword', forgotPassword);
router.post('/forgotPassword-verify', forgotPasswordVerify);

export default  router;