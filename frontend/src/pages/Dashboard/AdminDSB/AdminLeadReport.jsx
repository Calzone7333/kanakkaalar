import React, { useState } from "react";
import StatCard from "../../../components/StatCard";
import ChartCard from "../../../components/ChartCard";
import DataTable from "../../../components/DataTable";
import { TrendingUp, Users, Filter, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

const AdminLeadReport = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const leadTrendData = [
    { month: "Jan", total: 120, qualified: 45, converted: 12 },
    { month: "Feb", total: 135, qualified: 52, converted: 18 },
    { month: "Mar", total: 110, qualified: 48, converted: 15 },
    { month: "Apr", total: 145, qualified: 58, converted: 22 },
    { month: "May", total: 160, qualified: 65, converted: 28 },
    { month: "Jun", total: 180, qualified: 75, converted: 35 },
  ];

  const sourceData = [
    { name: "Website", value: 45 },
    { name: "Referral", value: 25 },
    { name: "Direct", value: 20 },
    { name: "Social Media", value: 10 },
  ];

  const conversionData = [
    { stage: "New", count: 320 },
    { stage: "In Progress", count: 215 },
    { stage: "Qualified", count: 145 },
    { stage: "Won", count: 98 },
    { stage: "Lost", count: 42 },
  ];

  const leadRecords = [
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "Tech Startups Inc",
      email: "rajesh@techstartups.com",
      phone: "+91-9876543210",
      status: "Qualified",
      priority: "High",
      service: "GST Registration",
      value: "₹4,999",
      createdDate: "2024-06-10",
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Fashion Retail Ltd",
      email: "priya@fashionretail.com",
      phone: "+91-8765432109",
      status: "In Progress",
      priority: "High",
      service: "Trademark Filing",
      value: "₹5,999",
      createdDate: "2024-06-08",
    },
    {
      id: 3,
      name: "Amit Patel",
      company: "Manufacturing Corp",
      email: "amit@manufacturing.com",
      phone: "+91-7654321098",
      status: "New",
      priority: "Medium",
      service: "Company Registration",
      value: "₹9,999",
      createdDate: "2024-06-12",
    },
    {
      id: 4,
      name: "Neha Singh",
      company: "Consulting Services",
      email: "neha@consulting.com",
      phone: "+91-6543210987",
      status: "Won",
      priority: "Low",
      service: "Annual Compliance",
      value: "₹14,999",
      createdDate: "2024-05-28",
    },
    {
      id: 5,
      name: "Vikram Rao",
      company: "Software Solutions",
      email: "vikram@softsolutions.com",
      phone: "+91-5432109876",
      status: "Lost",
      priority: "Medium",
      service: "Business Setup",
      value: "₹3,999",
      createdDate: "2024-05-15",
    },
  ];

  let filteredLeads = leadRecords;
  if (filterStatus !== "all") {
    filteredLeads = filteredLeads.filter((lead) => lead.status === filterStatus);
  }
  if (filterPriority !== "all") {
    filteredLeads = filteredLeads.filter((lead) => lead.priority === filterPriority);
  }

  const totalLeads = leadRecords.length;
  const qualifiedLeads = leadRecords.filter((l) => l.status === "Qualified").length;
  const wonLeads = leadRecords.filter((l) => l.status === "Won").length;
  const conversionRate = ((wonLeads / totalLeads) * 100).toFixed(1);

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lead Report
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Track and analyze your sales pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 transition bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={totalLeads.toString()}
          icon={<Users className="w-6 h-6" />}
          change={12.5}
          description="This month"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Qualified Leads"
          value={qualifiedLeads.toString()}
          icon={<TrendingUp className="w-6 h-6" />}
          change={8.2}
          description="Ready to close"
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={<Filter className="w-6 h-6" />}
          change={2.3}
          description="Won deals"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Won This Month"
          value={wonLeads.toString()}
          icon={<TrendingUp className="w-6 h-6" />}
          change={15.7}
          description="Closed deals"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lead Trend Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Lead Trend"
            subtitle="Monthly lead progression"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadTrendData}>
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
                  dataKey="total"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  name="Total Leads"
                />
                <Line
                  type="monotone"
                  dataKey="qualified"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6", r: 4 }}
                  name="Qualified"
                />
                <Line
                  type="monotone"
                  dataKey="converted"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 4 }}
                  name="Converted"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Lead Source Distribution */}
        <ChartCard title="Lead Sources" subtitle="Distribution by channel">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Lead Stage Breakdown */}
      <ChartCard title="Lead Stage Breakdown" subtitle="Conversion funnel">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="stage"
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
            <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} />
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
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lead Records Table */}
      <DataTable
        title="Lead Details"
        columns={[
          { key: "name", label: "Lead Name" },
          { key: "company", label: "Company" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  value === "New"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : value === "In Progress"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : value === "Qualified"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : value === "Won"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {value}
              </span>
            ),
          },
          {
            key: "priority",
            label: "Priority",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  value === "High"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : value === "Medium"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {value}
              </span>
            ),
          },
          { key: "service", label: "Service Interest" },
          { key: "value", label: "Est. Value" },
        ]}
        data={filteredLeads}
        searchPlaceholder="Search leads by name or email..."
      />
    </div>
  );
};

export default AdminLeadReport;
