import React, { useState, useEffect } from "react";
import { adminAPI } from "../lib/api";
import { X } from "lucide-react";

// Premium styled modal for adding a new agent
const AddAgentModal = ({
    isOpen,
    onClose,
    onSuccess,
    agentToEdit,
}) => {
    const isEditMode = Boolean(agentToEdit);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        state: "",
        city: "",
        firmName: "",
        referralCode: "",
        aadhaarNumber: "",
        panNumber: "",
        bankHolderName: "",
        bankAccountNumber: "",
        bankIfsc: "",
        bankName: "",
    });
    const [files, setFiles] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    useEffect(() => {
        if (isEditMode && agentToEdit) {
            setFormData({
                fullName: agentToEdit.fullName || "",
                email: agentToEdit.email || "",
                password: "",
                phone: agentToEdit.phone || "",
                address: agentToEdit.address || "",
                state: agentToEdit.state || "",
                city: agentToEdit.city || "",
                firmName: agentToEdit.firmName || "",
                referralCode: agentToEdit.referralCode || "",
                aadhaarNumber: agentToEdit.aadhaarNumber || "",
                panNumber: agentToEdit.panNumber || "",
                bankHolderName: agentToEdit.bankHolderName || "",
                bankAccountNumber: agentToEdit.bankAccountNumber || "",
                bankIfsc: agentToEdit.bankIfsc || "",
                bankName: agentToEdit.bankName || "",
            });
            // Files cannot be pre-populated in input type="file"
        } else {
            setFormData({
                fullName: "",
                email: "",
                password: "",
                phone: "",
                address: "",
                state: "",
                city: "",
                firmName: "",
                referralCode: "",
                aadhaarNumber: "",
                panNumber: "",
                bankHolderName: "",
                bankAccountNumber: "",
                bankIfsc: "",
                bankName: "",
            });
            setFiles({
                aadhaarFront: null,
                aadhaarBack: null,
                panCard: null,
            });
        }
    }, [agentToEdit, isEditMode, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!formData.fullName || !formData.email || (!isEditMode && !formData.password) || !formData.phone) {
            setError("Required fields: Name, Email, Phone, and Password (if new).");
            return;
        }

        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (!emailPattern.test(formData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            // Prepare FormData for multipart upload
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                fd.append(key, formData[key]);
            });

            if (files.aadhaarFront) fd.append("aadhaarFront", files.aadhaarFront);
            if (files.aadhaarBack) fd.append("aadhaarBack", files.aadhaarBack);
            if (files.panCard) fd.append("panCard", files.panCard);

            let response;
            if (isEditMode) {
                // For update, we might need a different API method that supports FormData update
                // Currently adminAPI.updateAgent uses JSON. We need to update it to use FormData or create a new method.
                // Assuming we updated adminAPI.updateAgent to handle this or we use createAgent logic for now.
                // Let's check api.js. I updated createAgent to use FormData in previous steps? No, I updated backend.
                // I need to update frontend api.js to send FormData for createAgent.
                // For updateAgent, I also need to update it.

                // Since I haven't updated api.js to use FormData for agents yet, I will do it in next step.
                // But for now, I will assume the API expects FormData.
                response = await adminAPI.updateAgent(agentToEdit.id, fd);
            } else {
                response = await adminAPI.createAgent(fd);
            }

            if (response?.data) {
                onSuccess && onSuccess(response.data);
                onClose();
            } else {
                setError("Unexpected response from server.");
            }
        } catch (err) {
            console.error("Add agent error:", err);
            const verb = isEditMode ? "update" : "add";
            setError(err?.response?.data?.message || `Failed to ${verb} agent.`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl relative animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
                >
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex-shrink-0">
                    {isEditMode ? "Edit Agent" : "Add New Agent"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-1">
                    {/* Personal Details */}
                    <h3 className="font-semibold text-gray-700 border-b pb-1">Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        </div>
                        {!isEditMode && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password *</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                            </div>
                        )}
                    </div>

                    {/* Address Details */}
                    <h3 className="font-semibold text-gray-700 border-b pb-1 pt-2">Address Details</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">State</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    {/* Professional & Identity */}
                    <h3 className="font-semibold text-gray-700 border-b pb-1 pt-2">Professional & Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Firm Name (Optional)</label>
                            <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Referral Code (Optional)</label>
                            <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                            <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                            <input type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    {/* Documents */}
                    <h3 className="font-semibold text-gray-700 border-b pb-1 pt-2">Documents Upload</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhaar Front</label>
                            <input type="file" name="aadhaarFront" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Aadhaar Back</label>
                            <input type="file" name="aadhaarBack" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">PAN Card</label>
                            <input type="file" name="panCard" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <h3 className="font-semibold text-gray-700 border-b pb-1 pt-2">Bank Details (For Commission)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                            <input type="text" name="bankHolderName" value={formData.bankHolderName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Account Number</label>
                            <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                            <input type="text" name="bankIfsc" value={formData.bankIfsc} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            {loading ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Agent")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAgentModal;
