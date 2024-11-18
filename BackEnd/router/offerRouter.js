import express from 'express';
import {createOffer, getOffers, getActiveOffer, editOffer, deleteOffer} from '../controller/offerController.js';
import verifyToken from "../middleware/middleware.js";
const router = express.Router();

router.post('/create', verifyToken,createOffer);
router.put('/editOffer/:id', verifyToken, editOffer);
router.delete('/deleteOffer/:id', verifyToken, deleteOffer);
router.get('/get-offers',getOffers);
router.get('/get-activeOffer', getActiveOffer);

export default router;