import React, { useState } from 'react';

const kpiDataMock = {
  employees: { total: 45, active: 42, inactive: 3, trend: '+2 this month' },
  customers: { total: 1250, active: 980, inactive: 270, trend: '+15 this month' },
  leads: { total: 580, qualified: 245, converted: 89, trend: '+45 this month' },
  tickets: { open: 23, pending: 12, resolved: 456, sla_breached: 2 },
  revenue: { total: 2450000, mtd: 524000, ytd: 1890000, trend: '+12% vs last month' },
  sales: { pipeline: 890000, deals_in_progress: 28, avg_deal_size: 31785, close_rate: '68%' },
};

const recentActivityMock = [
  { id: 1, type: 'Customer Created', user: 'Alice Johnson', time: '2 hours ago', icon: '👤' },
  { id: 2, type: 'Deal Closed', user: 'Bob Smith', time: '4 hours ago', icon: '💰', value: '$45,000' },
  { id: 3, type: 'Employee Added', user: 'Carol Davis', time: '1 day ago', icon: '👥' },
  { id: 4, type: 'Campaign Launched', user: 'David Wilson', time: '2 days ago', icon: '📧' },
  { id: 5, type: 'Ticket Resolved', user: 'Emma Brown', time: '3 days ago', icon: '✓' },
];

const systemHealthMock = [
  { service: 'Database', status: 'Operational', uptime: '99.98%', response: '12ms' },
  { service: 'Email Service', status: 'Operational', uptime: '99.95%', response: '45ms' },
  { service: 'Payment Gateway', status: 'Operational', uptime: '99.99%', response: '89ms' },
  { service: 'SMS Service', status: 'Operational', uptime: '99.90%', response: '234ms' },
];

export default function SystemOverview() {
  const [dateRange, setDateRange] = useState('month');

  const KPICard = ({ title, value, subtext, trend, icon }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && <p className="text-sm text-gray-600 mt-1">{trend}</p>}
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className="text-3xl opacity-20">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-1">Monitor your CRM system health and key metrics</p>
        </div>
        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                dateRange === range
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Total Employees"
          value={kpiDataMock.employees.total}
          subtext={`${kpiDataMock.employees.active} active • ${kpiDataMock.employees.inactive} inactive`}
          trend={kpiDataMock.employees.trend}
          icon="👥"
        />
        <KPICard
          title="Total Customers"
          value={kpiDataMock.customers.total.toLocaleString()}
          subtext={`${kpiDataMock.customers.active} active • ${kpiDataMock.customers.inactive} inactive`}
          trend={kpiDataMock.customers.trend}
          icon="👤"
        />
        <KPICard
          title="Total Leads"
          value={kpiDataMock.leads.total}
          subtext={`${kpiDataMock.leads.qualified} qualified • ${kpiDataMock.leads.converted} converted`}
          trend={kpiDataMock.leads.trend}
          icon="🔥"
        />
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="Support Tickets"
          value={kpiDataMock.tickets.open}
          subtext={`${kpiDataMock.tickets.pending} pending • ${kpiDataMock.tickets.resolved} resolved`}
          trend={`${kpiDataMock.tickets.sla_breached} SLA breached`}
          icon="🎫"
        />
        <KPICard
          title="Total Revenue"
          value={`$${(kpiDataMock.revenue.total / 1000000).toFixed(2)}M`}
          subtext={`MTD: $${(kpiDataMock.revenue.mtd / 1000).toFixed(0)}K`}
          trend={kpiDataMock.revenue.trend}
          icon="💰"
        />
        <KPICard
          title="Sales Pipeline"
          value={`$${(kpiDataMock.sales.pipeline / 1000).toFixed(0)}K`}
          subtext={`${kpiDataMock.sales.deals_in_progress} deals in progress`}
          trend={`Close rate: ${kpiDataMock.sales.close_rate}`}
          icon="📊"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivityMock.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.type}</p>
                  <p className="text-sm text-gray-500">{activity.user} • {activity.time}</p>
                </div>
                {activity.value && <p className="font-bold text-gray-900">{activity.value}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg Deal Size</p>
              <p className="text-2xl font-bold text-gray-900">${kpiDataMock.sales.avg_deal_size.toLocaleString()}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium">Lead to Customer Conversion</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((kpiDataMock.leads.converted / kpiDataMock.leads.total) * 100)}%</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium">YTD Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${(kpiDataMock.revenue.ytd / 1000000).toFixed(2)}M</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium">SLA Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((1 - kpiDataMock.tickets.sla_breached / (kpiDataMock.tickets.resolved + kpiDataMock.tickets.open + kpiDataMock.tickets.pending)) * 100)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">System Health</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase tracking-wide">Service</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase tracking-wide">Status</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase tracking-wide">Uptime</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase tracking-wide">Response Time</th>
              </tr>
            </thead>
            <tbody>
              {systemHealthMock.map((service, i) => (
                <tr key={i} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{service.service}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span className="text-sm text-gray-700">{service.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-mono text-sm">{service.uptime}</td>
                  <td className="py-4 px-4 text-gray-700 font-mono text-sm">{service.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
