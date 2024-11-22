import React from "react";
import { Navigate } from "react-router-dom";

const adminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin_login" />;
  }
  return children;
};

export default adminProtectedRoute;
