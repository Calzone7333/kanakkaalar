import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { userAPI } from "../../../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userAPI.all();
        setUsers(response.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err?.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-semibold">Users & Roles</h1>
          <p className="text-slate-600 mt-2 text-center py-8">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-8 space-y-6 min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl font-semibold">Users & Roles</h1>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-semibold">Users & Roles</h1>
        <p className="text-slate-600 mt-2">Total users: {users.length}</p>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="py-3 pr-6 font-medium text-gray-700">Profile</th>
                <th className="py-3 pr-6 font-medium text-gray-700">Name</th>
                <th className="py-3 pr-6 font-medium text-gray-700">Email</th>
                <th className="py-3 pr-6 font-medium text-gray-700">Phone</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-6">
                      {user.hasProfileImage ? (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-200 rounded-full">
                          <User size={16} className="text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 border border-gray-200 rounded-full">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-6 font-medium text-gray-800">{user.fullName || "N/A"}</td>
                    <td className="py-3 pr-6 text-gray-700">{user.email}</td>
                    <td className="py-3 pr-6 text-gray-700">{user.phone || "N/A"}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No users found.</p>
        )}
      </div>
    </div>
  );
}
