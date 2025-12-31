import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../lib/auth";
import { orderAPI } from "../lib/api";

export default function DashboardIndex() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [authPresent, setAuthPresent] = useState(false);

  const nav = useNavigate();

  // ✅ Run once on mount
  useEffect(() => {
    const authData = getAuth();
    const user = authData?.user;

    // Redirect if no user
    if (!user) {
      nav("/login");
      return;
    }

    const token = authData?.token;
    setAuthPresent(!!token);

    // If no token, show info & stop
    if (!token) {
      setInfo("No auth token found. Please login to view your orders.");
      setOrders([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    const fetchOrders = async () => {
      setError(null);
      setInfo(null);
      setLoading(true);

      try {
        const response = await orderAPI.myOrders();

        const data = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.orders)
              ? response.data.orders
              : [];

        if (mounted) setOrders(data);
      } catch (err) {

        // 🔁 Network fallback
        if (
          err?.code === "ERR_NETWORK" ||
          (err?.message &&
            err.message.toLowerCase().includes("network"))
        ) {
          try {
            const publicResp = await orderAPI.getAll();
            const fallbackData = Array.isArray(publicResp?.data)
              ? publicResp.data
              : Array.isArray(publicResp?.data?.data)
                ? publicResp.data.data
                : [];

            if (!mounted) return;
            if (fallbackData.length > 0) {
              setOrders(fallbackData);
              setInfo(
                "Loaded public orders as a fallback. Your user-specific orders endpoint failed to reach the backend."
              );
            } else {
              setOrders([]);
              setInfo("Could not reach backend. Showing no orders.");
            }
            return;
          } catch (fallbackErr) {
            if (!mounted) return;
            setOrders([]);
            setInfo("Could not reach backend. Showing no orders.");
            return;
          }
        }

        // 🔒 Auth fallback
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          try {
            const publicResp = await orderAPI.getAll();
            const all = Array.isArray(publicResp?.data)
              ? publicResp.data
              : Array.isArray(publicResp?.data?.data)
                ? publicResp.data.data
                : [];
            const filtered = all.filter((o) => {
              if (o.userId && user?.id)
                return Number(o.userId) === Number(user.id);
              if (o.customerEmail && user?.email)
                return (
                  String(o.customerEmail).toLowerCase() ===
                  String(user.email).toLowerCase()
                );
              return false;
            });
            if (!mounted) return;
            setOrders(filtered);
            setInfo(
              filtered.length > 0
                ? "Loaded matching orders from public list (auth endpoint failed)."
                : "No matching orders found in public list."
            );
            return;
          } catch (pubErr) {
            if (!mounted) return;
            setError(new Error("Authentication error. Please login again."));
            return;
          }
        }

        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []); // ✅ empty dependency → runs once only

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <svg
          className="w-6 h-6 mr-3 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading your orders...
      </div>
    );
  }

  if (error && !(Array.isArray(orders) && orders.length > 0)) {
    return (
      <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
        ❌ Error fetching your orders: {error.message || "Unknown error"}.
        <br />
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-3 py-1 bg-[#003366] text-white rounded hover:bg-[#002244]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        {/* <div className="text-sm text-slate-500">
          Auth:{" "}
          <span
            className={`font-medium ${authPresent ? "text-green-600" : "text-red-600"
              }`}
          >
            {authPresent ? "present" : "missing"}
          </span>
        </div> */}
      </div>

      {info && (
        <div className="p-3 my-4 text-sm text-yellow-800 border border-yellow-200 rounded bg-yellow-50">
          {info}
        </div>
      )}
      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="relative p-6 transition-all duration-200 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl hover:ring-2 hover:ring-[#0080FF] cursor-pointer"
            >
              <h3 className="text-xl font-extrabold text-[#0080FF]">
                {order.serviceName || "Untitled Service"}
              </h3>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Order ID:</span> {order.id}
                </p>
                <p>
                  <span className="font-medium">Customer:</span>{" "}
                  {order.customerEmail || getAuth()?.user?.email}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${order.status === "PAYMENT_COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "CREATED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Amount:</span> ₹
                  {order.totalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500 bg-white border border-dashed rounded-lg">
          <p className="text-lg">You don’t have any orders yet.</p>
          <button
            onClick={() => nav("/dashboard/user/servicehub")}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-[#0080FF] rounded-lg hover:bg-[#0066CC] transition"
          >
            Explore Services
          </button>
        </div>
      )}
    </div>
  );
}
