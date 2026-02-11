import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token → redirect to Unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
