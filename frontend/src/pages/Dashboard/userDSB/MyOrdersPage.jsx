import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBagIcon,
    CalendarIcon,
    CurrencyRupeeIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

const StatusBadge = ({ status }) => {
    let styles = "bg-slate-100 text-slate-600 border-slate-200";
    let label = status.replace(/_/g, ' ').toLowerCase();

    switch (status) {
        case 'PAYMENT_COMPLETED':
        case 'COMPLETED':
            styles = "bg-teal-50 text-teal-700 border-teal-200";
            label = "Active";
            break;
        case 'DRAFT':
            styles = "bg-slate-50 text-slate-500 border-slate-200";
            label = "Draft";
            break;
        case 'PENDING_PAYMENT':
        case 'PENDING':
            styles = "bg-amber-50 text-amber-700 border-amber-200";
            label = "Payment Pending";
            break;
        case 'PROCESSING':
            styles = "bg-blue-50 text-blue-700 border-blue-200";
            label = "Processing";
            break;
        case 'FAILED':
        case 'CANCELLED':
            styles = "bg-red-50 text-red-700 border-red-200";
            label = "Failed";
            break;
        default:
            break;
    }

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${styles} capitalize tracking-wide`}>
            {status === 'PAYMENT_COMPLETED' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>}
            {label}
        </span>
    );
};

export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderAPI.myOrders();
            // Sort by createdAt desc by default
            const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sorted);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderClick = (order) => {
        if (order.status === 'DRAFT' || order.status === 'PENDING_PAYMENT') {
            navigate(`/dashboard/user/service-order?orderId=${order.id}`);
        } else {
            navigate(`/dashboard/user/order/${order.id}`);
        }
    };

    // Filter logic
    const filteredOrders = orders.filter(o =>
        o.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(o.id).includes(searchQuery)
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#003366] tracking-tight">My Orders</h1>
                        <p className="text-slate-500 mt-1 text-xs md:text-sm">Manage and track your service applications.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard/user/servicehub')}
                            className="flex items-center px-4 py-2 bg-[#003366] text-white rounded-lg font-semibold shadow-md shadow-blue-900/10 hover:shadow-lg hover:bg-[#002244] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            New Application
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="block w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-[#003366] transition-colors"
                    >
                        <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="w-12 h-12 border-4 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin"></div>
                            <p className="text-slate-500 text-sm font-medium">Loading your orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
                        >
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBagIcon className="w-9 h-9 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">No orders found</h3>
                            <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
                                {searchQuery ? "Try adjusting your search terms." : "You haven't placed any orders yet. Start your journey today!"}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => navigate('/dashboard/user/servicehub')}
                                    className="text-[#003366] font-bold hover:text-[#C59B4E] flex items-center justify-center mx-auto transition-colors"
                                >
                                    Browse Services <ChevronRightIcon className="w-4 h-4 ml-1" />
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {filteredOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        variants={itemVariants}
                                        layout
                                        onClick={() => handleOrderClick(order)}
                                        className="group relative bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-[#003366]/30 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                            {/* Icon Box */}
                                            <div className="shrink-0">
                                                <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center group-hover:bg-[#003366] transition-colors duration-300">
                                                    <DocumentTextIcon className="w-5 h-5 text-[#003366] group-hover:text-white transition-colors" />
                                                </div>
                                            </div>

                                            {/* Main Info */}
                                            <div className="flex-grow min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                                                    <h3 className="text-sm md:text-base font-bold text-slate-800 group-hover:text-[#003366] transition-colors truncate">
                                                        {order.serviceName || "Untitled Service"}
                                                    </h3>
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                                                        #{String(order.id).split('-')[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                                    <div className="flex items-center">
                                                        <CalendarIcon className="w-3 h-3 mr-1" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center text-slate-700 font-semibold bg-slate-50 px-1.5 py-0.5 rounded">
                                                        <CurrencyRupeeIcon className="w-3 h-3 mr-1 text-slate-400" />
                                                        {order.totalAmount?.toLocaleString() || '0'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: Status & Action */}
                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-3 md:mt-0 gap-3 md:gap-1.5">
                                                <StatusBadge status={order.status} />

                                                <div className="hidden md:flex items-center text-[10px] font-bold text-[#C59B4E] group-hover:translate-x-1 transition-transform">
                                                    View Details <ChevronRightIcon className="w-2.5 h-2.5 ml-1" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Only: Action footer */}
                                        <div className="mt-3 pt-3 border-t border-slate-50 flex md:hidden justify-end">
                                            <div className="flex items-center text-[10px] font-bold text-[#C59B4E]">
                                                View details <ChevronRightIcon className="w-2.5 h-2.5 ml-1" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
