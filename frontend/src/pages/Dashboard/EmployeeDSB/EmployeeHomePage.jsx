import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  IndianRupee,
  Megaphone,
  Eye,
  TrendingUp,
  Calendar,
  FileText,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { orderAPI, serviceHubAPI, userAPI } from "@/lib/api";
import { getAuth } from "@/lib/auth";

export default function EmployeeHomePage() {
  const [employee, setEmployee] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const auth = getAuth();
      const user = auth?.user;
      setEmployee(user);

      if (user?.hasProfileImage) {
        try {
          const res = await userAPI.profileImage();
          const url = URL.createObjectURL(res.data);
          setAvatarUrl(url);
        } catch (error) {
          console.error("Failed to load profile image", error);
        }
      }

      if (user?.email) {
        fetchDashboardData(user.email);
      } else {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const fetchDashboardData = async (email) => {
    try {
      setLoading(true);
      console.log("EmployeeHomePage: Fetching data for email:", email);
      // Fetch stats and tasks in parallel
      const [statsRes, tasksRes] = await Promise.all([
        serviceHubAPI.status("EMPLOYEE", email),
        orderAPI.listAssigned(email)
      ]);

      console.log("EmployeeHomePage: Stats response:", statsRes);
      console.log("EmployeeHomePage: Tasks response:", tasksRes);

      setStats(statsRes.data);
      // Ensure we extract the array correctly from the response
      const tasksList = Array.isArray(tasksRes.data) ? tasksRes.data : [];
      setTasks(tasksList);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Derived calculations
  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "ASSIGNED").length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const totalValue = tasks.reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const handleView = (id) => navigate(`/dashboard/employee/task/${id}`);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full opacity-25"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#5E33AC] to-[#8155D6] rounded-3xl p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-400 opacity-10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-medium bg-white/20 rounded-full backdrop-blur-sm">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-3xl font-bold mb-2">
              Welcome back, {employee?.fullName?.split(' ')[0] || "Employee"}! 👋
            </h1>
            <p className="text-purple-100 text-lg max-w-xl">
              You have <span className="font-bold text-white">{inProgress} active tasks</span> requiring your attention today.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <img
              src={avatarUrl || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/wgo6e9kp_expires_30_days.png"}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-white/50 object-cover"
            />
            <div className="hidden sm:block">
              <p className="font-semibold text-white">{employee?.fullName}</p>
              <p className="text-sm text-purple-200">{employee?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<ClipboardCheck className="w-6 h-6" />}
          label="Total Assigned"
          value={totalTasks}
          trend="+12% this month"
          color="bg-blue-500"
          textColor="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="In Progress"
          value={inProgress}
          trend="5 due soon"
          color="bg-amber-500"
          textColor="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Completed"
          value={completed}
          trend="98% success rate"
          color="bg-emerald-500"
          textColor="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          label="Documents"
          value={stats?.documentsForAssignedOrders || 0}
          trend="Pending verification"
          color="bg-purple-500"
          textColor="text-purple-600"
          bgColor="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your assigned orders</p>
            </div>
            <button
              onClick={() => navigate("/dashboard/employee/tasks")}
              className="flex items-center gap-1 text-sm font-medium text-[#5E33AC] hover:text-[#4a288a] transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="text-gray-500 mt-1">You don't have any assigned tasks yet.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Task / Order</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {task.serviceName ? task.serviceName.charAt(0) : '#'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{task.serviceName || `Order #${task.id}`}</p>
                            <p className="text-xs text-gray-500">ID: {task.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-700 font-medium">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {task.totalAmount?.toLocaleString("en-IN") || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-3.5 h-3.5 mr-2" />
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-IN") : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleView(task.id)}
                          className="p-2 text-gray-400 hover:text-[#5E33AC] hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Announcements & Quick Actions */}
        <div className="space-y-8">
          {/* Announcements */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Announcements</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-amber-100/50">
                <p className="text-sm font-medium text-gray-800 mb-1">📅 Monthly Review</p>
                <p className="text-xs text-gray-600">Review meeting scheduled for 15th Nov 2025. Please update all task statuses.</p>
              </div>
              <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-amber-100/50">
                <p className="text-sm font-medium text-gray-800 mb-1">🚀 New Feature</p>
                <p className="text-xs text-gray-600">The new document verification system is live. Check the docs tab.</p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Task Completion</span>
                  <span className="font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#5E33AC] h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Client Satisfaction</span>
                  <span className="font-medium text-gray-900">4.8/5.0</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color, textColor, bgColor }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} ${textColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    ASSIGNED: "bg-purple-100 text-purple-700 border-purple-200",
    FAILED: "bg-red-100 text-red-700 border-red-200",
  };

  const defaultStyle = "bg-gray-100 text-gray-700 border-gray-200";
  const style = styles[status] || defaultStyle;

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${style}`}>
      {status?.replace(/_/g, " ") || "UNKNOWN"}
    </span>
  );
}
