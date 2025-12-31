import React, { useState, useEffect } from "react";
import StatCard from "../../../components/StatCard";
import DataTable from "../../../components/DataTable";
import ChartCard from "../../../components/ChartCard";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { attendanceAPI } from "../../../lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminAttendance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    attendanceRate: "0.0"
  });
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    fetchAttendance();
    fetchStats();
    fetchTrend();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await attendanceAPI.getAll();
      const data = res.data || [];

      // Filter today's records
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = data.filter(att => {
        const attDate = new Date(att.date).toISOString().split('T')[0];
        return attDate === today;
      });

      // Format for display
      const formatted = todayRecords.map(att => ({
        id: att.id,
        name: att.user?.fullName || "Unknown",
        date: new Date(att.date).toLocaleDateString(),
        checkIn: att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : "—",
        checkOut: att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : "—",
        duration: att.duration || (att.checkOutTime ? "In Progress" : "0h"),
        status: att.status || "Present",
      }));

      setRecords(formatted);
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await attendanceAPI.getStats();
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchTrend = async () => {
    try {
      const res = await attendanceAPI.getTrend();
      setTrendData(res.data || []);
    } catch (error) {
      console.error("Failed to fetch trend", error);
      // Fallback to mock data
      setTrendData([
        { week: "Week 1", present: 95, absent: 5, late: 3 },
        { week: "Week 2", present: 96, absent: 4, late: 2 },
        { week: "Week 3", present: 94, absent: 6, late: 4 },
        { week: "Week 4", present: 97, absent: 3, late: 1 },
      ]);
    }
  };

  const statusData = [
    { name: "Present", value: Number(stats.present) || 0 },
    { name: "Absent", value: Number(stats.absent) || 0 },
    { name: "Late", value: Number(stats.late) || 0 },
  ];

  const statCards = [
    {
      title: "Present Today",
      value: stats.present?.toString() || "0",
      icon: <CheckCircle className="w-6 h-6" />,
      change: 1.2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Late Arrivals",
      value: stats.late?.toString() || "0",
      icon: <Clock className="w-6 h-6" />,
      change: 0,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Absent",
      value: stats.absent?.toString() || "0",
      icon: <AlertCircle className="w-6 h-6" />,
      change: -2.1,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      icon: <Calendar className="w-6 h-6" />,
      change: 0.8,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  const COLORS = ["#10B981", "#EF4444", "#F59E0B"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Attendance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track and manage employee attendance (Office hours: 9:30 AM - Late after 9:45 AM)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Attendance Trend"
            subtitle="Weekly attendance overview (Last 4 weeks)"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="week"
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
                  dataKey="present"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 4 }}
                  name="Present"
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", r: 4 }}
                  name="Late"
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444", r: 4 }}
                  name="Absent"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Status Distribution */}
        <ChartCard title="Today's Status" subtitle="Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Attendance Records */}
      <DataTable
        loading={loading}
        title="Today's Attendance"
        columns={[
          { key: "name", label: "Employee Name" },
          { key: "date", label: "Date" },
          { key: "checkIn", label: "Check In" },
          { key: "checkOut", label: "Check Out" },
          { key: "duration", label: "Duration" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${value === "Present"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : value === "Late"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={records}
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
};

export default AdminAttendance;
