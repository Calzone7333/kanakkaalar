import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  CurrencyRupeeIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { orderAPI } from "@/lib/api";
import AdminOrderDetailModal from "./AdminOrderDetailModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id?.toString().includes(searchTerm) ||
          order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, orders]);

  const statusColors = {
    CREATED: "bg-blue-100 text-blue-800",
    DOCUMENTS_PENDING: "bg-yellow-100 text-yellow-800",
    DOCUMENTS_VERIFIED: "bg-purple-100 text-purple-800",
    PAYMENT_COMPLETED: "bg-green-100 text-green-800",
    ASSIGNED: "bg-indigo-100 text-indigo-800",
    IN_PROGRESS: "bg-orange-100 text-orange-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAYMENT_COMPLETED":
      case "DOCUMENTS_VERIFIED":
      case "COMPLETED":
        return <CheckIcon className="w-4 h-4" />;
      case "CANCELLED":
        return <XMarkIcon className="w-4 h-4" />;
      default:
        return <ArrowPathIcon className="w-4 h-4" />;
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all orders and assign them to employees
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchOrders();
          }}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <ArrowPathIcon
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <input
            type="text"
            placeholder="Search by Order ID, Email, or Service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <FunnelIcon className="absolute w-5 h-5 text-gray-400 top-3 left-3" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="DOCUMENTS_PENDING">Documents Pending</option>
            <option value="DOCUMENTS_VERIFIED">Documents Verified</option>
            <option value="PAYMENT_COMPLETED">Payment Completed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-end">
          <span className="text-sm font-medium text-gray-700">
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full animate-pulse">
              <ArrowPathIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex items-center justify-center py-12 bg-white border border-gray-200 rounded-lg">
          <div className="text-center">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">No orders found</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Service
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-left text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{order.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.serviceName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-600">
                      ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                          statusColors[order.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status?.replace(/_/g, " ") || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.assigneeEmail ? (
                        <div className="flex items-center gap-2 font-medium text-indigo-600">
                          <UserIcon className="w-4 h-4" />
                          {order.assigneeEmail}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOrderClick(order)}
                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onAssigned={(updatedOrder) => {
            setOrders(
              orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );
            setShowModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
