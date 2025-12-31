import React, { useState } from 'react';

const auditLogsMock = [
  { id: 1, user: 'Alice Johnson', action: 'Created Deal', resource: 'Stark Industries Deal', timestamp: '2025-10-28 10:30 AM', details: 'New deal for $125K' },
  { id: 2, user: 'Bob Smith', action: 'Updated Customer', resource: 'Asgard Tech', timestamp: '2025-10-28 09:15 AM', details: 'Updated contact information' },
  { id: 3, user: 'Carol Davis', action: 'Deleted Ticket', resource: 'Ticket #2847', timestamp: '2025-10-27 03:45 PM', details: 'Spam ticket removal' },
  { id: 4, user: 'David Wilson', action: 'Changed User Role', resource: 'Emma Brown', timestamp: '2025-10-27 02:20 PM', details: 'Promoted to Manager' },
  { id: 5, user: 'Emma Brown', action: 'Exported Data', resource: 'Customer List', timestamp: '2025-10-26 11:00 AM', details: 'CSV export of 1250 customers' },
];

const integrationsMock = [
  { name: 'Email Service (SendGrid)', status: 'Connected', lastSync: '2025-10-28 10:30 AM', action: 'Configure' },
  { name: 'SMS Service (Twilio)', status: 'Connected', lastSync: '2025-10-28 09:45 AM', action: 'Configure' },
  { name: 'Payment Gateway (Stripe)', status: 'Connected', lastSync: '2025-10-27 08:20 PM', action: 'Configure' },
  { name: 'Slack Integration', status: 'Disconnected', lastSync: 'Never', action: 'Connect' },
  { name: 'Zapier', status: 'Disconnected', lastSync: 'Never', action: 'Connect' },
];

export default function SettingsAuditLogs() {
  const [activeTab, setActiveTab] = useState('system');
  const [auditLogs] = useState(auditLogsMock);
  const [integrations] = useState(integrationsMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    companyName: 'Acme Corporation',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
  });

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings & Audit</h1>
        <p className="text-gray-600 mt-1">Manage system settings, integrations, and audit logs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['system', 'integrations', 'audit'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium border-b-2 transition ${
              activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'system' && 'System Settings'}
            {tab === 'integrations' && 'Integrations'}
            {tab === 'audit' && 'Audit Logs'}
          </button>
        ))}
      </div>

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option>UTC</option>
                    <option>EST</option>
                    <option>CST</option>
                    <option>PST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">SMS Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <span className="text-gray-900 font-medium">Auto Backup Enabled</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">
              💾 Save Changes
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {integrations.map((integration, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className={`font-semibold ${integration.status === 'Connected' ? 'text-gray-900' : 'text-gray-500'}`}>
                    {integration.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Last sync: {integration.lastSync}</p>
              </div>
              <button className={`px-4 py-2 rounded-lg font-medium transition ${
                integration.status === 'Connected'
                  ? 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
                {integration.action}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">User</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Action</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Resource</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Timestamp</th>
                  <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{log.user}</td>
                    <td className="py-4 px-6 text-gray-700">{log.action}</td>
                    <td className="py-4 px-6 text-gray-700">{log.resource}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{log.timestamp}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">
              📥 Export Logs
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
