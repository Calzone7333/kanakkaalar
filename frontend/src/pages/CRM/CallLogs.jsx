import React, { useState } from 'react';

const callLogsMock = [
  { id: 1, contact: 'Tony Stark', phone: '555-0101', duration: '32 min', date: '2025-10-28', time: '10:30 AM', type: 'Outgoing', status: 'Completed', notes: 'Discussed project requirements' },
  { id: 2, contact: 'Steve Rogers', phone: '555-0102', duration: '15 min', date: '2025-10-28', time: '02:15 PM', type: 'Incoming', status: 'Completed', notes: 'Follow-up on proposal' },
  { id: 3, contact: 'Natasha Romanoff', phone: '555-0103', duration: 'N/A', date: '2025-10-28', time: '04:00 PM', type: 'Missed', status: 'Pending', notes: 'Callback required' },
  { id: 4, contact: 'Bruce Banner', phone: '555-0104', duration: '48 min', date: '2025-10-27', time: '11:00 AM', type: 'Outgoing', status: 'Completed', notes: 'Demo session scheduled' },
];

export default function CallLogs() {
  const [callLogs, setCallLogs] = useState(callLogsMock);
  const [activeTab, setActiveTab] = useState('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCall, setNewCall] = useState({
    contact: '',
    phone: '',
    type: 'Outgoing',
    date: '',
    time: '',
    notes: '',
  });

  const filteredLogs = callLogs.filter(log =>
    log.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.phone.includes(searchTerm)
  );

  const handleAddCall = () => {
    if (newCall.contact && newCall.phone && newCall.date && newCall.time) {
      const call = {
        id: callLogs.length + 1,
        ...newCall,
        duration: 'Ongoing',
        status: 'Completed',
      };
      setCallLogs([...callLogs, call]);
      setNewCall({ contact: '', phone: '', type: 'Outgoing', date: '', time: '', notes: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteLog = (id) => {
    setCallLogs(callLogs.filter(log => log.id !== id));
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'Pending') return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getTypeColor = (type) => {
    if (type === 'Incoming') return 'text-green-600 bg-green-50';
    if (type === 'Outgoing') return 'text-blue-600 bg-blue-50';
    return 'text-red-600 bg-red-50';
  };

  const stats = {
    total: callLogs.length,
    completed: callLogs.filter(c => c.status === 'Completed').length,
    missed: callLogs.filter(c => c.type === 'Missed').length,
    totalMinutes: callLogs.reduce((sum, c) => {
      const minutes = parseInt(c.duration) || 0;
      return sum + minutes;
    }, 0),
  };

  const tabClass = (tab) =>
    `px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
      activeTab === tab
        ? 'border-[#0080FF] text-[#0080FF]'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">📞 Call Logs & Scheduling</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ Log Call / Schedule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Calls</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Missed Calls</p>
          <p className="text-3xl font-bold text-red-600">{stats.missed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Total Minutes</p>
          <p className="text-3xl font-bold text-orange-600">{stats.totalMinutes}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-xl shadow border-b border-gray-200">
        <nav className="flex space-x-4">
          <button onClick={() => setActiveTab('logs')} className={tabClass('logs')}>
            📞 Call Logs
          </button>
          <button onClick={() => setActiveTab('schedule')} className={tabClass('schedule')}>
            📅 Schedule
          </button>
        </nav>
      </div>

      {/* Call Logs Tab */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by contact or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{log.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.date} {log.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{log.duration}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button className="text-[#0080FF] hover:text-[#0066CC]">📝</button>
                      <button onClick={() => handleDeleteLog(log.id)} className="text-red-600 hover:text-red-900">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Call Schedule</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="font-medium text-blue-900">Today - 3:00 PM</p>
                  <p className="text-sm text-blue-700">Call with Tony Stark</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="font-medium text-green-900">Tomorrow - 10:00 AM</p>
                  <p className="text-sm text-green-700">Follow-up with Steve Rogers</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <p className="font-medium text-orange-900">Oct 30 - 2:30 PM</p>
                  <p className="text-sm text-orange-700">Demo session with Natasha</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Quick Dial</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Tony Stark</span>
                  <button className="px-3 py-1 bg-[#0080FF] text-white rounded text-sm hover:bg-[#0066CC]">📞 Call</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Steve Rogers</span>
                  <button className="px-3 py-1 bg-[#0080FF] text-white rounded text-sm hover:bg-[#0066CC]">📞 Call</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Natasha Romanoff</span>
                  <button className="px-3 py-1 bg-[#0080FF] text-white rounded text-sm hover:bg-[#0066CC]">📞 Call</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Log Call / Schedule</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Contact Name"
                value={newCall.contact}
                onChange={(e) => setNewCall({ ...newCall, contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newCall.phone}
                onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newCall.type}
                onChange={(e) => setNewCall({ ...newCall, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>Outgoing</option>
                <option>Incoming</option>
              </select>
              <input
                type="date"
                value={newCall.date}
                onChange={(e) => setNewCall({ ...newCall, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="time"
                value={newCall.time}
                onChange={(e) => setNewCall({ ...newCall, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <textarea
                placeholder="Call Notes"
                value={newCall.notes}
                onChange={(e) => setNewCall({ ...newCall, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
                rows="3"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCall}
                  className="flex-1 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]"
                >
                  Log Call
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
