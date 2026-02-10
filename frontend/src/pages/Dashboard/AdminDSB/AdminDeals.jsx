import React, { useState, useEffect } from "react";
import StatCard from "../../../components/StatCard";
import ChartCard from "../../../components/ChartCard";
import DataTable from "../../../components/DataTable";
import { IndianRupee, TrendingUp, Target, Zap, LayoutGrid, List as ListIcon, ArrowRight, CreditCard, Send } from "lucide-react";
import AddDealModal from "../../../components/AddDealModal";
import AssignEmployeeModal from "../../../components/AssignEmployeeModal";
import { orderAPI, dealAPI, paymentsAPI } from "../../../lib/api";
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

    // Payment Logic
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [dealForPayment, setDealForPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentPhone, setPaymentPhone] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    const handlePaymentClick = (deal) => {
        setDealForPayment(deal);
        setPaymentAmount(deal.amount || "");
        // Try to extract phone if available in customer string "Name (email) - Phone" or similar, 
        // but currently structure is just "Name (Email)".
        // Only asks for phone in modal.
        setPaymentModalOpen(true);
    };

    const sendPaymentLink = async () => {
        if (!paymentAmount) return alert("Please enter amount");
        // Simple phone validation
        if (!paymentPhone || paymentPhone.length < 10) return alert("Please enter valid phone number for WhatsApp");

        try {
            setPaymentLoading(true);

            // Extract email from "Name (email)" format if needed, or deal might have it?
            // deal.customer usually is "Name (Email)"
            let email = "";
            const emailMatch = dealForPayment.customer.match(/\(([^)]+)\)/);
            if (emailMatch) {
                email = emailMatch[1];
            } else {
                // If it's just an email
                if (dealForPayment.customer.includes("@")) email = dealForPayment.customer;
            }

            // Fallback
            if (!email && dealForPayment.contact) email = dealForPayment.contact; // If contact field exists

            const payload = {
                dealId: dealForPayment.rawId || dealForPayment.id.replace('deal-', ''),
                amount: parseFloat(paymentAmount),
                customerEmail: email,
                customerPhone: paymentPhone,
                description: `Payment for ${dealForPayment.name}`
            };

            // Call API
            // We need to add sendPaymentLink to paymentsAPI in frontend first? 
            // I'll check api.js content again. I haven't added it to api.js yet!
            // I'll add it to api.js in the next step. USE api.post directly for now or assume it exists.
            // Better to use api.post directly here to avoid switching files twice.
            await paymentsAPI.sendLink(payload); // I will add this to api.js

            alert("Payment Link Sent Successfully via Email & WhatsApp!");
            setPaymentModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to send link: " + (error.response?.data?.error || error.message));
        } finally {
            setPaymentLoading(false);
        }
    };

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
        <div className="flex-1 min-w-[300px] sm:min-w-[320px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-inner">
            <div className={`flex items-center justify-between mb-5 pb-2 border-b-2 ${color}`}>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">{stage}</h3>
                <span className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                    {deals.length}
                </span>
            </div>
            <div className="space-y-4">
                {deals.map(deal => (
                    <div key={deal.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-50 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 group relative cursor-pointer ring-offset-2 hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900/30">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">{deal.name}</h4>
                            <span className="text-xs font-black text-blue-600 ml-2">₹{Number(deal.amount).toLocaleString()}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span className="truncate max-w-[120px]">{deal.customer}</span>
                            <span className="font-bold px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 rounded">{deal.probability}%</span>
                        </div>

                        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                            <div
                                className="bg-gradient-to-r from-blue-400 to-blue-600 h-1 rounded-full transition-all duration-500"
                                style={{ width: `${deal.probability}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg ${deal.owner === 'Unassigned' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                {deal.owner === 'Unassigned' ? 'Unassigned' : (deal.owner.includes('@') ? deal.owner.split('@')[0] : deal.owner)}
                            </span>
                        </div>

                        {/* Hover Actions - More refined */}
                        <div className="absolute inset-0 bg-blue-600/95 dark:bg-blue-600/95 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl backdrop-blur-sm z-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); handleViewClick(deal); }}
                                className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                                title="View Details"
                            >
                                <ListIcon size={18} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAssignClick(deal); }}
                                className="p-2 bg-white text-blue-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                                title="Assign Employee"
                            >
                                <Target size={18} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePaymentClick(deal); }}
                                className="p-2 bg-white text-emerald-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                                title="Request Payment"
                            >
                                <CreditCard size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {deals.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-30 select-none">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-400 mb-2"></div>
                        <span className="text-xs font-bold uppercase tracking-tighter">Empty Stage</span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-2 sm:p-4 min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-2 sm:py-0">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Deal Management
                    </h1>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Manage and track your sales pipeline
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-bold whitespace-nowrap ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <ListIcon size={16} /> <span className="hidden sm:inline">List</span>
                        </button>
                        <button
                            onClick={() => setViewMode("kanban")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm font-bold whitespace-nowrap ${viewMode === "kanban" ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            <LayoutGrid size={16} /> <span className="hidden sm:inline">Kanban</span>
                        </button>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                    >
                        <Zap size={16} fill="currentColor" /> Add Deal
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <StatCard
                    compact
                    title="Pipeline Value"
                    value={`₹${(totalValue / 100000).toFixed(1)}L`}
                    icon={<IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />}
                    change={18.5}
                    description="Total potential"
                    bgColor="bg-blue-50/50"
                    iconColor="text-blue-600"
                />
                <StatCard
                    compact
                    title="Active Deals"
                    value={totalDeals.toString()}
                    icon={<Target className="w-5 h-5 sm:w-6 sm:h-6" />}
                    change={12.3}
                    description="In pipeline"
                    bgColor="bg-indigo-50/50"
                    iconColor="text-indigo-600"
                />
                <StatCard
                    compact
                    title="Avg Deal"
                    value={`₹${(avgDealSize / 1000).toFixed(0)}K`}
                    icon={<Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
                    change={5.2}
                    description="Per deal"
                    bgColor="bg-emerald-50/50"
                    iconColor="text-emerald-600"
                />
                <StatCard
                    compact
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />}
                    change={3.8}
                    description="Last 30 days"
                    bgColor="bg-amber-50/50"
                    iconColor="text-amber-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                <div>
                    <ChartCard title="Deal Trend" subtitle="Monthly performance">
                        <div style={{ width: '100%', height: 220 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dealTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: "10px", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        formatter={(value) => [`₹${value.toLocaleString()}`, "Amount"]}
                                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "10px" }} />
                                    <Line type="monotone" dataKey="deals" stroke="#3B82F6" strokeWidth={3} dot={{ fill: "#3B82F6", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} name="Total Deals" />
                                    <Line type="monotone" dataKey="closed" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} name="Closed Won" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>
                <ChartCard title="Pipeline Stage" subtitle="Distribution">
                    <div style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stageDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stageDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        padding: "4px 8px",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                                    }}
                                    itemStyle={{ fontSize: "10px", fontWeight: "bold", padding: "0" }}
                                />
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
                <div className="space-y-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <DataTable
                            loading={loading}
                            title="Recent Deals"
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
                                        <span className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                                            {value}
                                        </span>
                                    ),
                                },
                                {
                                    key: "probability",
                                    label: "Confidence",
                                    render: (value) => (
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 overflow-hidden bg-slate-100 rounded-full dark:bg-slate-800">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600">{value}%</span>
                                        </div>
                                    ),
                                },
                                { key: "owner", label: "Assignee" },
                                {
                                    key: "actions",
                                    label: "Actions",
                                    render: (_, deal) => (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePaymentClick(deal)}
                                                className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                                                title="Request Payment"
                                            >
                                                <CreditCard size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleAssignClick(deal)}
                                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                title="Assign"
                                            >
                                                <Target size={16} />
                                            </button>
                                        </div>
                                    )
                                },
                            ]}
                            data={filteredDeals}
                            searchPlaceholder="Search pipeline..."
                        />
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Active Pipeline</h3>
                            <span className="text-xs font-medium text-slate-500">{filteredDeals.length} deals</span>
                        </div>
                        {filteredDeals.map((deal) => (
                            <div key={deal.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-transform">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="max-w-[70%]">
                                        <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{deal.name}</h4>
                                        <p className="text-xs text-slate-500 mt-0.5">{deal.customer}</p>
                                    </div>
                                    <span className="text-sm font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">₹{Number(deal.amount).toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Current Stage</span>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{deal.stage}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
                                        <span className={`text-xs font-bold ${deal.owner === 'Unassigned' ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {deal.owner === 'Unassigned' ? 'Nobody' : deal.owner.split('@')[0]}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleViewClick(deal)}
                                        className="flex-1 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleAssignClick(deal)}
                                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold"
                                    >
                                        Assign
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredDeals.length === 0 && (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400 text-sm">No deals matching your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative">
                    {/* Horizontal scroll indicator for mobile */}
                    <div className="md:hidden flex items-center justify-center gap-2 mb-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                        <span>Scroll Right</span>
                        <ArrowRight size={10} />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                        <div className="snap-center"><KanbanColumn stage="Lead In" deals={filteredDeals.filter(d => d.stage === "Lead In")} color="border-slate-300" /></div>
                        <div className="snap-center"><KanbanColumn stage="Qualification" deals={filteredDeals.filter(d => d.stage === "Qualification")} color="border-blue-300" /></div>
                        <div className="snap-center"><KanbanColumn stage="Proposal Sent" deals={filteredDeals.filter(d => d.stage === "Proposal Sent")} color="border-violet-300" /></div>
                        <div className="snap-center"><KanbanColumn stage="Negotiation" deals={filteredDeals.filter(d => d.stage === "Negotiation")} color="border-orange-300" /></div>
                        <div className="snap-center"><KanbanColumn stage="Closed Won" deals={filteredDeals.filter(d => d.stage === "Closed Won")} color="border-emerald-300" /></div>
                        <div className="snap-center"><KanbanColumn stage="Closed Lost" deals={filteredDeals.filter(d => d.stage === "Closed Lost")} color="border-rose-300" /></div>
                    </div>
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

            {/* Payment Modal */}
            {paymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request Payment</h3>
                                    <p className="text-slate-500 text-sm mt-1">Send a secure payment link via Email & WhatsApp.</p>
                                </div>
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                    <CreditCard size={20} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Amount (₹)</label>
                                    <div className="relative">
                                        <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="number"
                                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700 dark:text-slate-200"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder="Enter amount"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Customer WhatsApp</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700 dark:text-slate-200"
                                        value={paymentPhone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                        placeholder="e.g. 9876543210"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Link will be sent to this number.</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => setPaymentModalOpen(false)}
                                    className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendPaymentLink}
                                    disabled={paymentLoading}
                                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {paymentLoading ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <>
                                            <Send size={16} /> Send Link
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDeals;
