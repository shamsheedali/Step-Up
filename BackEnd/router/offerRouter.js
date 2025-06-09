import express from 'express';
import {createOffer, getOffers, getActiveOffer, editOffer, deleteOffer} from '../controller/offerController.js';
import verifyToken from "../middleware/middleware.js";
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

router.post('/', verifyToken, requireRole("admin"), createOffer);
router.put('/:id', verifyToken, requireRole("admin"), editOffer);
router.delete('/:id', verifyToken, requireRole("admin"), deleteOffer);
router.get('/',getOffers);
router.get('/activeOffer', getActiveOffer);

export default router;