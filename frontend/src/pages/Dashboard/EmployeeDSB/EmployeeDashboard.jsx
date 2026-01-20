import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  FunnelIcon,
  BriefcaseIcon,
  UsersIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { getAuth, clearAuth } from "@/lib/auth";
import { userAPI, notificationAPI } from "@/lib/api";

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const settingsRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const auth = getAuth();
      const userData = auth?.user;
      setEmployee(userData);

      if (userData?.hasProfileImage) {
        try {
          const res = await userAPI.profileImage();
          const url = URL.createObjectURL(res.data);
          setAvatarUrl(url);
        } catch (error) {
          console.error("Failed to load profile image", error);
        }
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // 10s Poll

    fetchProfileData();
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      const data = res.data?.notifications || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (e) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (e) {
      console.error("Failed to mark read");
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef, notifRef]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle user logout
  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("auth:update"));
    navigate("/");
  };

  // Sidebar menu configuration
  const menuItems = [
    { name: "Home", path: "/dashboard/employee", icon: HomeIcon },
    { name: "Task", path: "/dashboard/employee/tasks", icon: ClipboardDocumentListIcon },
    { name: "Attendance", path: "/dashboard/employee/attendance", icon: ClockIcon },
    { name: "Sales", path: "/dashboard/employee/sales", icon: CurrencyRupeeIcon },
    { name: "Reports", path: "/dashboard/employee/reports", icon: ChartBarIcon },
  ];

  const crmItems = [
    { name: "Leads", path: "/dashboard/employee/crm/leads", icon: FunnelIcon },
    { name: "Deals", path: "/dashboard/employee/crm/deals", icon: BriefcaseIcon },
    { name: "Customers", path: "/dashboard/employee/crm/customers", icon: UsersIcon },
    { name: "Companies", path: "/dashboard/employee/crm/companies", icon: BuildingOfficeIcon },
  ];

  const otherItems = [
    { name: "Collaboration", path: "/dashboard/employee/chat", icon: ChatBubbleLeftRightIcon },
    { name: "Calendar", path: "/dashboard/employee/calendar", icon: CalendarIcon },
  ];

  // Helper for Link Classes
  const getLinkClass = ({ isActive }) => {
    return `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 font-medium ${isActive
      ? "bg-white/10 text-white shadow-sm backdrop-blur-sm border border-white/5"
      : "text-indigo-100 hover:bg-white/5 hover:text-white"
      }`;
  };

  // Internal CSS for hiding the scrollbar
  const internalCss = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `;

  return (
    <>
      <style>{internalCss}</style>
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 font-sans">

        {/* ---- MOBILE SIDEBAR OVERLAY ---- */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ---- SIDEBAR ---- */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#5E33AC] to-[#4527A0] text-white shadow-2xl transform transition-transform duration-300 ease-out lg:static lg:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex h-full flex-col">

            {/* 1. Brand Logo Area */}
            <div className="flex h-20 shrink-0 items-center justify-between px-6 border-b border-white/10 bg-[#5E33AC]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <h1 className="text-xl font-bold tracking-wide">KANAKKAALAR</h1>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 rounded-md hover:bg-white/10"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 2. Scrollable Nav Area */}
            <div className="flex-1 overflow-y-auto py-6 scrollbar-hide space-y-8">

              {/* Profile Card (Sidebar Top) */}
              <div className="px-6 flex flex-col items-center">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                  <img
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${employee?.fullName || 'User'}&background=random&color=fff`}
                    alt="Profile"
                    className="relative h-20 w-20 rounded-full object-cover border-4 border-[#5E33AC]"
                  />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white tracking-tight">
                  {employee?.fullName || "Welcome Back"}
                </h2>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full mt-2">
                  Employee
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="px-2 space-y-1">
                {menuItems.map((item) => (
                  <NavLink key={item.name} to={item.path} end={item.path === "/dashboard/employee"} className={getLinkClass}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}

                {/* CRM Divider */}
                <div className="mt-6 mb-2 px-6">
                  <p className="text-xs font-bold text-indigo-200/60 uppercase tracking-widest">Growth & CRM</p>
                </div>

                {crmItems.map((item) => (
                  <NavLink key={item.name} to={item.path} className={getLinkClass}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}

                {/* Tools Divider */}
                <div className="mt-6 mb-2 px-6">
                  <p className="text-xs font-bold text-indigo-200/60 uppercase tracking-widest">Tools</p>
                </div>
                {otherItems.map((item) => (
                  <NavLink key={item.name} to={item.path} className={getLinkClass}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* 3. Sidebar Footer (Logout/Settings shorthand?) */}
            <div className="p-4 border-t border-white/10 bg-[#4e2a96]">
              <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-indigo-100 hover:bg-black/20 hover:text-white transition-all">
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>

          </div>
        </aside>

        {/* ---- MAIN CONTENT AREA ---- */}
        <div className="flex flex-1 flex-col w-full min-w-0 bg-gray-50">

          {/* Header */}
          <header className="sticky top-0 z-20 flex h-20 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden hover:text-indigo-600 transition"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator (Mobile) */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            {/* Search Bar */}
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 bg-transparent sm:text-sm"
                  placeholder="Search tasks, leads, or reports..."
                  type="search"
                  name="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </form>

              <div className="flex items-center gap-x-4 lg:gap-x-6">

                {/* Notification Bell */}
                <div className="relative" ref={notifRef} >
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 transition relative"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 z-30 mt-2.5 w-80 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-900/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 max-h-[400px] overflow-y-auto">
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                      </div>
                      <div className="divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500 text-sm">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 5).map(notif => (
                            <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                              <p className={`text-sm ${!notif.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile Dropdown */}
                <div className="relative" ref={settingsRef}>
                  <button
                    className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg transition"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${employee?.fullName || 'User'}&background=random`}
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {employee?.fullName || "Employee"}
                      </span>
                      <Cog6ToothIcon className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isSettingsOpen && (
                    <div className="absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{employee?.email || "user@example.com"}</p>
                      </div>

                      <NavLink
                        to="/dashboard/employee/profile"
                        className="block px-3 py-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 mx-1 rounded-md transition"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Your Profile
                      </NavLink>
                      <NavLink
                        to="/dashboard/employee/settings"
                        className="block px-3 py-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 mx-1 rounded-md transition"
                        onClick={() => setIsSettingsOpen(false)}
                      >
                        Settings
                      </NavLink>

                      <div className="mt-1 border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-3 py-2 text-sm leading-6 text-red-600 hover:bg-red-50 mx-1 rounded-md transition font-medium"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl animate-fade-in-up">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
