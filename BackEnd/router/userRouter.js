import express from 'express'
import { signUp, login, storeGoogleUser, updateUserData } from '../controller/userController.js';
import verifyToken from '../middleware/middleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/googleUser', storeGoogleUser);
router.post('/update-userdata', verifyToken,updateUserData);

export default  router;