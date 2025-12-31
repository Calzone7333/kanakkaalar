import React, { useEffect, useState } from 'react';
import { companyAPI } from '../../../../lib/api';
import { Building, Search, FileText, Download } from 'lucide-react';

export default function AdminCompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await companyAPI.getAllProfiles();
            setCompanies(res.data);
        } catch (err) {
            console.error("Failed to fetch companies", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.panNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registered Companies</h1>
                    <p className="text-gray-500 mt-1">View and manage all user company profiles</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
                            <tr>
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Incorporation</th>
                                <th className="px-6 py-4">Tax Info</th>
                                <th className="px-6 py-4">Balance Sheet</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Loading companies...
                                    </td>
                                </tr>
                            ) : filteredCompanies.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No companies found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredCompanies.map((company) => (
                                    <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <Building size={16} />
                                                </div>
                                                <span className="font-medium text-gray-900">{company.businessName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-medium">{company.user?.fullName || 'N/A'}</span>
                                                <span className="text-xs text-gray-500">{company.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                                                {company.businessType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.incorporationDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs">GST: {company.gstin || '-'}</span>
                                                <span className="text-xs">PAN: {company.panNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.balanceSheetUrl ? (
                                                <a
                                                    href={company.balanceSheetUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs font-medium"
                                                >
                                                    <FileText size={14} /> View
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Not uploaded</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
