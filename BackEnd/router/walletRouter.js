import express from 'express';
import {getUserWalletDetails} from '../controller/walletController.js'
import verifyToken from '../middleware/middleware.js';
const router = express.Router();

router.get('/:userId', verifyToken, getUserWalletDetails);

export default router;