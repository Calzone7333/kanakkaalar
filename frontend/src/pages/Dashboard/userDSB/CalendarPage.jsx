import React, { useState, useEffect } from "react";
import { orderAPI } from "../../../lib/api";
import {
  Menu,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Settings,
  ChevronLeft
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, getDay, getDate, isSameDay, isSameMonth, parseISO } from 'date-fns';

export default function DailyUICalendar() {
  // State for the calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.myOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Helper to get days in month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Generate calendar grid array
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null); // Empty slots for previous month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Filter orders for the selected date
  const selectedDateOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt); // Assuming createdAt is the date we care about
    return isSameDay(orderDate, selectedDate);
  });

  // Check if a date has orders
  const hasOrders = (date) => {
    if (!date) return false;
    return orders.some(order => isSameDay(new Date(order.createdAt), date));
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-sans">

      {/* Main Widget Container */}
      <div className="bg-white rounded-[30px] shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl min-h-[600px]">

        {/* --- LEFT SIDE: Calendar --- */}
        <div className="flex-1 p-8 relative">

          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <button className="text-gray-400 hover:text-gray-600">
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <button onClick={prevMonth} className="text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <span className="text-gray-300 font-medium mr-2">{format(subMonths(currentDate, 1), 'MMMM')}</span>
                <span className="text-slate-800 font-bold text-lg">{format(currentDate, 'MMMM yyyy')}</span>
                <span className="text-gray-300 font-medium ml-2">{format(addMonths(currentDate, 1), 'MMMM')}</span>
              </div>
              <button onClick={nextMonth} className="text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Floating Plus Button */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg shadow-purple-200 transition transform hover:scale-110">
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm text-gray-400 font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-y-4 gap-x-2">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} />;

              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              const dateHasOrders = hasOrders(date);

              return (
                <div key={date.toString()} className="flex flex-col items-center justify-center relative">
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`
                      w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all relative
                      ${isSelected
                        ? "bg-purple-600 text-white shadow-md shadow-purple-200 scale-110"
                        : isToday
                          ? "bg-purple-100 text-purple-600 font-bold"
                          : "text-slate-600 hover:bg-gray-100"
                      }
                    `}
                  >
                    {getDate(date)}
                    {dateHasOrders && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 bg-purple-500 rounded-full"></span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT SIDE: Dashboard/Schedule --- */}
        <div className="w-full md:w-[400px] bg-[#1e1b4b] text-white p-8 flex flex-col relative overflow-hidden">
          {/* Background decoration circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-900 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

          {/* Header Date */}
          <div className="mb-10 text-right">
            <h2 className="text-6xl font-light tracking-tighter text-purple-200 opacity-90">{getDate(selectedDate)}</h2>
            <p className="text-xl font-medium uppercase tracking-widest text-white mt-1">{format(selectedDate, 'MMMM yyyy')}</p>
            <p className="text-sm text-purple-300 mt-1">{format(selectedDate, 'EEEE')}</p>
          </div>

          {/* Tasks List */}
          <div className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-purple-200 text-sm font-medium uppercase tracking-wider mb-4">
              {selectedDateOrders.length > 0 ? 'Orders & Services' : 'No orders for this day'}
            </h3>

            {selectedDateOrders.map((order) => (
              <div key={order.id} className="relative group">
                {/* White Card Effect */}
                <div className={`
                            bg-white rounded-xl p-4 text-slate-800 shadow-lg transition-all duration-300
                            hover:translate-x-[-5px] cursor-pointer opacity-90
                        `}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {/* Icon/Radio Logic */}
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'COMPLETED' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700 block">{order.serviceName || `Order #${order.id}`}</span>
                        <span className="text-xs text-gray-500">{order.status}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">{format(new Date(order.createdAt), 'h:mm a')}</span>
                  </div>
                  <div className="pl-7 text-xs text-gray-500">
                    Amount: ₹{order.totalAmount}
                  </div>
                </div>
              </div>
            ))}

            {selectedDateOrders.length === 0 && (
              <div className="text-center text-purple-300/50 py-10">
                <p>No services ordered on this date.</p>
              </div>
            )}
          </div>

          {/* Bottom Gear Icon */}
          <div className="mt-auto flex justify-end pt-6">
            <button className="text-purple-300 hover:text-white transition">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}