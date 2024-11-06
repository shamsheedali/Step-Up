import express from 'express';
import {createCoupon, getCoupons, verifyCouponCode,deleteCoupon} from '../controller/couponController.js'
import verifyToken from "../middleware/middleware.js";

const router = express.Router();

router.post('/create', verifyToken,createCoupon);
router.post('/verify', verifyToken,verifyCouponCode);
router.get('/coupons',getCoupons);
router.delete('/coupon/:id',verifyToken, deleteCoupon);

export default router;