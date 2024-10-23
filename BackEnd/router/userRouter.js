import express from 'express'
import { signUp, login, storeGoogleUser } from '../controller/userController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/googleUser', storeGoogleUser);

export default  router;