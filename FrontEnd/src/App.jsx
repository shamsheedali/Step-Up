import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Signup from "./pages/user/signup/Signup";
import Login from "./pages/user/login/Login";
import AdminLogin from "./pages/admin/adminlogin/AdminLogin";
import Homepage from "./pages/user/homepage/Homepage";
import AllProduct from "./pages/user/all_product/AllProduct";
import SingleProductPage from "./pages/user/single_productpage/SingleProductPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpPage from "./pages/user/otp/OtpPage";
import Page404 from "./components/user_components/404/Page404";
import ProfilePage from "./pages/user/profile_page/ProfilePage";
import Settings from "./pages/user/settings/Settings";
import DeliveryAddresses from "./pages/user/delivery_addresses/DeliveryAddresses";
import Bag from "./pages/user/bag/Bag";
import Checkout from "./pages/user/checkout/Checkout";
import ListOrders from "./pages/user/orders/ListOrders";
import Wishlist from "./pages/user/wishlist/Wishlist";
import Coupons from "./pages/user/coupons/Coupons";
import OrderSuccessPage from "./pages/user/order_success/OrderSuccessPage";
import Wallet from "./pages/user/wallet/Wallet";
import OrderDetailsPage from "./pages/user/orderDetails/OrderDetailsPage";
import AdminProtectedRoute from "../src/protectedRoutes/adminProtectedRoute";
import UserProtectedRoute from "./protectedRoutes/UserProtectedRoute";
import OrderPendingPage from "./pages/user/orderPending/OrderPendingPage";
import ForgotPassword from "./pages/user/forgotPassword/ForgotPassword";
import ForgotPasswordVerify from "./pages/user/forgotPassword_verify/ForgotPasswordVerify";

const App = () => {
  return (
    <div className="bg-white text-black font-clash-display">
      <ToastContainer theme="dark" />
      <Routes>
        {/* USER--ROUTES */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/forgotPassword-verify"
          element={<ForgotPasswordVerify />}
        />
        <Route path="/products" element={<AllProduct />} />
        <Route path="/products/:id" element={<SingleProductPage />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <ProfilePage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <UserProtectedRoute>
              <Settings />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/settings/delivery-addresses"
          element={
            <UserProtectedRoute>
              <DeliveryAddresses />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <UserProtectedRoute>
              <ListOrders />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/orders/:id"
          element={
            <UserProtectedRoute>
              <OrderDetailsPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/coupons"
          element={
            <UserProtectedRoute>
              <Coupons />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/profile/wallet"
          element={
            <UserProtectedRoute>
              <Wallet />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bag"
          element={
            <UserProtectedRoute>
              <Bag />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <UserProtectedRoute>
              <Wishlist />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/wishlist/:id"
          element={
            <UserProtectedRoute>
              <SingleProductPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bag/checkout"
          element={
            <UserProtectedRoute>
              <Checkout />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bag/checkout/order-success"
          element={
            <UserProtectedRoute>
              <OrderSuccessPage />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/bag/checkout/order-pending"
          element={
            <UserProtectedRoute>
              <OrderPendingPage />
            </UserProtectedRoute>
          }
        />

        {/* ADMIN--ROUTES */}
        <Route
          path="/dashboard/*"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 404 PAGE */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
};

export default App;
