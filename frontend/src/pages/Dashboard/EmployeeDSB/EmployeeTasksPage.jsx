import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Eye,
  FileText,
  IndianRupee,
  Calendar,
  CheckCircle,
  AlertTriangle,
  User,
  ClipboardCheck,
  Play,
  Filter,
  Search
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import { toast } from "react-hot-toast";
import { getAuth } from "@/lib/auth";

export default function EmployeeTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // ------------------ Fetch Employee Assigned Tasks ------------------
  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const auth = getAuth();
      const user = auth?.user;
      if (!user || !user.email) return;

      const res = await orderAPI.listAssigned(user.email);
      console.log("EmployeeTasksPage: Fetched tasks for", user.email, res);
      const list = Array.isArray(res.data) ? res.data : [];

      // Ensure consistent structure
      const normalized = list.map((t) => ({
        id: t.id,
        title: t.title || t.serviceName || `Order #${t.id}`,
        customer: t.customerName || t.customerEmail || "Unknown",
        totalAmount: t.totalAmount || 0,
        createdAt: t.createdAt || t.created_at,
        status: t.status || "ASSIGNED",
        documents: t.documents || [],
      }));

      setTasks(normalized);
      setFiltered(normalized);
    } catch (err) {
      console.error("Error loading tasks:", err);
      toast.error("Failed to load tasks");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ------------------ Filter Tasks ------------------
  useEffect(() => {
    let result = tasks;

    // Status Filter
    if (filterStatus !== "ALL") {
      result = result.filter((t) => t.status === filterStatus);
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.customer.toLowerCase().includes(query) ||
          String(t.id).includes(query)
      );
    }

    setFiltered(result);
  }, [filterStatus, searchQuery, tasks]);

  // ------------------ Actions ------------------
  const handleView = (id) => navigate(`/dashboard/employee/task/${id}`);

  const handleStartWork = async (id) => {
    try {
      await orderAPI.update(id, { status: "IN_PROGRESS" });
      toast.success("Task started successfully!");
      fetchTasks();
    } catch (err) {
      console.error("Error starting task:", err);
      toast.error("Failed to start task");
    }
  };

  // ------------------ Status Helpers ------------------
  const getStatusColor = (status) => {
    switch (status) {
      case "ASSIGNED": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "IN_PROGRESS": return "bg-amber-100 text-amber-700 border-amber-200";
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "ASSIGNED": return 25;
      case "IN_PROGRESS": return 60;
      case "COMPLETED": return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and track your assigned client projects</p>
        </div>
        <button
          onClick={fetchTasks}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh List
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks, clients, or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5E33AC] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5E33AC] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((task) => {
            const progress = getProgress(task.status);
            return (
              <div
                key={task.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(task.status)}`}>
                      {task.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{task.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1" title={task.title}>
                    {task.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-IN") : "N/A"}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Client</p>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={task.customer}>
                        {task.customer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Value</p>
                      <p className="text-sm font-medium text-gray-900">
                        {task.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-medium">Progress</span>
                      <span className="text-indigo-600 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? "bg-emerald-500" : "bg-[#5E33AC]"
                          }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button
                    onClick={() => handleView(task.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>

                  {task.status === "ASSIGNED" && (
                    <button
                      onClick={() => handleStartWork(task.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5E33AC] text-white text-sm font-medium rounded-xl hover:bg-[#4a288a] transition-all shadow-md shadow-indigo-200"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
