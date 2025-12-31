import React, { useEffect, useState } from "react";
import {
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info", duration = 5000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      const timer = setTimeout(() => {
        removeNotification(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
};

export const NotificationCenter = ({ notifications, removeNotification }) => {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white animate-slide-in ${
            notification.type === "success"
              ? "bg-green-600"
              : notification.type === "error"
                ? "bg-red-600"
                : notification.type === "warning"
                  ? "bg-yellow-600"
                  : "bg-blue-600"
          }`}
        >
          {notification.type === "success" && (
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
          )}
          {notification.type === "warning" && (
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          )}
          {notification.type === "error" && (
            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="flex-1 text-sm font-medium">
            {notification.message}
          </span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 hover:opacity-80 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
