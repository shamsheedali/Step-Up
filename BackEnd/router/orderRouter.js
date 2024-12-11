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

const router = express.Router();

router.post("/createOrder", verifyToken, createOrder);
router.get("/orders/:id", verifyToken, getUserOrders);
router.get("/orders/:orderId/products", getOrderProducts);
router.delete("/order-delete/:id/:uid", cancelOrder);
router.delete("/order-return/:id/:uid", returnOrder);
router.get("/getallorders", getAllOrders);
router.get("/change_status", changeStatus);
router.get("/change_payment_status", changePaymentStatus);
router.get("/limitOrders", getOrdersPagination);

//api for sales-report
router.post("/sales-report", salesReport);

export default router;
