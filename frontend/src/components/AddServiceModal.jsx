import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { serviceItemAPI } from "@/lib/api";

const AddServiceModal = ({ isOpen, onClose, onSuccess, serviceToEdit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        priceDescription: "",
        category: "Licenses/Registrations",
        subCategory: "",
        categoryKey: "licenses",
        route: "",
        active: true,
        pricingPlans: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const CATEGORIES = [
        "Licenses/Registrations",
        "Trademark/IP",
        "Company Change",
        "Taxation & Compliance",
        "New Business/Closure",
        "Legal Agreements",
        "Expert Consultation"
    ];

    const CAT_KEYS = {
        "Licenses/Registrations": "licenses",
        "Trademark/IP": "ip",
        "Company Change": "company",
        "Taxation & Compliance": "tax",
        "New Business/Closure": "formation",
        "Legal Agreements": "legal",
        "Expert Consultation": "consult"
    };

    useEffect(() => {
        if (serviceToEdit) {
            setFormData({
                name: serviceToEdit.name || "",
                description: serviceToEdit.description || "",
                priceDescription: serviceToEdit.priceDescription || "",
                category: serviceToEdit.category || "Licenses/Registrations",
                subCategory: serviceToEdit.subCategory || "",
                categoryKey: serviceToEdit.categoryKey || "licenses",
                route: serviceToEdit.route || "",
                active: serviceToEdit.active,
                pricingPlans: serviceToEdit.pricingPlans || null
            });
        } else {
            resetForm();
        }
    }, [serviceToEdit, isOpen]);

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            priceDescription: "",
            category: "Licenses/Registrations",
            subCategory: "",
            categoryKey: "licenses",
            route: "",
            active: true,
            pricingPlans: null
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
            ...(name === "category" ? { categoryKey: CAT_KEYS[value] || "licenses" } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let res;
            if (serviceToEdit) {
                res = await serviceItemAPI.update(serviceToEdit.id, formData);
            } else {
                res = await serviceItemAPI.create(formData);
            }
            onSuccess(res.data);
            onClose();
        } catch (err) {
            console.error("Failed to save service:", err);
            setError("Failed to save service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {serviceToEdit ? "Edit Service" : "Add New Service"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. GST Registration"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Sub Category *</label>
                            <input
                                type="text"
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Business Essentials"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Route/Path</label>
                            <input
                                type="text"
                                name="route"
                                value={formData.route}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. /compliances/gst"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price & Duration Description</label>
                            <input
                                type="text"
                                name="priceDescription"
                                value={formData.priceDescription}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Price: ₹999 | Duration: 3-7 Days"
                            />
                            <p className="text-xs text-gray-500">Format: Price: ₹XXX | Duration: Y Days</p>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Detailed Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                placeholder="Description of the service..."
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="active"
                                id="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                            />
                            <label htmlFor="active" className="text-sm font-medium text-gray-700 select-none">
                                Service Active
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                "Save Service"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceModal;
