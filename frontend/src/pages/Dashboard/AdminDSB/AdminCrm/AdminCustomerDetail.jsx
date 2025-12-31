import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    User, FileText, CreditCard, Bell,
    Phone, Mail, MapPin, Calendar,
    CheckCircle, Clock, AlertCircle,
    ChevronLeft, Upload, Download, Trash2,
    Plus, MessageSquare, Shield, Wallet,
    Briefcase, FileCheck, History
} from "lucide-react";
import StatCard from "../../../../components/StatCard";

// --- Sub-components for Tabs ---

const CustomerProfileTab = ({ customer }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <User size={20} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="text-gray-900 dark:text-white font-medium">{customer.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-gray-900 dark:text-white font-medium">15 Aug 1990</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Mail size={16} /> {customer.email}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <Phone size={16} /> {customer.phone}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">WhatsApp</label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2 text-green-600">
                        <MessageSquare size={16} /> {customer.phone}
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 dark:text-white font-medium">Male</p>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        <MapPin size={16} /> 123, Green Park, New Delhi, India - 110016
                    </p>
                </div>
            </div>
        </div>

        {/* KYC Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Shield size={20} /> KYC Details
            </h3>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Aadhaar Card</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                    </div>
                    <p className="font-mono text-gray-900 dark:text-white">XXXX-XXXX-1234</p>
                    <button className="text-blue-600 text-sm mt-2 flex items-center gap-1 hover:underline">
                        <Download size={14} /> View File
                    </button>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">PAN Card</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                    </div>
                    <p className="font-mono text-gray-900 dark:text-white">ABCDE1234F</p>
                    <button className="text-blue-600 text-sm mt-2 flex items-center gap-1 hover:underline">
                        <Download size={14} /> View File
                    </button>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                            Signature
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Update Signature</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ServicesTab = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Services</h3>
            <button className="px-3 py-1.5 bg-[#0189BB] text-white rounded-lg text-sm flex items-center gap-2">
                <Plus size={16} /> New Service
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                { name: "GST Registration", status: "In Progress", date: "20 Nov 2024", staff: "Amit K.", color: "blue" },
                { name: "ITR Filing", status: "Completed", date: "15 Oct 2024", staff: "Priya S.", color: "green" },
                { name: "PAN Application", status: "Pending", date: "22 Nov 2024", staff: "Unassigned", color: "amber" },
            ].map((service, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded-lg bg-${service.color}-50 text-${service.color}-600`}>
                            <Briefcase size={20} />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
              ${service.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                service.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    'bg-blue-100 text-blue-700'}`}>
                            {service.status}
                        </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">Due: {service.date}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-xs text-gray-500">Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300">{service.staff}</span></span>
                        <button className="text-blue-600 text-sm hover:underline">Details</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const DocumentsTab = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documents</h3>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                <Upload size={16} /> Upload New
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Aadhaar Card.pdf", "PAN Card.jpg", "Bank Statement.pdf", "Rent Agreement.pdf"].map((doc, idx) => (
                <div key={idx} className="group relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-700 rounded-md mb-3 text-gray-400">
                        <FileText size={32} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc}</p>
                    <p className="text-xs text-gray-500">Uploaded 2 days ago</p>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button className="p-1 bg-white shadow-sm rounded-md text-gray-600 hover:text-blue-600"><Eye size={14} /></button>
                        <button className="p-1 bg-white shadow-sm rounded-md text-gray-600 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const WalletTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#0189BB] to-[#01688f] rounded-xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Current Balance</p>
                    <h2 className="text-3xl font-bold">₹2,450.00</h2>
                </div>
                <div className="p-2 bg-white/10 rounded-lg">
                    <Wallet size={24} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-white text-[#0189BB] py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
                    Add Money
                </button>
                <button className="bg-[#0189BB] border border-white/30 py-2 rounded-lg font-medium text-sm hover:bg-white/10 transition-colors">
                    Withdraw
                </button>
            </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Transaction History</h3>
            <div className="space-y-4">
                {[
                    { desc: "Added to Wallet", date: "Today, 10:30 AM", amount: "+₹500", type: "credit" },
                    { desc: "Service Payment - ITR", date: "Yesterday, 4:15 PM", amount: "-₹1,200", type: "debit" },
                    { desc: "Cashback Received", date: "20 Nov, 2:00 PM", amount: "+₹50", type: "credit" },
                ].map((tx, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {tx.type === 'credit' ? <ArrowUpRight size={16} /> : <ArrowUpRight className="rotate-180" size={16} />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                                <p className="text-xs text-gray-500">{tx.date}</p>
                            </div>
                        </div>
                        <span className={`font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.amount}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const AdminCustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    // Mock Customer Data
    const customer = {
        id: id,
        name: "Rahul Kumar",
        email: "rahul@example.com",
        phone: "+91 98765 43210",
        status: "Active",
        kycStatus: "Verified",
        walletBalance: 2450,
        joinDate: "12 Jan 2024"
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: FileCheck },
        { id: "profile", label: "Profile", icon: User },
        { id: "services", label: "Services", icon: Briefcase },
        { id: "documents", label: "Documents", icon: FileText },
        { id: "wallet", label: "Wallet", icon: Wallet },
        { id: "support", label: "Support", icon: MessageSquare },
        { id: "history", label: "History", icon: History },
    ];

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button onClick={() => navigate("/dashboard/admin/crm")} className="hover:text-blue-600">CRM</button>
                <ChevronRight size={14} />
                <button onClick={() => navigate("/dashboard/admin/crm/customers")} className="hover:text-blue-600">Customers</button>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">{customer.name}</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {customer.name}
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                                    {customer.status}
                                </span>
                            </h1>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1"><Mail size={14} /> {customer.email}</span>
                                <span className="flex items-center gap-1"><Phone size={14} /> {customer.phone}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> Joined {customer.joinDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-[#0189BB] text-white rounded-lg hover:bg-[#017a9b] font-medium transition-colors flex items-center gap-2 shadow-sm">
                            <Plus size={18} /> New Service
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-6 mt-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap border-b-2 
                ${activeTab === tab.id
                                    ? "border-[#0189BB] text-[#0189BB]"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Wallet Balance" value={`₹${customer.walletBalance}`} icon={<Wallet className="w-6 h-6" />} bgColor="bg-blue-50" iconColor="text-blue-600" />
                        <StatCard title="Active Services" value="3" icon={<Briefcase className="w-6 h-6" />} bgColor="bg-purple-50" iconColor="text-purple-600" />
                        <StatCard title="Pending Tickets" value="1" icon={<MessageSquare className="w-6 h-6" />} bgColor="bg-amber-50" iconColor="text-amber-600" />
                        <StatCard title="Total Spent" value="₹12,500" icon={<CreditCard className="w-6 h-6" />} bgColor="bg-green-50" iconColor="text-green-600" />

                        <div className="lg:col-span-2">
                            <ServicesTab />
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-gray-300"></div>
                                            <div>
                                                <p className="text-sm text-gray-800 dark:text-gray-200">Document "PAN Card" uploaded successfully.</p>
                                                <p className="text-xs text-gray-500">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "profile" && <CustomerProfileTab customer={customer} />}
                {activeTab === "services" && <ServicesTab />}
                {activeTab === "documents" && <DocumentsTab />}
                {activeTab === "wallet" && <WalletTab />}
                {activeTab === "support" && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Support Tickets</h3>
                        <p>No active support tickets found for this customer.</p>
                    </div>
                )}
                {activeTab === "history" && (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200">
                        <History size={48} className="mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Activity Log</h3>
                        <p>View full audit trail of customer interactions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomerDetail;
