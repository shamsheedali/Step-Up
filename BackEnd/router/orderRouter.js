import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderProducts,
  cancelOrder,
  getAllOrders,
  changeStatus,
  salesReport,
  changePaymentStatus,
  getOrdersPagination,
  returnOrder,
} from "../controller/orderController.js";
import verifyToken from "../middleware/middleware.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("user"), createOrder);
router.get("/limitOrders", getOrdersPagination);
router.get("/:id", getUserOrders);
router.get("/:orderId/products", getOrderProducts);
router.delete("/:id/:uid", cancelOrder);
router.delete("/order-return/:id/:uid", returnOrder);
router.get("/", getAllOrders);
router.patch("/change-status", changeStatus);
router.patch("/payment-status", changePaymentStatus);

//api for sales-report
router.post("/sales-report", salesReport);

export default router;
