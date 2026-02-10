import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle2, X } from "lucide-react";
import { notificationAPI } from "../lib/api";

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

const NotificationDropdown = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const audioRef = useRef(new Audio(NOTIFICATION_SOUND_URL));
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await notificationAPI.getAll();
                const allData = response.data.notifications || [];

                // Only show UNREAD notifications in the dropdown for better clarity
                const unreadData = allData.filter(n => !n.read);

                // Play sound only if we actually found NEW unread IDs that weren't in our previous state
                const currentIds = notifications.map(n => n.id);
                const hasNewArrivals = unreadData.some(n => !currentIds.includes(n.id));

                if (hasNewArrivals && notifications.length > 0) {
                    playNotificationSound();
                }

                setNotifications(unreadData);
            } catch (err) {
                // Silent catch to prevent console spam on timeouts
                if (err.code === 'ECONNABORTED') {
                    console.warn("Notification fetch timed out - will retry.");
                } else {
                    console.warn("Failed to fetch notifications:", err.message);
                }
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll more frequently (10s) for responsiveness
        return () => clearInterval(interval);
    }, [notifications.length]); // Re-run if count changes to detect new arrivals accurately

    useEffect(() => {
        setUnreadCount(notifications.length);
    }, [notifications]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const playNotificationSound = () => {
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    };

    const handleMarkAsRead = async (id) => {
        try {
            // Optimistic update: remove from local state immediately
            setNotifications(prev => prev.filter(n => n.id !== id));
            // Actual API call
            await notificationAPI.markAsRead(id);
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const formatTime = (timeData) => {
        const dateStr = timeData?.time || timeData?.createdAt || timeData?.timestamp || timeData;
        try {
            if (!dateStr) return "just now";
            const date = new Date(dateStr);
            // If date is invalid, new Date() returns "Invalid Date"
            if (isNaN(date.getTime())) return "just now";
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (e) {
            return "just now";
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-900 rounded-[22px] shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div className="p-4 pb-3 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Bell size={16} />
                    </div>
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight uppercase">Recent Updates</h3>
                </div>
                {unreadCount > 0 && (
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {unreadCount} New
                    </span>
                )}
            </div>

            <div className="max-h-[300px] overflow-y-auto hide-scrollbar">
                {notifications.length > 0 ? (
                    <div className="flex flex-col">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="group relative px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                            >
                                {/* Indicator Line */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all group-hover:w-1.5 ${notification.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                                            {notification.message}
                                        </p>
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="p-1 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-md text-slate-400 hover:text-rose-500 transition-all active:scale-90"
                                            title="Dismiss"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                            {formatTime(notification)}
                                        </span>
                                        <span className="w-0.5 h-0.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${notification.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {notification.type === 'error' ? 'Alert' : 'Update'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-14 px-8 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-200 dark:text-slate-700">
                            <Bell size={24} />
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No New Notifications</p>
                    </div>
                )}
            </div>

            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => onClose()}
                    className="w-full py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-all shadow-sm active:scale-[0.98]"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
