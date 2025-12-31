import React, { useState } from 'react';

const dealsMock = [
  { id: 1, name: 'Stark Industries - Enterprise Deal', customer: 'Tony Stark', amount: 125000, stage: 'Proposal Sent', probability: 75, owner: 'Alice', dueDate: '2025-11-15' },
  { id: 2, name: 'Asgard Tech - Cloud Migration', customer: 'Thor Odinson', amount: 89000, stage: 'Negotiation', probability: 60, owner: 'Bob', dueDate: '2025-11-20' },
  { id: 3, name: 'Maximoff - SaaS Contract', customer: 'Wanda Maximoff', amount: 156000, stage: 'Qualification', probability: 40, owner: 'Carol', dueDate: '2025-11-30' },
  { id: 4, name: 'Banner Research - Pilot', customer: 'Bruce Banner', amount: 34000, stage: 'Closed Won', probability: 100, owner: 'David', dueDate: '2025-10-20' },
  { id: 5, name: 'Loki Solutions - Integration', customer: 'Loki Laufeyson', amount: 67000, stage: 'Lead In', probability: 20, owner: 'Emma', dueDate: '2025-12-10' },
];

const stagesMock = [
  { name: 'Lead In', deals: 2, value: 101000 },
  { name: 'Qualification', deals: 1, value: 156000 },
  { name: 'Proposal Sent', deals: 1, value: 125000 },
  { name: 'Negotiation', deals: 1, value: 89000 },
  { name: 'Closed Won', deals: 1, value: 34000 },
];

export default function SalesManagement() {
  const [deals, setDeals] = useState(dealsMock);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    name: '',
    customer: '',
    amount: '',
    stage: 'Lead In',
    owner: '',
  });

  const stages = ['Lead In', 'Qualification', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const owners = ['Alice', 'Bob', 'Carol', 'David', 'Emma'];

  const handleAddDeal = () => {
    if (newDeal.name && newDeal.customer && newDeal.amount && newDeal.owner) {
      const deal = {
        id: deals.length + 1,
        ...newDeal,
        amount: parseInt(newDeal.amount),
        probability: 40,
        dueDate: new Date().toISOString().split('T')[0],
      };
      setDeals([...deals, deal]);
      setNewDeal({ name: '', customer: '', amount: '', stage: 'Lead In', owner: '' });
      setIsModalOpen(false);
    }
  };

  const totalPipeline = deals.reduce((sum, d) => sum + d.amount, 0);
  const expectedRevenue = deals.reduce((sum, d) => sum + (d.amount * d.probability / 100), 0);

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return 'bg-gray-600';
    if (probability >= 50) return 'bg-gray-400';
    return 'bg-gray-300';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">Track opportunities, deals, and sales pipeline</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
        >
          + New Deal
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Total Pipeline</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(totalPipeline / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">{deals.length} deals</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Expected Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(expectedRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">Weighted by probability</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Avg Deal Size</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">${(totalPipeline / deals.length / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-600 mt-1">Per opportunity</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-500 text-sm font-medium uppercase">Win Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">67%</p>
          <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
        </div>
      </div>

      {/* Pipeline by Stage */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Pipeline by Stage</h2>
        <div className="space-y-4">
          {stagesMock.map((stage, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-900">{stage.name}</p>
                <span className="text-sm text-gray-600">${(stage.value / 1000).toFixed(0)}K • {stage.deals} {stage.deals === 1 ? 'deal' : 'deals'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gray-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stage.value / totalPipeline) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Deal Name</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Customer</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Amount</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Stage</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Probability</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Owner</th>
              <th className="text-left py-4 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wide">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => (
              <tr
                key={deal.id}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedDeal(deal)}
              >
                <td className="py-4 px-6 font-medium text-gray-900">{deal.name}</td>
                <td className="py-4 px-6 text-gray-700">{deal.customer}</td>
                <td className="py-4 px-6 font-mono text-gray-900">${deal.amount.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-semibold">
                    {deal.stage}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded h-2 overflow-hidden">
                      <div
                        className={`h-2 ${getProbabilityColor(deal.probability)}`}
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{deal.probability}%</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-700">{deal.owner}</td>
                <td className="py-4 px-6 text-gray-700 text-sm">{deal.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deal Details */}
      {selectedDeal && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedDeal.name}</h2>
              <p className="text-gray-600 mt-1">Customer: {selectedDeal.customer}</p>
            </div>
            <button onClick={() => setSelectedDeal(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-y border-gray-200 mb-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Deal Amount</p>
              <p className="text-gray-900 font-bold text-2xl">${selectedDeal.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Current Stage</p>
              <p className="text-gray-900 font-bold text-lg">{selectedDeal.stage}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Close Probability</p>
              <p className="text-gray-900 font-bold text-2xl">{selectedDeal.probability}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Update Stage</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Add Activity</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Create Quote</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-900">Close Deal</button>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Deal</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Deal Name"
                value={newDeal.name}
                onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <input
                type="text"
                placeholder="Customer Name"
                value={newDeal.customer}
                onChange={(e) => setNewDeal({ ...newDeal, customer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <input
                type="number"
                placeholder="Deal Amount"
                value={newDeal.amount}
                onChange={(e) => setNewDeal({ ...newDeal, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              />
              <select
                value={newDeal.stage}
                onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                {stages.map(stage => <option key={stage}>{stage}</option>)}
              </select>
              <select
                value={newDeal.owner}
                onChange={(e) => setNewDeal({ ...newDeal, owner: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Select Owner</option>
                {owners.map(owner => <option key={owner}>{owner}</option>)}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddDeal}
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
