import React, { useState, useEffect, useMemo } from "react";
import StatCard from "../../../components/StatCard";
import DataTable from "../../../components/DataTable";
import ChartCard from "../../../components/ChartCard";
import { Users, TrendingUp, BarChart3, Activity, Edit, Trash2 } from "lucide-react";
import { getAuth } from "../../../lib/auth";
import { adminAPI } from "../../../lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminCustomerLifecycle = () => {
  const [customers, setCustomers] = useState([]);
  const [lifecycleData, setLifecycleData] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalRevenue: 0,
    churnRate: "0%",
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await adminAPI.getCustomerLifecycleData();
        setCustomers(res.data.customers);
        setStats(res.data.stats);
        setLifecycleData(res.data.lifecycleData);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers.toLocaleString(),
      icon: <Activity className="w-6 h-6" />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Churn Rate",
      value: stats.churnRate,
      icon: <BarChart3 className="w-6 h-6" />,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Customer Lifecycle Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage customer relationships across their entire lifecycle
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      {/* Lifecycle Trend Chart */}
      <ChartCard
        title="Customer Lifecycle Trend"
        subtitle="Monthly customer acquisition and churn"
      >
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lifecycleData}>
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
            <Line
              type="monotone"
              dataKey="new"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: "#10B981", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="churned"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ fill: "#EF4444", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Customers Table */}
      <DataTable
        loading={loading}
        title="Customers"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${value === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                  }`}
              >
                {value}
              </span>
            ),
          },
          {
            key: "revenue",
            label: "Revenue",
            render: (value) => `₹${value.toLocaleString()}`,
          },
          { key: "lastContact", label: "Last Contact" },
          {
            key: "actions",
            label: "Actions",
            render: (_, item) => (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => console.log("Edit:", item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => console.log("Delete:", item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ),
          },
        ]}
        data={filteredCustomers}
        onAdd={() => console.log("Add customer")}
        searchPlaceholder="Search by name or email..."
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default AdminCustomerLifecycle;
