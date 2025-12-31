import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useUserAccount } from "../hooks/useUserAccount";

export default function Account() {
    const { 
        user, 
        isLoading, 
        isUpdating, 
        message, 
        profileImageUrl, 
        setProfileImageUrl, 
        updateProfile, 
        logout,
        setMessage
    } = useUserAccount();

    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ fullName: "", phone: "", password: "" });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Initialize form state when user data changes (e.g., on first load)
    useEffect(() => {
        if (user) {
            setForm({ fullName: user.fullName || user.name || "", phone: user.phone || "", password: "" });
        }
    }, [user]);

    const save = async (e) => {
        e?.preventDefault?.();
        
        const formData = new FormData();
        formData.append('fullName', form.fullName);
        formData.append('phone', form.phone);
        if (form.password) {
            formData.append('password', form.password);
        }
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile);
        }
        
        const { success, newImageUrl } = await updateProfile(formData);
        
        if (success) {
            if (newImageUrl) {
                // If there was an old database image, its URL can be revoked.
                if (profileImageUrl) {
                    try { URL.revokeObjectURL(profileImageUrl); } catch(e) {}
                }
                setProfileImageUrl(newImageUrl);
                setImagePreview(null); // The preview is now the main image, clear the preview state.
            }

            setEditing(false);
            setProfileImageFile(null); // Clear the selected file after successful upload
            setForm((f) => ({ ...f, password: "" })); 
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/svg+xml"];
            if (!allowedTypes.includes(file.type)) {
                setMessage("Invalid file type. Please select a PNG, JPG, or SVG image.");
                return;
            }
            // Clean up old preview if one exists
            if (imagePreview) {
                try { URL.revokeObjectURL(imagePreview); } catch (e) {}
            }
            setProfileImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Show a loading state until authentication is checked or user data is fetched.
    if (isLoading || !user) {
        return (
            <div className="max-w-3xl py-10 mx-auto">
                <div className="p-6 bg-white rounded shadow">
                    <h2 className="mb-4 text-xl font-semibold">My Account</h2>
                    <p className="text-sm text-slate-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl py-10 mx-auto">
            <div className="p-6 bg-white rounded shadow">
                <h2 className="flex items-center justify-between mb-4 text-xl font-semibold">
                    My Account 
                    { !editing && 
                        <button 
                            onClick={() => {
                                setEditing(true);
                                setMessage(null); // Clear any old messages
                            }} 
                            className="ml-4 text-sm text-[#003366] bg-white border border-[#003366] px-3 py-1 rounded hover:bg-[#003366] hover:text-white transition"
                        >
                            Edit
                        </button> 
                    }
                </h2>

                {message && (
                    <div 
                        className={`p-3 mb-4 text-sm border rounded ${
                            message.includes("Failed") || message.includes("Invalid") 
                            ? "text-red-700 border-red-200 bg-red-50" 
                            : "text-green-700 border-green-200 bg-green-50"
                        }`}
                    >
                        {message}
                    </div>
                )}

                {editing ? (
                    <form onSubmit={save} className="space-y-4">

                        {/* --- MODIFIED LAYOUT --- */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                            {/* Left side: Image upload */}
                            <div className="flex flex-col items-center flex-shrink-0 w-full sm:w-auto">
                                <label htmlFor="profile-image-upload" className="cursor-pointer">
                                    <img
                                        src={
                                            imagePreview || 
                                            profileImageUrl || "https://via.placeholder.com/100?text=Avatar"
                                        }
                                        alt="Profile Preview"
                                        // *** FIX HERE: Added 'object-top' ***
                                        className="object-cover object-top w-24 h-24 border-2 rounded-full border-slate-300"
                                    />
                                </label>
                                <input
                                    id="profile-image-upload"
                                    type="file"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={isUpdating}
                                />
                                <p className="mt-2 text-xs text-center text-slate-500">Click image to change</p>
                            </div>

                            {/* Right side: Form fields */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-600">Full Name</label>
                                    <input 
                                        value={form.fullName} 
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                                        className="w-full px-3 py-2 mt-1 border rounded" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600">Phone</label>
                                    <input 
                                        value={form.phone} 
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                                        className="w-full px-3 py-2 mt-1 border rounded" 
                                    />
                                </div>
                            </div>
                        </div>
                        {/* --- END MODIFIED LAYOUT --- */}


                        {/* Fields that remain full-width below */}
                        <div>
                            <label className="block text-sm text-slate-600">Email</label>
                            <input 
                                value={user.email} 
                                disabled 
                                className="w-full px-3 py-2 mt-1 border rounded cursor-not-allowed bg-slate-100" 
                            />
                            <p className="mt-1 text-xs text-slate-500">Email address cannot be changed here.</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm text-slate-600">New Password (optional)</label>
                            <input 
                                type="password" 
                                value={form.password} 
                                onChange={(e) => setForm({ ...form, password: e.Targe.value })} 
                                className="w-full px-3 py-2 mt-1 border rounded" 
                            />
                            <p className="mt-1 text-xs text-slate-500">Leave blank to keep current password.</p>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                            <button 
                                type="submit" 
                                disabled={isUpdating} 
                                className="bg-[#003366] text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-[#004488] transition"
                            >
                                {isUpdating ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => { 
                                    setEditing(false); 
                                    // Reset form to current user values
                                    setForm({ fullName: user.fullName || '', phone: user.phone || '', password: '' }); 
                                    setMessage(null); 
                                    setImagePreview(null); // Clear preview on cancel
                                    setProfileImageFile(null); // Clear file on cancel
                                }} 
                                className="px-4 py-2 transition border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="flex-shrink-0">
                                {profileImageUrl ? (
                                    <img
                                        src={profileImageUrl}
                                        alt="Profile"
                                        // *** FIX HERE: Added 'object-top' ***
                                        className="object-cover object-top w-24 h-24 border-2 rounded-full border-slate-200"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-24 h-24 bg-gray-100 border-2 rounded-full border-slate-200">
                                        <User size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="grid flex-1 grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-slate-500">Name</p>
                                    <p className="font-medium text-gray-800">{user.fullName || user.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Email</p>
                                    <p className="font-medium text-gray-800">{user.email}</p>
                                </div>
                                <div>
                                <p className="text-sm text-slate-500">Phone</p>
                                <p className="font-medium text-gray-800">{user.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Role</p>
                                <p className="font-medium text-gray-800">{user.role || "User"}</p>
                            </div>
                        </div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <button onClick={logout} className="px-4 py-2 text-white transition bg-red-600 rounded hover:bg-red-700">Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}