import React, { useState, useEffect } from "react";
import { orderAPI } from "../../../lib/api";
import DataTable from "../../../components/DataTable";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Assuming orderAPI.myOrders() returns orders created by the current user (agent)
            const res = await orderAPI.myOrders();
            setOrders(res.data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: "id", label: "Order ID", render: (val) => `#${val}` },
        { key: "serviceName", label: "Service" },
        { key: "customerEmail", label: "Customer" },
        { key: "totalAmount", label: "Amount", render: (val) => `₹${val}` },
        {
            key: "status",
            label: "Status",
            render: (val) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        val === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {val}
                </span>
            )
        },
        { key: "createdAt", label: "Date", render: (val) => new Date(val).toLocaleDateString() },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                <button
                    onClick={() => navigate('/servicehub')} // Navigate to service selection to create new order
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    New Order
                </button>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                searchPlaceholder="Search orders..."
            />
        </div>
    );
};

export default AgentOrders;
