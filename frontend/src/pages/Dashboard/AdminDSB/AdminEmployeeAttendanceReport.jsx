import React, { useState } from "react";
import StatCard from "../../../components/StatCard";
import ChartCard from "../../../components/ChartCard";
import DataTable from "../../../components/DataTable";
import { Calendar, CheckCircle, Clock, AlertCircle, User } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminEmployeeAttendanceReport = () => {
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const attendanceTrendData = [
    { week: "Week 1", present: 95, absent: 5, late: 3 },
    { week: "Week 2", present: 96, absent: 4, late: 2 },
    { week: "Week 3", present: 94, absent: 6, late: 4 },
    { week: "Week 4", present: 97, absent: 3, late: 1 },
    { week: "Week 5", present: 98, absent: 2, late: 1 },
  ];

  const statusData = [
    { name: "Present", value: 118 },
    { name: "Absent", value: 5 },
    { name: "Late", value: 2 },
  ];

  const departmentAttendance = [
    { department: "Sales", present: 28, absent: 1, late: 1 },
    { department: "Marketing", present: 15, absent: 1, late: 0 },
    { department: "Engineering", present: 32, absent: 2, late: 1 },
    { department: "HR", present: 8, absent: 0, late: 0 },
    { department: "Finance", present: 12, absent: 1, late: 0 },
    { department: "Operations", present: 20, absent: 1, late: 0 },
  ];

  const attendanceRecords = [
    {
      id: 1,
      name: "John Anderson",
      department: "Sales",
      date: "2024-06-14",
      checkIn: "09:00 AM",
      checkOut: "05:30 PM",
      duration: "8h 30m",
      status: "Present",
    },
    {
      id: 2,
      name: "Sarah Chen",
      department: "Engineering",
      date: "2024-06-14",
      checkIn: "08:45 AM",
      checkOut: "05:15 PM",
      duration: "8h 30m",
      status: "Present",
    },
    {
      id: 3,
      name: "Michael Roberts",
      department: "Marketing",
      date: "2024-06-14",
      checkIn: "—",
      checkOut: "—",
      duration: "0h",
      status: "Absent",
    },
    {
      id: 4,
      name: "Emma Davis",
      department: "Sales",
      date: "2024-06-14",
      checkIn: "09:30 AM",
      checkOut: "—",
      duration: "In Progress",
      status: "Present",
    },
    {
      id: 5,
      name: "Robert Taylor",
      department: "Finance",
      date: "2024-06-14",
      checkIn: "09:15 AM",
      checkOut: "05:45 PM",
      duration: "8h 30m",
      status: "Present",
    },
    {
      id: 6,
      name: "Jessica Martinez",
      department: "HR",
      date: "2024-06-14",
      checkIn: "09:05 AM",
      checkOut: "06:00 PM",
      duration: "8h 55m",
      status: "Present",
    },
  ];

  let filteredRecords = attendanceRecords;
  if (filterDepartment !== "all") {
    filteredRecords = filteredRecords.filter(
      (record) => record.department === filterDepartment
    );
  }
  if (filterStatus !== "all") {
    filteredRecords = filteredRecords.filter(
      (record) => record.status === filterStatus
    );
  }

  const totalEmployees = 125;
  const presentToday = statusData[0].value;
  const absentToday = statusData[1].value;
  const lateToday = statusData[2].value;
  const attendanceRate = ((presentToday / (presentToday + absentToday + lateToday)) * 100).toFixed(1);

  const stats = [
    {
      title: "Present Today",
      value: presentToday.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      change: 1.2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Absent Today",
      value: absentToday.toString(),
      icon: <AlertCircle className="w-6 h-6" />,
      change: -2.1,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      title: "Late Arrivals",
      value: lateToday.toString(),
      icon: <Clock className="w-6 h-6" />,
      change: 0,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Attendance Report
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track and manage employee attendance
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Trend */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Attendance Trend"
            subtitle="Weekly attendance overview"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrendData}>
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
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: "#EF4444", r: 4 }}
                  name="Absent"
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ fill: "#F59E0B", r: 4 }}
                  name="Late"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Today's Status Distribution */}
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

      {/* Department Attendance */}
      <ChartCard title="Attendance by Department" subtitle="Department-wise breakdown">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentAttendance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="department"
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
            <Bar dataKey="present" fill="#10B981" name="Present" />
            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
            <Bar dataKey="late" fill="#F59E0B" name="Late" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Filters */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <DataTable
        title="Today's Attendance Records"
        columns={[
          { key: "name", label: "Employee Name" },
          { key: "department", label: "Department" },
          { key: "date", label: "Date" },
          { key: "checkIn", label: "Check In" },
          { key: "checkOut", label: "Check Out" },
          { key: "duration", label: "Duration" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  value === "Present"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : value === "Absent"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={filteredRecords}
        searchPlaceholder="Search by employee name..."
      />
    </div>
  );
};

export default AdminEmployeeAttendanceReport;
