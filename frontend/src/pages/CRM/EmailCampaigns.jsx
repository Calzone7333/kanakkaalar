import React, { useState } from 'react';

const emailCampaignsMock = [
  { id: 1, name: 'Welcome Series', type: 'Drip', status: 'Active', recipients: 245, opens: 182, clicks: 65, created: '2025-10-15' },
  { id: 2, name: 'Product Launch', type: 'Blast', status: 'Completed', recipients: 1200, opens: 840, clicks: 320, created: '2025-10-10' },
  { id: 3, name: 'Re-engagement', type: 'Drip', status: 'Draft', recipients: 0, opens: 0, clicks: 0, created: '2025-10-20' },
  { id: 4, name: 'Monthly Newsletter', type: 'Drip', status: 'Active', recipients: 580, opens: 435, clicks: 128, created: '2025-09-15' },
];

const emailTemplatesMock = [
  { id: 101, name: 'Standard Welcome', category: 'Welcome', created: '2025-01-10', usage: 45 },
  { id: 102, name: 'Product Announcement', category: 'Announcement', created: '2025-02-15', usage: 32 },
  { id: 103, name: 'Promotional Offer', category: 'Promotion', created: '2025-03-20', usage: 89 },
  { id: 104, name: 'Follow-up Reminder', category: 'Follow-up', created: '2025-04-05', usage: 67 },
];

export default function EmailCampaigns() {
  const [campaigns, setCampaigns] = useState(emailCampaignsMock);
  const [templates, setTemplates] = useState(emailTemplatesMock);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Drip',
    recipients: '',
    subject: '',
  });

  const filteredCampaigns = campaigns.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCampaign = () => {
    if (newCampaign.name && newCampaign.recipients) {
      const campaign = {
        id: campaigns.length + 1,
        ...newCampaign,
        recipients: parseInt(newCampaign.recipients),
        status: 'Draft',
        opens: 0,
        clicks: 0,
        created: new Date().toISOString().split('T')[0],
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({ name: '', type: 'Drip', recipients: '', subject: '' });
      setIsModalOpen(false);
    }
  };

  const handleDeleteCampaign = (id) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-100 text-green-800';
    if (status === 'Completed') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-3xl font-bold text-gray-800">📧 Email Campaigns & Templates</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ➕ New Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-4 rounded-xl shadow border-b border-gray-200">
        <nav className="flex space-x-4">
          <button onClick={() => setActiveTab('campaigns')} className={tabClass('campaigns')}>
            📧 Campaigns
          </button>
          <button onClick={() => setActiveTab('templates')} className={tabClass('templates')}>
            📋 Templates
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder={activeTab === 'campaigns' ? 'Search campaigns...' : 'Search templates...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <p className="text-gray-600 text-sm">Active Campaigns</p>
              <p className="text-3xl font-bold text-green-600">{campaigns.filter(c => c.status === 'Active').length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm">Total Recipients</p>
              <p className="text-3xl font-bold text-purple-600">{campaigns.reduce((sum, c) => sum + c.recipients, 0)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm">Avg. Open Rate</p>
              <p className="text-3xl font-bold text-orange-600">
                {campaigns.length > 0 ? Math.round((campaigns.reduce((sum, c) => sum + c.opens, 0) / campaigns.reduce((sum, c) => sum + c.recipients, 0)) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipients</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.recipients}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.opens}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{campaign.clicks}</td>
                    <td className="px-6 py-4 text-right text-sm space-x-2">
                      <button className="text-[#0080FF] hover:text-[#0066CC]">✏️</button>
                      <button onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-600 hover:text-red-900">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            ➕ Create Template
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF]">
                <h3 className="font-semibold text-gray-900 text-lg">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Category: {template.category}</p>
                <p className="text-sm text-gray-500">Used {template.usage} times</p>
                <p className="text-xs text-gray-400 mt-2">Created: {template.created}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-2 py-1 bg-[#0080FF] text-white text-sm rounded hover:bg-[#0066CC]">Use</button>
                  <button className="flex-1 px-2 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50">Edit</button>
                  <button onClick={() => handleDeleteTemplate(template.id)} className="flex-1 px-2 py-1 text-red-600 text-sm rounded hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Campaign Name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <input
                type="text"
                placeholder="Email Subject"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <select
                value={newCampaign.type}
                onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>Drip</option>
                <option>Blast</option>
                <option>Triggered</option>
              </select>
              <input
                type="number"
                placeholder="Number of Recipients"
                value={newCampaign.recipients}
                onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleAddCampaign}
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
