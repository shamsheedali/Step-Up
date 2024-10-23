import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "../../../components/admin_components/AdminNavbar";
import AdminSidebar from "../../../components/admin_components/AdminSidebar";
import UserManagement from "../../../components/admin_components/UserManagement";
import ProductManagement from "../../../components/admin_components/ProductManagement";
import CategoryManagement from "../../../components/admin_components/CategoryManagement";

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
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
