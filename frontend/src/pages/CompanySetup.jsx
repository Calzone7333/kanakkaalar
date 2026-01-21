import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../lib/api';
import { getAuth } from '../lib/auth';

export default function CompanySetup() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'Sole Proprietorship',
        incorporationDate: '',
        registeredAddress: '',
        gstin: '',
        gstUsername: '',
        tanNumber: '',
        primaryBankName: '',
        currentBalance: '',
        panNumber: '',
    });

    const [balanceSheet, setBalanceSheet] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setBalanceSheet(e.target.files[0]);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const auth = getAuth();
            if (!auth || !auth.token) {
                throw new Error("Not authenticated");
            }

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (balanceSheet) {
                data.append('balanceSheet', balanceSheet);
            }

            await companyAPI.setup(data);

            setMessage("Company setup successful!");
            setTimeout(() => {
                navigate('/dashboard/user');
            }, 1500);

        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to setup company");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 relative p-4">
            <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
                <h2 className="mb-2 text-3xl font-bold text-center text-[#003366]">Company Setup 🏢</h2>
                <p className="mb-8 text-sm text-center text-slate-500">
                    Let's get your business profile ready.
                </p>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative max-w-md mx-auto">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full"></div>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step >= 1 ? 'bg-[#003366] text-white ring-4 ring-blue-50' : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                    >
                        1
                    </div>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step >= 2 ? 'bg-[#003366] text-white ring-4 ring-blue-50' : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                    >
                        2
                    </div>
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${step >= 3 ? 'bg-[#003366] text-white ring-4 ring-blue-50' : 'bg-white border-2 border-slate-200 text-slate-400'
                            }`}
                    >
                        3
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                                <input
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
                                    placeholder="Enter your company name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Business Type</label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23003366%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-no-repeat bg-[right_1.5rem_center]"
                                >
                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    <option value="Private Limited">Private Limited</option>
                                    <option value="Partnership / LLP">Partnership / LLP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Incorporation</label>
                                <input
                                    type="date"
                                    name="incorporationDate"
                                    value={formData.incorporationDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Registered Address</label>
                                <textarea
                                    name="registeredAddress"
                                    value={formData.registeredAddress}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50 resize-none"
                                    placeholder="Full address of your business"
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-[#003366] text-white rounded-xl font-semibold shadow-md hover:bg-[#002244] transition-all active:scale-[0.98]"
                                >
                                    Next Step →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GSTIN Number <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50 uppercase"
                                    placeholder="GSTIN Number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GST Username</label>
                                <input
                                    name="gstUsername"
                                    value={formData.gstUsername}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
                                    placeholder="Username for API Access"
                                />
                            </div>

                            {formData.businessType === 'Private Limited' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TAN Number</label>
                                    <input
                                        name="tanNumber"
                                        value={formData.tanNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50 uppercase"
                                        placeholder="TAN Number"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 text-slate-600 font-medium hover:text-[#003366] transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-8 py-3 bg-[#003366] text-white rounded-xl font-semibold shadow-md hover:bg-[#002244] transition-all active:scale-[0.98]"
                                >
                                    Next Step →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Individual PAN <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleChange}
                                    required
                                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                                    title="Format: ABCDE1234F"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50 uppercase placeholder:normal-case"
                                    placeholder="ABCDE1234F"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Bank Name</label>
                                <input
                                    name="primaryBankName"
                                    value={formData.primaryBankName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
                                    placeholder="e.g. HDFC Bank"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        name="currentBalance"
                                        value={formData.currentBalance}
                                        onChange={handleChange}
                                        className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all bg-slate-50"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Balance Sheet</label>
                                <div className="relative border border-dashed border-slate-300 rounded-xl p-4 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="text-sm text-slate-500">
                                        {balanceSheet ? (
                                            <span className="text-[#003366] font-medium">{balanceSheet.name}</span>
                                        ) : (
                                            <>
                                                <span className="text-[#003366] font-medium">Click to upload</span> or drag and drop
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-2">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-6 py-3 text-slate-600 font-medium hover:text-[#003366] transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-[#003366] text-white rounded-xl font-semibold shadow-md hover:bg-[#002244] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Setting up...' : 'Finish Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {message && (
                    <div
                        className={`mt-6 p-3 rounded-lg text-sm text-center font-medium animate-pulse ${message.toLowerCase().includes("success")
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

