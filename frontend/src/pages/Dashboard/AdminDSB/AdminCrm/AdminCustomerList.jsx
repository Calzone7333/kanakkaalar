import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../components/DataTable";
import { crmAPI } from "../../../../lib/api";
import {
    Users, Search, Filter, Plus, MoreVertical,
    Phone, Mail, MapPin, Edit, Trash2, Eye
} from "lucide-react";

const AdminCustomerList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await crmAPI.getAllProfiles();
            const profiles = res.data || [];

            // Transform backend data to frontend format
            const transformedCustomers = profiles.map(profile => ({
                id: profile.id,
                name: profile.user?.fullName || 'N/A',
                email: profile.user?.email || 'N/A',
                phone: profile.user?.phone || profile.whatsappNumber || 'N/A',
                status: profile.status || 'Active',
                kycStatus: profile.kycStatus || 'Pending',
                walletBalance: 0 // Will be populated separately if needed
            }));

            setCustomers(transformedCustomers);
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
        </div>
    );
};

export default AdminCustomerList;
