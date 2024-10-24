import express from 'express'
import { signUp, login, storeGoogleUser, updateUserData, changePassword } from '../controller/userController.js';
import verifyToken from '../middleware/middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/googleUser', storeGoogleUser);
router.post('/update-userdata', verifyToken, updateUserData);
router.post('/change-password', verifyToken, changePassword);

export default  router;