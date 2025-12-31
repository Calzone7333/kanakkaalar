import React, { useEffect, useState } from "react";
import StatCard from "../../../components/StatCard";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { walletAPI, orderAPI } from "../../../lib/api";

const AgentHome = () => {
    const [stats, setStats] = useState({
        balance: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [walletRes, ordersRes] = await Promise.all([
                    walletAPI.getWallet(),
                    orderAPI.myOrders()
                ]);

                const orders = ordersRes.data || [];
                setStats({
                    balance: walletRes.data?.balance || 0,
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length,
                    completedOrders: orders.filter(o => o.status === 'COMPLETED').length
                });
            } catch (error) {
                console.error("Failed to fetch agent stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Wallet Balance"
                    value={`₹${stats.balance.toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6 text-green-600" />}
                    change={0} // Calculate change if historical data available
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={<ShoppingCart className="w-6 h-6 text-blue-600" />}
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
                />
                <StatCard
                    title="Completed Orders"
                    value={stats.completedOrders}
                    icon={<Users className="w-6 h-6 text-purple-600" />}
                />
            </div>

            {/* Add charts or recent activity here if needed */}
        </div>
    );
};

export default AgentHome;
