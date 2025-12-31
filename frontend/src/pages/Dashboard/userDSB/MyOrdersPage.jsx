import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "@/lib/api";
import {
    ShoppingBagIcon,
    CalendarIcon,
    CurrencyRupeeIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await orderAPI.myOrders();
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PAYMENT_COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'FAILED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const handleOrderClick = (order) => {
        // If order is in draft/pending payment, go to the wizard flow to complete it
        if (order.status === 'DRAFT' || order.status === 'PENDING_PAYMENT') {
            navigate(`/dashboard/user/service-order?orderId=${order.id}`);
        } else {
            // Otherwise go to the detail view
            navigate(`/dashboard/user/order/${order.id}`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage your service applications</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/user/servicehub')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
                >
                    <ShoppingBagIcon className="w-5 h-5 mr-2" />
                    New Service
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <ShoppingBagIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any service orders yet.</p>
                    <button
                        onClick={() => navigate('/dashboard/user/servicehub')}
                        className="text-blue-600 font-medium hover:text-blue-800"
                    >
                        Browse Services &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            onClick={() => handleOrderClick(order)}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1" title={order.serviceName}>
                                    {order.serviceName || "Service Order"}
                                </h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <CurrencyRupeeIcon className="w-4 h-4 mr-2" />
                                        <span>₹{order.totalAmount?.toLocaleString() || '0'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <ClockIcon className="w-4 h-4 mr-2" />
                                        <span>ID: #{String(order.id).substring(0, 8)}...</span>
                                    </div>
                                </div>

                                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    View Details <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                            {/* Progress Bar (Mock) */}
                            <div className="h-1 w-full bg-gray-100">
                                <div
                                    className={`h-full ${order.status === 'PAYMENT_COMPLETED' ? 'bg-green-500' : 'bg-blue-500'}`}
                                    style={{ width: order.status === 'PAYMENT_COMPLETED' ? '40%' : '10%' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
