import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

app.use(express.json({ limit: "10mb" }));

// Store connected users: userId -> socketId
const connectedUsers = new Map();

io.on("connection", (socket) => {
  // Client sends userId on connection
  socket.on("registerUser", (userId) => {
    connectedUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of connectedUsers) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

app.set("io", io);
app.set("connectedUsers", connectedUsers);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/address", addressRouter);
app.use("/api/bag", bagRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/offer", offerRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/review", reviewRoutes);

// Database connection
connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
