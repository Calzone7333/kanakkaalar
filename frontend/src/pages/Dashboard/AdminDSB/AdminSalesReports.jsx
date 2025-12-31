import React, { useState } from "react";
import StatCard from "../../../components/StatCard";
import DataTable from "../../../components/DataTable";
import ChartCard from "../../../components/ChartCard";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const AdminSalesReports = () => {
  const [sales, setSales] = useState([
    {
      id: 1,
      date: "2024-06-14",
      product: "Premium Plan",
      customer: "Acme Corp",
      amount: 12500,
      quantity: 5,
      status: "Completed",
    },
    {
      id: 2,
      date: "2024-06-13",
      product: "Starter Bundle",
      customer: "TechInno Inc",
      amount: 4500,
      quantity: 9,
      status: "Completed",
    },
    {
      id: 3,
      date: "2024-06-13",
      product: "Enterprise Suite",
      customer: "Global Solutions",
      amount: 25000,
      quantity: 1,
      status: "Pending",
    },
    {
      id: 4,
      date: "2024-06-12",
      product: "Consulting Services",
      customer: "Future Systems",
      amount: 8750,
      quantity: 1,
      status: "Completed",
    },
  ]);

  const salesData = [
    { month: "Jan", sales: 85000, target: 80000, profit: 25500 },
    { month: "Feb", sales: 92000, target: 80000, profit: 27600 },
    { month: "Mar", sales: 78000, target: 80000, profit: 23400 },
    { month: "Apr", sales: 105000, target: 80000, profit: 31500 },
    { month: "May", sales: 98000, target: 85000, profit: 29400 },
    { month: "Jun", sales: 125000, target: 90000, profit: 37500 },
  ];

  const categoryData = [
    { category: "Software", revenue: 285000, growth: 12.5 },
    { category: "Consulting", revenue: 156000, growth: 8.2 },
    { category: "Support", revenue: 98000, growth: 5.3 },
    { category: "Training", revenue: 74500, growth: 18.7 },
  ];

  const stats = [
    {
      title: "Total Sales",
      value: "$483K",
      icon: <DollarSign className="w-6 h-6" />,
      change: 12.5,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Orders This Month",
      value: "145",
      icon: <ShoppingCart className="w-6 h-6" />,
      change: 8.3,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Avg Order Value",
      value: "$3,331",
      icon: <TrendingUp className="w-6 h-6" />,
      change: 3.2,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Profit Margin",
      value: "30.9%",
      icon: <BarChart3 className="w-6 h-6" />,
      change: 1.8,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sales Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Comprehensive sales and revenue analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales vs Target */}
        <ChartCard
          title="Sales vs Target"
          subtitle="Monthly comparison"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#E5E7EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Trend */}
        <ChartCard
          title="Profit Trend"
          subtitle="Monthly profit analysis"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                fill="#10B981"
                stroke="#059669"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Category Performance */}
      <ChartCard
        title="Revenue by Category"
        subtitle="Category-wise sales breakdown"
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <YAxis
              dataKey="category"
              type="category"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Sales Transactions */}
      <DataTable
        title="Recent Sales"
        columns={[
          { key: "date", label: "Date" },
          { key: "product", label: "Product" },
          { key: "customer", label: "Customer" },
          {
            key: "amount",
            label: "Amount",
            render: (value) => `$${value.toLocaleString()}`,
          },
          { key: "quantity", label: "Qty" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  value === "Completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={sales}
        searchPlaceholder="Search by product or customer..."
      />
    </div>
  );
};

export default AdminSalesReports;
