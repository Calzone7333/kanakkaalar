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
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Services Hub Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                        Manage all services displayed on the Service Hub.
                    </p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-all text-sm"
                >
                    <Layers className="w-4 h-4" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {serviceStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} loading={loading} />
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Filter</span>
                    </div>
                    <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                        {services.length} Total items
                    </div>
                </div>
                <div className="p-3 sm:p-4 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 min-w-max">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${filterCategory === cat
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20"
                                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:border-indigo-200 hover:bg-gray-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
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
