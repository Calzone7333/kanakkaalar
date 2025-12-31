import React, { useState, useEffect } from "react";
import { adminAPI } from "../lib/api";
import { X } from "lucide-react";

// Premium styled modal for adding a new employee
const AddEmployeeModal = ({
  isOpen,
  onClose,
  onSuccess,
  employeeToEdit,
}) => {
  const isEditMode = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isEditMode && employeeToEdit) {
      // Populate form for editing, excluding the password
      setFormData({
        fullName: employeeToEdit.fullName || "",
        email: employeeToEdit.email || "",
        password: "", // Password is not edited here for security
        role: employeeToEdit.role || "EMPLOYEE",
      });
    }
  }, [employeeToEdit, isEditMode, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.fullName || !formData.email || (!isEditMode && !formData.password)) {
      setError("All fields are required.");
      return;
    }

    // Simple email format check
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditMode) {
        // Don't send password on update
        const { password, ...updateData } = formData;
        response = await adminAPI.updateEmployee(employeeToEdit.id, updateData);
      } else {
        response = await adminAPI.createEmployee(formData);
      }

      if (response?.data) {
        onSuccess && onSuccess(response.data);
        onClose();
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Add employee error:", err);
      const verb = isEditMode ? "update" : "add";
      setError(err?.response?.data?.message || `Failed to ${verb} employee.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {isEditMode ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Password */}
          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {loading ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Employee")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;