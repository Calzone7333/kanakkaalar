import React, { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Users, UserCheck, UserX, Edit, Eye, Trash2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import AddEmployeeModal from "@/components/AddEmployeeModal";
import EmployeeDetailsPanel from "@/components/EmployeeDetailsPanel";
import ConfirmationModal from "@/components/ConfirmationModal";
import PageLoader from "@/components/PageLoader";

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [employeeToView, setEmployeeToView] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.listEmployees();
      setEmployees(res.data.employees || []);
      setStats(res.data.stats || {
        totalEmployees: 0,
        activeEmployees: 0,
        inactiveEmployees: 0,
      });
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEmployeeToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEmployeeToEdit(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmployeeToEdit(null);
  };

  const handleSuccess = (updatedEmployee) => {
    if (employeeToEdit) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
    } else {
      setEmployees((prev) => [updatedEmployee, ...prev]);
    }
    // Re-fetch stats to reflect potential changes
    fetchEmployees();
  };

  const handleOpenDeleteModal = (employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setEmployeeToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;
    setDeleteLoading(true);
    try {
      await adminAPI.deleteEmployee(employeeToDelete.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeToDelete.id));
      handleCloseDeleteModal();
      fetchEmployees(); // Re-fetch stats
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handlers for Details Panel
  const handleViewDetails = (employee) => {
    setEmployeeToView(employee);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const employeeStats = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Active Employees",
      value: stats?.activeEmployees || 0,
      icon: <UserCheck className="w-6 h-6" />,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Inactive Employees",
      value: stats?.inactiveEmployees || 0,
      icon: <UserX className="w-6 h-6" />,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "INACTIVE":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  if (loading && employees.length === 0) {
    return <PageLoader show={true} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Employee Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View, manage, and track all employees in your organization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} loading={loading} />
        ))}
      </div>

      <DataTable
        loading={loading}
        title="All Employees"
        columns={[
          { key: "fullName", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(value)}`}>
                {value}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (_, item) => (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Employee"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(item)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Delete Employee"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleViewDetails(item)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            ),
          },
        ]}
        data={filteredEmployees}
        onAdd={handleOpenAddModal}
        searchPlaceholder="Search by name or email..."
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add/Edit Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        employeeToEdit={employeeToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.fullName}? This action cannot be undone.`}
      />

      {/* View Details Panel */}
      <EmployeeDetailsPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        employee={employeeToView}
      />
    </div>
  );
};

export default AdminEmployees;