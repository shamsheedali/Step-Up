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
  searchOrders,
} from "../controller/orderController.js";
import verifyToken from "../middleware/middleware.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

router.post("/", verifyToken, requireRole("user"), createOrder);
router.get("/limitOrders", getOrdersPagination);
router.get("/search-orders", verifyToken, requireRole("admin"), searchOrders);
router.get("/:id", getUserOrders);
router.get("/:orderId/products", getOrderProducts);
router.delete("/:id/:uid", cancelOrder);
router.delete("/order-return/:id/:uid", returnOrder);
router.get("/", getAllOrders);
router.patch("/change-status", changeStatus);
router.patch("/payment-status", changePaymentStatus);

// API for sales report
router.post("/sales-report", salesReport);

export default router;
