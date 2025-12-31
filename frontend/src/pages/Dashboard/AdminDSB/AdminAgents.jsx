import React, { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Users, UserCheck, UserX, Edit, Trash2, Power, Wallet } from "lucide-react";
import { adminAPI } from "@/lib/api";
import AddAgentModal from "@/components/AddAgentModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import PageLoader from "@/components/PageLoader";

const AdminAgents = () => {
    const [agents, setAgents] = useState([]);
    const [stats, setStats] = useState({
        totalAgents: 0,
        activeAgents: 0,
        inactiveAgents: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [agentToEdit, setAgentToEdit] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const res = await adminAPI.listAgents();
            setAgents(res.data.agents || []);
            setStats(res.data.stats || {
                totalAgents: 0,
                activeAgents: 0,
                inactiveAgents: 0,
            });
        } catch (error) {
            console.error("Failed to fetch agents:", error);
            // Fallback for demo if API fails
            setAgents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setAgentToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (agent) => {
        setAgentToEdit(agent);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAgentToEdit(null);
    };

    const handleSuccess = (updatedAgent) => {
        if (agentToEdit) {
            setAgents((prev) =>
                prev.map((agt) => (agt.id === updatedAgent.id ? updatedAgent : agt))
            );
        } else {
            setAgents((prev) => [updatedAgent, ...prev]);
        }
        fetchAgents();
    };

    const handleOpenDeleteModal = (agent) => {
        setAgentToDelete(agent);
        setIsConfirmModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setAgentToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!agentToDelete) return;
        setDeleteLoading(true);
        try {
            await adminAPI.deleteAgent(agentToDelete.id);
            setAgents((prev) => prev.filter((agt) => agt.id !== agentToDelete.id));
            handleCloseDeleteModal();
            fetchAgents();
        } catch (error) {
            console.error("Failed to delete agent:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleStatus = async (agent) => {
        const newStatus = agent.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        try {
            await adminAPI.toggleAgentStatus(agent.id, newStatus);
            setAgents((prev) =>
                prev.map((agt) =>
                    agt.id === agent.id ? { ...agt, status: newStatus } : agt
                )
            );
            fetchAgents();
        } catch (error) {
            console.error("Failed to toggle agent status:", error);
        }
    };

    const agentStats = [
        {
            title: "Total Agents",
            value: stats?.totalAgents || 0,
            icon: <Users className="w-6 h-6" />,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            title: "Active Agents",
            value: stats?.activeAgents || 0,
            icon: <UserCheck className="w-6 h-6" />,
            bgColor: "bg-green-50",
            iconColor: "text-green-600",
        },
        {
            title: "Inactive Agents",
            value: stats?.inactiveAgents || 0,
            icon: <UserX className="w-6 h-6" />,
            bgColor: "bg-red-50",
            iconColor: "text-red-600",
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
            case "INACTIVE":
                return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const filteredAgents = useMemo(() => {
        if (!searchTerm) return agents;
        return agents.filter(
            (agent) =>
                agent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [agents, searchTerm]);

    if (loading && agents.length === 0) {
        return <PageLoader show={true} />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Agent Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage agents, their wallets, and account status.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agentStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={loading} />
                ))}
            </div>

            <DataTable
                loading={loading}
                title="All Agents"
                columns={[
                    { key: "fullName", label: "Name" },
                    { key: "email", label: "Email" },
                    {
                        key: "walletBalance",
                        label: "Wallet Balance",
                        render: (val) => <span className="font-mono">₹{(val || 0).toLocaleString()}</span>
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (value) => (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(value)}`}>
                                {value}
                            </span>
                        ),
                    },
                    {
                        key: "actions",
                        label: "Actions",
                        render: (_, item) => (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleToggleStatus(item)}
                                    className={`${item.status === "ACTIVE" ? "text-red-500" : "text-green-500"
                                        } hover:opacity-80 transition-colors`}
                                    title={item.status === "ACTIVE" ? "Deactivate Account" : "Activate Account"}
                                >
                                    <Power className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleOpenEditModal(item)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit Agent"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteModal(item)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete Agent"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ),
                    },
                ]}
                data={filteredAgents}
                onAdd={handleOpenAddModal}
                searchPlaceholder="Search by name or email..."
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add/Edit Modal */}
            <AddAgentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                agentToEdit={agentToEdit}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Delete Agent"
                message={`Are you sure you want to delete ${agentToDelete?.fullName}? This action cannot be undone and will remove their wallet.`}
            />
        </div>
    );
};

export default AdminAgents;
