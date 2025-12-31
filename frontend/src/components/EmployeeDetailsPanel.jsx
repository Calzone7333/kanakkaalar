import React from 'react';
import { X } from 'lucide-react';

const DetailItem = ({ label, value, children }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {children || value}
    </dd>
  </div>
);

const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
};

const EmployeeDetailsPanel = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        aria-hidden="true"
      ></div>

      {/* Side Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform ease-in-out duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Employee Details
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {employee.fullName}
            </p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            <dl className="divide-y divide-gray-200">
              <DetailItem label="Full Name" value={employee.fullName} />
              <DetailItem label="Email Address" value={employee.email} />
              <DetailItem label="Role" value={employee.role} />
              <DetailItem label="Status">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(employee.status)}`}>
                  {employee.status}
                </span>
              </DetailItem>
              <DetailItem label="Date Joined" value={formatDate(employee.createdAt)} />
              <DetailItem label="Last Updated" value={formatDate(employee.updatedAt)} />
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailsPanel;