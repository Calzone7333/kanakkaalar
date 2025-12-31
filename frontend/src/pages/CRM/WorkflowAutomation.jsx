import React, { useState } from 'react';

const workflowsMock = [
  { id: 1, name: 'Welcome Email Series', type: 'Email', trigger: 'New Lead', status: 'Active', runs: 245, lastRun: '2025-10-28', actions: 3 },
  { id: 2, name: 'Follow-up Call Reminder', type: 'Task', trigger: 'Deal Stage Change', status: 'Active', runs: 128, lastRun: '2025-10-27', actions: 2 },
  { id: 3, name: 'Proposal Sent Notification', type: 'Email', trigger: 'Manual', status: 'Inactive', runs: 0, lastRun: 'Never', actions: 1 },
  { id: 4, name: 'Re-engagement Campaign', type: 'Email', trigger: 'No Activity (30 days)', status: 'Active', runs: 67, lastRun: '2025-10-26', actions: 4 },
  { id: 5, name: 'Sales Stage Update', type: 'Task', trigger: 'Lead Score > 80', status: 'Active', runs: 89, lastRun: '2025-10-28', actions: 2 },
];

const triggersMock = [
  'New Lead',
  'Lead Score Threshold',
  'Deal Stage Change',
  'Contract Signed',
  'Manual Trigger',
  'Time-based (Schedule)',
  'No Activity (N days)',
  'Email Engagement',
];

const actionsMock = [
  'Send Email',
  'Create Task',
  'Update Field',
  'Assign to User',
  'Send SMS',
  'Create Deal',
  'Send Notification',
  'Move to Stage',
];

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState(workflowsMock);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    trigger: 'New Lead',
    type: 'Email',
    status: 'Active',
  });

  const filteredWorkflows = workflows.filter(w =>
    filterStatus === 'All' || w.status === filterStatus
  );

  const handleAddWorkflow = () => {
    if (newWorkflow.name) {
      const workflow = {
        id: workflows.length + 1,
        ...newWorkflow,
        runs: 0,
        lastRun: 'Never',
        actions: 1,
      };
      setWorkflows([...workflows, workflow]);
      setNewWorkflow({ name: '', trigger: 'New Lead', type: 'Email', status: 'Active' });
      setIsModalOpen(false);
    }
  };

  const handleToggleStatus = (id) => {
    setWorkflows(workflows.map(w =>
      w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w
    ));
  };

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
  };

  const getTypeIcon = (type) => {
    const icons = { Email: '📧', Task: '✅', SMS: '💬' };
    return icons[type] || '⚙️';
  };

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'Active').length,
    totalRuns: workflows.reduce((sum, w) => sum + w.runs, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">🤖 Workflow Automation</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ New Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Workflows</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Total Executions</p>
          <p className="text-3xl font-bold text-orange-600">{stats.totalRuns}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow">
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

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map(workflow => (
          <div key={workflow.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl">{getTypeIcon(workflow.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      workflow.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <p>🔔 Trigger: {workflow.trigger}</p>
                    <p>▶️ Runs: {workflow.runs}</p>
                    <p>⚡ Actions: {workflow.actions}</p>
                    <p>⏰ Last: {workflow.lastRun}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(workflow.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition ${
                    workflow.status === 'Active'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {workflow.status === 'Active' ? '⏸️ Pause' : '▶️ Resume'}
                </button>
                <button className="px-3 py-1 text-[#0080FF] border border-[#0080FF] rounded text-sm hover:bg-blue-50">✏️</button>
                <button onClick={() => handleDeleteWorkflow(workflow.id)} className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50">🗑️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Triggers & Actions Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Available Triggers</h3>
          <div className="space-y-2">
            {triggersMock.map((trigger, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-blue-500">
                {trigger}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Available Actions</h3>
          <div className="space-y-2">
            {actionsMock.map((action, i) => (
              <div key={i} className="p-2 bg-gray-50 rounded-lg text-sm text-gray-700 border-l-4 border-green-500">
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Workflow</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Workflow Name"
                value={newWorkflow.name}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newWorkflow.trigger}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                {triggersMock.map(trigger => <option key={trigger}>{trigger}</option>)}
              </select>
              <select
                value={newWorkflow.type}
                onChange={(e) => setNewWorkflow({ ...newWorkflow, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>Email</option>
                <option>Task</option>
                <option>SMS</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddWorkflow}
                  className="flex-1 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]"
                >
                  Create
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
