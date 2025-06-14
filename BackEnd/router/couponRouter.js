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

router.post("/", verifyToken, requireRole("admin"), createCoupon);
router.post("/verify", verifyToken, verifyCouponCode);
router.get("/", verifyToken, getCoupons);
//pagination
router.get("/couponLimit", verifyToken, requireRole("admin"), getLimitCoupons);
router.put("/coupon/:id", verifyToken, requireRole("admin"), editCoupon);
router.patch("/toggle/:id", verifyToken, requireRole("admin"), toggleCouponStatus);
router.delete("/coupon/:id", verifyToken, requireRole("admin"), deleteCoupon);

export default router;
