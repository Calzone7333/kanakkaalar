import React, { useState } from 'react';

const campaignsMock = [
  { id: 1, name: 'Q4 Product Launch', type: 'Email', status: 'Active', recipients: 1200, opens: 420, clicks: 89, ctr: '21%', roi: '340%', startDate: '2025-10-01' },
  { id: 2, name: 'Enterprise Webinar Series', type: 'Webinar', status: 'Active', recipients: 850, opens: 680, clicks: 156, ctr: '23%', roi: '285%', startDate: '2025-10-15' },
  { id: 3, name: 'Summer Clearance', type: 'SMS', status: 'Completed', recipients: 2400, opens: 1920, clicks: 384, ctr: '20%', roi: '420%', startDate: '2025-09-01' },
  { id: 4, name: 'Holiday Campaign', type: 'Email', status: 'Draft', recipients: 0, opens: 0, clicks: 0, ctr: '0%', roi: '0%', startDate: '2025-11-01' },
  { id: 5, name: 'Partner Program', type: 'Content', status: 'Active', recipients: 5600, opens: 2800, clicks: 728, ctr: '26%', roi: '365%', startDate: '2025-08-15' },
];

export default function MarketingManagement() {
  const [campaigns, setCampaigns] = useState(campaignsMock);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    type: 'Email',
    recipients: '',
  });

  const types = ['Email', 'SMS', 'Webinar', 'Content', 'Social'];
  const statuses = ['Draft', 'Active', 'Paused', 'Completed'];

  const handleAddCampaign = () => {
    if (newCampaign.name && newCampaign.recipients) {
      const campaign = {
        id: campaigns.length + 1,
        ...newCampaign,
        recipients: parseInt(newCampaign.recipients),
        opens: 0,
        clicks: 0,
        ctr: '0%',
        roi: '0%',
        status: 'Draft',
        startDate: new Date().toISOString().split('T')[0],
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({ name: '', type: 'Email', recipients: '' });
      setIsModalOpen(false);
    }
  };

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
  const avgCTR = Math.round(campaigns.filter(c => c.status !== 'Draft').reduce((sum, c) => sum + parseInt(c.ctr), 0) / campaigns.filter(c => c.status !== 'Draft').length);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketing Management</h1>
          <p className="text-gray-600 mt-1">Manage campaigns, track performance, and analyze ROI</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
        >
          + New Campaign
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Active Campaigns</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{activeCampaigns.length}</p>
          <p className="text-xs text-gray-600 mt-1">Running now</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Total Recipients</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{(totalRecipients / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-600 mt-1">All campaigns</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Avg Click Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{avgCTR}%</p>
          <p className="text-xs text-gray-600 mt-1">Across campaigns</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Total Campaigns</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{campaigns.length}</p>
          <p className="text-xs text-gray-600 mt-1">{campaigns.filter(c => c.status === 'Completed').length} completed</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Campaign</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Type</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Status</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Recipients</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Open Rate</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">CTR</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">ROI</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedCampaign(campaign)}
              >
                <td className="py-4 px-6 font-medium text-gray-900">{campaign.name}</td>
                <td className="py-4 px-6 text-gray-700">{campaign.type}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === 'Active' ? 'bg-gray-600 text-white' :
                    campaign.status === 'Completed' ? 'bg-gray-400 text-white' :
                    'bg-gray-200 text-gray-900'
                  }`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-700">{campaign.recipients.toLocaleString()}</td>
                <td className="py-4 px-6 text-gray-700">{Math.round((campaign.opens / campaign.recipients) * 100)}%</td>
                <td className="py-4 px-6 font-mono text-gray-900">{campaign.ctr}</td>
                <td className="py-4 px-6 font-bold text-gray-900">{campaign.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campaign Details */}
      {selectedCampaign && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedCampaign.name}</h2>
              <p className="text-gray-600 mt-1">{selectedCampaign.type} • {selectedCampaign.status}</p>
            </div>
            <button onClick={() => setSelectedCampaign(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-200 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Recipients</p>
              <p className="text-gray-900 font-bold">{selectedCampaign.recipients.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Opens</p>
              <p className="text-gray-900 font-bold">{selectedCampaign.opens}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Clicks</p>
              <p className="text-gray-900 font-bold">{selectedCampaign.clicks}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">ROI</p>
              <p className="text-gray-900 font-bold">{selectedCampaign.roi}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">View Analytics</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Edit Campaign</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Duplicate</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Export Report</button>
          </div>
        </div>
      )}

      {/* Add Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Campaign</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Campaign Name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <select
                value={newCampaign.type}
                onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                {types.map(type => <option key={type}>{type}</option>)}
              </select>
              <input
                type="number"
                placeholder="Recipients"
                value={newCampaign.recipients}
                onChange={(e) => setNewCampaign({ ...newCampaign, recipients: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddCampaign}
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
