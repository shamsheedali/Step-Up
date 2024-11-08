import express from 'express';
import {createOffer, getOffers, getActiveOffer} from '../controller/offerController.js';
import verifyToken from "../middleware/middleware.js";
const router = express.Router();

router.post('/create', verifyToken,createOffer);
router.get('/get-offers',getOffers);
router.get('/get-activeOffer', getActiveOffer);

export default router;