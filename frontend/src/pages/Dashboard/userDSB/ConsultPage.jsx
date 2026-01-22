import React, { useState, useEffect } from "react";
import api, { expertAPI } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Globe,
  Video,
  Phone,
  Search,
  Briefcase,
  BadgeCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function ConsultPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", ...new Set(experts.map(expert => expert.qualification).filter(Boolean))];

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await expertAPI.getAll();
        setExperts(res.data);
      } catch (error) {
        console.error("Failed to fetch experts", error);
        toast.error("Failed to load experts");
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(expert => {
    const matchesCategory = activeCategory === "All" || expert.qualification === activeCategory;
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expert.specialization && expert.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const getImageUrl = (expert) => {
    // Use the dynamic base URL from the API configuration
    // Fallback to the production IP if undefined, though api.js should set it.
    const baseUrl = api.defaults.baseURL || 'http://192.168.1.2:8081/api';
    return `${baseUrl} /experts/${expert.id}/image`;
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50/50 space-y-8">

      {/* Header Section */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Talk to an Expert</h1>
          <p className="text-slate-300 text-base mb-8 max-w-lg leading-relaxed">
            Get instant professional advice from top Chartered Accountants, Company Secretaries, and Legal Advisors via secure video or audio calls.
          </p>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, expertise (e.g., GST, Startup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/20 backdrop-blur-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${activeCategory === cat
              ? "bg-[#0f172a] text-white border-[#0f172a] shadow-md"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experts Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium"> Finding the best experts for you...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {filteredExperts.map((expert) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={expert.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group overflow-hidden flex flex-col h-full"
              >
                <div className="p-4 md:p-5 flex flex-col h-full">
                  {/* Header: Avatar & Main Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0 pt-0.5">
                      <img
                        src={getImageUrl(expert)}
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${expert.name}&background=f1f5f9&color=64748b` }}
                        alt={expert.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                      />
                      {expert.available && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-sm">
                          <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-[15px] leading-tight group-hover:text-indigo-600 transition-colors mb-1 truncate" title={expert.name}>
                        {expert.name}
                      </h3>
                      <p className="text-indigo-600 font-medium text-xs flex items-center mb-2 truncate">
                        {expert.qualification}
                        <BadgeCheck className="w-3.5 h-3.5 ml-1 text-blue-500 shrink-0" />
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-medium">
                        <span className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                          <Briefcase className="w-3 h-3 text-slate-400" /> {expert.experience}
                        </span>
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">
                          <Star className="w-3 h-3 fill-current" /> {expert.rating} {expert.reviews > 0 && <span className="text-amber-600/70 ml-0.5">({expert.reviews})</span>}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialization Points */}
                  <div className="flex flex-col gap-0.5 mb-1 pt-0.5">
                    {expert.specialization?.slice(0, 3).map((spec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0"></div>
                        <span className="text-[10px] text-slate-600 font-medium truncate">{spec}</span>
                      </div>
                    ))}
                    {(expert.specialization?.length || 0) > 3 && (
                      <div className="pl-3 text-[9px] text-indigo-500 font-medium">
                        +{(expert.specialization?.length || 0) - 3} more
                      </div>
                    )}
                  </div>

                  <div className="mt-auto"></div>
                  <div className="border-t border-dashed border-slate-100 my-1"></div>

                  {/* Footer */}
                  <div className="pt-0 space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Consultation Fee</p>
                      <div className="flex items-baseline">
                        <span className="text-sm md:text-[15px] font-bold text-slate-900">{expert.price}</span>
                        <span className="text-[10px] text-slate-400 font-medium ml-1">/ 30m</span>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 bg-[#003366] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#002244] transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]">
                      <Video className="w-4 h-4 text-white/90" /> Book Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filteredExperts.length === 0 && (
        <div className="text-center py-12 md:py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No experts matched</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">Try changing your filters or searching for a different qualification.</p>
          <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-wide">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
