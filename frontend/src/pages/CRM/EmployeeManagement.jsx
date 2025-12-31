import React, { useState } from 'react';

const employeesMock = [
  { id: 1, name: 'Alice Johnson', role: 'Senior Sales Manager', department: 'Sales', email: 'alice@company.com', phone: '555-1001', status: 'Active', quota: 250000, achieved: 245000, performance: 98 },
  { id: 2, name: 'Bob Smith', role: 'Sales Executive', department: 'Sales', email: 'bob@company.com', phone: '555-1002', status: 'Active', quota: 220000, achieved: 198000, performance: 90 },
  { id: 3, name: 'Carol Davis', role: 'Sales Executive', department: 'Sales', email: 'carol@company.com', phone: '555-1003', status: 'Active', quota: 200000, achieved: 165000, performance: 83 },
  { id: 4, name: 'David Wilson', role: 'Account Manager', department: 'Customer Success', email: 'david@company.com', phone: '555-1004', status: 'Active', quota: 150000, achieved: 142000, performance: 95 },
  { id: 5, name: 'Emma Brown', role: 'CRM Coordinator', department: 'Operations', email: 'emma@company.com', phone: '555-1005', status: 'Active', quota: 0, achieved: 0, performance: 100 },
];

const departmentsMock = [
  { name: 'Sales', count: 3, color: 'bg-blue-100', textColor: 'text-blue-800' },
  { name: 'Customer Success', count: 1, color: 'bg-green-100', textColor: 'text-green-800' },
  { name: 'Operations', count: 1, color: 'bg-orange-100', textColor: 'text-orange-800' },
];

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(employeesMock);
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    role: '',
    department: 'Sales',
    email: '',
    phone: '',
    quota: '',
  });

  const departments = ['All', ...new Set(employees.map(e => e.department))];

  let filteredEmployees = employees.filter(emp => {
    const deptMatch = filterDept === 'All' || emp.department === filterDept;
    const statusMatch = filterStatus === 'All' || emp.status === filterStatus;
    const searchMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    return deptMatch && statusMatch && searchMatch;
  });

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.email) {
      const employee = {
        id: employees.length + 1,
        ...newEmployee,
        quota: parseInt(newEmployee.quota) || 0,
        achieved: 0,
        performance: 0,
        status: 'Active',
      };
      setEmployees([...employees, employee]);
      setNewEmployee({ name: '', role: '', department: 'Sales', email: '', phone: '', quota: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    setSelectedEmployee(null);
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return 'bg-green-100 text-green-800';
    if (performance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    inactive: employees.filter(e => e.status === 'Inactive').length,
    avgPerformance: Math.round(employees.reduce((sum, e) => sum + e.performance, 0) / employees.length),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">👥 Employee Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Employees</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Inactive</p>
          <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Avg Performance</p>
          <p className="text-3xl font-bold text-orange-600">{stats.avgPerformance}%</p>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departmentsMock.map((dept, i) => (
          <div key={i} className={`p-4 rounded-lg shadow ${dept.color}`}>
            <p className={`font-semibold ${dept.textColor} text-lg mb-2`}>{dept.name}</p>
            <p className={`text-3xl font-bold ${dept.textColor}`}>{dept.count}</p>
            <p className="text-xs text-gray-600 mt-1">Employees</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {departments.map(dept => <option key={dept}>{dept}</option>)}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{emp.role}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{emp.department}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${emp.performance >= 95 ? 'bg-green-500' : emp.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${emp.performance}%` }}
                      ></div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getPerformanceColor(emp.performance)}`}>
                      {emp.performance}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <button className="text-[#0080FF] hover:text-[#0066CC]">✏️</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEmployee(emp.id);
                  }} className="text-red-600 hover:text-red-900">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details */}
      {selectedEmployee && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0080FF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedEmployee.role} • {selectedEmployee.department}</p>
            </div>
            <button onClick={() => setSelectedEmployee(null)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Email</p>
              <p className="text-gray-900">{selectedEmployee.email}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Phone</p>
              <p className="text-gray-900">{selectedEmployee.phone}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold inline-block ${selectedEmployee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {selectedEmployee.status}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Department</p>
              <p className="text-gray-900">{selectedEmployee.department}</p>
            </div>
          </div>

          {selectedEmployee.quota > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">📊 Sales Performance</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Quota</p>
                  <p className="text-2xl font-bold text-gray-900">${(selectedEmployee.quota / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Achieved</p>
                  <p className="text-2xl font-bold text-[#0080FF]">${(selectedEmployee.achieved / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Performance</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(selectedEmployee.performance)}`}>{selectedEmployee.performance}%</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full bg-[#0080FF]"
                  style={{ width: `${Math.min((selectedEmployee.achieved / selectedEmployee.quota) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📞 Call</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📧 Email</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📊 Analytics</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">✏️ Edit</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Employee</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="text"
                placeholder="Job Role"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>Sales</option>
                <option>Customer Success</option>
                <option>Operations</option>
                <option>Management</option>
              </select>
              <input
                type="number"
                placeholder="Sales Quota (optional)"
                value={newEmployee.quota}
                onChange={(e) => setNewEmployee({ ...newEmployee, quota: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddEmployee}
                  className="flex-1 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
