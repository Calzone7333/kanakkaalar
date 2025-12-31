import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout";
import { clearAuth } from "../../../lib/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("auth:update"));
    navigate("/");
  };

  return (
    <AdminLayout logout={handleLogout}>
      <Outlet />
    </AdminLayout>
  );
}
