import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical
} from "lucide-react";

export default function CompliancesPage() {
  // Seed data that represents "work based" and "other" compliances.
  const seed = [
    {
      id: "c1",
      name: "GST Filing - July 2025",
      category: "work",
      frequency: "Monthly",
      dueDate: "2025-08-10",
      status: "Pending",
      assignee: "Prakash",
      description:
        "Prepare and submit GST returns for the month. Collect invoices and reconcile input tax credit.",
      priority: "High"
    },
    {
      id: "c2",
      name: "TDS Quarterly Filing - Q2",
      category: "work",
      frequency: "Quarterly",
      dueDate: "2025-07-31",
      status: "In Progress",
      assignee: "Finance Team",
      description:
        "Compile TDS statements and file Form 24Q/26Q as applicable. Ensure TAN and challans are reconciled.",
      priority: "Medium"
    },
    {
      id: "c3",
      name: "Annual ROC Compliance",
      category: "other",
      frequency: "Yearly",
      dueDate: "2025-09-30",
      status: "Pending",
      assignee: "Company Secretary",
      description:
        "Prepare and file annual return with Registrar of Companies and ensure all board resolutions are attached.",
      priority: "Critical"
    },
    {
      id: "c4",
      name: "Income Tax Return (Company)",
      category: "other",
      frequency: "Yearly",
      dueDate: "2025-10-31",
      status: "Pending",
      assignee: "Tax Consultant",
      description: "Collect audited P&L and balance sheet to prepare and file company ITR.",
      priority: "High"
    },
    {
      id: "c5",
      name: "PF & ESI Monthly Return",
      category: "work",
      frequency: "Monthly",
      dueDate: "2025-08-15",
      status: "Completed",
      assignee: "HR Team",
      description: "File monthly PF and ESI returns for all employees.",
      priority: "Medium"
    },
  ];

  const [items, setItems] = useState(seed);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(items[0]?.id || null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageSize] = useState(6);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    // Keep selected item valid after filters/changes
    if (!items.find((i) => i.id === selectedId)) {
      setSelectedId(items[0]?.id || null);
    }
  }, [items, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((it) => (activeCategory === "all" ? true : it.category === activeCategory))
      .filter((it) => (statusFilter === "all" ? true : it.status === statusFilter))
      .filter(
        (it) =>
          q === "" ||
          it.name.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          (it.assignee || "").toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [items, query, activeCategory, statusFilter]);

  function toggleComplete(id) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: it.status === "Completed" ? "Pending" : "Completed" } : it))
    );
  }

  function loadMore() {
    setVisibleCount((v) => v + pageSize);
  }

  const selected = items.find((i) => i.id === selectedId) || filtered[0] || null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "In Progress": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "text-red-600 bg-red-50 border-red-100";
      case "High": return "text-orange-600 bg-orange-50 border-orange-100";
      default: return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50/50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Compliances
            </h1>
            <p className="mt-1 text-sm text-slate-500">Track and manage your statutory obligations.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              {['all', 'work', 'other'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeCategory === cat
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                  {cat === 'all' ? 'All' : cat === 'work' ? 'Work Based' : 'Other'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search compliances..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* List Section */}
          <section className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-slate-800">Compliance List</h2>
                <span className="text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
                  {filtered.length} Items
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                {filtered.slice(0, visibleCount).map((it) => (
                  <div
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${selectedId === it.id ? "bg-indigo-50/50 border-l-4 border-indigo-500" : "border-l-4 border-transparent"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-medium text-sm ${selectedId === it.id ? "text-indigo-900" : "text-slate-900"}`}>
                        {it.name}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getStatusColor(it.status)}`}>
                        {it.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(it.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {it.frequency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {it.assignee}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getPriorityColor(it.priority)}`}>
                        {it.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p>No compliances found</p>
                  </div>
                )}
              </div>

              {visibleCount < filtered.length && (
                <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                  <button onClick={loadMore} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    Load more items
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Details Section */}
          <section className="lg:col-span-7">
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-6">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${getPriorityColor(selected.priority)}`}>
                        {selected.priority} Priority
                      </span>
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                        {selected.category} Compliance
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{selected.name}</h2>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                  {/* Status Card */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${selected.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                          selected.status === 'In Progress' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'
                        }`}>
                        {selected.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> :
                          selected.status === 'In Progress' ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">Current Status</p>
                        <p className="text-xs text-slate-500">Last updated today</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleComplete(selected.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${selected.status === "Completed"
                          ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                        }`}
                    >
                      {selected.status === "Completed" ? "Mark as Pending" : "Mark as Completed"}
                    </button>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {selected.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">Due Date</span>
                      </div>
                      <p className="text-slate-900 font-medium">{new Date(selected.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">Assignee</span>
                      </div>
                      <p className="text-slate-900 font-medium">{selected.assignee}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">Frequency</span>
                      </div>
                      <p className="text-slate-900 font-medium">{selected.frequency}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase">Documents</span>
                      </div>
                      <p className="text-indigo-600 font-medium text-sm cursor-pointer hover:underline">View Attached Files</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      Add Note
                    </button>
                    <button className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      Upload Document
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 bg-white rounded-2xl border border-slate-100 border-dashed">
                <FileText className="w-16 h-16 mb-4 text-slate-200" />
                <p className="text-lg font-medium text-slate-600">No Item Selected</p>
                <p className="text-sm">Select a compliance item to view details</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
