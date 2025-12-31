import React, { useState, useEffect } from "react";
import { adminAPI } from "../../lib/api";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import PageLoader from "../../components/PageLoader";
import { Edit, PlusCircle, Trash2 } from "lucide-react";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Fetch all employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAllEmployees();
        setEmployees(response.data || []);
      } catch (err) {
        setError("Failed to fetch employees. Please try again later.");
        console.error("Fetch employees error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handlers for modal
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
      // Update existing employee in the list
      setEmployees(
        employees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        )
      );
    } else {
      // Add new employee to the list
      setEmployees([updatedEmployee, ...employees]);
    }
  };

  // Handlers for delete confirmation
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
      // Remove employee from the list in the UI
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Delete employee error:", err);
      // You might want to show an error toast here
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <PageLoader show={true} />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Employees</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenEditModal(employee)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(employee)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <AddEmployeeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          employeeToEdit={employeeToEdit}
        />
      )}
    </div>
  );
};

export default AllEmployees;