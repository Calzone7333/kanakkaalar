import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  UserPlusIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const LeadCard = ({ lead }) => {
  const statusColors = {
    New: "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Qualified: "bg-green-100 text-green-800",
    Lost: "bg-red-100 text-red-800",
    Won: "bg-emerald-100 text-emerald-800",
  };

  const priorityColors = {
    High: "border-red-500",
    Medium: "border-yellow-500",
    Low: "border-blue-500",
  };

  return (
    <div
      className={`bg-white rounded-lg border-l-4 ${priorityColors[lead.priority] || "border-gray-300"} shadow-md hover:shadow-lg transition p-6`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
          <p className="text-sm text-gray-600">{lead.company}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.status] || "bg-gray-100"}`}
        >
          {lead.status}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
          <a href={`mailto:${lead.email}`} className="hover:text-indigo-600">
            {lead.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <PhoneIcon className="w-4 h-4 text-gray-400" />
          <a href={`tel:${lead.phone}`} className="hover:text-indigo-600">
            {lead.phone}
          </a>
        </div>
        {lead.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-gray-400" />
            <span>{lead.location}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Interest</p>
        <p className="text-sm text-gray-700 font-medium">
          {lead.serviceInterest}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">Est. Value</p>
        <p className="text-lg font-bold text-green-600">
          ₹{lead.estimatedValue.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/dashboard/crm/leads/${lead.id}`}
          className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center text-sm font-medium transition"
        >
          View Details
        </Link>
        <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm">
          +Convert
        </button>
      </div>
    </div>
  );
};

const LeadFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    service: "all",
  });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Service
          </label>
          <select
            value={filters.service}
            onChange={(e) => handleChange("service", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Services</option>
            <option value="GST">GST Registration</option>
            <option value="Trademark">Trademark Filing</option>
            <option value="Company">Company Registration</option>
            <option value="Compliance">Annual Compliance</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default function LeadManagementPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockLeads = [
      {
        id: 1,
        name: "Rajesh Kumar",
        company: "Tech Startups Inc",
        email: "rajesh@techstartups.com",
        phone: "+91-9876543210",
        location: "Bangalore",
        status: "Qualified",
        priority: "High",
        serviceInterest: "GST Registration",
        estimatedValue: 4999,
      },
      {
        id: 2,
        name: "Priya Sharma",
        company: "Fashion Retail Ltd",
        email: "priya@fashionretail.com",
        phone: "+91-8765432109",
        location: "Mumbai",
        status: "In Progress",
        priority: "High",
        serviceInterest: "Trademark Filing",
        estimatedValue: 5999,
      },
      {
        id: 3,
        name: "Amit Patel",
        company: "Manufacturing Corp",
        email: "amit@manufacturing.com",
        phone: "+91-7654321098",
        location: "Ahmedabad",
        status: "New",
        priority: "Medium",
        serviceInterest: "Company Registration",
        estimatedValue: 9999,
      },
      {
        id: 4,
        name: "Neha Singh",
        company: "Consulting Services",
        email: "neha@consulting.com",
        phone: "+91-6543210987",
        location: "Delhi",
        status: "Won",
        priority: "Low",
        serviceInterest: "Annual Compliance",
        estimatedValue: 14999,
      },
    ];

    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
    setLoading(false);
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = leads;

    if (filters.status !== "all") {
      filtered = filtered.filter((lead) => lead.status === filters.status);
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter((lead) => lead.priority === filters.priority);
    }

    if (filters.service !== "all") {
      filtered = filtered.filter((lead) =>
        lead.serviceInterest.includes(filters.service),
      );
    }

    setFilteredLeads(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lead Management
            </h1>
            <p className="text-gray-600 mt-2">
              Track and manage your sales pipeline
            </p>
          </div>
          <Link
            to="/dashboard/crm/leads/new"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            <UserPlusIcon className="w-5 h-5" />
            New Lead
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Leads", value: leads.length, color: "from-blue-500" },
          {
            label: "Qualified",
            value: leads.filter((l) => l.status === "Qualified").length,
            color: "from-green-500",
          },
          {
            label: "In Progress",
            value: leads.filter((l) => l.status === "In Progress").length,
            color: "from-yellow-500",
          },
          {
            label: "Won This Month",
            value: leads.filter((l) => l.status === "Won").length,
            color: "from-emerald-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} to-purple-600 rounded-lg shadow-lg p-6 text-white`}
          >
            <p className="text-sm font-semibold opacity-90 mb-1">
              {stat.label}
            </p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <LeadFilters onFilterChange={handleFilterChange} />

      {/* Leads Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Loading leads...</div>
      ) : filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No leads found matching your filters</p>
        </div>
      )}
    </div>
  );
}
