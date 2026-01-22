import React, { useEffect, useState } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { docsAPI } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

/**
 * A utility to format file size in a human-readable way.
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function DocumentsPage() {
  const authData = getAuth();
  const user = authData?.user;

  const [docs, setDocs] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Status message state
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    try {
      setLoading(true);
      const res = await docsAPI.listMyDocs();
      setDocs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch docs", err);
      showStatus('error', "Could not load documents from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDocs();
  };

  function showStatus(type, text) {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 4000);
  }

  // --- Upload Handler ---
  async function handleUpload() {
    if (!files.length) return showStatus('error', "Please select a file first.");

    setUploading(true);
    try {
      // Parallel uploads
      await Promise.all(files.map(async (f) => {
        const fd = new FormData();
        fd.append('file', f);
        if (user?.id) fd.append('ownerUserId', String(user.id));
        await docsAPI.upload(fd);
      }));

      showStatus('success', "Documents uploaded successfully to server!");
      setFiles([]);
      fetchDocs(); // Refresh list from server
    } catch (err) {
      console.error(err);
      showStatus('error', "Failed to upload one or more files.");
    } finally {
      setUploading(false);
    }
  }

  // --- Delete Handler ---
  async function handleDelete(docId, docName) {
    if (!window.confirm(`Permanently delete "${docName}" from server?`)) return;

    try {
      await docsAPI.deleteDocument(docId);
      showStatus('success', "Document deleted.");
      setDocs(prev => prev.filter(d => d.id !== docId));
    } catch (err) {
      console.error(err);
      showStatus('error', "Could not delete document.");
    }
  }

  // --- Download Handler ---
  async function handleDownload(doc) {
    try {
      const res = await docsAPI.downloadDocument(doc.id);
      const blob = res.data instanceof Blob ? res.data : await res.data.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.filename || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showStatus('error', "Download failed.");
    }
  }

  // --- File Selection ---
  function handleFileSelect(e) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  }

  // Filter docs
  const filteredDocs = docs.filter(d =>
    d.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Securely store and manage your business documents.</p>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-gray-100 transition text-gray-500 ${refreshing ? 'animate-spin' : ''}`}
          title="Refresh List"
        >
          <ArrowPathIcon className="w-6 h-6" />
        </button>
      </div>

      {/* 2. Upload Area */}
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-colors group relative shadow-sm">
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileSelect}
        />
        <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:scale-105 transition-transform duration-300">
          <CloudArrowUpIcon className="w-6 h-6 text-[#2E96FF]" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">
          {files.length > 0 ? `${files.length} file(s) selected` : "Upload Documents"}
        </h3>
        <p className="text-gray-400 text-xs mt-1 max-w-xs">
          {files.length > 0 ? "Click 'Upload Now' below to save." : "Drag & drop files or click to browse."}
        </p>

        {files.length > 0 && (
          <div className="mt-4 z-20 relative">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-5 py-2 bg-[#2E96FF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <CloudArrowUpIcon className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Now'}
            </button>
            <button
              onClick={() => setFiles([])}
              className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium block w-full"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* 3. Status Toast */}
      {statusMsg.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <div className={`w-2 h-2 rounded-full ${statusMsg.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span className="font-medium text-sm">{statusMsg.text}</span>
        </div>
      )}

      {/* 4. Search & List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
            All Files ({docs.length})
          </h2>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 md:py-16 text-center text-gray-400 animate-pulse">
            Loading documents...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-12 md:py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
            <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No documents found.</p>
            {searchQuery && <p className="text-sm text-gray-400 mt-1">Try a different search term.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col justify-between h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-[#2E96FF] transition"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.filename)}
                      className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-red-500 transition"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-sm truncate mb-1" title={doc.filename}>{doc.filename}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                    <span>{formatFileSize(doc.sizeBytes)}</span>
                    <span className="text-gray-300">•</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}