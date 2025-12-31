import React, { useState } from "react";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("integrations");
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "SendGrid Email",
      type: "email",
      status: "connected",
      icon: "📧",
      description: "Email service for campaigns and notifications",
      config: { apiKey: "sk_test_***", fromEmail: "noreply@crm.com" },
      connectedDate: "2025-01-15",
      lastUsed: "2025-01-28",
    },
    {
      id: 2,
      name: "Twilio SMS",
      type: "sms",
      status: "connected",
      icon: "💬",
      description: "SMS service for customer communications",
      config: { accountSid: "AC***", authToken: "***" },
      connectedDate: "2025-01-10",
      lastUsed: "2025-01-26",
    },
    {
      id: 3,
      name: "Stripe Payments",
      type: "payment",
      status: "connected",
      icon: "💳",
      description: "Payment processing for invoices and subscriptions",
      config: { apiKey: "sk_live_***", webhookSecret: "whsec_***" },
      connectedDate: "2025-01-01",
      lastUsed: "2025-01-28",
    },
    {
      id: 4,
      name: "Slack Notifications",
      type: "communication",
      status: "disconnected",
      icon: "🎯",
      description: "Real-time notifications to Slack",
      config: {},
      connectedDate: null,
      lastUsed: null,
    },
  ]);

  const auditLogs = [
    { id: 1, user: "admin@crm.com", action: "Updated employee: Alice Johnson", timestamp: "2025-01-28 14:32:15", category: "Employee Management", status: "success" },
    { id: 2, user: "admin@crm.com", action: "Created new lead: Tech Corp", timestamp: "2025-01-28 13:45:22", category: "Lead Management", status: "success" },
    { id: 3, user: "manager@crm.com", action: "Exported customer list", timestamp: "2025-01-28 12:18:00", category: "Data Export", status: "success" },
    { id: 4, user: "admin@crm.com", action: "Failed login attempt from IP 192.168.1.50", timestamp: "2025-01-28 11:25:33", category: "Security", status: "failed" },
    { id: 5, user: "admin@crm.com", action: "Updated system settings", timestamp: "2025-01-28 10:12:45", category: "System", status: "success" },
    { id: 6, user: "sales@crm.com", action: "Closed deal: $50,000", timestamp: "2025-01-27 16:44:12", category: "Sales", status: "success" },
    { id: 7, user: "admin@crm.com", action: "Deleted inactive customer: Old Corp", timestamp: "2025-01-27 15:30:00", category: "Customer Management", status: "success" },
    { id: 8, user: "manager@crm.com", action: "Generated Q1 sales report", timestamp: "2025-01-27 14:15:22", category: "Reporting", status: "success" },
  ];

  const [filterCategory, setFilterCategory] = useState("All");
  const [searchLog, setSearchLog] = useState("");

  // Filter audit logs
  const filteredLogs = auditLogs.filter((log) => {
    const categoryMatch = filterCategory === "All" || log.category === filterCategory;
    const searchMatch = searchLog === "" || 
      log.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      log.user.toLowerCase().includes(searchLog.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Integration Modal
  const IntegrationModal = ({ integration }) => {
    const [formData, setFormData] = useState(integration?.config || {});

    const handleConnect = () => {
      console.log("Connecting integration:", formData);
      setShowIntegrationModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">{integration?.icon}</span>
              {integration?.name}
            </h3>
            <button onClick={() => setShowIntegrationModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">{integration?.description}</p>

          <div className="space-y-4 mb-6">
            {integration?.type === "email" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter your SendGrid API key"
                    defaultValue={formData.apiKey || ""}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                  <input
                    type="email"
                    placeholder="noreply@company.com"
                    defaultValue={formData.fromEmail || ""}
                    onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
            {integration?.type === "sms" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                  <input
                    type="text"
                    placeholder="Enter your Twilio Account SID"
                    defaultValue={formData.accountSid || ""}
                    onChange={(e) => setFormData({ ...formData, accountSid: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                  <input
                    type="password"
                    placeholder="Enter your Twilio Auth Token"
                    defaultValue={formData.authToken || ""}
                    onChange={(e) => setFormData({ ...formData, authToken: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
            {integration?.type === "payment" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                  <input
                    type="password"
                    placeholder="Enter your Stripe API key"
                    defaultValue={formData.apiKey || ""}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
                  <input
                    type="password"
                    placeholder="Enter your Webhook Secret"
                    defaultValue={formData.webhookSecret || ""}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowIntegrationModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">⚙️ System Settings</h1>
        <p className="mt-1 text-gray-600">Manage integrations, configurations, and system logs</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto pb-0">
          {[
            { id: "integrations", label: "🔗 Integrations", icon: "🔗" },
            { id: "general", label: "⚙️ General Settings", icon: "⚙️" },
            { id: "audit", label: "📋 Audit Logs", icon: "📋" },
            { id: "security", label: "🔒 Security", icon: "🔒" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Integrations</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {integrations.map((integration) => (
                <div key={integration.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-xs text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        integration.status === "connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {integration.status === "connected" ? "✓ Connected" : "Disconnected"}
                    </span>
                  </div>

                  {integration.status === "connected" && (
                    <div className="space-y-2 mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <p>Connected: {integration.connectedDate}</p>
                      <p>Last used: {integration.lastUsed}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <button
                          onClick={() => {
                            setSelectedIntegration(integration);
                            setShowIntegrationModal(true);
                          }}
                          className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                        >
                          Configure
                        </button>
                        <button className="flex-1 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition">
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedIntegration(integration);
                          setShowIntegrationModal(true);
                        }}
                        className="w-full px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Integrations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">📦 Available Integrations</h2>
            <p className="text-gray-700 mb-4">Connect more services to extend your CRM capabilities</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                ➕ Google Analytics
              </button>
              <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                ➕ Hubspot
              </button>
              <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                ➕ Salesforce
              </button>
              <button className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                ➕ Zapier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
              <input
                type="text"
                defaultValue="Acme Corporation"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Email</label>
              <input
                type="email"
                defaultValue="admin@acme.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>UTC</option>
                <option>EST</option>
                <option>CST</option>
                <option>PST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Changes</button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>All Categories</option>
              <option>Employee Management</option>
              <option>Lead Management</option>
              <option>Customer Management</option>
              <option>Data Export</option>
              <option>Security</option>
              <option>System</option>
              <option>Sales</option>
              <option>Reporting</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Export
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Timestamp</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-700 text-xs">{log.timestamp}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{log.user}</td>
                      <td className="px-4 py-3 text-gray-700">{log.action}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {log.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {log.status === "success" ? "✓" : "✗"} {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Require minimum 8 characters</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Require uppercase letters</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Require numbers</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">Require special characters</span>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-4">Require 2FA for all admin accounts</p>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">Enable 2FA requirement</span>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Save Changes</button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Integration Modal */}
      {showIntegrationModal && selectedIntegration && <IntegrationModal integration={selectedIntegration} />}
    </div>
  );
};

export default AdminSettings;
