import React, { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

export default function EmployeeContactPage() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    department: "HR"
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent successfully!");
      setFormData({ subject: "", message: "", department: "HR" });
    }, 1500);
  };

  const contacts = [
    { name: "Human Resources", email: "hr@kanakkaalar.com", phone: "+91 98765 43210", role: "Personnel & Payroll" },
    { name: "IT Support", email: "support@kanakkaalar.com", phone: "+91 98765 43211", role: "Technical Issues" },
    { name: "Admin Dept", email: "admin@kanakkaalar.com", phone: "+91 98765 43212", role: "Facilities & Logistics" },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact & Support</h1>
        <p className="text-gray-600">Need assistance? Reach out to the relevant department or send us a direct message.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Directory */}
        <div className="space-y-4">
          {contacts.map((contact, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-gray-900 text-lg mb-1">{contact.name}</h3>
              <p className="text-sm text-[#5E33AC] font-medium mb-4">{contact.role}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <EnvelopeIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{contact.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{contact.phone}</span>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-lg mt-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPinIcon className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-lg">Headquarters</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              123 Business Park, <br />
              Tech Hub District, <br />
              Bangalore, Karnataka - 560100
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-50 rounded-xl text-[#5E33AC]">
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Send a Message</h2>
              <p className="text-sm text-gray-500">We usually respond within 24 hours.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5E33AC] focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50"
                >
                  <option value="HR">Human Resources</option>
                  <option value="IT">IT Support</option>
                  <option value="Admin">Administration</option>
                  <option value="Management">Management</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your issue"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5E33AC] focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Message</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your query or issue in detail..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5E33AC] focus:ring-2 focus:ring-purple-100 outline-none transition bg-gray-50 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="px-8 py-3 bg-[#5E33AC] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a288a] hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}