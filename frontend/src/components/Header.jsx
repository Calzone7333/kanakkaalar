import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Menu, ChevronDown, ArrowRight, LogOut } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getAuth, clearAuth } from "../lib/auth";
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
      { label: 'Talk to an IP/Trademark Lawyer', href: '/ConsultanExpert/talkToIP' },
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
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: "32px" }}>
          <style>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
            
            /* Custom thin scrollbar for specific sections */
            .theme-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .theme-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .theme-scrollbar::-webkit-scrollbar-thumb {
              background-color: rgba(26, 127, 125, 0.4); /* Theme color #1A7F7D with opacity */
              border-radius: 4px;
            }
            .theme-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: rgba(26, 127, 125, 0.8);
            }
            .theme-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(26, 127, 125, 0.4) transparent;
            }
          `}</style>
          {columns.map(title => (
            <div key={title} className="flex flex-col">
              <h4 className="font-bold text-xs text-[#1A7F7D] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">{title}</h4>
              <ul className={`
                list-none space-y-2.5 max-h-[calc(80vh-150px)] overflow-y-auto pr-2
                ${title === 'Licenses & Registrations' ? 'theme-scrollbar' : 'no-scrollbar'}
              `}>
                {content[title].map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="block text-sm text-gray-600 hover:text-[#1A7F7D] hover:translate-x-1 transition-all duration-200">
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
      <ul className="list-none space-y-1">
        {content.map(link => (
          <li key={link.label}>
            <Link to={link.href} className="block text-sm text-gray-600 hover:text-[#1A7F7D] hover:bg-gray-50 px-3 py-2.5 rounded-lg transition-colors">
              {link.label}
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
        maxWidth: '95vw',
        backgroundColor: 'white',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1), 0 0 20px -5px rgba(0,0,0,0.05)',
        borderRadius: '0 0 16px 16px',
        padding: '24px 32px',
        zIndex: 9999,
        borderTop: '3px solid #1A7F7D',
        opacity: 1,
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
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
    }
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

  // --- 2. Scroll Detection ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 60) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Desktop Handlers ---
  const handleMenuEnter = (menuId, rect, content, width, isMegaMenu) => {
    clearTimeout(leaveTimeout.current);

    // Improved positioning logic
    const margin = 24;
    const headerHeight = 84; // Slightly taller header allowance
    let left = rect.left;

    // Center mega menus relative to nav item if possible, or relative to page
    if (isMegaMenu) {
      // Logic for MegaMenus - typically wider, so ensure they fit on screen
      const screenWidth = window.innerWidth;
      const centeredLeft = (screenWidth - width) / 2;

      // Use constrained centered position
      left = Math.max(margin, Math.min(centeredLeft, screenWidth - width - margin));
    } else {
      // Dropdowns aligned to left of nav item
      left = Math.max(margin, Math.min(rect.left, window.innerWidth - width - margin));
    }

    setMenuConfig({
      content,
      position: { top: 90, left }, // Fixed top matching header height
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
        className={`cs_site_header bg-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
          ${isMobileMenuOpen ? "translate-y-0" : ""} 
        `}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 9000,
          height: '90px',
          boxShadow: showHeader ? "0 4px 20px rgba(0,0,0,0.04)" : "none",
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="relative flex items-center justify-between h-full">

            {/* Shape (Desktop Only) */}
            <div className="absolute top-0 left-0 hidden xl:block pointer-events-none opacity-40">
              <img src={headerShape} alt="" className="h-full object-cover" />
            </div>

            {/* 1. Logo */}
            <div className="relative z-10 flex-shrink-0 flex items-center">
              <Link
                to="/"
                aria-label="Home"
                className="block"
                onClick={closeMobileMenu}
              >
                <img src={logo} alt="Kanakkaalar" className="h-16 md:h-20 w-auto object-contain" />
              </Link>
            </div>
            {/* 2. Desktop Nav */}
            <div className="hidden lg:flex flex-grow justify-center items-center h-full px-4">
              <ul className="list-none flex items-center gap-1 xl:gap-4 h-full">
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
                    className="text-sm font-bold uppercase text-slate-700 hover:text-[#1A7F7D] px-4 py-2 transition-colors rounded-lg hover:bg-slate-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative flex items-center gap-2 px-6 py-2.5 bg-[#1A7F7D] text-white text-sm font-bold uppercase rounded-full overflow-hidden transition-all hover:bg-[#156664] hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started <ArrowRight size={16} />
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-4 relative" data-profile-menu>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                    data-profile-menu
                  >
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A7F7D] to-[#23938D] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {(user.name || user.fullName || "U")[0].toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfileMenu ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name || user.fullName || "User"}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard/user/account"
                        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1A7F7D] transition-colors"
                        onClick={closeProfileMenu}
                      >
                        Account Settings
                      </Link>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1A7F7D] transition-colors"
                        onClick={closeProfileMenu}
                      >
                        Dashboard
                      </Link>
                      <div className="h-px bg-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
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
                to="/dashboard"
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
