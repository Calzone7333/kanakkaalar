import React, { useState, useEffect } from "react";
import StatCard from "../../../components/StatCard";
import ChartCard from "../../../components/ChartCard";
import DataTable from "../../../components/DataTable";
import { DollarSign, TrendingUp, Target, Zap, LayoutGrid, List as ListIcon } from "lucide-react";
import AddDealModal from "../../../components/AddDealModal";
import AssignEmployeeModal from "../../../components/AssignEmployeeModal";
import { orderAPI, dealAPI } from "../../../lib/api";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const AdminDeals = () => {
    const [filterStage, setFilterStage] = useState("all");
    const [filterOwner, setFilterOwner] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'kanban'

    const [dealRecords, setDealRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                // Fetch both Orders and Manual Deals in parallel
                const [ordersRes, dealsRes] = await Promise.all([
                    orderAPI.getAll(),
                    dealAPI.getAll()
                ]);

                const orders = ordersRes.data || [];
                const manualDeals = dealsRes.data || [];

                // Map Orders to Deal structure
                const mappedOrders = orders.map(order => ({
                    id: `order-${order.id}`, // Prefix ID to avoid collision
                    rawId: order.id,
                    type: 'order',
                    name: order.serviceName || `Order #${order.id}`,
                    customer: order.customerEmail || "Unknown",
                    amount: order.totalAmount || 0,
                    stage: mapStatusToStage(order.status),
                    probability: mapStatusToProbability(order.status),
                    owner: order.assigneeEmail || "Unassigned",
                    dueDate: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A",
                    originalStatus: order.status
                }));

                // Map Manual Deals (already in correct structure, but ensure consistency)
                const mappedManualDeals = manualDeals.map(deal => ({
                    id: `deal-${deal.id}`,
                    rawId: deal.id,
                    type: 'deal',
                    name: deal.name,
                    customer: deal.customer,
                    amount: deal.amount, // Assuming string or number, handle parsing if needed
                    stage: deal.stage,
                    probability: deal.probability,
                    owner: deal.owner || "Unassigned",
                    dueDate: deal.dueDate || "N/A",
                    originalStatus: null
                }));

                // Combine and sort by date (assuming newer first)
                const allDeals = [...mappedManualDeals, ...mappedOrders];
                setDealRecords(allDeals);
            } catch (error) {
                console.error("Failed to fetch deals:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const mapStatusToStage = (status) => {
        if (!status) return "Lead In";
        const s = status.toUpperCase();
        if (s.includes("CREATED") || s.includes("PENDING")) return "Qualification";
        if (s.includes("PROCESSING") || s.includes("IN_PROGRESS")) return "Negotiation";
        if (s.includes("COMPLETED") || s.includes("APPROVED")) return "Closed Won";
        if (s.includes("CANCELLED") || s.includes("REJECTED")) return "Closed Lost";
        return "Proposal Sent";
    };

    const mapStatusToProbability = (status) => {
        if (!status) return 10;
        const s = status.toUpperCase();
        if (s.includes("CREATED")) return 20;
        if (s.includes("PENDING")) return 40;
        if (s.includes("PROCESSING")) return 60;
        if (s.includes("COMPLETED")) return 100;
        if (s.includes("CANCELLED")) return 0;
        return 50;
    };

    // Calculate trends and distribution
    const dealTrendData = [
        { month: "Jan", deals: 0, value: 0, closed: 0 },
        { month: "Feb", deals: 0, value: 0, closed: 0 },
        { month: "Mar", deals: 0, value: 0, closed: 0 },
        { month: "Apr", deals: 0, value: 0, closed: 0 },
        { month: "May", deals: 0, value: 0, closed: 0 },
        { month: "Jun", deals: 0, value: 0, closed: 0 },
    ];

    const stageCounts = dealRecords.reduce((acc, deal) => {
        acc[deal.stage] = (acc[deal.stage] || 0) + 1;
        return acc;
    }, {});

    const stageDistribution = Object.keys(stageCounts).map(stage => ({
        name: stage,
        value: (stageCounts[stage] / dealRecords.length) * 100,
        deals: stageCounts[stage]
    }));

    if (stageDistribution.length === 0) {
        stageDistribution.push({ name: "No Data", value: 100, deals: 0 });
    }

    const handleDealAdded = (newDeal) => {
        // Since we fetch all, we can just add it to state with correct mapping
        const mappedDeal = {
            id: `deal-${newDeal.id}`,
            rawId: newDeal.id,
            type: 'deal',
            name: newDeal.name,
            customer: newDeal.customer,
            amount: newDeal.amount,
            stage: newDeal.stage,
            probability: newDeal.probability,
            owner: newDeal.owner || "Unassigned",
            dueDate: newDeal.dueDate || "N/A",
            originalStatus: null
        };
        setDealRecords((prev) => [mappedDeal, ...prev]);
    };

    let filteredDeals = dealRecords;
    if (filterStage !== "all") {
        filteredDeals = filteredDeals.filter((deal) => deal.stage === filterStage);
    }
    if (filterOwner !== "all") {
        filteredDeals = filteredDeals.filter((deal) => deal.owner === filterOwner);
    }

    const totalDeals = dealRecords.length;
    const totalValue = dealRecords.reduce((sum, deal) => sum + Number(deal.amount), 0);
    const avgDealSize = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;
    const closedDeals = dealRecords.filter((d) => d.stage === "Closed Won").length;
    const winRate = totalDeals > 0 ? ((closedDeals / totalDeals) * 100).toFixed(1) : 0;

    const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);

    const handleAssignClick = (deal) => {
        setSelectedDeal(deal);
        setAssignModalOpen(true);
    };

    const handleAssigned = (dealId, assigneeEmail) => {
        setDealRecords(prev => prev.map(d =>
            d.id === dealId ? { ...d, owner: assigneeEmail } : d
        ));
    };

    const handleViewClick = (deal) => {
        // Navigate to detail view or open modal
        // For now, let's just log it or maybe show a simple alert/modal
        // Ideally navigate to /dashboard/admin/deals/:id
        console.log("View deal:", deal);
        // window.location.href = `/dashboard/admin/deals/${deal.rawId}`; // Example navigation
        alert(`Viewing Deal: ${deal.name}\nCustomer: ${deal.customer}\nAmount: ₹${deal.amount}\nStage: ${deal.stage}`);
    };

    const KanbanColumn = ({ stage, deals, color }) => (
        <div className="flex-1 min-w-[280px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${color}`}>
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">{stage}</h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                    {deals.length}
                </span>
            </div>
            <div className="space-y-3">
                {deals.map(deal => (
                    <div key={deal.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group relative">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{deal.name}</h4>
                            <span className="text-xs font-bold text-gray-500">₹{Number(deal.amount).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{deal.customer.split('@')[0]}</span>
                            <span>{deal.probability}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${deal.probability}%` }}
                            ></div>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${deal.owner === 'Unassigned' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {deal.owner === 'Unassigned' ? 'Unassigned' : deal.owner.split('@')[0]}
                            </span>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleViewClick(deal); }}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium hover:bg-blue-200"
                            >
                                View
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAssignClick(deal); }}
                                className="px-3 py-1 bg-purple-100 text-purple-600 rounded text-xs font-medium hover:bg-purple-200"
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                ))}
                {deals.length === 0 && (
                    <div className="text-center py-4 text-gray-400 text-sm italic">
                        No deals
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Deal Management
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Manage your sales pipeline and opportunities
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <ListIcon size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode("kanban")}
                            className={`p-2 rounded-md transition-all ${viewMode === "kanban" ? "bg-white dark:bg-gray-700 shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Add Deal
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Pipeline Value"
                    value={`₹${(totalValue / 100000).toFixed(1)}L`}
                    icon={<DollarSign className="w-6 h-6" />}
                    change={18.5}
                    description="All deals"
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Active Deals"
                    value={totalDeals.toString()}
                    icon={<Target className="w-6 h-6" />}
                    change={12.3}
                    description="In pipeline"
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Avg Deal Size"
                    value={`₹${(avgDealSize / 1000).toFixed(0)}K`}
                    icon={<Zap className="w-6 h-6" />}
                    change={5.2}
                    description="Per opportunity"
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                />
                <StatCard
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    change={3.8}
                    description="Last 30 days"
                    bgColor="bg-amber-50"
                    iconColor="text-amber-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ChartCard title="Deal Trend" subtitle="Monthly deal value and count">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dealTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                    <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="deals" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 4 }} name="Total Deals" />
                                    <Line type="monotone" dataKey="closed" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} name="Closed Won" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>
                <ChartCard title="Pipeline by Stage" subtitle="Deal distribution">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stageDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stageDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>
            </div>

            {/* Filters */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Stage</label>
                        <select
                            value={filterStage}
                            onChange={(e) => setFilterStage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Stages</option>
                            <option value="Lead In">Lead In</option>
                            <option value="Qualification">Qualification</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Negotiation">Negotiation</option>
                            <option value="Closed Won">Closed Won</option>
                            <option value="Closed Lost">Closed Lost</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Owner</label>
                        <select
                            value={filterOwner}
                            onChange={(e) => setFilterOwner(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Owners</option>
                            {/* Mock owners for filter */}
                            <option value="Alice Johnson">Alice Johnson</option>
                            <option value="Bob Smith">Bob Smith</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* View Content */}
            {viewMode === "list" ? (
                <DataTable
                    loading={loading}
                    title="Deal Details"
                    columns={[
                        { key: "name", label: "Deal Name" },
                        { key: "customer", label: "Customer" },
                        {
                            key: "amount",
                            label: "Amount",
                            render: (val) => `₹${Number(val).toLocaleString()}`
                        },
                        {
                            key: "stage",
                            label: "Stage",
                            render: (value) => (
                                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                                    {value}
                                </span>
                            ),
                        },
                        {
                            key: "probability",
                            label: "Probability",
                            render: (value) => (
                                <div className="flex items-center gap-2">
                                    <div className="w-12 h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${value}%` }} />
                                    </div>
                                    <span className="text-xs font-semibold">{value}%</span>
                                </div>
                            ),
                        },
                        { key: "owner", label: "Owner" },
                        { key: "dueDate", label: "Due Date" },
                    ]}
                    data={filteredDeals}
                    searchPlaceholder="Search deals..."
                    onAdd={() => setIsModalOpen(true)}
                />
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    <KanbanColumn stage="Lead In" deals={filteredDeals.filter(d => d.stage === "Lead In")} color="border-gray-400" />
                    <KanbanColumn stage="Qualification" deals={filteredDeals.filter(d => d.stage === "Qualification")} color="border-blue-400" />
                    <KanbanColumn stage="Proposal Sent" deals={filteredDeals.filter(d => d.stage === "Proposal Sent")} color="border-purple-400" />
                    <KanbanColumn stage="Negotiation" deals={filteredDeals.filter(d => d.stage === "Negotiation")} color="border-orange-400" />
                    <KanbanColumn stage="Closed Won" deals={filteredDeals.filter(d => d.stage === "Closed Won")} color="border-green-400" />
                    <KanbanColumn stage="Closed Lost" deals={filteredDeals.filter(d => d.stage === "Closed Lost")} color="border-red-400" />
                </div>
            )}

            <AddDealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDealAdded={handleDealAdded}
            />

            <AssignEmployeeModal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                deal={selectedDeal}
                onAssigned={handleAssigned}
            />
        </div>
    );
};

export default AdminDeals;
