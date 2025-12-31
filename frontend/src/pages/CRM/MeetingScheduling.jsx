import React, { useState } from 'react';

const meetingsMock = [
  { id: 1, title: 'Demo with Tony Stark', contact: 'Tony Stark', date: '2025-10-30', time: '2:00 PM', duration: '1 hour', status: 'Scheduled', attendees: ['Alice', 'Tony'], notes: '' },
  { id: 2, title: 'Contract Review - Steve Rogers', contact: 'Steve Rogers', date: '2025-10-29', time: '10:00 AM', duration: '45 min', status: 'Scheduled', attendees: ['Bob', 'Steve'], notes: '' },
  { id: 3, title: 'Follow-up Discussion', contact: 'Natasha Romanoff', date: '2025-10-28', time: '3:30 PM', duration: '30 min', status: 'Completed', attendees: ['Carol', 'Natasha'], notes: 'Discussed pricing and timeline. Interested in proposal.' },
  { id: 4, title: 'Quarterly Business Review', contact: 'Bruce Banner', date: '2025-11-05', time: '11:00 AM', duration: '2 hours', status: 'Scheduled', attendees: ['Alice', 'Bob', 'Bruce'], notes: '' },
];

export default function MeetingScheduling() {
  const [meetings, setMeetings] = useState(meetingsMock);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    contact: '',
    date: '',
    time: '',
    duration: '1 hour',
    attendees: '',
  });

  const filteredMeetings = meetings.filter(m =>
    filterStatus === 'All' || m.status === filterStatus
  );

  const handleAddMeeting = () => {
    if (newMeeting.title && newMeeting.contact && newMeeting.date && newMeeting.time) {
      const meeting = {
        id: meetings.length + 1,
        ...newMeeting,
        attendees: newMeeting.attendees.split(',').map(a => a.trim()),
        status: 'Scheduled',
        notes: '',
      };
      setMeetings([...meetings, meeting]);
      setNewMeeting({ title: '', contact: '', date: '', time: '', duration: '1 hour', attendees: '' });
      setIsModalOpen(false);
    }
  };

  const handleUpdateNotes = (id, notes) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, notes } : m));
  };

  const handleCompleteStatus = (id) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, status: 'Completed' } : m));
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter(m => m.id !== id));
    setSelectedMeeting(null);
  };

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'Scheduled').length,
    completed: meetings.filter(m => m.status === 'Completed').length,
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">📋 Meeting Notes & Scheduling</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ Schedule Meeting
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Meetings</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Scheduled</p>
          <p className="text-3xl font-bold text-green-600">{stats.scheduled}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl font-bold text-orange-600">{stats.completed}</p>
        </div>
      </div>

      {/* Upcoming Meetings */}
      {upcomingMeetings.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Upcoming Meetings</h3>
          <div className="space-y-3">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="bg-white p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{meeting.title}</p>
                  <p className="text-sm text-gray-600">{meeting.date} at {meeting.time}</p>
                </div>
                <button
                  onClick={() => setSelectedMeeting(meeting)}
                  className="px-3 py-1 text-[#0080FF] border border-[#0080FF] rounded text-sm hover:bg-blue-50"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Meetings List */}
      <div className="space-y-3">
        {filteredMeetings.map(meeting => (
          <div
            key={meeting.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF] cursor-pointer"
            onClick={() => setSelectedMeeting(meeting)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                    meeting.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <p>👤 {meeting.contact}</p>
                  <p>📅 {meeting.date} at {meeting.time}</p>
                  <p>⏱️ {meeting.duration}</p>
                  <p>👥 {meeting.attendees.length} attendees</p>
                </div>
              </div>
              <div className="flex gap-2">
                {meeting.status !== 'Completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompleteStatus(meeting.id);
                    }}
                    className="px-3 py-1 text-green-600 border border-green-600 rounded text-sm hover:bg-green-50"
                  >
                    ✅
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMeeting(meeting.id);
                  }}
                  className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meeting Details */}
      {selectedMeeting && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-[#0080FF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{selectedMeeting.title}</h3>
              <p className="text-sm text-gray-600 mt-1">with {selectedMeeting.contact}</p>
            </div>
            <button onClick={() => setSelectedMeeting(null)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900">{selectedMeeting.date}</p>
              <p className="text-sm text-gray-600">{selectedMeeting.time} ({selectedMeeting.duration})</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Attendees</p>
              <div className="flex flex-wrap gap-2">
                {selectedMeeting.attendees.map((attendee, i) => (
                  <span key={i} className="px-2 py-1 bg-[#0080FF] text-white text-xs rounded-full">
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meeting Notes</label>
              <textarea
                value={selectedMeeting.notes || ''}
                onChange={(e) => handleUpdateNotes(selectedMeeting.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
                rows="5"
                placeholder="Add notes from the meeting..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📧 Send Summary</button>
            <button className="px-4 py-2 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📎 Attach Files</button>
            <button className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]">💾 Save Notes</button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Meeting</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Meeting Title"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="text"
                placeholder="Contact Name"
                value={newMeeting.contact}
                onChange={(e) => setNewMeeting({ ...newMeeting, contact: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="date"
                value={newMeeting.date}
                onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="time"
                value={newMeeting.time}
                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newMeeting.duration}
                onChange={(e) => setNewMeeting({ ...newMeeting, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>1 hour</option>
                <option>1.5 hours</option>
                <option>2 hours</option>
              </select>
              <input
                type="text"
                placeholder="Attendees (comma-separated)"
                value={newMeeting.attendees}
                onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddMeeting}
                  className="flex-1 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]"
                >
                  Schedule
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
