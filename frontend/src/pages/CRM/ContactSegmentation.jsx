import React, { useState } from 'react';

const segmentsMock = [
  { id: 1, name: 'Enterprise Clients', count: 45, description: 'High-value accounts with annual revenue >$1M', color: 'bg-red-100', textColor: 'text-red-800', criteria: 'Revenue > $1M, Active contracts' },
  { id: 2, name: 'SMB Segment', count: 127, description: 'Small to medium businesses', color: 'bg-blue-100', textColor: 'text-blue-800', criteria: 'Revenue $100K - $1M' },
  { id: 3, name: 'Startups', count: 89, description: 'Early-stage companies', color: 'bg-green-100', textColor: 'text-green-800', criteria: 'Founded < 3 years ago' },
  { id: 4, name: 'Inactive Contacts', count: 34, description: 'No activity in last 90 days', color: 'bg-gray-100', textColor: 'text-gray-800', criteria: 'Last activity > 90 days' },
  { id: 5, name: 'High-Engagement', count: 156, description: 'Frequently interact with content', color: 'bg-purple-100', textColor: 'text-purple-800', criteria: '5+ interactions/month' },
  { id: 6, name: 'At-Risk Customers', count: 23, description: 'Low engagement, may churn', color: 'bg-orange-100', textColor: 'text-orange-800', criteria: 'Engagement < 1/month' },
];

export default function ContactSegmentation() {
  const [segments, setSegments] = useState(segmentsMock);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: '',
    description: '',
    criteria: '',
    color: 'bg-blue-100',
  });

  const handleAddSegment = () => {
    if (newSegment.name && newSegment.criteria) {
      const segment = {
        id: segments.length + 1,
        ...newSegment,
        count: 0,
        textColor: newSegment.color.replace('bg-', 'text-'),
      };
      setSegments([...segments, segment]);
      setNewSegment({ name: '', description: '', criteria: '', color: 'bg-blue-100' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteSegment = (id) => {
    setSegments(segments.filter(s => s.id !== id));
    if (selectedSegment?.id === id) setSelectedSegment(null);
  };

  const totalContacts = segments.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">🏷️ Contact Segmentation</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ New Segment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Segments</p>
          <p className="text-3xl font-bold text-blue-600">{segments.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Contacts</p>
          <p className="text-3xl font-bold text-green-600">{totalContacts}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Average Segment Size</p>
          <p className="text-3xl font-bold text-orange-600">{Math.round(totalContacts / segments.length)}</p>
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.map(segment => (
          <div
            key={segment.id}
            onClick={() => setSelectedSegment(segment)}
            className={`p-5 rounded-lg shadow-lg cursor-pointer transition hover:shadow-xl border-l-4 ${segment.color}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className={`font-bold text-lg ${segment.textColor}`}>{segment.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{segment.description}</p>
              </div>
              <button onClick={() => handleDeleteSegment(segment.id)} className="text-red-600 hover:text-red-900">🗑️</button>
            </div>

            <div className={`py-3 px-4 rounded-lg ${segment.color} mb-3`}>
              <p className={`text-2xl font-bold ${segment.textColor}`}>{segment.count}</p>
              <p className="text-xs text-gray-600">Contacts</p>
            </div>

            <p className="text-xs text-gray-700 mb-3">
              <span className="font-semibold">Criteria:</span> {segment.criteria}
            </p>

            <div className="flex gap-2">
              <button className="flex-1 px-2 py-1 text-[#0080FF] border border-[#0080FF] rounded text-sm hover:bg-blue-50">
                View
              </button>
              <button className="flex-1 px-2 py-1 text-green-600 border border-green-600 rounded text-sm hover:bg-green-50">
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Segment Details */}
      {selectedSegment && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{selectedSegment.name}</h3>
            <button onClick={() => setSelectedSegment(null)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={`p-4 rounded-lg ${selectedSegment.color}`}>
              <p className="text-gray-600 text-sm">Total Contacts</p>
              <p className="text-3xl font-bold">{selectedSegment.count}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Criteria</p>
              <p className="text-sm font-medium text-gray-900">{selectedSegment.criteria}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Quick Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">📧 Send Campaign</button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">📞 Call List</button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">📊 Analytics</button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">⬇️ Export CSV</button>
            </div>
          </div>

          {/* Contact List Preview */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold text-gray-900 mb-3">Sample Contacts (Top 5)</h4>
            <div className="space-y-2">
              {['Tony Stark', 'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Wanda Maximoff'].map((contact, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{contact}</span>
                  <button className="text-[#0080FF] hover:text-[#0066CC] text-sm">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Segment</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Segment Name"
                value={newSegment.name}
                onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <textarea
                placeholder="Description"
                value={newSegment.description}
                onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
                rows="2"
              />
              <textarea
                placeholder="Criteria (e.g., Revenue > $1M, Active contracts)"
                value={newSegment.criteria}
                onChange={(e) => setNewSegment({ ...newSegment, criteria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
                rows="2"
              />
              <select
                value={newSegment.color}
                onChange={(e) => setNewSegment({ ...newSegment, color: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option value="bg-blue-100">Blue</option>
                <option value="bg-red-100">Red</option>
                <option value="bg-green-100">Green</option>
                <option value="bg-purple-100">Purple</option>
                <option value="bg-orange-100">Orange</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddSegment}
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
