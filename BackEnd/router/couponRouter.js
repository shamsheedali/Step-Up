import express from "express";
import {
  createCoupon,
  getCoupons,
  verifyCouponCode,
  editCoupon,
  toggleCouponStatus,
  getLimitCoupons,
  deleteCoupon,
} from "../controller/couponController.js";
import verifyToken from "../middleware/middleware.js";

const router = express.Router();

router.post("/create", verifyToken, createCoupon);
router.post("/verify", verifyToken, verifyCouponCode);
router.get("/coupons", getCoupons);
//pagination
router.get("/couponLimit", getLimitCoupons);
router.put("/edit-coupon/:id", verifyToken, editCoupon);
router.patch("/toggle/:id", verifyToken, toggleCouponStatus);
router.delete("/coupon/:id", verifyToken, deleteCoupon);

export default router;
