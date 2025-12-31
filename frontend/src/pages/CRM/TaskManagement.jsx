import React, { useState } from 'react';

const tasksMock = [
  { id: 1, title: 'Follow up with Tony Stark', status: 'Overdue', priority: 'High', assignee: 'Alice', dueDate: '2025-10-20', contact: 'Tony Stark', description: 'Discuss proposal details' },
  { id: 2, title: 'Send contract to Steve Rogers', status: 'In Progress', priority: 'High', assignee: 'Bob', dueDate: '2025-10-25', contact: 'Steve Rogers', description: 'Contract for new project' },
  { id: 3, title: 'Schedule demo with Natasha', status: 'Pending', priority: 'Medium', assignee: 'Carol', dueDate: '2025-10-30', contact: 'Natasha Romanoff', description: 'Product demo session' },
  { id: 4, title: 'Prepare quote for Wanda', status: 'Completed', priority: 'Medium', assignee: 'Alice', dueDate: '2025-10-15', contact: 'Wanda Maximoff', description: 'Price quote preparation' },
  { id: 5, title: 'Update CRM with new leads', status: 'In Progress', priority: 'Low', assignee: 'Bob', dueDate: '2025-10-28', contact: 'N/A', description: 'Data entry task' },
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState(tasksMock);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'Medium',
    assignee: 'Alice',
    dueDate: '',
    contact: '',
    description: '',
  });

  const statuses = ['All', 'Pending', 'In Progress', 'Overdue', 'Completed'];
  const priorities = ['All', 'High', 'Medium', 'Low'];
  const assignees = ['Alice', 'Bob', 'Carol'];

  let filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'All' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const handleAddTask = () => {
    if (newTask.title && newTask.dueDate) {
      const task = {
        id: tasks.length + 1,
        ...newTask,
        status: 'Pending',
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', priority: 'Medium', assignee: 'Alice', dueDate: '', contact: '', description: '' });
      setIsModalOpen(false);
    }
  };

  const handleCompleteTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'Overdue') return 'bg-red-100 text-red-800';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'text-red-600 bg-red-50';
    if (priority === 'Medium') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">✅ Task Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Tasks</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {priorities.map(priority => <option key={priority}>{priority}</option>)}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF]">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <p>👤 {task.assignee}</p>
                    <p>📅 {task.dueDate}</p>
                    <p>📌 {task.contact}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {task.status !== 'Completed' && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      ✅
                    </button>
                  )}
                  <button className="px-3 py-1 text-[#0080FF] border border-[#0080FF] rounded text-sm hover:bg-blue-50">
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No tasks found matching your filters</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <textarea
                placeholder="Task Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
                rows="3"
              />
              <input
                type="text"
                placeholder="Contact Name"
                value={newTask.contact}
                onChange={(e) => setNewTask({ ...newTask, contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <select
                value={newTask.assignee}
                onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                {assignees.map(assignee => <option key={assignee}>{assignee}</option>)}
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddTask}
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
