import React, { useState, useEffect } from "react";
import {
    Users, FileText, CreditCard, Bell,
    Search, Filter, Plus, MoreVertical,
    Phone, Mail, MapPin, Calendar,
    CheckCircle, Clock, AlertCircle,
    ChevronRight, ArrowUpRight, Wallet, Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../../components/StatCard";
import DataTable from "../../../../components/DataTable";
import { crmAPI } from "../../../../lib/api";

const AdminCrmDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeServices: 0,
        pendingRequests: 0,
        totalRevenue: 0
    });
    const [recentCustomers, setRecentCustomers] = useState([]);
    const [serviceStats, setServiceStats] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch dashboard stats
            const statsRes = await crmAPI.getDashboardStats();
            setStats({
                totalCustomers: statsRes.data.totalCustomers || 0,
                activeServices: statsRes.data.activeServices || 0,
                pendingRequests: statsRes.data.pendingRequests || 0,
                totalRevenue: statsRes.data.totalRevenue || 0
            });

            // Fetch recent customers
            const customersRes = await crmAPI.getAllProfiles();
            const profiles = customersRes.data || [];

            // Get recent 5 customers
            const recent = profiles.slice(0, 5).map(profile => ({
                id: profile.id,
                name: profile.user?.fullName || 'N/A',
                email: profile.user?.email || 'N/A',
                phone: profile.user?.phone || profile.whatsappNumber || 'N/A',
                status: profile.status || 'Active',
                kycStatus: profile.kycStatus || 'Pending',
                services: 0
            }));
            setRecentCustomers(recent);

            // Fetch service requests for stats
            const servicesRes = await crmAPI.getAllServiceRequests();
            const services = servicesRes.data || [];

            // Calculate service statistics
            const serviceMap = {};
            services.forEach(service => {
                const name = service.serviceName || 'Other';
                serviceMap[name] = (serviceMap[name] || 0) + 1;
            });

            const serviceStatsArray = Object.entries(serviceMap).slice(0, 4).map(([label, count], idx) => ({
                label,
                count,
                color: ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'][idx]
            }));
            setServiceStats(serviceStatsArray);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            title: "Total Customers",
            value: stats.totalCustomers.toString(),
            icon: <Users className="w-6 h-6" />,
            change: 12.5,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Active Services",
            value: stats.activeServices.toString(),
            icon: <FileText className="w-6 h-6" />,
            change: 8.2,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
        },
        {
            title: "Pending Requests",
            value: stats.pendingRequests.toString(),
            icon: <Clock className="w-6 h-6" />,
            change: -2.4,
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            title: "Total Revenue",
            value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
            icon: <Wallet className="w-6 h-6" />,
            change: 15.3,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your B2C customers, services, and support.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/dashboard/admin/crm/companies")}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
                    >
                        <Building size={18} />
                        Companies
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/admin/crm/customers")}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        View All Customers
                    </button>
                    <button
                        onClick={() => navigate("/dashboard/admin/crm/customers")}
                        className="px-4 py-2 bg-[#0189BB] text-white rounded-lg hover:bg-[#017a9b] font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Customers Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Customers</h3>
                        <button
                            onClick={() => navigate("/dashboard/admin/crm/customers")}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                        >
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        {recentCustomers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Users size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No customers found. Add your first customer to get started!</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Services</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {recentCustomers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    {customer.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{customer.email}</span>
                                                    <span className="text-xs text-gray-400">{customer.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${customer.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                        customer.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                                    {customer.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.services} Active
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/dashboard/admin/crm/customer/${customer.id}`)}
                                                    className="text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Modules */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#0189BB] to-[#01688f] rounded-xl p-6 text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors text-left flex flex-col gap-2">
                                <FileText size={20} />
                                New Service
                            </button>
                            <button
                                onClick={() => navigate("/dashboard/admin/leads")}
                                className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors text-left flex flex-col gap-2"
                            >
                                <Users size={20} />
                                Add Lead
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors text-left flex flex-col gap-2">
                                <Wallet size={20} />
                                Add Money
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm font-medium transition-colors text-left flex flex-col gap-2">
                                <Bell size={20} />
                                Send Alert
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Overview</h3>
                        <div className="space-y-4">
                            {serviceStats.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No services yet</p>
                            ) : (
                                serviceStats.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                                        </div>
                                        <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCrmDashboard;
