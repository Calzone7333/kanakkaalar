import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  MapPin,
  Coffee,
  History
} from "lucide-react";
import { toast } from "react-hot-toast";
import { attendanceAPI } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

export default function EmployeeAttendancePage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [workDuration, setWorkDuration] = useState("00:00:00");
  const [location, setLocation] = useState("Detecting location...");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Fetch today's attendance status
    fetchTodayAttendance();
    fetchHistory();

    // Get Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setLocation("Office HQ (Verified)"),
        () => setLocation("Remote / Unknown")
      );
    } else {
      setLocation("Location unavailable");
    }

    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await attendanceAPI.getToday();
      if (res.data) {
        const att = res.data;
        setCheckInTime(att.checkInTime ? new Date(att.checkInTime) : null);
        setCheckOutTime(att.checkOutTime ? new Date(att.checkOutTime) : null);
        setIsCheckedIn(att.checkInTime && !att.checkOutTime);
      }
    } catch (error) {
      console.error("Failed to fetch today's attendance", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await attendanceAPI.getMyHistory();
      const data = res.data || [];
      // Format history for display
      const formatted = data.slice(0, 5).map(att => ({
        date: new Date(att.date).toLocaleDateString(),
        checkIn: att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString() : "-",
        checkOut: att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString() : "-",
        status: att.status || "Present",
        duration: att.duration || "-"
      }));
      setHistory(formatted);
    } catch (error) {
      console.error("Failed to fetch history", error);
    }
  };

  useEffect(() => {
    if (isCheckedIn && checkInTime && !checkOutTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = now - checkInTime;
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setWorkDuration(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, checkInTime, checkOutTime]);

  const handleCheckIn = async () => {
    try {
      const res = await attendanceAPI.checkIn(location);
      const att = res.data;
      setCheckInTime(new Date(att.checkInTime));
      setIsCheckedIn(true);
      setCheckOutTime(null);
      toast.success("Checked in successfully at " + new Date(att.checkInTime).toLocaleTimeString());
      fetchHistory();
    } catch (error) {
      toast.error("Failed to check in");
      console.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await attendanceAPI.checkOut();
      const att = res.data;
      setCheckOutTime(new Date(att.checkOutTime));
      setIsCheckedIn(false);
      toast.success("Checked out successfully at " + new Date(att.checkOutTime).toLocaleTimeString());
      fetchHistory();
    } catch (error) {
      toast.error("Failed to check out");
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-gray-600 mt-1">Track your daily work hours and attendance history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clock & Action */}
          <div className="bg-gradient-to-br from-[#5E33AC] to-[#8155D6] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <p className="text-purple-200 font-medium mb-1">
                  {currentTime.toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <h2 className="text-3xl font-bold font-mono tracking-wider">
                  {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
                </h2>
                <div className="flex items-center gap-2 mt-4 text-purple-100 bg-white/10 px-4 py-2 rounded-full w-fit mx-auto md:mx-0">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm relative">
                  <div className="text-center">
                    <p className="text-xs text-purple-200 uppercase tracking-wider font-semibold">Work Time</p>
                    <p className="text-2xl font-bold font-mono">{workDuration}</p>
                  </div>
                  {isCheckedIn && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse border-2 border-[#5E33AC]"></div>
                  )}
                </div>

                {!isCheckedIn ? (
                  <button
                    onClick={handleCheckIn}
                    disabled={loading}
                    className="px-8 py-3 bg-white text-[#5E33AC] font-bold rounded-xl shadow-lg hover:bg-gray-50 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Check In
                  </button>
                ) : (
                  <button
                    onClick={handleCheckOut}
                    className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Check Out
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              icon={<Clock className="w-6 h-6 text-blue-600" />}
              label="Avg. Hours"
              value="8h 45m"
              color="bg-blue-50"
            />
            <StatCard
              icon={<CalendarIcon className="w-6 h-6 text-purple-600" />}
              label="Days Present"
              value={`${history.filter(h => h.status === 'Present').length} Days`}
              color="bg-purple-50"
            />
            <StatCard
              icon={<Coffee className="w-6 h-6 text-amber-600" />}
              label="Leaves Taken"
              value="2 Days"
              color="bg-amber-50"
            />
          </div>
        </div>

        {/* History Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">Recent History</h3>
          </div>

          <div className="space-y-6">
            {history.map((record, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${record.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>

                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold text-gray-900">{record.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${record.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {record.status}
                  </span>
                </div>

                <div className="text-xs text-gray-500 grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="block text-gray-400">Check In</span>
                    <span className="font-medium">{record.checkIn}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-gray-400">Check Out</span>
                    <span className="font-medium">{record.checkOut}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 text-sm text-[#5E33AC] font-medium hover:bg-purple-50 rounded-lg transition-colors">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-6 rounded-2xl border border-gray-100 ${color} flex flex-col items-center text-center`}>
      <div className="p-3 bg-white rounded-xl shadow-sm mb-3">
        {icon}
      </div>
      <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}