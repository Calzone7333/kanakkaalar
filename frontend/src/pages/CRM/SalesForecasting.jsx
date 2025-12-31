import React, { useState } from 'react';

const forecastDataMock = [
  { month: 'Oct 2025', current: 450000, previous: 400000, target: 500000, pipeline: 280000 },
  { month: 'Nov 2025', current: 520000, previous: 480000, target: 550000, pipeline: 350000 },
  { month: 'Dec 2025', current: 680000, previous: 600000, target: 700000, pipeline: 420000 },
  { month: 'Jan 2026', current: 550000, previous: null, target: 600000, pipeline: 380000 },
  { month: 'Feb 2026', current: 600000, previous: null, target: 650000, pipeline: 410000 },
];

const repsForecasts = [
  { rep: 'Alice Johnson', forecast: 245000, pipeline: 180000, closeRate: 78, quota: 250000 },
  { rep: 'Bob Smith', forecast: 198000, pipeline: 150000, closeRate: 72, quota: 220000 },
  { rep: 'Carol Davis', forecast: 165000, pipeline: 130000, closeRate: 68, quota: 200000 },
  { rep: 'David Wilson', forecast: 212000, pipeline: 145000, closeRate: 75, quota: 230000 },
];

export default function SalesForecasting() {
  const [forecastData] = useState(forecastDataMock);
  const [repsData] = useState(repsForecasts);
  const [selectedPeriod, setSelectedPeriod] = useState('6-month');

  const totalForecast = forecastData.reduce((sum, item) => sum + item.current, 0);
  const totalPipeline = forecastData.reduce((sum, item) => sum + item.pipeline, 0);
  const totalTarget = forecastData.reduce((sum, item) => sum + item.target, 0);
  const forecastAccuracy = Math.round((totalForecast / totalTarget) * 100);

  const getStatusColor = (forecast, quota) => {
    const percentage = (forecast / quota) * 100;
    if (percentage >= 100) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const stats = {
    totalForecast: totalForecast,
    totalPipeline: totalPipeline,
    totalTarget: totalTarget,
    accuracy: forecastAccuracy,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">📊 Sales Forecasting</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Forecast</p>
          <p className="text-3xl font-bold text-green-600">${(stats.totalForecast / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Pipeline</p>
          <p className="text-3xl font-bold text-blue-600">${(stats.totalPipeline / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Total Target</p>
          <p className="text-3xl font-bold text-orange-600">${(stats.totalTarget / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Forecast Accuracy</p>
          <p className="text-3xl font-bold text-purple-600">{stats.accuracy}%</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white p-4 rounded-xl shadow flex gap-2">
        {['1-month', '3-month', '6-month', '12-month'].map(period => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedPeriod === period
                ? 'bg-[#0080FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Sales Forecast Trend</h3>
        <div className="space-y-4">
          {forecastData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{item.month}</span>
                <div className="space-x-4">
                  <span className="text-gray-600">Forecast: ${(item.current / 1000).toFixed(0)}K</span>
                  <span className="text-gray-600">Target: ${(item.target / 1000).toFixed(0)}K</span>
                </div>
              </div>

              <div className="flex gap-2 h-8">
                {/* Current Forecast */}
                <div
                  className="bg-[#0080FF] rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(item.current / item.target) * 60}%` }}
                >
                  {item.current > item.target * 0.5 ? `${Math.round((item.current / item.target) * 100)}%` : ''}
                </div>

                {/* Pipeline */}
                <div
                  className="bg-orange-300 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                  style={{ width: `${(item.pipeline / item.target) * 60}%` }}
                >
                </div>

                {/* Target Indicator */}
                <div className="flex-1 border-r-2 border-gray-900"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Rep Forecasts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">👥 Sales Rep Forecasts</h3>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales Rep</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Forecast</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pipeline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">vs Quota</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repsData.map((rep, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{rep.rep}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${(rep.forecast / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${(rep.pipeline / 1000).toFixed(0)}K</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#0080FF]"
                          style={{ width: `${rep.closeRate}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{rep.closeRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${rep.forecast >= rep.quota ? 'bg-green-500' : rep.forecast >= rep.quota * 0.8 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min((rep.forecast / rep.quota) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{Math.round((rep.forecast / rep.quota) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(rep.forecast, rep.quota)}`}>
                      {rep.forecast >= rep.quota ? '✅ On Track' : '⚠️ At Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Forecast Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Overall forecast is <span className="font-semibold">on track</span> at {stats.accuracy}% of target</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">!</span>
            <span><span className="font-semibold">David Wilson</span> is leading with 92% vs quota achievement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">⚠</span>
            <span><span className="font-semibold">Carol Davis</span> needs attention - currently at 83% of quota</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">ℹ</span>
            <span>Pipeline value of ${(totalPipeline / 1000).toFixed(0)}K could close $640K+ in next 2 months</span>
          </li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
          <p className="text-2xl mb-2">📥</p>
          <p className="font-semibold text-gray-900">Import Pipeline</p>
        </button>
        <button className="p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
          <p className="text-2xl mb-2">📊</p>
          <p className="font-semibold text-gray-900">Generate Report</p>
        </button>
        <button className="p-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
          <p className="text-2xl mb-2">⚙️</p>
          <p className="font-semibold text-gray-900">Adjust Forecast</p>
        </button>
      </div>
    </div>
  );
}
