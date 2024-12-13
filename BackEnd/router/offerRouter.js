import express from 'express';
import {createOffer, getOffers, getActiveOffer, editOffer, deleteOffer} from '../controller/offerController.js';
import verifyToken from "../middleware/middleware.js";
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

router.post('/create', verifyToken, requireRole("admin"), createOffer);
router.put('/editOffer/:id', verifyToken, requireRole("admin"), editOffer);
router.delete('/deleteOffer/:id', verifyToken, requireRole("admin"), deleteOffer);
router.get('/get-offers',getOffers);
router.get('/get-activeOffer', getActiveOffer);

export default router;