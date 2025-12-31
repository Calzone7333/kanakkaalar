import React, { useState } from 'react';

const activitiesMock = [
  { id: 1, type: 'Call', contact: 'Tony Stark', description: 'Call with Tony Stark - Discussed project requirements', time: '2 hours ago', user: 'Alice', icon: '📞' },
  { id: 2, type: 'Email', contact: 'Steve Rogers', description: 'Sent proposal email to Steve Rogers', time: '4 hours ago', user: 'Bob', icon: '📧' },
  { id: 3, type: 'Meeting', contact: 'Natasha Romanoff', description: 'Scheduled meeting with Natasha Romanoff for Oct 30', time: '1 day ago', user: 'Carol', icon: '📅' },
  { id: 4, type: 'Note', contact: 'Bruce Banner', description: 'Added note: Follow up on pricing discussion', time: '1 day ago', user: 'Alice', icon: '📝' },
  { id: 5, type: 'Deal', contact: 'Wanda Maximoff', description: 'Deal moved to "Proposal Sent" stage', time: '2 days ago', user: 'Bob', icon: '💰' },
  { id: 6, type: 'Task', contact: 'N/A', description: 'Task completed: Send contract to Steve Rogers', time: '2 days ago', user: 'Carol', icon: '✅' },
  { id: 7, type: 'Lead', contact: 'Vision', description: 'New lead created from website form', time: '3 days ago', user: 'System', icon: '🔥' },
];

export default function ActivityTimeline() {
  const [activities, setActivities] = useState(activitiesMock);
  const [filterType, setFilterType] = useState('All');
  const [filterUser, setFilterUser] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const activityTypes = ['All', 'Call', 'Email', 'Meeting', 'Note', 'Deal', 'Task', 'Lead'];
  const users = ['All', 'Alice', 'Bob', 'Carol', 'System'];

  let filteredActivities = activities.filter(activity => {
    const typeMatch = filterType === 'All' || activity.type === filterType;
    const userMatch = filterUser === 'All' || activity.user === filterUser;
    const searchMatch = activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       activity.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && userMatch && searchMatch;
  });

  const getActivityColor = (type) => {
    const colors = {
      Call: 'border-blue-500 bg-blue-50',
      Email: 'border-green-500 bg-green-50',
      Meeting: 'border-purple-500 bg-purple-50',
      Note: 'border-yellow-500 bg-yellow-50',
      Deal: 'border-red-500 bg-red-50',
      Task: 'border-green-500 bg-green-50',
      Lead: 'border-orange-500 bg-orange-50',
    };
    return colors[type] || 'border-gray-500 bg-gray-50';
  };

  const stats = {
    total: activities.length,
    today: activities.filter(a => a.time.includes('hour') || a.time.includes('ago')).length,
    thisWeek: activities.length,
    byType: {
      Call: activities.filter(a => a.type === 'Call').length,
      Email: activities.filter(a => a.type === 'Email').length,
      Meeting: activities.filter(a => a.type === 'Meeting').length,
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">📝 Activity Timeline</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Activities</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Calls</p>
          <p className="text-3xl font-bold text-green-600">{stats.byType.Call}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Emails</p>
          <p className="text-3xl font-bold text-purple-600">{stats.byType.Email}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Meetings</p>
          <p className="text-3xl font-bold text-orange-600">{stats.byType.Meeting}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {activityTypes.map(type => <option key={type}>{type}</option>)}
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {users.map(user => <option key={user}>{user}</option>)}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <div key={activity.id} className="relative">
              <div className="flex gap-4">
                {/* Timeline Line */}
                {index !== filteredActivities.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-300"></div>
                )}

                {/* Activity Card */}
                <div className="flex gap-4 flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl border-2 border-gray-300">
                      {activity.icon}
                    </div>
                  </div>

                  <div className={`flex-1 p-4 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{activity.type}</span>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{activity.contact}</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{activity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>👤 {activity.user}</span>
                          <span>⏰ {activity.time}</span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">⋮</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            <p>No activities found matching your filters</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📌 Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
            📞 Log Call
          </button>
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
            📧 Send Email
          </button>
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
            📝 Add Note
          </button>
          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
            📅 Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
