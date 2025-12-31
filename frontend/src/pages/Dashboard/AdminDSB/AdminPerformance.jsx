import React, { useState } from "react";
import StatCard from "../../../components/StatCard";
import DataTable from "../../../components/DataTable";
import ChartCard from "../../../components/ChartCard";
import { TrendingUp, Award, Target, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";

const AdminPerformance = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "John Anderson",
      department: "Engineering",
      q1: 92,
      q2: 95,
      q3: 98,
      rating: 4.8,
      status: "Excellent",
    },
    {
      id: 2,
      name: "Sarah Chen",
      department: "Product",
      q1: 88,
      q2: 91,
      q3: 94,
      rating: 4.6,
      status: "Excellent",
    },
    {
      id: 3,
      name: "Michael Roberts",
      department: "Sales",
      q1: 85,
      q2: 87,
      q3: 89,
      rating: 4.3,
      status: "Good",
    },
    {
      id: 4,
      name: "Emma Davis",
      department: "Marketing",
      q1: 79,
      q2: 82,
      q3: 86,
      rating: 4.1,
      status: "Good",
    },
  ]);

  const performanceData = [
    { quarter: "Q1 2024", avgScore: 86, target: 85 },
    { quarter: "Q2 2024", avgScore: 89, target: 85 },
    { quarter: "Q3 2024", avgScore: 92, target: 85 },
    { quarter: "Q4 2024", avgScore: 95, target: 90 },
  ];

  const correlationData = [
    { experience: 2, performance: 78 },
    { experience: 3, performance: 82 },
    { experience: 4, performance: 85 },
    { experience: 5, performance: 88 },
    { experience: 6, performance: 91 },
    { experience: 7, performance: 92 },
    { experience: 8, performance: 94 },
    { experience: 10, performance: 95 },
  ];

  const stats = [
    {
      title: "Avg Performance",
      value: "92%",
      icon: <TrendingUp className="w-6 h-6" />,
      change: 3.2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Excellent Performers",
      value: "28",
      icon: <Award className="w-6 h-6" />,
      change: 5.1,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Goals Achieved",
      value: "87%",
      icon: <Target className="w-6 h-6" />,
      change: 2.3,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Top Performer",
      value: "John A.",
      icon: <Zap className="w-6 h-6" />,
      change: 0,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Performance Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor and analyze employee performance metrics
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
        {/* Performance Trend */}
        <ChartCard
          title="Quarterly Performance Trend"
          subtitle="Average performance vs targets"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="quarter"
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
              <Bar
                dataKey="avgScore"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                name="Avg Score"
              />
              <Bar
                dataKey="target"
                fill="#E5E7EB"
                radius={[8, 8, 0, 0]}
                name="Target"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Experience vs Performance */}
        <ChartCard
          title="Experience vs Performance"
          subtitle="Correlation analysis"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="experience"
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                label={{ value: "Years Experience", position: "insideBottomRight", offset: -5 }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: "12px" }}
                label={{ value: "Performance Score", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Scatter name="Employees" data={correlationData} fill="#3B82F6" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Performance Table */}
      <DataTable
        title="Employee Performance Ratings"
        columns={[
          { key: "name", label: "Employee Name" },
          { key: "department", label: "Department" },
          {
            key: "q3",
            label: "Q3 Score",
            render: (value) => (
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
                <span>{value}%</span>
              </div>
            ),
          },
          {
            key: "rating",
            label: "Rating",
            render: (value) => (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.floor(value) ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                  {value}
                </span>
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  value === "Excellent"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                }`}
              >
                {value}
              </span>
            ),
          },
        ]}
        data={employees}
        onEdit={(employee) => console.log("Edit:", employee)}
        searchPlaceholder="Search by name or department..."
      />
    </div>
  );
};

export default AdminPerformance;
