import React, { useState } from "react";
import StatCard from "../../../components/StatCard";
import ChartCard from "../../../components/ChartCard";
import DataTable from "../../../components/DataTable";
import { DollarSign, TrendingUp, Target, Zap } from "lucide-react";
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

const AdminDealReport = () => {
  const [filterStage, setFilterStage] = useState("all");
  const [filterOwner, setFilterOwner] = useState("all");

  const dealTrendData = [
    { month: "Jan", deals: 12, value: 425000, closed: 5 },
    { month: "Feb", deals: 15, value: 512000, closed: 7 },
    { month: "Mar", deals: 10, value: 380000, closed: 4 },
    { month: "Apr", deals: 18, value: 645000, closed: 9 },
    { month: "May", deals: 22, value: 780000, closed: 11 },
    { month: "Jun", deals: 25, value: 895000, closed: 13 },
  ];

  const stageDistribution = [
    { name: "Lead In", value: 20, deals: 8 },
    { name: "Qualification", value: 25, deals: 10 },
    { name: "Proposal Sent", value: 30, deals: 12 },
    { name: "Negotiation", value: 18, deals: 7 },
    { name: "Closed Won", value: 5, deals: 2 },
    { name: "Closed Lost", value: 2, deals: 1 },
  ];

  const dealRecords = [
    {
      id: 1,
      name: "Stark Industries - Enterprise Deal",
      customer: "Tony Stark",
      amount: "₹1,25,000",
      stage: "Proposal Sent",
      probability: 75,
      owner: "Alice Johnson",
      dueDate: "2024-11-15",
    },
    {
      id: 2,
      name: "Asgard Tech - Cloud Migration",
      customer: "Thor Odinson",
      amount: "₹89,000",
      stage: "Negotiation",
      probability: 60,
      owner: "Bob Smith",
      dueDate: "2024-11-20",
    },
    {
      id: 3,
      name: "Maximoff - SaaS Contract",
      customer: "Wanda Maximoff",
      amount: "₹1,56,000",
      stage: "Qualification",
      probability: 40,
      owner: "Carol Davis",
      dueDate: "2024-11-30",
    },
    {
      id: 4,
      name: "Banner Research - Pilot",
      customer: "Bruce Banner",
      amount: "₹34,000",
      stage: "Closed Won",
      probability: 100,
      owner: "David Wilson",
      dueDate: "2024-10-20",
    },
    {
      id: 5,
      name: "Loki Solutions - Integration",
      customer: "Loki Laufeyson",
      amount: "₹67,000",
      stage: "Lead In",
      probability: 20,
      owner: "Emma Brown",
      dueDate: "2024-12-10",
    },
  ];

  let filteredDeals = dealRecords;
  if (filterStage !== "all") {
    filteredDeals = filteredDeals.filter((deal) => deal.stage === filterStage);
  }
  if (filterOwner !== "all") {
    filteredDeals = filteredDeals.filter((deal) => deal.owner === filterOwner);
  }

  const totalDeals = dealRecords.length;
  const totalValue = dealRecords.reduce((sum, deal) => {
    const value = parseInt(deal.amount.replace(/[₹,]/g, ""));
    return sum + value;
  }, 0);
  const avgDealSize = Math.round(totalValue / totalDeals);
  const closedDeals = dealRecords.filter((d) => d.stage === "Closed Won").length;
  const winRate = ((closedDeals / totalDeals) * 100).toFixed(1);

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Deal Report
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Monitor your sales pipeline and opportunities
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pipeline Value"
          value={`₹${(totalValue / 100000).toFixed(1)}L`}
          icon={<DollarSign className="w-6 h-6" />}
          change={18.5}
          description="All deals"
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Active Deals"
          value={totalDeals.toString()}
          icon={<Target className="w-6 h-6" />}
          change={12.3}
          description="In pipeline"
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Avg Deal Size"
          value={`₹${(avgDealSize / 1000).toFixed(0)}K`}
          icon={<Zap className="w-6 h-6" />}
          change={5.2}
          description="Per opportunity"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          change={3.8}
          description="Last 30 days"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Deal Trend Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Deal Trend"
            subtitle="Monthly deal value and count"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dealTrendData}>
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
                  dataKey="deals"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  name="Total Deals"
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 4 }}
                  name="Closed Won"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pipeline by Stage */}
        <ChartCard title="Pipeline by Stage" subtitle="Deal distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stageDistribution.map((entry, index) => (
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

      {/* Stage Details */}
      <ChartCard title="Stage Breakdown" subtitle="Deals by stage">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stageDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="deals" fill="#3B82F6" radius={[8, 8, 0, 0]} />
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
              Stage
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stages</option>
              <option value="Lead In">Lead In</option>
              <option value="Qualification">Qualification</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Owner
            </label>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Owners</option>
              <option value="Alice Johnson">Alice Johnson</option>
              <option value="Bob Smith">Bob Smith</option>
              <option value="Carol Davis">Carol Davis</option>
              <option value="David Wilson">David Wilson</option>
              <option value="Emma Brown">Emma Brown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deal Records Table */}
      <DataTable
        title="Deal Details"
        columns={[
          { key: "name", label: "Deal Name" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount" },
          {
            key: "stage",
            label: "Stage",
            render: (value) => (
              <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                {value}
              </span>
            ),
          },
          {
            key: "probability",
            label: "Probability",
            render: (value) => (
              <div className="flex items-center gap-2">
                <div className="w-12 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs font-semibold">{value}%</span>
              </div>
            ),
          },
          { key: "owner", label: "Owner" },
          { key: "dueDate", label: "Due Date" },
        ]}
        data={filteredDeals}
        searchPlaceholder="Search deals by name or customer..."
      />
    </div>
  );
};

export default AdminDealReport;
