import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  Users,
  Briefcase,
  ArrowUpRight,
  Download
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getAuth } from "@/lib/auth";

export default function EmployeeSalesPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const auth = getAuth();
        const user = auth?.user;
        if (user?.email) {
          const res = await orderAPI.listAssigned(user.email);
          setOrders(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch sales data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  // Derived Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const completedRevenue = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingRevenue = totalRevenue - completedRevenue;
  const uniqueClients = new Set(orders.map(o => o.customerEmail)).size;

  // Monthly Revenue Data (Mocked logic for demo visualization)
  const chartData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
  ];

  // Populate chart data if dates exist, otherwise leave as mock for visual structure
  orders.forEach(o => {
    if (o.createdAt) {
      const month = new Date(o.createdAt).getMonth();
      if (month < 6) { // Just for the first half of year demo
        chartData[month].value += (o.totalAmount || 0);
      }
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Track revenue generation and client acquisition.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#5E33AC] to-[#8155D6] p-6 rounded-2xl text-white shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full text-white">
              +12.5%
            </span>
          </div>
          <p className="text-purple-200 text-sm font-medium mb-1">Total Revenue Generated</p>
          <h3 className="text-3xl font-bold">₹{(totalRevenue / 100000).toFixed(2)} Lakh</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Realized Revenue</p>
          <h3 className="text-2xl font-bold text-gray-900">₹{(completedRevenue / 1000).toFixed(1)}k</h3>
          <p className="text-xs text-emerald-600 mt-2 font-medium">From completed orders</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Briefcase className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Pipeline Value</p>
          <h3 className="text-2xl font-bold text-gray-900">₹{(pendingRevenue / 1000).toFixed(1)}k</h3>
          <p className="text-xs text-amber-600 mt-2 font-medium">Potential revenue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium mb-1">Active Clients</p>
          <h3 className="text-2xl font-bold text-gray-900">{uniqueClients}</h3>
          <p className="text-xs text-blue-600 mt-2 font-medium">Across all services</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
          <select className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5E33AC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5E33AC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5E33AC"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent High Value Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">High Value Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders
                .sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
                .slice(0, 5)
                .map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.customerEmail}</td>
                    <td className="px-6 py-4 text-gray-600">{order.serviceName || `Order #${order.id}`}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}