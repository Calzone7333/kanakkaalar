import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { BarChart2, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import { serviceHubAPI } from "../../../lib/api"; // <-- your existing API service

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const sResp = await serviceHubAPI.status("ADMIN");
        if (!mounted) return;
        setStats(sResp.data || null);
        setError(null);
      } catch (err) {
        console.error("Failed to load admin reports", err);
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500 bg-white rounded shadow">Loading reports...</div>;
  }
  if (error) {
    return (
      <div className="p-6 text-red-700 border border-red-200 rounded bg-red-50">
        Failed to load reports: {String(error?.message || error)}
      </div>
    );
  }

  if (!stats) return null;

  // Chart Data
  const totalDocs = stats.totalDocuments ?? 0;
  const unverified = stats.unverifiedDocuments ?? 0;
  const verified = totalDocs - unverified;
  const verifiedPercent = totalDocs > 0 ? Math.round((verified / totalDocs) * 100) : 0;

  const pieData = [
    { name: "Verified", value: verified },
    { name: "Unverified", value: unverified },
  ];

  const barData = [
    { name: "Total Orders", value: stats.totalOrders ?? 0 },
    { name: "Assigned Orders", value: stats.assignedOrdersCount ?? 0 },
    { name: "Total Documents", value: totalDocs },
    { name: "Unverified Docs", value: unverified },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-semibold text-slate-800">📊 Admin Reports</h2>
        <div className="text-sm text-slate-500">
          Updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BarChart2 className="w-6 h-6 text-blue-500" />}
          label="Total Orders"
          value={stats.totalOrders ?? 0}
          gradient="from-blue-100 to-blue-50"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          label="Assigned Orders"
          value={stats.assignedOrdersCount ?? 0}
          gradient="from-green-100 to-green-50"
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-indigo-500" />}
          label="Total Documents"
          value={stats.totalDocuments ?? 0}
          gradient="from-indigo-100 to-indigo-50"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
          label="Unverified Documents"
          value={stats.unverifiedDocuments ?? 0}
          gradient="from-red-100 to-red-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Pie Chart */}
        <div className="p-6 bg-white border shadow-sm rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold text-slate-700">
            Documents Verification Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-center text-slate-600">
            {verifiedPercent}% Documents Verified
          </div>
        </div>

        {/* Bar Chart */}
        <div className="p-6 bg-white border shadow-sm rounded-2xl">
          <h3 className="mb-4 text-lg font-semibold text-slate-700">
            Overall System Statistics
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Stat Card
function StatCard({ icon, label, value, gradient }) {
  return (
    <div
      className={`p-5 rounded-2xl bg-gradient-to-br ${gradient} border shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between">
        <div className="p-3 bg-white shadow-sm rounded-xl">{icon}</div>
        <div className="text-3xl font-semibold text-slate-800">{value}</div>
      </div>
      <div className="mt-3 text-sm font-medium text-slate-600">{label}</div>
    </div>
  );
}
