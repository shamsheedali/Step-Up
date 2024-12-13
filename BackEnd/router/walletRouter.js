import express from 'express';
import {getUserWalletDetails} from '../controller/walletController.js'
import verifyToken from '../middleware/middleware.js';
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

router.get('/:userId', verifyToken, requireRole("user"), getUserWalletDetails);

export default router;