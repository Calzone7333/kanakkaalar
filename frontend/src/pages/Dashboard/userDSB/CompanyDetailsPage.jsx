import React, { useEffect, useState } from 'react';
import { companyAPI } from '../../../lib/api';
import { Building, FileText, CreditCard, Calendar } from 'lucide-react';

export default function CompanyDetailsPage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await companyAPI.getProfile();
                setProfile(res.data);
            } catch (err) {
                setError("Could not load company details.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading company details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!profile) return <div className="p-8 text-center text-slate-500">No company details found.</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">My Company Details</h1>

            {/* Business Details Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4 border-b pb-3 border-slate-100">
                    <Building className="text-[#003366]" size={24} />
                    <h2 className="text-lg font-semibold text-slate-700">Business Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Business Name</label>
                        <p className="text-slate-800 font-medium">{profile.businessName}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Business Type</label>
                        <p className="text-slate-800 font-medium">{profile.businessType}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Incorporation Date</label>
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                            <Calendar size={16} className="text-slate-400" />
                            {profile.incorporationDate}
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Registered Address</label>
                        <p className="text-slate-800 font-medium">{profile.registeredAddress}</p>
                    </div>
                </div>
            </div>

            {/* Compliance & Tax Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4 border-b pb-3 border-slate-100">
                    <FileText className="text-[#003366]" size={24} />
                    <h2 className="text-lg font-semibold text-slate-700">Compliance & Tax</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">GSTIN</label>
                        <p className="text-slate-800 font-medium">{profile.gstin || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">GST Username</label>
                        <p className="text-slate-800 font-medium">{profile.gstUsername || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">TAN Number</label>
                        <p className="text-slate-800 font-medium">{profile.tanNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">PAN Number</label>
                        <p className="text-slate-800 font-medium">{profile.panNumber}</p>
                    </div>
                </div>
            </div>

            {/* Financial Card */}
            <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-4 border-b pb-3 border-slate-100">
                    <CreditCard className="text-[#003366]" size={24} />
                    <h2 className="text-lg font-semibold text-slate-700">Financial Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Primary Bank</label>
                        <p className="text-slate-800 font-medium">{profile.primaryBankName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Current Balance</label>
                        <p className="text-slate-800 font-medium">₹ {profile.currentBalance || '0'}</p>
                    </div>
                    {profile.balanceSheetUrl && (
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Balance Sheet</label>
                            <a
                                href={profile.balanceSheetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors text-sm font-medium"
                            >
                                <FileText size={16} />
                                View Document
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
