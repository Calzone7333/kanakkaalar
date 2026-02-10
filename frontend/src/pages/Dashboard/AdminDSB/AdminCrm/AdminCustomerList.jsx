import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../components/DataTable";
import { crmAPI, dealAPI, orderAPI, paymentsAPI } from "../../../../lib/api";
import {
    Users, Search, Filter, Plus, MoreVertical,
    Phone, Mail, MapPin, Edit, Trash2, Eye,
    CreditCard, Target, IndianRupee, Send
} from "lucide-react";

const AdminCustomerList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);

    // Payment Logic
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [customerForPayment, setCustomerForPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentPhone, setPaymentPhone] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    const handlePaymentClick = (customer) => {
        setCustomerForPayment(customer);
        setPaymentAmount("");
        setPaymentPhone(customer.phone !== 'N/A' ? customer.phone : "");
        setPaymentModalOpen(true);
    };

    const sendPaymentLink = async () => {
        if (!paymentAmount) return alert("Please enter amount");
        if (!paymentPhone || paymentPhone.length < 10) return alert("Please enter valid phone number for WhatsApp");

        try {
            setPaymentLoading(true);
            const payload = {
                dealId: customerForPayment.id.startsWith('deal-cust-') ? customerForPayment.id.replace('deal-cust-', '') : customerForPayment.id,
                amount: parseFloat(paymentAmount),
                customerEmail: customerForPayment.email !== 'N/A' ? customerForPayment.email : "",
                customerPhone: paymentPhone,
                description: `Payment for Customer ${customerForPayment.name}`
            };
            await paymentsAPI.sendLink(payload);
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
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);

            const [crmRes, dealsRes, ordersRes] = await Promise.all([
                crmAPI.getAllProfiles(),
                dealAPI.getAll(),
                orderAPI.getAll()
            ]);

            const profiles = crmRes.data || [];
            const deals = dealsRes.data || [];
            const orders = ordersRes.data || [];

            const customerMap = new Map();

            // 1. Process CRM Profiles (Highest Priority)
            profiles.forEach(profile => {
                const email = profile.user?.email?.toLowerCase();
                if (email) {
                    customerMap.set(email, {
                        id: profile.id, // CRM ID
                        source: 'CRM',
                        name: profile.user?.fullName || 'N/A',
                        email: profile.user?.email,
                        phone: profile.user?.phone || profile.whatsappNumber || 'N/A',
                        status: profile.status || 'Active',
                        kycStatus: profile.kycStatus || 'Pending',
                        walletBalance: 0,
                        dealsCount: 0,
                        ordersCount: 0
                    });
                }
            });

            // 2. Process Deals (Add missing, update counts)
            deals.forEach(deal => {
                // Extract email from "Name (email)" or just use field if exists (assuming deal structure)
                let email = deal.customerEmail ? deal.customerEmail.toLowerCase() : null;
                let name = deal.customerName || deal.customer || "Unknown";

                // Fallback parsing if customer string is "Name (Email)"
                if (!email && deal.customer && deal.customer.includes('(')) {
                    const match = deal.customer.match(/\(([^)]+)\)/);
                    if (match) email = match[1].toLowerCase();
                    name = deal.customer.split('(')[0].trim();
                } else if (!email && deal.customer && deal.customer.includes('@')) {
                    email = deal.customer.toLowerCase();
                    name = email.split('@')[0];
                }

                if (email) {
                    if (customerMap.has(email)) {
                        const existing = customerMap.get(email);
                        existing.dealsCount = (existing.dealsCount || 0) + 1;
                    } else {
                        // New Customer from Deal
                        customerMap.set(email, {
                            id: `deal-cust-${deal.id}`, // Temporary ID
                            source: 'Deal',
                            name: name,
                            email: email,
                            phone: deal.contact || deal.phone || 'N/A',
                            status: deal.stage || 'Lead',
                            kycStatus: 'Pending',
                            walletBalance: 0,
                            dealsCount: 1,
                            ordersCount: 0,
                            dealId: deal.id // Store dealId for simpler access
                        });
                    }
                }
            });

            // 3. Process Orders (Add missing, update counts)
            orders.forEach(order => {
                const email = order.customerEmail ? order.customerEmail.toLowerCase() : null;
                if (email) {
                    if (customerMap.has(email)) {
                        const existing = customerMap.get(email);
                        existing.ordersCount = (existing.ordersCount || 0) + 1;
                    } else {
                        // New Customer from Order (Unlikely if auth required, but possible for guest checkout)
                        customerMap.set(email, {
                            id: `order-cust-${order.id}`,
                            source: 'Order',
                            name: order.customerName || email.split('@')[0],
                            email: email,
                            phone: 'N/A',
                            status: 'Active',
                            kycStatus: 'Pending',
                            walletBalance: 0,
                            dealsCount: 0,
                            ordersCount: 1
                        });
                    }
                }
            });

            setCustomers(Array.from(customerMap.values()));
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError(err.response?.data?.message || 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading customers...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error: {error}</p>
                <button
                    onClick={fetchCustomers}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Customers</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {customers.length} customer{customers.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <button
                    onClick={() => navigate("/dashboard/admin/crm")}
                    className="px-4 py-2 bg-[#0189BB] text-white rounded-lg hover:bg-[#017a9b] font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Customer
                </button>
            </div>

            <DataTable
                loading={loading}
                title="Customers"
                columns={[
                    {
                        key: "name",
                        label: "Customer",
                        render: (value, item) => (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    {value.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{value}</div>
                                    <div className="text-xs text-gray-500">ID: #{item.id}</div>
                                </div>
                            </div>
                        )
                    },
                    {
                        key: "email",
                        label: "Contact",
                        render: (value, item) => (
                            <div className="flex flex-col">
                                <span>{value}</span>
                                <span className="text-xs text-gray-400">{item.phone}</span>
                            </div>
                        )
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (value) => (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                ${value === 'Active' ? 'bg-green-100 text-green-700' :
                                    value === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-700'}`}>
                                {value}
                            </span>
                        )
                    },
                    {
                        key: "kycStatus",
                        label: "KYC",
                        render: (value) => (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                ${value === 'Verified' ? 'bg-blue-100 text-blue-700' :
                                    value === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'}`}>
                                {value}
                            </span>
                        )
                    },
                    {
                        key: "walletBalance",
                        label: "Wallet",
                        render: (value) => `₹${value}`
                    },
                    {
                        key: "actions",
                        label: "Actions",
                        render: (_, item) => (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePaymentClick(item)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                    title="Request Payment"
                                >
                                    <CreditCard size={18} />
                                </button>
                                <button
                                    onClick={() => navigate(`/dashboard/admin/crm/customer/${item.id}`)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="View Profile"
                                >
                                    <Eye size={18} />
                                </button>
                                <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                                    <Edit size={18} />
                                </button>
                            </div>
                        )
                    }
                ]}
                data={filteredCustomers}
                searchPlaceholder="Search by name or email..."
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
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

export default AdminCustomerList;
