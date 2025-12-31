import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationAPI } from '../../../lib/api';
import { formatDistanceToNow } from 'date-fns';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationAPI.getAll();
        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError('Failed to load notifications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const formatTime = (isoString) => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true });
    } catch (e) {
      return 'just now';
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex items-center mb-6 border-b pb-4">
        <Bell className="w-6 h-6 text-gray-700 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading notifications...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-8">{error}</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg flex items-start gap-4 transition-colors ${
                !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 ${!notification.read ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <div>
                <p className={`text-gray-800 ${!notification.read ? 'font-semibold' : ''}`}>{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(notification.time)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">You have no new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;