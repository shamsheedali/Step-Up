import express from "express";
import { createOrder, getUserOrders, getOrderProducts, cancelOrder } from "../controller/orderController.js";
import verifyToken from "../middleware/middleware.js";

const router = express.Router();


router.post("/createOrder", verifyToken, createOrder);
router.get("/orders/:id", verifyToken, getUserOrders);
router.get("/orders/:orderId/products", getOrderProducts);
router.delete('/order-delete/:id', verifyToken, cancelOrder)

export default router;
