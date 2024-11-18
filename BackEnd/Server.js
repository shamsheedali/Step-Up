import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRouter from './router/userRouter.js';
import adminRouter from './router/adminRouter.js';
import categoryRouter from './router/categoryRoutes.js';
import productRouter from './router/productRouter.js';
import otpRouter from './router/otpRouter.js';
import addressRouter from './router/addressRouter.js';
import bagRouter from './router/bagRouter.js';
import orderRouter from './router/orderRouter.js';
import paymentRouter from './router/paymentRouter.js';
import wishlistRouter from './router/wishlistRouter.js';
import couponRouter from './router/couponRouter.js';
import offerRouter from './router/offerRouter.js';
import walletRouter from './router/walletRouter.js';
import connectDB from './db/connection.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

//CORS
app.use(cors());

//USER-ROUTE
app.use('/user', userRouter);
//OTP-ROUTE
app.use('/api/otp', otpRouter);
//ADMIN-ROUTE
app.use('/admin', adminRouter);
//CATEGORY-ROUTE
app.use('/category', categoryRouter);
//PRODUCT-ROUTE
app.use('/product', productRouter);
//ADDRESS-ROUTE
app.use('/address', addressRouter);
//BAG-ROUTE
app.use('/bag', bagRouter);
//WISHLIST-ROUTE
app.use('/wishlist', wishlistRouter);
//ORDER-ROUTE
app.use('/order', orderRouter);
//PAYMENT-ROUTE
app.use('/payment', paymentRouter);
//COUPON-ROUTE
app.use('/coupon', couponRouter);
//OFFER-ROUTE
app.use('/offer', offerRouter);
//WALLET-ROUTE
app.use('/wallet', walletRouter);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server Started...");
});

//DATABASE--CONNECTION
connectDB();