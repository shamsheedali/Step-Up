import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "../../../components/admin_components/AdminNavbar";
import AdminSidebar from "../../../components/admin_components/AdminSidebar";
import UserManagement from "../../../components/admin_components/UserManagement";
import ProductManagement from "../../../components/admin_components/ProductManagement";
import CategoryManagement from "../../../components/admin_components/CategoryManagement";
import OrderManagement from "../../../components/admin_components/OrderManagement";
import CouponManagement from "../../../components/admin_components/CouponManagement";
import SalesReport from "../../../components/admin_components/SalesReport";
import OfferManagement from "../../../components/admin_components/OfferManagement";
import Overview from "../../../components/admin_components/Overview";

const Dashboard = () => {
  return (
    <div className="h-screen bg-[#1f2937]">
      <AdminNavbar />

      <AdminSidebar />

      <div className="content-area">
        <Routes>
          <Route path="user_management" element={<UserManagement />} />
          <Route path="product_management" element={<ProductManagement />} />
          <Route path="category_management" element={<CategoryManagement />} />
          <Route path="order_management" element={<OrderManagement />} />
          <Route path="coupon_management" element={<CouponManagement />} />
          <Route path="offer_management" element={<OfferManagement />} />
          <Route path="sales_report" element={<SalesReport />} />
          <Route path="overview" element={<Overview />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
