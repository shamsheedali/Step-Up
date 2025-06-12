import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRouter from "./router/userRouter.js";
import adminRouter from "./router/adminRouter.js";
import categoryRouter from "./router/categoryRoutes.js";
import productRouter from "./router/productRouter.js";
import otpRouter from "./router/otpRouter.js";
import addressRouter from "./router/addressRouter.js";
import bagRouter from "./router/bagRouter.js";
import orderRouter from "./router/orderRouter.js";
import paymentRouter from "./router/paymentRouter.js";
import wishlistRouter from "./router/wishlistRouter.js";
import couponRouter from "./router/couponRouter.js";
import offerRouter from "./router/offerRouter.js";
import walletRouter from "./router/walletRouter.js";
import reviewRoutes from "./router/reviewRoutes.js";
import connectDB from "./db/connection.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

//CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//USER-ROUTE
app.use("/api/user", userRouter);
//OTP-ROUTE
app.use("/api/otp", otpRouter);
//ADMIN-ROUTE
app.use("/api/admin", adminRouter);
//CATEGORY-ROUTE
app.use("/api/category", categoryRouter);
//PRODUCT-ROUTE
app.use("/api/product", productRouter);
//ADDRESS-ROUTE
app.use("/api/address", addressRouter);
//BAG-ROUTE
app.use("/api/bag", bagRouter);
//WISHLIST-ROUTE
app.use("/api/wishlist", wishlistRouter);
//ORDER-ROUTE
app.use("/api/order", orderRouter);
//PAYMENT-ROUTE
app.use("/api/payment", paymentRouter);
//COUPON-ROUTE
app.use("/api/coupon", couponRouter);
//OFFER-ROUTE
app.use("/api/offer", offerRouter);
//WALLET-ROUTE
app.use("/api/wallet", walletRouter);
//REVIEW-ROUTE
app.use("/api/review", reviewRoutes);

//DATABASE--CONNECTION
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
