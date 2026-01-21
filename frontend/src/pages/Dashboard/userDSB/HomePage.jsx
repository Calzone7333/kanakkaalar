import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  PhoneIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ScaleIcon,
  TruckIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { getAuth } from "../../../lib/auth";
import { userAPI, orderAPI } from "../../../lib/api";
import "./HomePage.css";

// Banners Data
const BANNERS = [
  {
    id: 1,
    title: "Start Your Business",
    desc: "Register your Private Limited Company in just a few clicks.",
    bg: "bg-gradient-to-r from-blue-700 to-indigo-800",
    btnText: "Register Now",
    link: "/dashboard/user/servicehub"
  },
  {
    id: 2,
    title: "Tax Filing Made Easy",
    desc: "Seamless ITR filing with expert assistance.",
    bg: "bg-gradient-to-r from-emerald-600 to-green-700",
    btnText: "File ITR",
    link: "/dashboard/user/servicehub"
  },
  {
    id: 3,
    title: "Legal Compliance",
    desc: "Stay compliant with annual filings and legal support.",
    bg: "bg-gradient-to-r from-violet-600 to-purple-700",
    btnText: "Check Compliance",
    link: "/dashboard/user/compliances"
  }
];

// Quick Stats
const STATS = [
  { label: "Active Orders", value: "0", icon: <ShoppingBagIcon className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
  { label: "Pending Actions", value: "0", icon: <ClockIcon className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50" },
  { label: "Completed", value: "0", icon: <CheckBadgeIcon className="w-5 h-5 text-green-600" />, bg: "bg-green-50" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [stats, setStats] = useState({ active: 0, pending: 0, completed: 0 });

  useEffect(() => {
    const authData = getAuth();
    if (authData?.user) {
      setUser(authData.user);
      // Fetch fresher profile to get image if needed
      userAPI.getById(authData.user.id).then(res => {
        if (res.data) setUser(res.data);
      }).catch(() => { });
    }

    // Auto-scroll banners
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % BANNERS.length);
    }, 5000);

    // Fetch Stats (Mock logic for now, can be connected to API)
    orderAPI.myOrders().then(res => {
      const orders = res.data || [];
      setStats({
        active: orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length,
        pending: orders.filter(o => o.status === 'DOCUMENTS_PENDING' || o.status === 'PENDING_PAYMENT').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length
      });
    }).catch(err => console.error(err));

    return () => clearInterval(interval);
  }, []);

  const handleServiceClick = () => {
    navigate('/dashboard/user/servicehub');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">

      {/* 1. Nice Header with Greeting & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome back, <span className="text-[#2E96FF]">{user?.fullName || "User"}</span>!
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here is an overview of your business activities.</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3 min-w-[130px]">
              <div className={`p-2 rounded-md ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{idx === 0 ? stats.active : idx === 1 ? stats.pending : stats.completed}</p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Modern Hero Banner Carousel (Compact) */}
      <div className="relative group rounded-xl overflow-hidden shadow-lg h-[200px] md:h-[260px]">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? "opacity-100 z-10" : "opacity-0 z-0"
              } ${banner.bg}`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-12 text-white max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight drop-shadow-sm">
                {banner.title}
              </h2>
              <p className="text-sm md:text-base text-blue-50 mb-5 max-w-lg leading-relaxed drop-shadow-sm">
                {banner.desc}
              </p>
              <div>
                <button
                  onClick={() => navigate(banner.link)}
                  className="px-5 py-2 bg-white text-gray-900 text-sm rounded-md font-bold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  {banner.btnText}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Section Title */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
          Top Services
        </h2>
        <Link to="/dashboard/user/servicehub" className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
          View All <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {/* 4. Service Grid - Compact & Clean */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServiceCard
          title="GST Registration"
          desc="Get your GSTIN quickly & hassle-free."
          icon={<DocumentTextIcon className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          onClick={handleServiceClick}
        />
        <ServiceCard
          title="PVT LTD Registration"
          desc="Start your private limited company today."
          icon={<BuildingOfficeIcon className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
          onClick={handleServiceClick}
        />
        <ServiceCard
          title="ITR Filing"
          desc="Expert assisted Income Tax Return filing."
          icon={<ScaleIcon className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          onClick={handleServiceClick}
        />
        <ServiceCard
          title="FSSA Food License"
          desc="Apply for FoSCoS FSSAI license easily."
          icon={<ShoppingBagIcon className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
          onClick={handleServiceClick}
        />
        <ServiceCard
          title="Import Export Code"
          desc="Expand your business globally with IEC."
          icon={<TruckIcon className="w-6 h-6 text-teal-600" />}
          color="bg-teal-50"
          onClick={handleServiceClick}
        />
        <ServiceCard
          title="Trademark Registration"
          desc="Protect your brand identity securely."
          icon={<CheckBadgeIcon className="w-6 h-6 text-pink-600" />}
          color="bg-pink-50"
          onClick={handleServiceClick}
        />
      </div>

      {/* 5. Support / CTA Section */}
      <div className="bg-slate-900 rounded-xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-xl font-bold mb-2">Need Expert Consultation?</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our Chartered Accountants and Legal Experts are here to help you navigate through complex compliances.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/user/consult')}
          className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-blue-500/30 text-sm"
        >
          <PhoneIcon className="w-4 h-4" />
          <span>Talk to an Expert</span>
        </button>
      </div>

    </div>
  );
}

// Reusable Service Card Component
function ServiceCard({ title, desc, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden"
    >
      <div className={`p-3 rounded-lg ${color} transition-colors group-hover:scale-105 duration-300 shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-300">
        <ArrowRightIcon className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
