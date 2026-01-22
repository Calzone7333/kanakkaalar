import React from "react";
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

export default function EmployeeCompanyPage() {
  const policies = [
    { title: "Employee Handbook 2025", size: "2.4 MB", type: "PDF" },
    { title: "Leave Policy", size: "1.1 MB", type: "PDF" },
    { title: "Code of Conduct", size: "850 KB", type: "PDF" },
    { title: "IT Security Guidelines", size: "1.5 MB", type: "PDF" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e] text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5E33AC] to-purple-900 opacity-90"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 p-10 md:p-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6">
            <BuildingOffice2Icon className="w-4 h-4" />
            <span>Established 2020</span>
          </div>
          <h1 className="text-3xl md:text-3xl font-bold mb-6 leading-tight">
            Building the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
              Financial Compliance
            </span>
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl leading-relaxed">
            We are dedicated to simplifying business compliance and financial services for entrepreneurs across India. Our mission is to empower businesses with seamless, technology-driven solutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <GlobeAltIcon className="w-6 h-6 text-[#5E33AC]" />
            Our Mission & Vision
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              At Kanakkaalar, we believe that compliance shouldn't be a barrier to innovation. We strive to create a ecosystem where businesses can focus on growth while we handle the complexities of legal and financial regulations.
            </p>
            <p>
              Our vision is to become India's most trusted partner for business services, leveraging AI and automation to deliver error-free, timely, and affordable solutions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                <h3 className="font-bold text-purple-900 mb-2">Innovation First</h3>
                <p className="text-sm text-purple-700">Constantly evolving our tech stack to serve better.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Customer Centric</h3>
                <p className="text-sm text-blue-700">Your success is our primary metric of success.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-gray-500" />
              Leadership
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">JD</div>
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">CEO & Founder</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">JS</div>
                <div>
                  <p className="font-medium text-gray-900">Jane Smith</p>
                  <p className="text-xs text-gray-500">CTO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-lg">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-indigo-100 text-sm mb-4">Contact HR for any queries regarding policies.</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition">
              Contact HR
            </button>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <DocumentTextIcon className="w-6 h-6 text-[#5E33AC]" />
          Company Policies & Documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {policies.map((doc, idx) => (
            <div key={idx} className="group p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all bg-gray-50 hover:bg-white cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                  <DocumentTextIcon className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded uppercase">
                  {doc.type}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 truncate" title={doc.title}>{doc.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{doc.size}</span>
                <button className="text-[#5E33AC] hover:bg-purple-50 p-1.5 rounded-lg transition">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}