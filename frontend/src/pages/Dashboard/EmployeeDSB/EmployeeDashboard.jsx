import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getAuth, clearAuth } from "@/lib/auth";
import { userAPI } from "@/lib/api";




export default function Dashboard() {
  const [employee, setEmployee] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const settingsRef = useRef(null);

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

    fetchProfileData();
  }, []);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsRef]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("auth:update"));
    navigate("/");
  };

  // Sidebar menu items
  // Added a 'path' property to each item for routing
  const menuItems = [
    { name: "Home", path: "/dashboard/employee", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/1tiea0ff_expires_30_days.png" },
    { name: "Task", path: "/dashboard/employee/tasks", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/nftk4cn0_expires_30_days.png" },
    { name: "Attendance", path: "/dashboard/employee/attendance", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/8i5hdmtf_expires_30_days.png" },
    { name: "Sales", path: "/dashboard/employee/sales", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/gs83arzr_expires_30_days.png" },
    { name: "Reports", path: "/dashboard/employee/reports", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/61zpjsff_expires_30_days.png" },
  ];

  const crmItems = [
    { name: "Leads", path: "/dashboard/employee/crm/leads", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/nftk4cn0_expires_30_days.png" },
    { name: "Deals", path: "/dashboard/employee/crm/deals", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/gs83arzr_expires_30_days.png" },
    { name: "Customers", path: "/dashboard/employee/crm/customers", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/yig4meo6_expires_30_days.png" },
    { name: "Companies", path: "/dashboard/employee/crm/companies", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/sf0ehoxm_expires_30_days.png" },
  ];

  const otherItems = [
    { name: "Calendar", path: "/dashboard/employee/calendar", icon: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/4l6p6d26_expires_30_days.png" },
  ];

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
      <div className="flex h-screen w-full overflow-hidden bg-gray-100">

        {/* ---- MOBILE SIDEBAR OVERLAY ---- */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* ---- SIDEBAR ---- */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-[260px] transform bg-[#5E33AC] shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Added 'scrollbar-hide' class to conceal the scrollbar visually */}
          <div className="flex h-full flex-col overflow-y-auto p-6 scrollbar-hide relative">

            {/* Close Button (Mobile Only) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-white lg:hidden hover:bg-white/10 rounded-full p-1 transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Profile Section */}
            <div className="mb-10 flex flex-col items-center text-center">
              {/* --- PROFILE IMAGE --- */}
              <img
                src={avatarUrl || "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/wubvUxErdY/wgo6e9kp_expires_30_days.png"}
                alt="Profile"
                className="h-20 w-20 rounded-full border-2 border-white object-cover shadow-md"
              />
              {/* --- EMPLOYEE NAME --- */}
              <h2 className="mt-3 text-lg font-semibold text-white">
                {employee?.fullName || "Employee Name"}
              </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/dashboard/employee"}
                  className={({ isActive }) =>
                    `flex items-center cursor-pointer transition-all duration-200 rounded-2xl ${isActive ? "bg-white/20 px-5 py-3" : "px-3 py-2 hover:bg-white/10"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img src={item.icon} alt={item.name} className="w-[28px] h-[28px] mr-4" />
                      <span
                        className={`text-lg font-semibold ${isActive ? "text-white" : "text-gray-200"
                          }`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* CRM Section */}
              <div className="pt-4">
                <div className="px-3 pb-2">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">CRM</span>
                </div>
                {crmItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center cursor-pointer transition-all duration-200 rounded-2xl ${isActive ? "bg-white/20 px-5 py-3" : "px-3 py-2 hover:bg-white/10"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <img src={item.icon} alt={item.name} className="w-[28px] h-[28px] mr-4" />
                        <span
                          className={`text-lg font-semibold ${isActive ? "text-white" : "text-gray-200"
                            }`}
                        >
                          {item.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Other Items */}
              {otherItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center cursor-pointer transition-all duration-200 rounded-2xl ${isActive ? "bg-white/20 px-5 py-3" : "px-3 py-2 hover:bg-white/10"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <img src={item.icon} alt={item.name} className="w-[28px] h-[28px] mr-4" />
                      <span
                        className={`text-lg font-semibold ${isActive ? "text-white" : "text-gray-200"
                          }`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* ---- MAIN CONTENT AREA ---- */}
        <div className="flex flex-1 flex-col w-full min-w-0">
          {/* Header: Search + Profile */}
          <header className="flex flex-shrink-0 items-center justify-between border-b bg-white p-4 px-6 gap-4">

            <div className="flex items-center gap-4 flex-1">

              {/* Hamburger Menu (Mobile) */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-500 lg:hidden hover:text-gray-800 transition"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Left side: Search Box */}
              <div className="relative w-full max-w-[450px] hidden sm:block">
                <input
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-12 pr-5 text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
                />

                {/* Search Icon */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149852.png"
                    alt="search"
                    className="w-5 opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Actions & Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button className="relative text-gray-500 transition hover:text-gray-800">
                <BellIcon className="h-6 w-6" />
                {/* Notification dot */}
                <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
              </button>

              {/* Settings Dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="text-gray-500 transition hover:text-gray-800"
                >
                  <Cog6ToothIcon className="h-6 w-6" />
                </button>

                {/* Dropdown Menu */}
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <NavLink
                      to="/dashboard/employee/profile" // Assuming this is your profile route
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                      My Account
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ---- SCROLLABLE CONTENT ---- */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
