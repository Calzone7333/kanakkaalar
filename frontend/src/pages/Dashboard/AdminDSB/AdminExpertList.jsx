import React, { useState, useEffect } from "react";
import { expertAPI } from "../../../lib/api";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Star,
    X,
    Check,
    User,
    Briefcase,
    Upload
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminExpertList() {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpert, setEditingExpert] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        qualification: "",
        experience: "",
        rating: 5.0,
        reviews: 0,
        languages: "", // comma separated
        specialization: "", // comma separated
        price: "",
        available: true,
        bio: ""
    });

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const res = await expertAPI.getAll();
            setExperts(res.data);
        } catch (error) {
            console.error("Failed to fetch experts", error);
            toast.error("Failed to load experts");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const expertData = {
                ...formData,
                languages: formData.languages.split(",").map(s => s.trim()),
                specialization: formData.specialization.split(",").map(s => s.trim())
            };

            const payload = new FormData();
            payload.append("data", JSON.stringify(expertData));
            if (selectedFile) {
                payload.append("file", selectedFile);
            }

            if (editingExpert) {
                await expertAPI.update(editingExpert.id, payload);
                toast.success("Expert updated successfully");
            } else {
                await expertAPI.create(payload);
                toast.success("Expert created successfully");
            }
            setIsModalOpen(false);
            fetchExperts();
        } catch (error) {
            console.error("Failed to save expert", error);
            toast.error("Failed to save expert");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expert?")) return;
        try {
            await expertAPI.delete(id);
            toast.success("Expert deleted");
            fetchExperts();
        } catch (error) {
            console.error("Failed to delete expert", error);
            toast.error("Failed to delete expert");
        }
    };

    const openModal = (expert = null) => {
        setSelectedFile(null);
        if (expert) {
            setEditingExpert(expert);
            setFormData({
                name: expert.name,
                qualification: expert.qualification,
                experience: expert.experience,
                rating: expert.rating,
                reviews: expert.reviews,
                languages: expert.languages ? expert.languages.join(", ") : "",
                specialization: expert.specialization ? expert.specialization.join(", ") : "",
                price: expert.price,
                available: expert.available,
                bio: expert.bio || ""
            });
        } else {
            setEditingExpert(null);
            setFormData({
                name: "",
                qualification: "",
                experience: "",
                rating: 5.0,
                reviews: 0,
                languages: "",
                specialization: "",
                price: "",
                available: true,
                bio: ""
            });
        }
        setIsModalOpen(true);
    };

    const filteredExperts = experts.filter(e =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.qualification.toLowerCase().includes(query.toLowerCase())
    );

    const getImageUrl = (expert) => {
        if (expert.image) return `data:${expert.imageContentType};base64,${expert.image}`; // If we returned base64 string
        // But we are now returning bytes via an endpoint.
        // So we construct the URL.
        const baseUrl = import.meta.env.VITE_API_URL || 'http://192.168.1.2:8081/api';
        return `${baseUrl}/api/experts/${expert.id}/image`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage Experts</h1>
                    <p className="text-slate-500">Add or edit consultation experts.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
                >
                    <Plus className="w-4 h-4" /> Add Expert
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search experts..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Expert</th>
                                <th className="px-6 py-4">Qualification</th>
                                <th className="px-6 py-4">Experience</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExperts.map((expert) => (
                                <tr key={expert.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getImageUrl(expert)}
                                                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${expert.name}&background=random`; }}
                                                alt={expert.name}
                                                className="w-10 h-10 rounded-full object-cover bg-slate-100"
                                            />
                                            <div>
                                                <div className="font-medium text-slate-900">{expert.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                                                    {expert.rating} ({expert.reviews})
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{expert.qualification}</td>
                                    <td className="px-6 py-4 text-slate-600">{expert.experience}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{expert.price}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${expert.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {expert.available ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openModal(expert)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(expert.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredExperts.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        No experts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingExpert ? "Edit Expert" : "Add New Expert"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                                    <input
                                        required
                                        value={formData.qualification}
                                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                                    <input
                                        required
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        placeholder="e.g. 10 Years"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                                    <input
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="e.g. ₹1500"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        max="5"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Reviews Count</label>
                                    <input
                                        type="number"
                                        value={formData.reviews}
                                        onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                                        <Upload className="w-4 h-4 text-slate-500" />
                                        <span className="text-sm text-slate-600">Choose File</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {selectedFile && <span className="text-sm text-slate-600">{selectedFile.name}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Languages (comma separated)</label>
                                <input
                                    value={formData.languages}
                                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                    placeholder="English, Hindi, Tamil"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization (comma separated)</label>
                                <input
                                    value={formData.specialization}
                                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                    placeholder="GST, Income Tax, Corporate Law"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                <textarea
                                    rows="3"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.available}
                                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="available" className="text-sm font-medium text-slate-700">Available for booking</label>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition shadow-sm shadow-indigo-200"
                                >
                                    {editingExpert ? "Update Expert" : "Create Expert"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
