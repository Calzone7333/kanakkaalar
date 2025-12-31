import React, { useState } from 'react';

const customersMock = [
  { id: 1, name: 'Tony Stark Industries', email: 'contact@stark.com', phone: '555-0101', status: 'Active', type: 'Enterprise', ltv: 125000, interactions: 34, lastContact: '2025-10-28' },
  { id: 2, name: 'Asgard Tech', email: 'info@asgard.com', phone: '555-0102', status: 'Active', type: 'Corporate', ltv: 89000, interactions: 28, lastContact: '2025-10-27' },
  { id: 3, name: 'Loki Solutions', email: 'sales@loki.com', phone: '555-0103', status: 'At Risk', type: 'SMB', ltv: 34000, interactions: 8, lastContact: '2025-10-15' },
  { id: 4, name: 'Banner Research', email: 'contact@banner.com', phone: '555-0104', status: 'Inactive', type: 'Startup', ltv: 0, interactions: 3, lastContact: '2025-08-20' },
  { id: 5, name: 'Maximoff Enterprises', email: 'hello@maximoff.com', phone: '555-0105', status: 'Active', type: 'Enterprise', ltv: 156000, interactions: 42, lastContact: '2025-10-28' },
];

const lifecycleStagesMock = [
  { name: 'Prospect', count: 120, color: 'bg-gray-200' },
  { name: 'Lead', count: 245, color: 'bg-gray-300' },
  { name: 'Customer', count: 856, color: 'bg-gray-400' },
  { name: 'Loyal', count: 89, color: 'bg-gray-600' },
  { name: 'Churned', count: 45, color: 'bg-gray-100' },
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(customersMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'SMB',
  });

  const types = ['All', 'Enterprise', 'Corporate', 'SMB', 'Startup'];
  const statuses = ['All', 'Active', 'At Risk', 'Inactive'];

  let filteredCustomers = customers.filter(c => {
    const statusMatch = filterStatus === 'All' || c.status === filterStatus;
    const typeMatch = filterType === 'All' || c.type === filterType;
    const searchMatch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer = {
        id: customers.length + 1,
        ...newCustomer,
        status: 'Active',
        ltv: 0,
        interactions: 0,
        lastContact: new Date().toISOString().split('T')[0],
      };
      setCustomers([...customers, customer]);
      setNewCustomer({ name: '', email: '', phone: '', type: 'SMB' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const getStatusStyle = (status) => {
    const styles = {
      'Active': 'bg-gray-100 text-gray-900',
      'At Risk': 'bg-gray-200 text-gray-800',
      'Inactive': 'bg-gray-300 text-gray-900',
    };
    return styles[status] || 'bg-gray-100 text-gray-900';
  };

  const totalLTV = customers.reduce((sum, c) => sum + c.ltv, 0);
  const avgInteractions = Math.round(customers.reduce((sum, c) => sum + c.interactions, 0) / customers.length);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600 mt-1">Manage customer relationships and lifecycle</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
        >
          + Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
          <p className="text-xs text-gray-600 mt-1">{customers.filter(c => c.status === 'Active').length} active</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Total LTV</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(totalLTV / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">${Math.round(totalLTV / customers.length).toLocaleString()} avg</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Avg Interactions</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{avgInteractions}</p>
          <p className="text-xs text-gray-600 mt-1">Per customer</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">At Risk</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{customers.filter(c => c.status === 'At Risk').length}</p>
          <p className="text-xs text-gray-600 mt-1">Need attention</p>
        </div>
      </div>

      {/* Customer Lifecycle */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Lifecycle</h2>
        <div className="flex gap-2 overflow-x-auto">
          {lifecycleStagesMock.map((stage, i) => (
            <div key={i} className="flex-shrink-0 text-center">
              <div className={`${stage.color} w-16 h-16 rounded-lg flex items-center justify-center mb-2`}>
                <p className="font-bold text-white text-lg">{stage.count}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{stage.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
        >
          {statuses.map(status => <option key={status}>{status}</option>)}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
        >
          {types.map(type => <option key={type}>{type}</option>)}
        </select>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Customer Name</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Type</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Status</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">LTV</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Interactions</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Last Contact</th>
              <th className="text-right py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                <td className="py-4 px-6 font-medium text-gray-900">{customer.name}</td>
                <td className="py-4 px-6 text-gray-700">{customer.type}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(customer.status)}`}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-gray-900">${customer.ltv.toLocaleString()}</td>
                <td className="py-4 px-6 text-gray-700">{customer.interactions}</td>
                <td className="py-4 px-6 text-gray-700 text-sm">{customer.lastContact}</td>
                <td className="py-4 px-6 text-right text-sm space-x-2">
                  <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  <button onClick={() => handleDeleteCustomer(customer.id)} className="text-gray-400 hover:text-gray-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Details */}
      {selectedCustomer && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCustomer.name}</h2>
              <p className="text-gray-600 mt-1">{selectedCustomer.type}</p>
            </div>
            <button onClick={() => setSelectedCustomer(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-y border-gray-200 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
              <p className="text-gray-900 font-medium">{selectedCustomer.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Phone</p>
              <p className="text-gray-900 font-medium">{selectedCustomer.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total LTV</p>
              <p className="text-gray-900 font-bold text-lg">${selectedCustomer.ltv.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Last Interaction</p>
              <p className="text-gray-900 font-medium">{selectedCustomer.lastContact}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Send Email</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Call</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Create Deal</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">View History</button>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Customer</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <select
                value={newCustomer.type}
                onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                <option>Enterprise</option>
                <option>Corporate</option>
                <option>SMB</option>
                <option>Startup</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCustomer}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
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
