import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { adminAPI, orderAPI } from "../lib/api";

const AssignEmployeeModal = ({ isOpen, onClose, deal, onAssigned }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
        }
    }, [isOpen]);

    const fetchEmployees = async () => {
        try {
            const res = await adminAPI.listEmployees();
            // Handle response structure { employees: [...], stats: ... }
            const employeesList = Array.isArray(res.data)
                ? res.data
                : (res.data?.employees || []);
            setEmployees(employeesList);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
            setError("Failed to load employees");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmployee) {
            setError("Please select an employee");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Check if it's an order or a manual deal
            if (deal.type === 'order') {
                await orderAPI.assign(deal.rawId, { assigneeEmail: selectedEmployee });
            } else {
                // For manual deals, we might need a different endpoint or update method
                // Assuming dealAPI.update exists and supports owner field
                const { dealAPI } = await import("../lib/api");
                await dealAPI.update(deal.rawId, { owner: selectedEmployee });
            }

            onAssigned(deal.id, selectedEmployee);
            onClose();
        } catch (err) {
            console.error("Failed to assign deal:", err);
            setError("Failed to assign deal. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6">Assign Deal</h2>
                <p className="mb-4 text-gray-600">
                    Assigning <strong>{deal?.name}</strong> to an employee.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">-- Select Employee --</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.email}>
                                    {emp.fullName} ({emp.email})
                                </option>
                            ))}
                        </select>
                    </div>

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
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {loading ? "Assigning..." : "Assign"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignEmployeeModal;
