import React, { useState } from 'react';

const documentsMock = [
  { id: 1, name: 'Q4_2025_Sales_Strategy.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Alice', date: '2025-10-28', category: 'Strategy', linked: 'Tony Stark' },
  { id: 2, name: 'Proposal_SteveRogers_Draft.docx', type: 'Word', size: '1.2 MB', uploadedBy: 'Bob', date: '2025-10-27', category: 'Proposal', linked: 'Steve Rogers' },
  { id: 3, name: 'Contract_Template_2025.docx', type: 'Word', size: '890 KB', uploadedBy: 'Carol', date: '2025-10-25', category: 'Template', linked: 'N/A' },
  { id: 4, name: 'Invoice_202510001.xlsx', type: 'Excel', size: '340 KB', uploadedBy: 'Alice', date: '2025-10-26', category: 'Invoice', linked: 'Natasha Romanoff' },
  { id: 5, name: 'Meeting_Notes_Oct28.txt', type: 'Text', size: '125 KB', uploadedBy: 'Bob', date: '2025-10-28', category: 'Notes', linked: 'Bruce Banner' },
  { id: 6, name: 'Demo_Recording_Link.txt', type: 'Link', size: '2 KB', uploadedBy: 'Carol', date: '2025-10-26', category: 'Recording', linked: 'Wanda Maximoff' },
];

const categoriesMock = [
  { name: 'Proposals', count: 12, size: '45 MB' },
  { name: 'Contracts', count: 8, size: '32 MB' },
  { name: 'Invoices', count: 25, size: '18 MB' },
  { name: 'Meeting Notes', count: 34, size: '12 MB' },
  { name: 'Templates', count: 7, size: '8 MB' },
  { name: 'Recordings', count: 6, size: '890 MB' },
];

export default function DocumentManagement() {
  const [documents, setDocuments] = useState(documentsMock);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    type: 'PDF',
    category: 'Proposal',
    linked: '',
  });

  const filteredDocs = documents.filter(doc => {
    const categoryMatch = filterCategory === 'All' || doc.category === filterCategory;
    const searchMatch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleUploadDoc = () => {
    if (newDoc.name) {
      const doc = {
        id: documents.length + 1,
        ...newDoc,
        size: '1.5 MB',
        uploadedBy: 'Current User',
        date: new Date().toISOString().split('T')[0],
      };
      setDocuments([...documents, doc]);
      setNewDoc({ name: '', type: 'PDF', category: 'Proposal', linked: '' });
      setIsUploadOpen(false);
    }
  };

  const handleDeleteDoc = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getTypeIcon = (type) => {
    const icons = {
      'PDF': '📄',
      'Word': '📝',
      'Excel': '📊',
      'Text': '📋',
      'Link': '🔗',
    };
    return icons[type] || '📁';
  };

  const getTypeColor = (type) => {
    const colors = {
      'PDF': 'bg-red-50',
      'Word': 'bg-blue-50',
      'Excel': 'bg-green-50',
      'Text': 'bg-yellow-50',
      'Link': 'bg-purple-50',
    };
    return colors[type] || 'bg-gray-50';
  };

  const stats = {
    total: documents.length,
    totalSize: documents.reduce((sum, d) => sum + parseFloat(d.size), 0).toFixed(1),
    categories: categoriesMock.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">📎 Document Management</h2>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC] transition"
        >
          ⬆️ Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Documents</p>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Total Storage Used</p>
          <p className="text-3xl font-bold text-green-600">1.2 GB</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Categories</p>
          <p className="text-3xl font-bold text-orange-600">{stats.categories}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesMock.map((cat, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow border-l-4 border-[#0080FF] cursor-pointer hover:shadow-lg transition">
            <h4 className="font-semibold text-gray-900">{cat.name}</h4>
            <div className="flex justify-between items-end mt-2">
              <div>
                <p className="text-sm text-gray-600">{cat.count} files</p>
                <p className="text-xs text-gray-500">{cat.size}</p>
              </div>
              <button className="text-[#0080FF] hover:text-[#0066CC]">→</button>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
          >
            <option>All</option>
            {categoriesMock.map(cat => <option key={cat.name}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => (
            <div key={doc.id} className={`p-4 rounded-lg shadow hover:shadow-lg transition border-l-4 border-[#0080FF] ${getTypeColor(doc.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl">{getTypeIcon(doc.type)}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 mt-2">
                      <p>📁 {doc.category}</p>
                      <p>💾 {doc.size}</p>
                      <p>👤 {doc.uploadedBy}</p>
                      <p>📅 {doc.date}</p>
                      {doc.linked !== 'N/A' && <p>🔗 Linked: {doc.linked}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-[#0080FF] border border-[#0080FF] rounded text-sm hover:bg-blue-50">⬇️</button>
                  <button className="px-3 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50">👁️</button>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
            <p>No documents found</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Document</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#0080FF] transition">
                <p className="text-3xl mb-2">📁</p>
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PDF, Word, Excel, etc.</p>
              </div>

              <input
                type="text"
                placeholder="Document Name"
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />

              <select
                value={newDoc.type}
                onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                <option>PDF</option>
                <option>Word</option>
                <option>Excel</option>
                <option>Text</option>
                <option>Link</option>
              </select>

              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              >
                {categoriesMock.map(cat => <option key={cat.name}>{cat.name}</option>)}
              </select>

              <input
                type="text"
                placeholder="Link to Contact (optional)"
                value={newDoc.linked}
                onChange={(e) => setNewDoc({ ...newDoc, linked: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0080FF] focus:border-[#0080FF]"
              />

              <div className="flex space-x-2">
                <button
                  onClick={handleUploadDoc}
                  className="flex-1 px-4 py-2 bg-[#0080FF] text-white rounded-lg hover:bg-[#0066CC]"
                >
                  Upload
                </button>
                <button
                  onClick={() => setIsUploadOpen(false)}
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
