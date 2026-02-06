import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // no token → redirect to login
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    let role = decoded.role;

    // normalize: treat "string" as "Admin"
    if (role === "string") {
      role = "Admin";
    }

    // check role
    if (role !== allowedRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  } catch (err) {
    // invalid token → redirect to login
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
