import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Menu, ChevronDown, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, clearAuth } from "../lib/auth";
import { userAPI } from "../lib/api";
import logo from "../assets1/img/kanakkaalar_logo.png";
import headerShape from "../assets1/img/header-shape.svg";

// --- Navigation Data ---
const navLinks = [
  {
    id: 'consult',
    label: 'Consult an Expert',
    href: '/ConsultanExpert/talkToLawyer',
    dropdown: [
      { label: 'Talk to a Lawyer', href: '/ConsultanExpert/talkToLawyer' },
      { label: 'Talk to a Chartered Accountant', href: '/ConsultanExpert/talkToCA' },
      { label: 'Talk to a Company Secretary', href: '/ConsultanExpert/talkToCS' },

    ],
    dropdownWidth: 250,
  },
  {
    id: 'business',
    label: 'Business Setup',
    href: '/BusinessSetup/plc',
    isMegaMenu: true,
    dropdown: {
      'Company Registration': [
        { label: 'Private Limited Company', href: '/BusinessSetup/plc' },
        { label: 'Public Limited Company', href: '/BusinessSetup/public-ltd' },
        { label: 'Limited Liability Partnership', href: '/BusinessSetup/llp' },
        { label: 'One Person Company', href: '/BusinessSetup/opc' },
        { label: 'Sole Proprietorship', href: '/BusinessSetup/sp' },
        { label: 'Nidhi Company', href: '/BusinessSetup/nidhi' },
        { label: 'Producer Company', href: '/BusinessSetup/producer' },
        { label: 'Partnership Firm', href: '/BusinessSetup/partnership' },
        { label: 'Startup India Registration', href: '/BusinessSetup/startup' },
      ],
      'International Setup': [
        { label: 'US Incorporation', href: '/International/us' },
        { label: 'Singapore', href: '/International/singapore' },
        { label: 'UK Company', href: '/International/uk' },
        { label: 'Netherlands Incorporation', href: '/International/netherlands' },
        { label: 'Hong Kong Company', href: '/International/hong-kong' },
        { label: 'Dubai Company', href: '/International/dubai' },
        { label: 'International TM Registration', href: '/International/international-trademark' },
      ],
      'Licenses & Registrations': [
        { label: 'Digital Signature Certificate', href: '/Licenses/dsc' },
        { label: 'Udyam Registration', href: '/Licenses/udyam' },
        { label: 'MSME Registration', href: '/Licenses/msme' },
        { label: 'ISO Certification', href: '/Licenses/iso' },
        { label: 'FSSAI [Food License]', href: '/Licenses/fssai' },
        { label: 'IEC [Import/Export Code]', href: '/Licenses/iec' },
        { label: 'Apeda RCMC', href: '/Licenses/apeda-rcmc' },
        { label: 'Spice Board Registration', href: '/Licenses/spice-board' },
        { label: 'FIEO Registration', href: '/Licenses/fieo' },
        { label: 'Legal Metrology', href: '/Licenses/legal-metrology' },
        { label: 'Hallmark Registration', href: '/Licenses/hallmark' },
        { label: 'BIS Registration', href: '/Licenses/bis' },
        { label: 'Liquor License', href: '/Licenses/liquor' },
        { label: 'CLRA Registration & Licensing', href: '/Licenses/clra' },
        { label: 'AD Code Registration', href: '/Licenses/adcode' },
        { label: 'IRDAI Registration', href: '/Licenses/irdai' },
        { label: 'Drug & Cosmetic License', href: '/Licenses/drug-cosmetic' },
        { label: 'Customs Clearance', href: '/Licenses/customs-clearance' },
      ],
    },
    dropdownWidth: 750,
  },
  {
    id: 'fundraising',
    label: 'Fundraising',
    href: '/Fundraising',
    dropdown: [
      { label: 'Fundraising', href: '/Fundraising' },
      { label: 'Pitch Deck', href: '/Fundraising/pitch-deck' },
      { label: 'Business Loan', href: '/Fundraising/business-loan' },
      { label: 'DPR Service', href: '/Fundraising/dpr' },
    ],
    dropdownWidth: 200,
  },
  {
    id: 'ngo',
    label: 'NGO',
    href: '/NGO',
    isMegaMenu: true,
    dropdown: {
      'NGO Registration': [
        { label: 'NGO', href: '/NGO' },
        { label: 'Section 8 Company', href: '/NGO/section-8' },
        { label: 'Trust Registration', href: '/NGO/trust' },
        { label: 'Society Registration', href: '/NGO/society' },
      ],
      'NGO Compliance': [
        { label: 'NGO Compliance', href: '/NGO/compliance' },
        { label: 'Section 8 Compliance', href: '/NGO/section8' },
        { label: 'CSR-1 Filing', href: '/NGO/csr1' },
        { label: 'Sec.80G & Sec.12A', href: '/NGO/80g-12a' },
        { label: 'Darpan Registration', href: '/NGO/darpan' },
        { label: 'FCRA Registration', href: '/NGO/fcra' },
      ],
    },
    dropdownWidth: 500,
  },
];

// --- Desktop Components ---
const NavItem = ({ item, onMouseEnter, onMouseLeave }) => {
  const navItemRef = useRef(null);

  const handleMouseEnter = () => {
    if (navItemRef.current) {
      const rect = navItemRef.current.getBoundingClientRect();
      onMouseEnter(item.id, rect, item.dropdown, item.dropdownWidth, item.isMegaMenu);
    }
  };

  return (
    <li
      ref={navItemRef}
      className="relative h-full flex items-center px-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        to={item.href}
        className="font-medium text-slate-700 hover:text-[#1A7F7D] transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 text-sm lg:text-[15px] whitespace-nowrap"
      >
        {item.label}
      </Link>
    </li>
  );
};

const DropdownPortal = ({ content, position, width, isMegaMenu, onMouseEnter, onMouseLeave }) => {
  if (!content) return null;

  const renderContent = () => {
    if (isMegaMenu) {
      const columns = Object.keys(content);
      const gridCols = `repeat(${columns.length}, 1fr)`;
      return (
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "0" }}>
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
            .theme-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .theme-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .theme-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(26, 127, 125, 0.2); 
              border-radius: 4px;
            }
            .theme-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(26, 127, 125, 0.6);
            }
            .theme-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(26, 127, 125, 0.4) transparent;
            }
          `}</style>
          {columns.map((title, index) => (
            <div key={title} className={`flex flex-col px-8 ${index !== columns.length - 1 ? "border-r border-slate-50/80" : ""}`}>
              <h4 className="font-bold text-[11px] text-[#1A7F7D] uppercase tracking-[0.1em] mb-4 pb-2 border-b border-transparent">{title}</h4>
              <ul className={`
                list-none space-y-2 max-h-[calc(75vh-150px)] overflow-y-auto pr-2 -mr-2
                ${title === 'Licenses & Registrations' ? 'theme-scrollbar' : 'no-scrollbar'}
              `}>
                {content[title].map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="group flex items-center text-[13.5px] font-medium text-slate-600 hover:text-[#1A7F7D] transition-colors py-1">
                      <span className="w-1 h-1 rounded-full bg-slate-300 mr-2 group-hover:bg-[#1A7F7D] group-hover:scale-125 transition-all"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    return (
      <ul className="list-none space-y-1 p-2">
        {content.map(link => (
          <li key={link.label}>
            <Link to={link.href} className="flex items-center text-sm font-medium text-slate-600 hover:text-[#1A7F7D] hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all group">
              {link.label}
              <ArrowRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#1A7F7D]" />
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        maxWidth: '92vw',
        backgroundColor: 'white',
        boxShadow: '0 20px 40px -5px rgba(20, 25, 40, 0.1), 0 8px 15px -5px rgba(20, 25, 40, 0.04), 0 0 0 1px rgba(0,0,0,0.02)',
        borderRadius: '20px',
        padding: isMegaMenu ? '32px 0' : '8px',
        zIndex: 9999,
        border: '1px solid rgba(241, 245, 249, 1)',
        opacity: 1,
        animation: 'fadeIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }`}</style>
      {renderContent()}
    </div>,
    document.body
  );
};

// --- Mobile Components ---
const MobileSubMenu = ({ dropdown, isMegaMenu, onLinkClick }) => {
  if (!dropdown) return null;

  const renderLinks = (links) => (
    <ul className="list-none pl-4 space-y-3 mt-2 border-l-2 border-slate-100 ml-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="block text-[15px] text-slate-600 hover:text-[#1A7F7D]"
            onClick={onLinkClick} // Close menu on click
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (isMegaMenu) {
    return (
      <div className="mt-3 space-y-5 pl-2">
        {Object.keys(dropdown).map((category) => (
          <div key={category}>
            <h5 className="text-xs font-bold text-[#1A7F7D] uppercase tracking-wider mb-2">{category}</h5>
            {renderLinks(dropdown[category])}
          </div>
        ))}
      </div>
    );
  }

  return renderLinks(dropdown);
};

export default function Header() {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);

  // Desktop State
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuConfig, setMenuConfig] = useState({
    content: null,
    position: { top: 0, left: 0 },
    width: 0,
    isMegaMenu: false,
  });

  // Mobile State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState(null);

  // User State
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const lastScrollYRef = useRef(0);
  let leaveTimeout = useRef(null);

  // --- 0. Load User from Auth ---
  useEffect(() => {
    const authData = getAuth();
    if (authData && authData.user) {
      setUser(authData.user);

      // Load Profile Image matching Dashboard logic
      (async () => {
        try {
          const resp = await userAPI.profileImage();
          const blob = resp.data;
          if (blob instanceof Blob && blob.size > 0) {
            const url = URL.createObjectURL(blob);
            setUser(u => ({ ...u, profileBlobUrl: url }));
          }
        } catch (e) {
          // Silent fail
        }
      })();
    }

    // Cleanup blob URL
    return () => {
      if (user?.profileBlobUrl) URL.revokeObjectURL(user.profileBlobUrl);
    };
  }, []);

  // --- Close Profile Menu on Outside Click ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showProfileMenu && !e.target.closest('[data-profile-menu]')) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfileMenu]);

  // --- 1. Body Scroll Lock for Mobile ---
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // --- 2. Screen & Scroll Detection ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide/Show logic
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  // Active "Pill" design only when on Home AND at the top AND on Desktop
  const showFloatingHeader = isHomePage && !isScrolled && isDesktop;

  // --- Desktop Handlers ---
  const handleMenuEnter = (menuId, rect, content, width, isMegaMenu) => {
    clearTimeout(leaveTimeout.current);

    // Improved positioning logic
    const margin = 24;
    const verticalGap = showFloatingHeader ? 15 : 0; // Gap for floating header
    let left = rect.left;

    // Center mega menus relative to nav item if possible, or relative to page
    if (isMegaMenu) {
      // Logic for MegaMenus
      const screenWidth = window.innerWidth;
      const centeredLeft = (screenWidth - width) / 2;
      left = Math.max(margin, Math.min(centeredLeft, screenWidth - width - margin));
    } else {
      // Dropdowns aligned to left of nav item
      left = Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin));
    }

    setMenuConfig({
      content,
      position: { top: rect.bottom + verticalGap, left }, // Dynamic top based on element position
      width,
      isMegaMenu,
    });
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    leaveTimeout.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const handleDropdownEnter = () => {
    clearTimeout(leaveTimeout.current);
  };

  // --- Mobile Handlers ---
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false); // Explicit close
  const toggleMobileSubmenu = (id) => {
    setExpandedMobileItem(expandedMobileItem === id ? null : id);
  };

  // --- Profile Menu Handlers ---
  const closeProfileMenu = () => setShowProfileMenu(false);

  // --- Logout Handler ---
  const handleLogout = () => {
    clearAuth();
    setUser(null);
    closeProfileMenu();
    window.dispatchEvent(new Event("auth:update"));
    navigate("/");
  };

  return (
    <>
      <header
        className={`cs_site_header transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
          ${// Conditional classes for Floating vs Standard
          isMobileMenuOpen
            ? "!translate-y-0 !opacity-100 !rounded-none !top-0 !w-full !max-w-none"
            : showFloatingHeader
              ? "rounded-full shadow-2xl border border-slate-200/60 bg-white/90 backdrop-blur-md"
              : "bg-white shadow-sm border-b border-slate-100 rounded-none"
          } 
        `}
        style={{
          position: "fixed",
          // Conditional Styles
          top: isMobileMenuOpen ? 0 : (showFloatingHeader ? "20px" : "0"),
          left: isMobileMenuOpen ? 0 : "50%",
          transform: isMobileMenuOpen ? "none" : (
            // Always keep centered horizontally (translateX(-50%))
            // Add vertical translation if hidden
            showHeader
              ? "translateX(-50%)"
              : "translateX(-50%) translateY(-150%)"
          ),
          width: isMobileMenuOpen ? "100%" : (showFloatingHeader ? "94%" : "100%"),
          maxWidth: isMobileMenuOpen ? "100%" : (showFloatingHeader ? "1280px" : "100%"),
          zIndex: 9000,
          height: showFloatingHeader ? '80px' : '90px', // Standard height slightly taller
        }}
      >
        <div className={`w-full h-full px-4 sm:px-6 lg:px-8 ${showFloatingHeader ? "px-4 sm:px-8" : "max-w-[1440px] mx-auto"}`}>
          <div className="relative flex items-center justify-between h-full">

            {/* Shape (Desktop Only) - Maintain mostly for standard, maybe hide for floating if distracting */}
            <div className={`absolute top-0 left-0 hidden xl:block pointer-events-none opacity-40 ${showFloatingHeader ? "mix-blend-multiply" : ""}`}>
              {/* Optional shape overlay */}
              {!showFloatingHeader && <img src={headerShape} alt="" className="h-full object-cover" />}
            </div>

            {/* 1. Logo */}
            <div className="relative z-10 flex-shrink-0 flex items-center">
              <Link
                to="/"
                aria-label="Home"
                className="block"
                onClick={closeMobileMenu}
              >
                <img
                  src={logo}
                  alt="Kanakkaalar"
                  className={`${showFloatingHeader ? "h-16 md:h-20" : "h-20 md:h-24"} w-auto object-contain transition-all duration-500`}
                />
              </Link>
            </div>
            {/* 2. Desktop Nav */}
            <div className="hidden lg:flex flex-grow justify-center items-center h-full px-4">
              <ul className={`list-none flex items-center h-full transition-all duration-500 ${showFloatingHeader ? "gap-1 xl:gap-2" : "gap-1 xl:gap-4"}`}>
                {navLinks.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                  />
                ))}
              </ul>
            </div>

            {/* 3. Right Actions */}
            <div className="flex items-center gap-3 md:gap-4 z-10">

              {!user ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    to="/login"
                    className={`text-sm font-bold uppercase text-slate-700 hover:text-[#1A7F7D] transition-all hover:bg-slate-50
                      ${showFloatingHeader ? "px-5 py-2.5 rounded-full" : "px-4 py-2 rounded-lg"}
                    `}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`group relative flex items-center gap-2 text-sm font-bold uppercase overflow-hidden transition-all duration-300
                      ${showFloatingHeader
                        ? "px-6 py-3 bg-gradient-to-r from-[#1A7F7D] to-[#23938D] text-white rounded-full hover:shadow-lg hover:shadow-[#1A7F7D]/40 active:scale-95"
                        : "px-6 py-2.5 bg-[#1A7F7D] text-white rounded-full shadow-md hover:bg-[#156664] hover:scale-105 active:scale-95 hover:shadow-lg"
                      }
                    `}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started <ArrowRight size={16} />
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3 relative" data-profile-menu>
                  {/* Display Name Separately (Not Clickable) */}
                  <span className="text-sm font-semibold text-slate-700 max-w-[150px] truncate cursor-default">
                    {user.name || user.fullName || "User"}
                  </span>

                  {/* Profile Image Trigger (Clickable) */}
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center justify-center transition-transform hover:scale-105 focus:outline-none relative z-50"
                    data-profile-menu
                  >
                    {user.profileBlobUrl ? (
                      <img
                        src={user.profileBlobUrl}
                        alt={user.name || user.fullName}
                        className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      />
                    ) : user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name || user.fullName}
                        className="w-10 h-10 rounded-full object-cover shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A7F7D] to-[#23938D] text-white flex items-center justify-center text-sm font-bold shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        {(user.name || user.fullName || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to={user?.role ? `/dashboard/${user.role.toLowerCase()}` : "/dashboard"}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1A7F7D] transition-colors"
                        onClick={closeProfileMenu}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <div className="h-px bg-slate-100 my-0"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none z-50"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* --- Desktop Dropdown (Portal) --- */}
      {activeMenu && !isMobileMenuOpen && (
        <DropdownPortal
          content={menuConfig.content}
          position={menuConfig.position}
          width={menuConfig.width}
          isMegaMenu={menuConfig.isMegaMenu}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMenuLeave}
        />
      )}

      {/* --- Mobile Navigation Drawer --- */}
      <div
        className={`fixed inset-0 bg-white z-[8999] overflow-y-auto transition-transform duration-300 lg:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: "90px" }}
      >
        <div className="container mx-auto px-4 pb-20">
          <div className="flex flex-col space-y-2 mt-4">
            {navLinks.map((item) => (
              <div key={item.id} className="border-b border-slate-50 last:border-0">
                <button
                  onClick={() => toggleMobileSubmenu(item.id)}
                  className="w-full flex items-center justify-between py-4 text-left font-bold text-slate-800"
                >
                  <span className="text-lg">{item.label}</span>
                  <span className={`transform transition-transform duration-200 ${expandedMobileItem === item.id ? 'rotate-180 text-[#1A7F7D]' : 'text-slate-400'}`}>
                    <ChevronDown size={20} />
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out 
                  ${expandedMobileItem === item.id ? 'max-h-[1500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                >
                  <MobileSubMenu
                    dropdown={item.dropdown}
                    isMegaMenu={item.isMegaMenu}
                    onLinkClick={closeMobileMenu}
                  />
                </div>
              </div>
            ))}
          </div>

          {!user ? (
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <Link
                to="/login"
                className="flex items-center justify-center py-3.5 font-bold uppercase border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center justify-center py-3.5 font-bold text-white uppercase rounded-xl shadow-md bg-[#1A7F7D]"
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                {user.profileBlobUrl ? (
                  <img
                    src={user.profileBlobUrl}
                    alt={user.name || user.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name || user.fullName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#1A7F7D] text-white flex items-center justify-center text-lg font-bold">
                    {(user.name || user.fullName || "U")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-800">{user.name || user.fullName || "User"}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard/user/account"
                className="block w-full py-3 px-4 text-center text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
                onClick={closeMobileMenu}
              >
                My Account
              </Link>
              <Link
                to={user?.role ? `/dashboard/${user.role.toLowerCase()}` : "/dashboard"}
                className="block w-full py-3 px-4 text-center text-sm font-bold text-white rounded-xl bg-[#1A7F7D]"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-[8000] lg:hidden backdrop-blur-sm" onClick={toggleMobileMenu} aria-hidden="true" />
      )}
    </>
  );
}
