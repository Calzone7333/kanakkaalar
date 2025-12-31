import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
  ListBulletIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

const WorkflowTimeline = ({ orderId, progress }) => {
  const stages = [
    { key: "WEB", label: "Web/App", sequence: 1, color: "from-blue-500" },
    { key: "CRM", label: "CRM Routing", sequence: 2, color: "from-purple-500" },
    {
      key: "SALES",
      label: "Sales & Payment",
      sequence: 3,
      color: "from-pink-500",
    },
    { key: "ONBD", label: "Onboarding", sequence: 4, color: "from-orange-500" },
    { key: "CASE", label: "Case Mgmt", sequence: 5, color: "from-yellow-500" },
    { key: "EXEC", label: "Execution", sequence: 6, color: "from-green-500" },
    { key: "GOVT", label: "Gov't Portal", sequence: 7, color: "from-teal-500" },
    {
      key: "QA",
      label: "QA & Compliance",
      sequence: 8,
      color: "from-indigo-500",
    },
    { key: "DEL", label: "Delivery", sequence: 9, color: "from-emerald-500" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "bg-green-500 ring-green-300",
      IN_PROGRESS: "bg-blue-500 ring-blue-300",
      PENDING: "bg-gray-300 ring-gray-200",
      FAILED: "bg-red-500 ring-red-300",
      BLOCKED: "bg-yellow-500 ring-yellow-300",
    };
    return colors[status] || colors.PENDING;
  };

  const stageStatusMap = {};
  if (progress?.stages) {
    progress.stages.forEach((s) => {
      stageStatusMap[s.stage] = s.status;
    });
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border-t-4 border-indigo-600">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Workflow Timeline</h2>
        <div className="text-xs md:text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {progress?.completionPercentage || 0}% Complete
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 hidden md:block">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress?.completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline Stages - Responsive Layout */}
      <div className="relative">
        {/* Desktop: Horizontal Connecting Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 transform -translate-y-1/2" />

        {/* Mobile: Vertical Connecting Line */}
        <div className="lg:hidden absolute top-4 bottom-4 left-6 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-emerald-300 transform -translate-x-1/2" />

        {/* Stage Cards */}
        <div className="flex flex-col lg:grid lg:grid-cols-9 gap-6 lg:gap-2">
          {stages.map((stage, idx) => {
            const stageStatus = stageStatusMap[stage.key] || "PENDING";
            const isCompleted = stageStatus === "COMPLETED";
            const isInProgress = stageStatus === "IN_PROGRESS";

            return (
              <div key={stage.key} className="relative pl-14 lg:pl-0">
                <div
                  className={`flex lg:flex-col items-center lg:justify-center cursor-pointer transition-all lg:hover:scale-110 ${isCompleted
                      ? "opacity-100"
                      : isInProgress
                        ? "opacity-100"
                        : "opacity-75"
                    }`}
                  title={`${stage.label} - ${stageStatus}`}
                >
                  {/* Stage Circle */}
                  <div className="absolute left-0 lg:static lg:mb-3">
                    <div
                      className={`w-12 h-12 rounded-full ${getStatusColor(stageStatus)} ring-4 flex items-center justify-center text-white font-bold text-sm shadow-lg relative z-10 bg-white`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : (
                        <span>{stage.sequence}</span>
                      )}
                    </div>
                    {isInProgress && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
                    )}
                  </div>

                  {/* Stage Label & Status (Desktop: Centered, Mobile: Left aligned) */}
                  <div className="text-left lg:text-center">
                    <div className="text-sm lg:text-xs font-semibold text-gray-700 leading-tight">
                      {stage.label}
                    </div>
                    <div
                      className={`text-xs mt-1 font-medium ${isCompleted
                          ? "text-green-600"
                          : isInProgress
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                    >
                      {stageStatus.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ExceptionCard = ({ exception }) => {
  const exceptionColors = {
    PF: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      title: "Payment Failure",
    },
    MD: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      title: "Missing Documents",
    },
    GO: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      title: "Govt Objection",
    },
    SLAB: {
      bg: "bg-pink-50",
      border: "border-pink-200",
      icon: "text-pink-600",
      title: "SLA Breach Risk",
    },
    CR: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      title: "Cancellation Request",
    },
  };

  const config = exceptionColors[exception.stage] || exceptionColors.PF;

  return (
    <div
      className={`${config.bg} border-l-4 ${config.border} p-4 rounded-lg mb-3`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-semibold ${config.icon}`}>{config.title}</p>
          <p className="text-sm text-gray-700 mt-1">{exception.description}</p>
          {exception.details && (
            <p className="text-xs text-gray-600 mt-2 italic">
              {exception.details}
            </p>
          )}
        </div>
        <ExclamationTriangleIcon
          className={`w-5 h-5 ${config.icon} flex-shrink-0`}
        />
      </div>
    </div>
  );
};

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockLeads = [
      {
        id: 1,
        name: "Alice Smith",
        service: "GST Registration",
        status: "In Progress",
        assigned: "Employee A",
        value: 499,
        progress: 50,
      },
      {
        id: 2,
        name: "Bob Johnson",
        service: "Trademark Filing",
        status: "In Progress",
        assigned: "Employee B",
        value: 5999,
        progress: 70,
      },
      {
        id: 3,
        name: "Charlie Brown",
        service: "Company Closure",
        status: "Pending",
        assigned: "Employee A",
        value: 9999,
        progress: 20,
      },
    ];
    setLeads(mockLeads);
    setLoading(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-900">
          Active Leads Pipeline
        </h2>
        <Link
          to="/crm/leads/add"
          className="w-full sm:w-auto text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
        >
          + New Lead
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-600">{lead.service}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold self-start sm:self-auto">
                {lead.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-gray-600">
                  Progress
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {lead.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${lead.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-2">
              <span className="text-gray-600">
                Assigned to:{" "}
                <span className="font-semibold">{lead.assigned}</span>
              </span>
              <Link
                to={`/crm/leads/${lead.id}`}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCards = () => {
  const stats = [
    {
      name: "Active Leads",
      value: 12,
      icon: UserPlusIcon,
      color: "from-blue-500 to-blue-600",
      trend: "+3 this week",
    },
    {
      name: "Pending Tasks",
      value: 8,
      icon: ListBulletIcon,
      color: "from-orange-500 to-orange-600",
      trend: "-2 resolved",
    },
    {
      name: "Revenue This Month",
      value: "₹2.45L",
      icon: CurrencyRupeeIcon,
      color: "from-green-500 to-green-600",
      trend: "+25% from last month",
    },
    {
      name: "Completion Rate",
      value: "87%",
      icon: CheckCircleIcon,
      color: "from-purple-500 to-purple-600",
      trend: "+5% from last month",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
        >
          <div className={`bg-gradient-to-br ${stat.color} p-6 text-white`}>
            <div className="flex justify-between items-start mb-2">
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-sm font-semibold opacity-90 mb-1">{stat.name}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold text-green-600">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CrmDashboard() {
  const [orderId, setOrderId] = useState(1002);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `/api/workflow/orders/${orderId}/progress`,
        );
        setProgress(response.data);
      } catch (error) {
        console.error("Error fetching workflow progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">CRM Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage your entire sales and service delivery pipeline
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Workflow Timeline */}
      {progress ? (
        <>
          <WorkflowTimeline orderId={orderId} progress={progress} />

          {/* Exceptions Section */}
          {progress.exceptions && progress.exceptions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mt-8 border-l-4 border-red-500">
              <div className="flex items-center mb-6">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Active Issues & Exceptions
                </h2>
              </div>
              <div>
                {progress.exceptions.map((exc, idx) => (
                  <ExceptionCard key={idx} exception={exc} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading workflow data...</p>
        </div>
      )}

      {/* Leads Table */}
      <div className="mt-8">
        <LeadsTable />
      </div>
    </div>
  );
}
