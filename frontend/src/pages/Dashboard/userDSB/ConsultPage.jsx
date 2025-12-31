import React, { useState, useEffect } from "react";
import { expertAPI } from "../../../lib/api";
import {
  Star,
  Clock,
  Globe,
  Video,
  Phone,
  MessageSquare,
  CheckCircle,
  Search,
  Filter,
  MapPin,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

export default function ConsultPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Chartered Accountant", "Company Secretary", "Legal Advisor", "Tax Consultant"];

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
    const baseUrl = 'http://115.97.59.230:8081'; // Force IP as requested
    return `${baseUrl}/api/experts/${expert.id}/image`;
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-gray-50/50 space-y-8">

      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Talk to an Expert</h1>
          <p className="text-indigo-100 text-lg mb-6">
            Get professional advice from top Chartered Accountants, Company Secretaries, and Legal Advisors via video or audio call.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, expertise (e.g., GST, Startup)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Experts Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <div key={expert.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">

              {/* Card Header */}
              <div className="p-6 border-b border-slate-50">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={getImageUrl(expert)}
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${expert.name}&background=random`; }}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full bg-slate-100 object-cover border-2 border-white shadow-sm"
                    />
                    {expert.available && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 text-lg">{expert.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-xs font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-current" />
                        {expert.rating}
                      </div>
                    </div>
                    <p className="text-indigo-600 font-medium text-sm">{expert.qualification}</p>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                      <Briefcase className="w-3 h-3" />
                      {expert.experience} Exp
                    </div>
                  </div>
                </div>

                {/* Specialization Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {expert.specialization && expert.specialization.map(spec => (
                    <span key={spec} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-md font-medium border border-slate-100">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{expert.languages && expert.languages.join(", ")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 bg-green-50 rounded-xl text-center">
                    <p className="text-xs text-green-600 font-medium uppercase">Consultation</p>
                    <p className="text-green-700 font-bold">{expert.price}<span className="text-xs font-normal">/30min</span></p>
                  </div>
                  <div className="flex-1 p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-medium uppercase">Next Available</p>
                    <p className="text-slate-700 font-bold">Today, 4 PM</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                    <Video className="w-4 h-4" />
                    Book Video
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    <Phone className="w-4 h-4" />
                    Audio Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredExperts.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No experts found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
