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
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.post("/create", verifyToken, requireRole("admin"), createCoupon);
router.post("/verify", verifyCouponCode);
router.get("/coupons", getCoupons);
//pagination
router.get("/couponLimit", getLimitCoupons);
router.put("/edit-coupon/:id", verifyToken, requireRole("admin"), editCoupon);
router.patch("/toggle/:id", verifyToken, requireRole("admin"), toggleCouponStatus);
router.delete("/coupon/:id", verifyToken, requireRole("admin"), deleteCoupon);

export default router;
