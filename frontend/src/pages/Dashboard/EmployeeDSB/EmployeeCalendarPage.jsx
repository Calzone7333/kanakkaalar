import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon
} from "lucide-react";
import { orderAPI } from "@/lib/api";
import { getAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

// --- Month-wise Image Configuration ---
// High-quality Unsplash images matched to the season/vibe of each month
const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=2000", // Jan: Winter/Snow
  "https://images.unsplash.com/photo-1516562309702-97fe86704977?auto=format&fit=crop&q=80&w=2000", // Feb: Soft Light/Winter
  "https://images.unsplash.com/photo-1555662369-1a742845d41d?auto=format&fit=crop&q=80&w=2000", // Mar: Early Spring/Green
  "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&q=80&w=2000", // Apr: Flowers/Bloom
  "https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?auto=format&fit=crop&q=80&w=2000", // May: Vibrant Nature
  "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=2000", // Jun: Sunny Fields
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000", // Jul: Beach/Summer
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000", // Aug: Deep Forest
  "https://images.unsplash.com/photo-1505235682978-95f739071933?auto=format&fit=crop&q=80&w=2000", // Sep: Harvest/Golden
  "https://images.unsplash.com/photo-1508796079804-4b9e4c5b3d2f?auto=format&fit=crop&q=80&w=2000", // Oct: Autumn/Orange (Matches Theme)
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=2000", // Nov: Misty/Moody
  "https://images.unsplash.com/photo-1482686119681-df96594bc3e3?auto=format&fit=crop&q=80&w=2000", // Dec: Winter/Holiday
];

export default function DesignCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // --- Design Constants ---
  const THEME_COLOR = "text-[#F2994A]";
  const THEME_BG = "bg-[#F2994A]";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const auth = getAuth();
      const user = auth?.user;
      if (user?.email) {
        const res = await orderAPI.listAssigned(user.email);
        setTasks(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // --- Helpers ---
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const getTasksForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter(t => isSameDay(new Date(t.createdAt), date));
  };

  // --- Render Variables ---
  const { days, firstDay } = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const selectedTasks = tasks.filter(t => isSameDay(new Date(t.createdAt), selectedDate));

  // Get dynamic image based on current month index (0-11)
  const currentHeroImage = MONTH_IMAGES[currentDate.getMonth()];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 lg:p-8 font-sans">

      {/* Main Card Container */}
      <div className="bg-white w-full max-w-[1400px] min-h-screen lg:min-h-[800px] shadow-2xl flex flex-col lg:flex-row relative overflow-hidden rounded-lg">

        {/* --- LEFT SIDE: DYNAMIC IMAGE & OVERLAYS --- */}
        <div className="relative w-full lg:w-[45%] h-[250px] lg:h-auto bg-gray-900 overflow-hidden group shrink-0">
          {/* Animated Background Image */}
          <div className="absolute inset-0 transition-transform duration-1000 ease-in-out group-hover:scale-110">
            <img
              key={currentDate.getMonth()} // Key forces fade effect when month changes
              src={currentHeroImage}
              alt="Seasonal Background"
              className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
            />
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Logo Area */}
          <div className="absolute top-6 left-6 lg:top-10 lg:left-10">
            <h2 className="text-[#F2994A] text-xl lg:text-2xl font-bold tracking-wider uppercase drop-shadow-md">
              My Company
            </h2>
          </div>

          {/* Contact Info (Bottom Left) */}
          <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 text-white space-y-2 lg:space-y-3 z-10">
            <h3 className={`text-lg lg:text-xl font-bold ${THEME_COLOR} mb-2 uppercase tracking-wide`}>Contact Us:</h3>
            <div className="flex items-center gap-3 text-xs lg:text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
              <div className="p-1.5 lg:p-2 bg-white/10 rounded-full backdrop-blur-sm"><Phone className="w-3 h-3 lg:w-4 lg:h-4" /></div>
              <span>+123 456 789</span>
            </div>
            <div className="flex items-center gap-3 text-xs lg:text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
              <div className="p-1.5 lg:p-2 bg-white/10 rounded-full backdrop-blur-sm"><Mail className="w-3 h-3 lg:w-4 lg:h-4" /></div>
              <span>calendar@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-xs lg:text-sm font-medium opacity-90 hover:opacity-100 transition-opacity">
              <div className="p-1.5 lg:p-2 bg-white/10 rounded-full backdrop-blur-sm"><MapPin className="w-3 h-3 lg:w-4 lg:h-4" /></div>
              <span>123 Street Name, City, Country</span>
            </div>
          </div>
        </div>

        {/* --- MIDDLE: THE CURVED DIVIDER (Hidden on Mobile) --- */}
        <div className="hidden lg:block absolute left-[45%] top-0 bottom-0 w-[150px] z-10 pointer-events-none -ml-[75px]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* White Shape */}
            <path d="M 50 0 C 20 25 20 75 50 100 L 100 100 L 100 0 Z" fill="white" />
            {/* Orange Border Stroke */}
            <path d="M 50 0 C 20 25 20 75 50 100" fill="none" stroke="#F2994A" strokeWidth="2.5" />
          </svg>
        </div>

        {/* --- RIGHT SIDE: CALENDAR CONTENT --- */}
        <div className="flex-1 bg-white p-6 lg:p-16 flex flex-col relative z-20">

          {/* Header Section */}
          <div className="text-center lg:text-right mb-6 lg:mb-10">
            <div className="flex flex-col items-center lg:items-end">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-800 tracking-tighter leading-none">
                <span className={THEME_COLOR}>{currentDate.getFullYear()}</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-400 tracking-[0.2em] uppercase mt-2">
                Calendar
              </h2>
            </div>

            {/* Decorative Line */}
            <div className={`h-1.5 w-24 ${THEME_BG} mx-auto lg:ml-auto lg:mr-0 mt-4 lg:mt-6 mb-4 rounded-full`}></div>

            {/* Dynamic Month Description */}
            <div className="text-gray-400 text-sm max-w-sm mx-auto lg:ml-auto lg:mr-0 lg:text-right">
              Plan your success for <strong>{currentDate.toLocaleDateString('en-US', { month: 'long' })}</strong>.
              You have {tasks.length} active tasks scheduled.
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-[#F2994A] hover:text-[#F2994A] transition-all"
              >
                <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-[#F2994A] hover:text-[#F2994A] transition-all"
              >
                <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
            <h2 className={`text-xl lg:text-2xl font-black uppercase tracking-widest ${THEME_COLOR}`}>
              {currentDate.toLocaleDateString('en-US', { month: 'long' })}
            </h2>
          </div>

          {/* Calendar Box */}
          <div className="bg-gray-50 rounded-[20px] lg:rounded-[30px] p-4 lg:p-8 flex-1 flex flex-col shadow-inner">

            {/* Grid Header */}
            <div className="grid grid-cols-7 mb-4 lg:mb-6 border-b border-gray-200 pb-4">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div
                  key={day}
                  className={`text-center font-bold text-[10px] lg:text-xs tracking-widest
                    ${(i === 0 || i === 6) ? THEME_COLOR : 'text-gray-400'} 
                  `}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-y-4 lg:gap-y-6 gap-x-1 lg:gap-x-2">
              {blanks.map(i => <div key={`blank-${i}`} />)}

              {daysArray.map(day => {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(date, selectedDate);
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const isToday = isSameDay(date, new Date());

                return (
                  <div key={day} className="flex flex-col items-center group/date relative">
                    <button
                      onClick={() => setSelectedDate(date)}
                      className={`
                        w-7 h-7 lg:w-9 lg:h-9 flex items-center justify-center rounded-full text-xs lg:text-sm font-semibold transition-all relative z-10
                        ${isSelected
                          ? `${THEME_BG} text-white shadow-lg shadow-orange-200 scale-110`
                          : isWeekend
                            ? `text-[#F2994A] hover:bg-orange-50`
                            : 'text-gray-600 hover:bg-gray-200'
                        }
                        ${isToday && !isSelected ? 'ring-1 ring-[#F2994A] ring-offset-2' : ''}
                      `}
                    >
                      {day}
                    </button>

                    {/* Task Dot */}
                    {dayTasks.length > 0 && (
                      <div className={`mt-1 w-1 h-1 rounded-full ${isSelected ? 'bg-orange-200' : THEME_BG}`}></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Panel: Selected Date Details */}
            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}
                </span>
                <span className="text-xs font-bold text-[#F2994A] bg-orange-50 px-2 py-1 rounded-full">
                  {selectedTasks.length} Events
                </span>
              </div>

              <div className="space-y-2 h-[100px] overflow-y-auto pr-1 scrollbar-hide">
                {selectedTasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-300 text-xs italic">
                    No tasks scheduled for this day
                  </div>
                ) : (
                  selectedTasks.map(task => (
                    <div
                      key={task.id}
                      onClick={() => navigate(`/dashboard/employee/task/${task.id}`)}
                      className="bg-white p-2.5 rounded-lg border border-gray-100 hover:border-orange-300 hover:shadow-sm cursor-pointer transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Clock className="w-3 h-3 text-gray-300 group-hover:text-[#F2994A]" />
                        <span className="text-xs font-medium text-gray-600 truncate">{task.serviceName || "Service Order"}</span>
                      </div>
                      <CheckCircle2 className={`w-3 h-3 ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}