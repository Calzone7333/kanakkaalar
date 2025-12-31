import React, { useState } from 'react';

const reportsMock = [
  { id: 1, name: 'Monthly Revenue Report', type: 'Revenue', lastGenerated: '2025-10-28', size: '2.4 MB', download: true },
  { id: 2, name: 'Sales Performance Q4', type: 'Sales', lastGenerated: '2025-10-27', size: '1.8 MB', download: true },
  { id: 3, name: 'Lead Conversion Analysis', type: 'Leads', lastGenerated: '2025-10-26', size: '892 KB', download: true },
  { id: 4, name: 'Employee Performance Metrics', type: 'HR', lastGenerated: '2025-10-25', size: '3.1 MB', download: true },
  { id: 5, name: 'Customer Satisfaction Survey', type: 'Customer', lastGenerated: '2025-10-24', size: '1.2 MB', download: true },
];

const analyticsDataMock = {
  monthlyRevenue: [
    { month: 'Aug', revenue: 125000 },
    { month: 'Sep', revenue: 180000 },
    { month: 'Oct', revenue: 245000 },
  ],
  leadConversion: {
    total: 580,
    qualified: 245,
    converted: 89,
    rate: '15.3%',
  },
  employeePerformance: [
    { name: 'Alice Johnson', deals: 12, revenue: 125000, target: 250000 },
    { name: 'Bob Smith', deals: 9, revenue: 89000, target: 220000 },
    { name: 'Carol Davis', deals: 7, revenue: 67000, target: 200000 },
  ],
};

export default function ReportsAnalytics() {
  const [reports] = useState(reportsMock);
  const [reportType, setReportType] = useState('Revenue');
  const [dateRange, setDateRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);

  const reportTypes = ['Revenue', 'Sales', 'Leads', 'Customer', 'HR'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and export business reports and analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium">
            + Generate Report
          </button>
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-900">
            ⬇ Export All
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {reportTypes.map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg transition font-medium ${
              reportType === type
                ? 'bg-gray-900 text-white'
                : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Monthly Revenue</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option>Month</option>
              <option>Quarter</option>
              <option>Year</option>
            </select>
          </div>

          <div className="space-y-4">
            {analyticsDataMock.monthlyRevenue.map((data, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-900">{data.month}</p>
                  <p className="font-bold text-gray-900">${(data.revenue / 1000).toFixed(0)}K</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-600 h-3 rounded-full"
                    style={{ width: `${(data.revenue / 245000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Conversion Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Lead Conversion</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsDataMock.leadConversion.total}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Qualified</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsDataMock.leadConversion.qualified}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Converted</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsDataMock.leadConversion.converted}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsDataMock.leadConversion.rate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Employee Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Employee</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Deals</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Revenue</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Target</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">% Target</th>
              </tr>
            </thead>
            <tbody>
              {analyticsDataMock.employeePerformance.map((emp, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{emp.name}</td>
                  <td className="py-4 px-4 text-gray-700">{emp.deals}</td>
                  <td className="py-4 px-4 font-mono text-gray-900">${(emp.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-4 font-mono text-gray-900">${(emp.target / 1000).toFixed(0)}K</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded h-2">
                        <div
                          className="bg-gray-600 h-2 rounded"
                          style={{ width: `${Math.min((emp.revenue / emp.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{Math.round((emp.revenue / emp.target) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Reports */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Available Reports</h2>
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-600">Generated: {report.lastGenerated}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{report.size}</span>
                <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 text-sm font-medium">
                  ⬇ Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Details */}
      {selectedReport && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedReport.name}</h2>
              <p className="text-gray-600 mt-1">Type: {selectedReport.type}</p>
            </div>
            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Last Generated</p>
              <p className="text-gray-900 font-medium">{selectedReport.lastGenerated}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">File Size</p>
              <p className="text-gray-900 font-medium">{selectedReport.size}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Format</p>
              <p className="text-gray-900 font-medium">PDF & CSV</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">⬇ Download PDF</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium">⬇ Download CSV</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}
