import React, { useState } from 'react';

const pipelineDataMock = {
  'Lead In': { count: 8, value: 245000, avgDaysInStage: 12 },
  'Qualification': { count: 12, value: 480000, avgDaysInStage: 8 },
  'Proposal Sent': { count: 6, value: 320000, avgDaysInStage: 15 },
  'Negotiation': { count: 5, value: 280000, avgDaysInStage: 20 },
  'Closed Won': { count: 15, value: 890000, avgDaysInStage: 0 },
  'Closed Lost': { count: 4, value: 120000, avgDaysInStage: 0 },
};

const conversionDataMock = [
  { from: 'Lead In', to: 'Qualification', rate: 85, count: 12 },
  { from: 'Qualification', to: 'Proposal Sent', rate: 72, count: 6 },
  { from: 'Proposal Sent', to: 'Negotiation', rate: 80, count: 5 },
  { from: 'Negotiation', to: 'Closed Won', rate: 75, count: 4 },
];

export default function PipelineAnalytics() {
  const [timeRange, setTimeRange] = useState('30-days');

  const stages = Object.entries(pipelineDataMock);
  const totalPipelineValue = stages.reduce((sum, [_, data]) => sum + data.value, 0);
  const totalDeals = stages.reduce((sum, [_, data]) => sum + data.count, 0);
  const wonDeals = pipelineDataMock['Closed Won'].count;
  const lostDeals = pipelineDataMock['Closed Lost'].count;
  const winRate = Math.round((wonDeals / (wonDeals + lostDeals)) * 100);

  const stats = {
    totalValue: totalPipelineValue,
    totalDeals: totalDeals,
    winRate: winRate,
    avgDealSize: Math.round(totalPipelineValue / totalDeals),
  };

  const getStageColor = (stage) => {
    const colors = {
      'Lead In': 'bg-blue-100',
      'Qualification': 'bg-cyan-100',
      'Proposal Sent': 'bg-indigo-100',
      'Negotiation': 'bg-purple-100',
      'Closed Won': 'bg-green-100',
      'Closed Lost': 'bg-red-100',
    };
    return colors[stage] || 'bg-gray-100';
  };

  const getStageTextColor = (stage) => {
    const colors = {
      'Lead In': 'text-blue-800',
      'Qualification': 'text-cyan-800',
      'Proposal Sent': 'text-indigo-800',
      'Negotiation': 'text-purple-800',
      'Closed Won': 'text-green-800',
      'Closed Lost': 'text-red-800',
    };
    return colors[stage] || 'text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">🔄 Pipeline Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
        >
          <option value="7-days">Last 7 Days</option>
          <option value="30-days">Last 30 Days</option>
          <option value="90-days">Last 90 Days</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Pipeline Value</p>
          <p className="text-3xl font-bold text-green-600">${(stats.totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Deals</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalDeals}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">Win Rate</p>
          <p className="text-3xl font-bold text-purple-600">{stats.winRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Avg Deal Size</p>
          <p className="text-3xl font-bold text-orange-600">${(stats.avgDealSize / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Pipeline Stage Breakdown</h3>
        <div className="space-y-4">
          {stages.map(([stage, data]) => (
            <div key={stage}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`font-semibold ${getStageTextColor(stage)}`}>{stage}</h4>
                  <p className="text-xs text-gray-600">{data.count} deals • ${(data.value / 1000).toFixed(0)}K value</p>
                </div>
                <span className="text-sm font-bold text-gray-600">{Math.round((data.value / stats.totalValue) * 100)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full ${getStageColor(stage)} flex items-center justify-center text-xs font-semibold transition-all duration-300`}
                  style={{ width: `${(data.value / stats.totalValue) * 100}%` }}
                >
                  {(data.value / stats.totalValue) * 100 > 10 && `${Math.round((data.value / stats.totalValue) * 100)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Conversion Rates by Stage</h3>
        <div className="space-y-3">
          {conversionDataMock.map((conv, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{conv.from}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium text-gray-900">{conv.to}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${conv.rate >= 80 ? 'bg-green-500' : conv.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${conv.rate}%` }}
                  ></div>
                </div>
                <span className="font-bold text-gray-900 w-12 text-right">{conv.rate}%</span>
                <span className="text-sm text-gray-600 w-16 text-right">({conv.count} deals)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map(([stage, data]) => (
          <div key={stage} className={`p-5 rounded-lg shadow border-l-4 ${getStageColor(stage)}`}>
            <h4 className={`font-bold text-lg ${getStageTextColor(stage)} mb-3`}>{stage}</h4>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Deals</span>
                <span className="font-semibold text-gray-900">{data.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Value</span>
                <span className="font-semibold text-gray-900">${(data.value / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Value</span>
                <span className="font-semibold text-gray-900">${(data.value / data.count / 1000).toFixed(0)}K</span>
              </div>
              {stage !== 'Closed Won' && stage !== 'Closed Lost' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Time</span>
                  <span className="font-semibold text-gray-900">{data.avgDaysInStage} days</span>
                </div>
              )}
            </div>

            <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-700 text-sm font-medium transition">
              View Deals
            </button>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pipeline Insights</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Pipeline is <span className="font-semibold">healthy</span> with {stats.winRate}% win rate</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">ℹ</span>
            <span><span className="font-semibold">Qualification stage</span> has the highest deal count (12 deals)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600 font-bold">!</span>
            <span><span className="font-semibold">Proposal Sent to Negotiation</span> conversion is 80% - focus area</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 font-bold">📈</span>
            <span>Average deal cycle time is <span className="font-semibold">55 days</span> from Lead to Close</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
