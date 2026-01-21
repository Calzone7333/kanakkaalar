import React, { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import DataTable from "@/components/DataTable";
import { Layers, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { serviceItemAPI } from "@/lib/api";
import AddServiceModal from "@/components/AddServiceModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import PageLoader from "@/components/PageLoader";

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [stats, setStats] = useState({
        totalServices: 0,
        activeServices: 0,
        inactiveServices: 0,
    });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const res = await serviceItemAPI.getAll();
            const allServices = res.data || [];
            setServices(allServices);

            // Calculate stats locally
            const activeCount = allServices.filter(s => s.active).length;
            setStats({
                totalServices: allServices.length,
                activeServices: activeCount,
                inactiveServices: allServices.length - activeCount,
            });
        } catch (error) {
            console.error("Failed to fetch services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setServiceToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (service) => {
        setServiceToEdit(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setServiceToEdit(null);
    };

    const handleSuccess = (updatedService) => {
        fetchServices(); // Simple re-fetch to ensure sync
    };

    const handleOpenDeleteModal = (service) => {
        setServiceToDelete(service);
        setIsConfirmModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setServiceToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!serviceToDelete) return;
        setDeleteLoading(true);
        try {
            await serviceItemAPI.delete(serviceToDelete.id);
            handleCloseDeleteModal();
            fetchServices();
        } catch (error) {
            console.error("Failed to delete service:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const serviceStats = [
        {
            title: "Total Services",
            value: stats.totalServices,
            icon: <Layers className="w-6 h-6" />,
            bgColor: "bg-indigo-50",
            iconColor: "text-indigo-600",
        },
        {
            title: "Active Services",
            value: stats.activeServices,
            icon: <CheckCircle className="w-6 h-6" />,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            title: "Inactive Services",
            value: stats.inactiveServices,
            icon: <XCircle className="w-6 h-6" />,
            bgColor: "bg-rose-50",
            iconColor: "text-rose-600",
        },
    ];

    const categories = useMemo(() => {
        const cats = new Set(services.map(s => s.category));
        return ["All", ...Array.from(cats)];
    }, [services]);

    const filteredServices = useMemo(() => {
        let result = services;

        if (filterCategory !== "All") {
            result = result.filter(s => s.category === filterCategory);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(
                (s) =>
                    s.name.toLowerCase().includes(lowerTerm) ||
                    s.category.toLowerCase().includes(lowerTerm) ||
                    s.subCategory.toLowerCase().includes(lowerTerm)
            );
        }
        return result;
    }, [services, searchTerm, filterCategory]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Services Hub Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Manage all services displayed on the Service Hub.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {serviceStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={loading} />
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Category:</span>
                <div className="flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${filterCategory === cat
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <DataTable
                loading={loading}
                title="All Services"
                columns={[
                    { key: "name", label: "Service Name" },
                    { key: "category", label: "Category" },
                    { key: "subCategory", label: "Sub Category" },
                    { key: "priceDescription", label: "Pricing Info" },
                    {
                        key: "active",
                        label: "Status",
                        render: (value) => (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${value
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-rose-100 text-rose-700"
                                }`}>
                                {value ? "Active" : "Inactive"}
                            </span>
                        ),
                    },
                    {
                        key: "actions",
                        label: "Actions",
                        render: (_, item) => (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleOpenEditModal(item)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Edit Service"
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteModal(item)}
                                    className="text-red-600 hover:text-red-800 transition-colors"
                                    title="Delete Service"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ),
                    },
                ]}
                data={filteredServices}
                onAdd={handleOpenAddModal}
                searchPlaceholder="Search services..."
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Add/Edit Modal */}
            <AddServiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSuccess}
                serviceToEdit={serviceToEdit}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Delete Service"
                message={`Are you sure you want to delete ${serviceToDelete?.name}? This action cannot be undone.`}
            />

        </div>
    );
};

export default AdminServices;
