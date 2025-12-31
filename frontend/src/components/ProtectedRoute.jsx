import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "../lib/auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const authData = getAuth();
  const location = useLocation();

  // 1. Check if the user is logged in (i.e., if a token exists)
  const token = authData?.token;
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the route requires specific roles and if the user has one of them
  const user = authData?.user;
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = user?.role?.toUpperCase();
    const isAllowed = allowedRoles.some(role => role.toUpperCase() === userRole);
    if (!isAllowed) {
      // User is logged in but doesn't have the right role, redirect to a general dashboard or home
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}
