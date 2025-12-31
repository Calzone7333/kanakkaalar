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
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Company Setup</h1>

                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-700">Company Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Business Name</label>
                                <input
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Business Type</label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                >
                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    <option value="Private Limited">Private Limited</option>
                                    <option value="Partnership / LLP">Partnership / LLP</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Date of Incorporation / Start Date</label>
                                <input
                                    type="date"
                                    name="incorporationDate"
                                    value={formData.incorporationDate}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Registered Address</label>
                                <textarea
                                    name="registeredAddress"
                                    value={formData.registeredAddress}
                                    onChange={handleChange}
                                    rows="3"
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                ></textarea>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-[#003366] text-white px-6 py-2 rounded hover:bg-[#002244] transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-700">Compliance & Tax Setup</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">GSTIN Number (Optional if exempt)</label>
                                <input
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">GST Username (For API linkage)</label>
                                <input
                                    name="gstUsername"
                                    value={formData.gstUsername}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            {formData.businessType === 'Private Limited' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">TAN Number</label>
                                    <input
                                        name="tanNumber"
                                        value={formData.tanNumber}
                                        onChange={handleChange}
                                        className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="text-slate-600 hover:text-slate-800 px-4 py-2"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-[#003366] text-white px-6 py-2 rounded hover:bg-[#002244] transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-700">Financial Initialization</h2>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Individual PAN Number <span className="text-red-500">*</span></label>
                                <input
                                    name="panNumber"
                                    value={formData.panNumber}
                                    onChange={handleChange}
                                    required
                                    placeholder="ABCDE1234F"
                                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                                    title="PAN Number must be in the format ABCDE1234F"
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none uppercase"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Primary Bank Account Name</label>
                                <input
                                    name="primaryBankName"
                                    value={formData.primaryBankName}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Current/Opening Balance</label>
                                <input
                                    type="number"
                                    name="currentBalance"
                                    value={formData.currentBalance}
                                    onChange={handleChange}
                                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2 focus:ring-[#003366] focus:border-[#003366] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Upload Previous Year Balance Sheet</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#003366] hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="text-slate-600 hover:text-slate-800 px-4 py-2"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#003366] text-white px-6 py-2 rounded hover:bg-[#002244] transition-colors disabled:bg-slate-400"
                                >
                                    {loading ? 'Saving...' : 'Finish Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
