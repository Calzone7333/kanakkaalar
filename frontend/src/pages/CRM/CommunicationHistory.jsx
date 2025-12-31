import React, { useState } from 'react';

const communicationsMock = [
  { id: 1, contact: 'Tony Stark', type: 'Email', subject: 'Project proposal discussion', date: '2025-10-28', time: '10:30 AM', sender: 'Alice', status: 'Sent', details: 'Sent project proposal document' },
  { id: 2, contact: 'Steve Rogers', type: 'Call', subject: 'Contract review call', date: '2025-10-28', time: '02:15 PM', sender: 'Bob', status: 'Completed', details: 'Discussed contract terms and pricing' },
  { id: 3, contact: 'Natasha Romanoff', type: 'SMS', subject: 'Meeting reminder', date: '2025-10-28', time: '09:00 AM', sender: 'System', status: 'Delivered', details: 'Reminder for scheduled meeting today' },
  { id: 4, contact: 'Bruce Banner', type: 'Email', subject: 'Q4 Marketing Plan', date: '2025-10-27', time: '03:45 PM', sender: 'Carol', status: 'Opened', details: 'Shared Q4 marketing strategy document' },
  { id: 5, contact: 'Wanda Maximoff', type: 'Call', subject: 'Demo follow-up', date: '2025-10-27', time: '11:20 AM', sender: 'Alice', status: 'Completed', details: 'Discussed demo outcomes and next steps' },
  { id: 6, contact: 'Vision', type: 'Email', subject: 'Welcome email', date: '2025-10-26', time: '08:00 AM', sender: 'System', status: 'Sent', details: 'New lead welcome email' },
];

export default function CommunicationHistory() {
  const [communications, setCommunications] = useState(communicationsMock);
  const [filterType, setFilterType] = useState('All');
  const [filterContact, setFilterContact] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComm, setSelectedComm] = useState(null);

  const types = ['All', 'Email', 'Call', 'SMS', 'Note'];
  const contacts = ['All', ...new Set(communications.map(c => c.contact))];

  let filteredComms = communications.filter(comm => {
    const typeMatch = filterType === 'All' || comm.type === filterType;
    const contactMatch = filterContact === 'All' || comm.contact === filterContact;
    const searchMatch = comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       comm.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && contactMatch && searchMatch;
  });

  const getTypeIcon = (type) => {
    const icons = { Email: '📧', Call: '📞', SMS: '💬', Note: '📝' };
    return icons[type] || '💬';
  };

  const getTypeColor = (type) => {
    const colors = {
      Email: 'bg-blue-100',
      Call: 'bg-green-100',
      SMS: 'bg-purple-100',
      Note: 'bg-yellow-100',
    };
    return colors[type] || 'bg-gray-100';
  };

  const getStatusColor = (status) => {
    if (status === 'Sent' || status === 'Delivered') return 'bg-blue-100 text-blue-800';
    if (status === 'Opened') return 'bg-green-100 text-green-800';
    if (status === 'Completed') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: communications.length,
    emails: communications.filter(c => c.type === 'Email').length,
    calls: communications.filter(c => c.type === 'Call').length,
    sms: communications.filter(c => c.type === 'SMS').length,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">💬 Communication History</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Communications</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Emails</p>
          <p className="text-3xl font-bold text-green-600">{stats.emails}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Calls</p>
          <p className="text-3xl font-bold text-purple-600">{stats.calls}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">SMS</p>
          <p className="text-3xl font-bold text-orange-600">{stats.sms}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by subject or contact..."
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
            {types.map(type => <option key={type}>{type}</option>)}
          </select>

          <select
            value={filterContact}
            onChange={(e) => setFilterContact(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {contacts.map(contact => <option key={contact}>{contact}</option>)}
          </select>
        </div>
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {filteredComms.length > 0 ? (
          filteredComms.map(comm => (
            <div
              key={comm.id}
              onClick={() => setSelectedComm(comm)}
              className={`p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF] cursor-pointer ${getTypeColor(comm.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl">{getTypeIcon(comm.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{comm.subject}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <p>👤 {comm.contact}</p>
                      <p>💬 {comm.type}</p>
                      <p>👤 {comm.sender}</p>
                      <p>📅 {comm.date} at {comm.time}</p>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋮</button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            <p>No communications found matching your filters</p>
          </div>
        )}
      </div>

      {/* Communication Details */}
      {selectedComm && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0080FF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{getTypeIcon(selectedComm.type)}</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedComm.subject}</h3>
                  <p className="text-sm text-gray-600">{selectedComm.type} with {selectedComm.contact}</p>
                </div>
              </div>
            </div>
            <button onClick={() => setSelectedComm(null)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Communication Type</p>
              <p className="text-lg font-semibold text-gray-900">{selectedComm.type}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Status</p>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold inline-block ${getStatusColor(selectedComm.status)}`}>
                {selectedComm.status}
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900">{selectedComm.date}</p>
              <p className="text-sm text-gray-600">{selectedComm.time}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Sent By</p>
              <p className="text-lg font-semibold text-gray-900">{selectedComm.sender}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
            <p className="p-4 bg-gray-50 rounded-lg text-gray-700">{selectedComm.details}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📧 Reply</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">🔗 Link</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📎 Attach</button>
          </div>
        </div>
      )}

      {/* Quick Stats by Contact */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Communications by Contact (Top 5)</h3>
        <div className="space-y-3">
          {['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Wanda Maximoff'].map((contact, i) => {
            const count = communications.filter(c => c.contact === contact).length;
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900 font-medium">{contact}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#0080FF]"
                      style={{ width: `${Math.min(count * 20, 100)}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
