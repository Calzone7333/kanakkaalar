import React, { useState, useEffect } from "react";
import { walletAPI } from "../../../lib/api";
import StatCard from "../../../components/StatCard";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

const AgentWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [walletRes, txRes] = await Promise.all([
                    walletAPI.getWallet(),
                    walletAPI.getTransactions()
                ]);
                setWallet(walletRes.data);
                setTransactions(txRes.data || []);
            } catch (error) {
                console.error("Failed to fetch wallet data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading wallet...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-blue-100 font-medium">Total Balance</span>
                    <Wallet className="w-6 h-6 text-blue-200" />
                </div>
                <div className="text-4xl font-bold mb-2">
                    ₹{wallet?.balance?.toLocaleString() || "0.00"}
                </div>
                <div className="text-sm text-blue-200">
                    Last updated: {new Date(wallet?.updatedAt).toLocaleString()}
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'CREDIT'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {tx.type === 'CREDIT' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        {tx.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium text-right ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {tx.type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No transactions yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AgentWallet;
