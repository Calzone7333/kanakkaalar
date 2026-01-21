import React, { useState, useEffect } from "react";
import { userAPI } from "../lib/api";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Users2,
  TrendingUp,
  BarChart,
  ShoppingCart,
  FileText,
  Gift,
  Zap,
  Search,
  Bell,
  Settings,
  User,
  Menu,
  X,
  Building,
  MessageSquare,
  Layers // Added Layers
} from "lucide-react";

// ✅ Import getUser from your auth utility
import { getAuth } from "../lib/auth";



const AdminLayout = ({ children, logout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [userName, setUserName] = useState("Admin");
  const [userProfileImage, setUserProfileImage] = useState(null);
  const location = useLocation();

  // ✅ Load user info once
  useEffect(() => {
    const authData = getAuth();
    const user = authData?.user;
    if (user) {
      const name =
        user.fullName || user.name || user.email?.split("@")[0] || "Admin";
      setUserName(name);

      // If current user has a profile image stored as blob, fetch it
      (async () => {
        try {
          const resp = await userAPI.profileImage();
          const blob = resp.data;
          const url = URL.createObjectURL(blob);
          setUserProfileImage(url);
        } catch (e) {
          // ignore - keep default avatar
          setUserProfileImage(null);
        }
      })();
    }
  }, []);

  const navItems = [
    { path: "/dashboard/admin", label: "Dashboard", Icon: LayoutDashboard },
    {
      label: "CRM",
      Icon: Users,
      children: [
        { path: "/dashboard/admin/crm", label: "Dashboard", Icon: LayoutDashboard },
        { path: "/dashboard/admin/crm/customers", label: "Customers", Icon: Users },
        { path: "/dashboard/admin/crm/companies", label: "Companies", Icon: Building },
        { path: "/dashboard/admin/leads", label: "Leads", Icon: Zap },
        { path: "/dashboard/admin/deals", label: "Deals", Icon: Gift },
      ],
    },
    { path: "/dashboard/admin/attendance", label: "Attendance", Icon: Calendar },
    { path: "/dashboard/admin/chat", label: "Collaboration", Icon: MessageSquare },
    { path: "/dashboard/admin/employees", label: "Employees", Icon: Users2 },
    { path: "/dashboard/admin/agents", label: "Agents", Icon: User },
    { path: "/dashboard/admin/performance", label: "Performance", Icon: TrendingUp },
    { path: "/dashboard/admin/sales-reports", label: "Sales Reports", Icon: BarChart },
    { path: "/dashboard/admin/orders", label: "Orders", Icon: ShoppingCart },
    { path: "/dashboard/admin/services", label: "Services Hub", Icon: Layers }, // Added Services Hub
    { path: "/dashboard/admin/experts", label: "Experts", Icon: User },
    { path: "/dashboard/admin/reports", label: "Reports", Icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ item, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;
    const isChildActive = hasChildren && item.children.some(child => isActive(child.path));

    useEffect(() => {
      if (isChildActive) setIsOpen(true);
    }, [isChildActive]);

    if (hasChildren) {
      return (
        <div className="flex flex-col">
          <button
            onClick={() => {
              if (isSidebarExpanded) setIsOpen(!isOpen);
            }}
            className={`flex items-center py-2.5 rounded-md transition-all duration-200 text-[15px] w-full text-left
              ${isChildActive ? "text-white font-semibold" : "text-white hover:bg-[#046487]/80"}
              ${isSidebarExpanded ? "px-5 gap-3" : "px-0 gap-0 justify-center w-[52px] mx-auto"}
            `}
          >
            <item.Icon size={20} className="shrink-0" />
            <span
              className={`truncate flex-1 transition-opacity duration-200 ${isSidebarExpanded ? "opacity-100" : "opacity-0 h-0 hidden"}`}
            >
              {item.label}
            </span>
            {isSidebarExpanded && (
              <span className="text-xs ml-auto">{isOpen ? "▼" : "▶"}</span>
            )}
          </button>

          {/* Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${isOpen && isSidebarExpanded ? "max-h-96" : "max-h-0"}`}>
            {item.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                onClick={onClick}
                className={`flex items-center py-2 pl-12 pr-4 rounded-md transition-all duration-200 text-[14px]
                  ${isActive(child.path) ? "text-white font-bold bg-[#046487]" : "text-white/80 hover:text-white hover:bg-[#046487]/50"}
                `}
              >
                <child.Icon size={16} className="shrink-0 mr-2" />
                <span className="truncate">{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center py-2.5 rounded-md transition-all duration-200 text-[15px]
          ${isActive(item.path) ? "bg-[#046487] text-white font-semibold" : "text-white hover:bg-[#046487]/80"}
          ${isSidebarExpanded ? "px-5 gap-3" : "px-0 gap-0 justify-center w-[52px] mx-auto"}
        `}
      >
        <item.Icon size={20} className="shrink-0" />
        <span
          className={`truncate transition-opacity duration-200 ${isSidebarExpanded ? "opacity-100" : "opacity-0 h-0 hidden"}`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full bg-[#EFF2F7] overflow-hidden">
      {/* === SIDEBAR === */}
      <div
        className={`fixed lg:static top-[65px] inset-y-0 left-0 z-40 bg-[#0189BB] transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none mt-20
    ${isSidebarExpanded ? "w-[250px]" : "w-[130px]"}
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    rounded-tr-[45px]
  `}
      >

        {/* === SIDEBAR HEADER === */}
        <div className="relative flex flex-col items-center -mt-8 pb-4">
          {/* Avatar Circle */}
          <div
            className={`rounded-full bg-[#0189BB] flex items-center justify-center border-4 border-white shadow-md transition-all duration-300 overflow-hidden
              ${isSidebarExpanded ? "w-20 h-20" : "w-12 h-12"}
            `}
          >
            {userProfileImage ? (
              <img
                src={userProfileImage}
                alt="Profile"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <User
                color="white"
                strokeWidth={1.5}
                className={`transition-all duration-300 ${isSidebarExpanded ? "w-9 h-9" : "w-6 h-6"
                  }`}
              />
            )}
          </div>

          {/* 🧑 User Name Below Circle (Dynamic) */}
          <span
            className={`text-white font-semibold mt-2 transition-all duration-300 ${isSidebarExpanded ? "text-lg" : "text-sm"
              }`}
          >
            {userName}
          </span>

          {/* Divider line */}
          <div className="mt-4 w-[70%] h-px bg-white/40"></div>
        </div>

        {/* === NAVIGATION === */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
          <div className="flex flex-col gap-0.5 px-0 pt-4">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                item={item}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </div>
        </nav>

        {/* === SIDEBAR FOOTER === */}
        <div
          className={`mt-auto mb-6 pt-3 border-t border-white/30 space-y-4 transition-all duration-300 ${isSidebarExpanded ? "px-5" : "px-2"
            }`}
        >
          <Link
            to="/dashboard/admin/profile"
            className={`flex items-center text-white hover:opacity-80 transition-opacity text-[15px] ${isSidebarExpanded ? "gap-3" : "gap-0 justify-center"
              }`}
            onClick={() => setSidebarOpen(false)}
          >
            <User size={20} className="shrink-0" />
            <span
              className={`truncate transition-opacity duration-200 ${isSidebarExpanded ? "inline" : "hidden"
                }`}
            >
              Profile
            </span>
          </Link>

          <button
            onClick={logout}
            className={`flex items-center text-[#FF0000] hover:opacity-80 transition-opacity text-[15px] w-full ${isSidebarExpanded ? "gap-3" : "gap-0 justify-center"
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out shrink-0"
              style={{ color: "#FF0000" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span
              className={`truncate transition-opacity duration-200 ${isSidebarExpanded ? "inline" : "hidden"
                }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* === OVERLAY (MOBILE SIDEBAR) === */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === MAIN CONTENT === */}
      <div className="flex flex-col flex-1 w-full">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full h-[65px] px-4 sm:px-6 ">
          {/* Left Section (Menu) */}
          <div className="flex items-center gap-4">

            {/* Mobile Menu Button */}
            <button
              className="p-1 text-gray-700 hover:bg-gray-100 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              className="p-1 text-gray-700 hover:bg-gray-100 rounded-md hidden lg:block"
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Center Section (Search Bar) */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 w-[280px] sm:w-[340px] md:w-[420px] lg:w-[460px] text-[15px] mx-auto absolute left-1/2 transform -translate-x-1/2">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              className="w-full border-0 outline-none text-gray-500 placeholder-gray-400"
            />
          </div>

          {/* Right Section (Icons) */}
          <div className="flex items-center gap-4 pr-2">
            <Link to="/dashboard/admin/notifications" className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-[-4px] right-[-3px] h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </Link>
            <Settings size={20} className="text-gray-600 cursor-pointer" />
            {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0189BB] text-white cursor-pointer">
              <User size={16} />
            </div> */}
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 w-full h-full p-4 sm:p-6 md:p-8 overflow-y-auto mt-[65px]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
