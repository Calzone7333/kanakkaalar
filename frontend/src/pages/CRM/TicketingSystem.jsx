import React, { useState } from 'react';

const ticketsMock = [
  { id: 1, subject: 'Integration issue with payment gateway', status: 'Open', priority: 'High', customer: 'Stark Industries', assignee: 'Alice', created: '2025-10-28', sla: 'At Risk' },
  { id: 2, subject: 'Feature request: bulk user import', status: 'In Progress', priority: 'Medium', customer: 'Asgard Tech', assignee: 'Bob', created: '2025-10-27', sla: 'On Track' },
  { id: 3, subject: 'Password reset not working', status: 'Open', priority: 'Critical', customer: 'Maximoff', assignee: 'Carol', created: '2025-10-28', sla: 'At Risk' },
  { id: 4, subject: 'API rate limiting questions', status: 'Resolved', priority: 'Low', customer: 'Banner Research', assignee: 'David', created: '2025-10-20', sla: 'Resolved' },
  { id: 5, subject: 'Data export format issue', status: 'In Progress', priority: 'Medium', customer: 'Loki Solutions', assignee: 'Emma', created: '2025-10-25', sla: 'On Track' },
];

export default function TicketingSystem() {
  const [tickets, setTickets] = useState(ticketsMock);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    customer: '',
    priority: 'Medium',
    assignee: '',
  });

  const statuses = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const assignees = ['Alice', 'Bob', 'Carol', 'David', 'Emma'];

  let filteredTickets = tickets.filter(t => {
    const statusMatch = filterStatus === 'All' || t.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || t.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  const handleAddTicket = () => {
    if (newTicket.subject && newTicket.customer && newTicket.assignee) {
      const ticket = {
        id: tickets.length + 1,
        ...newTicket,
        status: 'Open',
        created: new Date().toISOString().split('T')[0],
        sla: 'On Track',
      };
      setTickets([...tickets, ticket]);
      setNewTicket({ subject: '', customer: '', priority: 'Medium', assignee: '' });
      setIsModalOpen(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-gray-700 text-white',
      'High': 'bg-gray-500 text-white',
      'Medium': 'bg-gray-400 text-white',
      'Low': 'bg-gray-300 text-gray-900',
    };
    return colors[priority] || 'bg-gray-300 text-gray-900';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-gray-200 text-gray-900',
      'In Progress': 'bg-gray-400 text-white',
      'Resolved': 'bg-gray-600 text-white',
      'Closed': 'bg-gray-800 text-white',
    };
    return colors[status] || 'bg-gray-200 text-gray-900';
  };

  const stats = {
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    avgResolution: '2.4 hours',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support & Ticketing</h1>
          <p className="text-gray-600 mt-1">Manage support tickets and customer issues</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
        >
          + New Ticket
        </button>
      </div>

      {/* SLA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Open Tickets</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.open}</p>
          <p className="text-xs text-gray-600 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">In Progress</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
          <p className="text-xs text-gray-600 mt-1">Being worked on</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Resolved</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.resolved}</p>
          <p className="text-xs text-gray-600 mt-1">This month</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Avg Resolution Time</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgResolution}</p>
          <p className="text-xs text-gray-600 mt-1">SLA compliance</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
        >
          {statuses.map(status => <option key={status}>{status}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
        >
          {priorities.map(priority => <option key={priority}>{priority}</option>)}
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Ticket</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Customer</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Priority</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Status</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Assignee</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">SLA</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <td className="py-4 px-6 font-medium text-gray-900">{ticket.subject}</td>
                <td className="py-4 px-6 text-gray-700">{ticket.customer}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700">{ticket.assignee}</td>
                <td className="py-4 px-6">
                  <span className={`text-xs font-semibold ${ticket.sla === 'At Risk' ? 'text-gray-700' : 'text-gray-600'}`}>
                    {ticket.sla}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details */}
      {selectedTicket && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ticket #{selectedTicket.id}</h2>
              <p className="text-gray-600 mt-1">{selectedTicket.subject}</p>
            </div>
            <button onClick={() => setSelectedTicket(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
              <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getStatusColor(selectedTicket.status)}`}>
                {selectedTicket.status}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Priority</p>
              <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${getPriorityColor(selectedTicket.priority)}`}>
                {selectedTicket.priority}
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Assignee</p>
              <p className="text-gray-900 font-semibold">{selectedTicket.assignee}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Created</p>
              <p className="text-gray-900 font-semibold text-sm">{selectedTicket.created}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Add Note</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Change Status</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Reassign</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Close Ticket</button>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create Support Ticket</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Ticket Subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <input
                type="text"
                placeholder="Customer Name"
                value={newTicket.customer}
                onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                {priorities.slice(1).map(priority => <option key={priority}>{priority}</option>)}
              </select>
              <select
                value={newTicket.assignee}
                onChange={(e) => setNewTicket({ ...newTicket, assignee: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Assign To</option>
                {assignees.map(assignee => <option key={assignee}>{assignee}</option>)}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTicket}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                >
                  Create
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
