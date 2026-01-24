import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ShieldCheck,
  FolderOpen,
  Monitor,
  Calendar,
  BarChart2,
  Headphones,
  Menu as MenuIcon,
  User,
  LogOut,
  Settings,
  Bell,
  ShoppingBag,
  Building
} from "lucide-react";
import { clearAuth, getAuth } from "../../../lib/auth";
import { orderAPI, companyAPI } from "../../../lib/api";
import logo from "../../../assets1/img/kanakkaalar_logo.png";
import "./UserDashboard.css";



export default function UserDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const menuRef = useRef(null);
  const cartRef = useRef(null);
  const nav = useNavigate();
  const location = useLocation();

  // 1. Handle Logout Logic
  const handleLogout = () => {
    setMenuOpen(false);
    clearAuth();
    window.dispatchEvent(new Event("auth:update"));
    nav("/");
  };

  // 2. Handle My Account Navigation
  const handleMyAccount = () => {
    setMenuOpen(false);
    nav("/dashboard/user/profile");
  };

  const handleResumeOrder = (orderId) => {
    setCartOpen(false);
    nav(`/dashboard/user/service-order?orderId=${orderId}`);
  };

  useEffect(() => {
    // Load User Data
    const authData = getAuth();
    if (authData?.user) {
      setUser(authData.user);
    }

    // Load Profile Image
    (async () => {
      try {
        const resp = await (await import("../../../lib/api")).userAPI.profileImage();
        const blob = resp.data;
        if (blob instanceof Blob) {
          const url = URL.createObjectURL(blob);
          setUser((u) => ({ ...(u || {}), profileBlobUrl: url }));
        }
      } catch (e) {
        // Silent fail
      }
    })();

    // Fetch Pending Orders
    const fetchPendingOrders = async () => {
      try {
        const res = await orderAPI.myOrders();
        const allOrders = res.data || [];
        // Filter for DRAFT, DOCUMENTS_PENDING, or PENDING_PAYMENT
        const pending = allOrders.filter(o =>
          o.status === 'DRAFT' ||
          o.status === 'DOCUMENTS_PENDING' ||
          o.status === 'PENDING_PAYMENT'
        );
        setPendingOrders(pending);
      } catch (err) {
        console.warn("Failed to fetch pending orders", err);
      }
    };
    fetchPendingOrders();

    // Click Outside Listener
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (user?.profileBlobUrl) URL.revokeObjectURL(user.profileBlobUrl);
    };
  }, [location.pathname]); // Re-fetch on navigation might be good to update cart

  // Check Company Profile
  useEffect(() => {
    const checkCompanyProfile = async () => {
      try {
        await companyAPI.getProfile();
      } catch (err) {
        if (err.response?.status === 404) {
          nav("/company-setup");
        }
      }
    };

    if (user && user.role === 'USER') {
      checkCompanyProfile();
    }
  }, [user, nav]);

  const navItems = [
    { to: "/dashboard/user/home", label: "Home", icon: <Home size={18} /> },
    { to: "/dashboard/user/compliances", label: "Compliances", icon: <ShieldCheck size={18} /> },
    { to: "/dashboard/user/company", label: "Company", icon: <Building size={18} /> },
    { to: "/dashboard/user/documents", label: "Documents", icon: <FolderOpen size={18} /> },
    { to: "/dashboard/user/servicehub", label: "Service Hub", icon: <Monitor size={18} /> },
    { to: "/dashboard/user/my-orders", label: "My Orders", icon: <ShoppingBag size={18} /> },
    { to: "/dashboard/user/calendar", label: "Calendar", icon: <Calendar size={18} /> },
    // Reports removed as per request
    { to: "/dashboard/user/consult", label: "Consult", icon: <Headphones size={18} /> },
  ];

  const getCurrentLabel = () => {
    const currentItem = navItems.find((item) => location.pathname.startsWith(item.to));
    return currentItem ? currentItem.label : "Dashboard";
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        <div className="sidebar-logo">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => nav('/')}
          >
            <img src={logo} alt="Kanakkaalar" className="h-20 w-auto" />
          </div>
          {/* Mobile Close Button */}
          <button
            className="text-gray-400 hover:text-gray-600 lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <LogOut size={20} className="rotate-180" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              onClick={() => setMenuOpen(false)} // Close menu on click mobile
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <header className="dashboard-header">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuIcon size={24} />
            </button>


            <h1 className="header-title">{getCurrentLabel()}</h1>
          </div>

          <div className="header-actions">

            {/* --- PENDING ORDERS / CART --- */}
            <div className="relative" ref={cartRef}>
              <button
                className="header-icon-btn relative"
                onClick={() => setCartOpen(!cartOpen)}
                title="Pending Orders"
              >
                <ShoppingBag size={20} />
                {pendingOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingOrders.length}
                  </span>
                )}
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Pending Applications</h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{pendingOrders.length} items</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {pendingOrders.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No pending orders found.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {pendingOrders.map(order => (
                          <div
                            key={order.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer transition"
                            onClick={() => handleResumeOrder(order.id)}
                          >
                            <p className="font-medium text-gray-800 text-sm truncate">{order.serviceName}</p>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${order.status === 'PENDING_PAYMENT' ? 'text-orange-600 bg-orange-50' :
                                order.status === 'DOCUMENTS_PENDING' ? 'text-blue-600 bg-blue-50' :
                                  'text-gray-600 bg-gray-100'
                                }`}>
                                {order.status === 'PENDING_PAYMENT' ? 'Payment Pending' :
                                  order.status === 'DOCUMENTS_PENDING' ? 'Docs Uploaded' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {pendingOrders.length > 0 && (
                    <div className="p-2 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => { setCartOpen(false); nav('/dashboard/user/my-orders'); }}
                        className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-800 py-1"
                      >
                        View All Orders
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className="header-icon-btn"
              onClick={() => nav("/dashboard/user/notifications")}
              title="Notifications"
            >
              <Bell size={20} />
            </button>

            <button
              className="profile-image-btn"
              onClick={() => nav("/dashboard/user/profile")}
              title="Profile"
            >
              <div className="profile-placeholder">
                {user?.profileBlobUrl ? (
                  <img src={user.profileBlobUrl} alt="User" />
                ) : (
                  <User size={20} />
                )}
              </div>
            </button>
          </div>
        </header>

        <main className="content-container">
          <div className="content-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}