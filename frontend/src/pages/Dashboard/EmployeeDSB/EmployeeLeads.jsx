import React, { useState, useEffect } from "react";
import StatCard from "../../../components/StatCard";
import DataTable from "../../../components/DataTable";
import { Users, TrendingUp, TrendingDown, Phone } from "lucide-react";
import { leadAPI } from "../../../lib/api";
import AddLeadModal from "../../../components/AddLeadModal";

const EmployeeLeads = () => {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        newLeads: 0,
        convertedLeads: 0,
        lostLeads: 0,
        followUps: 0,
    });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await leadAPI.getAll();
            const rawLeads = res.data || [];

            // Ensure unique IDs
            const leadsData = rawLeads.map((lead, index) => ({
                ...lead,
                originalId: lead.id,
                id: `${lead.id || 'lead'}-${index}-${Date.now()}`
            }));

            setLeads(leadsData);

            // Calculate stats from leadsData
            const newLeads = leadsData.filter(l => l.status === 'New').length;
            const converted = leadsData.filter(l => l.status === 'Converted').length;
            const lost = leadsData.filter(l => l.status === 'Lost').length;
            const followUps = leadsData.filter(l => l.status === 'Contacted').length;

            setStats({
                newLeads,
                convertedLeads: converted,
                lostLeads: lost,
                followUps
            });
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeadAdded = (newLead) => {
        fetchLeads(); // Refresh the list
    };

    const leadStats = [
        {
            title: "New Leads",
            value: stats.newLeads,
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Converted Leads",
            value: stats.convertedLeads,
            icon: <TrendingUp className="w-6 h-6" />,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Lost Leads",
            value: stats.lostLeads,
            icon: <TrendingDown className="w-6 h-6" />,
            bgColor: "bg-red-50",
            iconColor: "text-red-600",
        },
        {
            title: "Follow-ups",
            value: stats.followUps,
            icon: <Phone className="w-6 h-6" />,
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "New":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
            case "Contacted":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
            case "Converted":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
            case "Lost":
                return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    My Leads
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Track and manage your leads
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leadStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <DataTable
                loading={loading}
                title="All Leads"
                columns={[
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Phone" },
                    { key: "service", label: "Source/Service" },
                    { key: "ownerName", label: "Assigned To" },
                    {
                        key: "status",
                        label: "Status",
                        render: (value) => (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(value)}`}>
                                {value}
                            </span>
                        ),
                    },
                ]}
                data={filteredLeads}
                searchPlaceholder="Search by name or email..."
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                onAdd={() => setIsModalOpen(true)}
            />

            <AddLeadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLeadAdded={handleLeadAdded}
            />
        </div>
    );
};

export default EmployeeLeads;
