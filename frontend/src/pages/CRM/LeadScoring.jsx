import React, { useState } from 'react';

const leadsMock = [
  { id: 1, name: 'Jane Foster', email: 'jane@example.com', company: 'Foster Labs', score: 95, grade: 'A+', status: 'Hot', source: 'Website', engagement: 85, budget: 'High', timeline: '< 1 month' },
  { id: 2, name: 'Thor Odinson', email: 'thor@example.com', company: 'Asgard Tech', score: 82, grade: 'A', status: 'Warm', source: 'Referral', engagement: 70, budget: 'High', timeline: '1-2 months' },
  { id: 3, name: 'Loki Laufeyson', email: 'loki@example.com', company: 'Loki Solutions', score: 65, grade: 'B', status: 'Warm', source: 'LinkedIn', engagement: 55, budget: 'Medium', timeline: '2-3 months' },
  { id: 4, name: 'Bruce Banner', email: 'bruce@example.com', company: 'Banner Research', score: 45, grade: 'C', status: 'Cold', source: 'Cold Call', engagement: 30, budget: 'Low', timeline: '3+ months' },
  { id: 5, name: 'Wanda Maximoff', email: 'wanda@example.com', company: 'Maximoff Enterprises', score: 88, grade: 'A', status: 'Hot', source: 'Event', engagement: 78, budget: 'Very High', timeline: '< 2 weeks' },
];

const scoringRules = [
  { criterion: 'Website Visit', points: 5 },
  { criterion: 'Email Open', points: 3 },
  { criterion: 'Email Click', points: 10 },
  { criterion: 'Page Visit', points: 2 },
  { criterion: 'Download', points: 15 },
  { criterion: 'Demo Request', points: 50 },
  { criterion: 'Meeting Scheduled', points: 25 },
  { criterion: 'Form Submission', points: 20 },
];

export default function LeadScoring() {
  const [leads, setLeads] = useState(leadsMock);
  const [sortBy, setSortBy] = useState('score');
  const [filterGrade, setFilterGrade] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);

  const grades = ['All', 'A+', 'A', 'B', 'C', 'D'];
  const statuses = ['All', 'Hot', 'Warm', 'Cold'];

  let filteredLeads = leads.filter(lead => {
    const gradeMatch = filterGrade === 'All' || lead.grade === filterGrade;
    const statusMatch = filterStatus === 'All' || lead.status === filterStatus;
    const searchMatch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    return gradeMatch && statusMatch && searchMatch;
  });

  if (sortBy === 'score') {
    filteredLeads.sort((a, b) => b.score - a.score);
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status) => {
    if (status === 'Hot') return 'bg-red-100 text-red-800';
    if (status === 'Warm') return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600';
    if (grade === 'B') return 'text-orange-600';
    return 'text-red-600';
  };

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'Hot').length,
    warm: leads.filter(l => l.status === 'Warm').length,
    cold: leads.filter(l => l.status === 'Cold').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">⭐ Lead Scoring</h2>
        <button className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition">
          📊 View Analytics
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Hot Leads</p>
          <p className="text-3xl font-bold text-red-600">{stats.hot}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Warm Leads</p>
          <p className="text-3xl font-bold text-orange-600">{stats.warm}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-300">
          <p className="text-gray-600 text-sm">Cold Leads</p>
          <p className="text-3xl font-bold text-blue-400">{stats.cold}</p>
        </div>
      </div>

      {/* Scoring Rules */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Scoring Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scoringRules.map((rule, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">{rule.criterion}</p>
              <p className="text-lg font-bold text-[#0080FF]">+{rule.points} pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            {grades.map(grade => <option key={grade}>{grade}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            <option value="score">Sort by Score</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedLead(lead)}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.company}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                      <div
                        className={`h-2 rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${lead.score}%` }}
                      ></div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-bold text-lg ${getGradeColor(lead.grade)}`}>{lead.grade}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{lead.engagement}%</td>
                <td className="px-6 py-4 text-right text-sm space-x-2">
                  <button className="text-[#0080FF] hover:text-[#0066CC]">👁️</button>
                  <button className="text-yellow-600 hover:text-yellow-900">⭐</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Details */}
      {selectedLead && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h3>
            <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-gray-700">❌</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
              <p className="text-gray-600 text-sm">Overall Score</p>
              <p className="text-4xl font-bold text-green-600">{selectedLead.score}</p>
              <p className={`text-lg font-bold ${getGradeColor(selectedLead.grade)}`}>Grade: {selectedLead.grade}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Key Metrics</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Budget:</span><span className="font-semibold">{selectedLead.budget}</span></div>
                <div className="flex justify-between"><span>Timeline:</span><span className="font-semibold">{selectedLead.timeline}</span></div>
                <div className="flex justify-between"><span>Source:</span><span className="font-semibold">{selectedLead.source}</span></div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm mb-2">Contact Info</p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">{selectedLead.email}</p>
                <p className="text-gray-700">{selectedLead.company}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="p-3 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📞 Call</button>
            <button className="p-3 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📧 Email</button>
            <button className="p-3 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">📅 Schedule Meeting</button>
            <button className="p-3 border border-[#0080FF] text-[#0080FF] rounded-lg hover:bg-blue-50">💼 Create Deal</button>
          </div>
        </div>
      )}
    </div>
  );
}
