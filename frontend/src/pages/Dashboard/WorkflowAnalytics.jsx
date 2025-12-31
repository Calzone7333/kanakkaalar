import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const StageChart = ({ stageName, completedCount, failedCount }) => {
  const total = completedCount + failedCount;
  const completionRate = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <h3 className="font-semibold text-gray-900 mb-3">{stageName}</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Success Rate</span>
          <span className="font-bold text-green-600">
            {completionRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-center">
          <p className="text-green-600 font-bold">{completedCount}</p>
          <p className="text-gray-600">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-red-600 font-bold">{failedCount}</p>
          <p className="text-gray-600">Failed</p>
        </div>
      </div>
    </div>
  );
};

const ExceptionChart = ({ exceptionName, count }) => {
  const colors = {
    PF: "bg-red-100 text-red-800 border-red-300",
    MD: "bg-orange-100 text-orange-800 border-orange-300",
    GO: "bg-yellow-100 text-yellow-800 border-yellow-300",
    SLAB: "bg-pink-100 text-pink-800 border-pink-300",
    CR: "bg-purple-100 text-purple-800 border-purple-300",
  };

  const exceptionLabels = {
    PF: "Payment Failure",
    MD: "Missing Docs",
    GO: "Govt Objection",
    SLAB: "SLA Breach",
    CR: "Cancellation",
  };

  const colorClass = colors[exceptionName] || colors.PF;

  return (
    <div className={`border rounded-lg p-4 ${colorClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{exceptionLabels[exceptionName]}</p>
          <p className="text-sm opacity-75">Recent occurrences</p>
        </div>
        <div className="text-3xl font-bold">{count}</div>
      </div>
    </div>
  );
};

export default function WorkflowAnalytics() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [stageStats, setStageStats] = useState([]);
  const [exceptionStats, setExceptionStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashRes, stageRes, excRes] = await Promise.all([
          axios.get("/api/workflow/analytics/dashboard-stats"),
          axios.get("/api/workflow/analytics/stage-stats"),
          axios.get("/api/workflow/analytics/exception-stats"),
        ]);

        setDashboardStats(dashRes.data);
        setStageStats(stageRes.data);
        setExceptionStats(excRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ChartBarIcon className="w-10 h-10 text-indigo-600" />
          Workflow Analytics
        </h1>
        <p className="text-gray-600">
          Track performance and identify bottlenecks
        </p>
      </div>

      {/* Summary Stats */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-600">Completed</p>
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600">
              {dashboardStats.completedStages}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Stages completed successfully
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-600">In Progress</p>
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-4xl font-bold text-blue-600">
              {dashboardStats.inProgressStages}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Stages currently active
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-600">Blocked</p>
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
            </div>
            <p className="text-4xl font-bold text-yellow-600">
              {dashboardStats.blockedStages}
            </p>
            <p className="text-xs text-gray-600 mt-2">Stages awaiting action</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-600">Failed</p>
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-600">
              {dashboardStats.failedStages}
            </p>
            <p className="text-xs text-gray-600 mt-2">Stages with issues</p>
          </div>
        </div>
      )}

      {/* Stage Performance */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Stage Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stageStats.map((stat) => (
            <StageChart
              key={stat.stage}
              stageName={stat.label}
              completedCount={stat.completedCount}
              failedCount={stat.failedCount}
            />
          ))}
        </div>
      </div>

      {/* Exception Tracking */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Exception Tracking
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {exceptionStats.map((stat) => (
            <ExceptionChart
              key={stat.exception}
              exceptionName={stat.exception}
              count={stat.count}
            />
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quick Insights
        </h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>High Completion Rate:</strong> Most stages are being
              completed successfully with positive trends.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Monitor Blocked Stages:</strong> Review blocked orders to
              ensure timely resolution.
            </span>
          </p>
          <p className="flex items-start gap-3">
            <ChartBarIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Best Performing:</strong> CRM and Sales stages show the
              highest success rates.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
