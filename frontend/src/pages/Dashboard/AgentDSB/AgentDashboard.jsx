import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Wallet,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    Search,
    Bell
} from "lucide-react";
import { clearAuth } from "../../../lib/auth";

const AgentDashboard = ({ user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Your specific functional menu items
    const menuItems = [
        { path: "/dashboard/agent", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { path: "/dashboard/agent/wallet", label: "My Wallet", icon: <Wallet size={20} /> },
        { path: "/dashboard/agent/orders", label: "My Orders", icon: <FileText size={20} /> },
        { path: "/dashboard/agent/profile", label: "Profile", icon: <User size={20} /> },
    ];

    const handleLogout = () => {
        clearAuth();
        window.dispatchEvent(new Event("auth:update"));
        navigate("/");
    };

    return (
        <div className="flex h-screen bg-[#F5F5F5]">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:relative lg:translate-x-0 flex flex-col`}
            >
                {/* Logo Area */}
                <div className="flex items-center h-24 px-8">
                    <span className="text-2xl font-black text-gray-900 tracking-wide">LOGO</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-gray-500">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2 flex-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-6 py-3.5 rounded-xl transition-all duration-200 font-medium ${isActive
                                        ? "bg-[#FDBA74] text-white shadow-md shadow-orange-100" // Active: Orange BG, White Text
                                        : "text-gray-600 hover:bg-gray-50 hover:text-orange-500" // Inactive: Gray Text
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom (Logout) */}
                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Header - Styled to match image (Transparent/Light BG with Search & Profile) */}
                <header className="flex items-center justify-between h-24 px-8 bg-[#F5F5F5] lg:bg-[#F5F5F5]">
                    
                    {/* Mobile Menu Toggle & Search Bar */}
                    <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500">
                            <Menu size={24} />
                        </button>

                        {/* Search Bar (Rounded White Pill) */}
                        <div className="relative hidden md:block w-96">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                <Search size={20} />
                            </span>
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white rounded-full border-none focus:ring-2 focus:ring-orange-200 shadow-sm outline-none"
                            />
                        </div>
                    </div>

                    {/* Right Side: Profile & Notifications */}
                    <div className="flex items-center gap-6">
                        {/* Notification Bell */}
                        <button className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User Profile Info */}
                        <div className="flex items-center gap-3">
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-bold text-gray-900 uppercase">
                                    {user?.fullName || "Agent User"}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
                                {/* Placeholder Avatar */}
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold">
                                    {user?.fullName?.charAt(0) || "A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AgentDashboard;