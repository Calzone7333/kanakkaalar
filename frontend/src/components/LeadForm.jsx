import React, { useState } from 'react';
import { leadAPI } from '../lib/api';
import { CheckCircle, AlertCircle, Loader2, User, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function LeadForm({ serviceName, btnText = "Get Started Now", title }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success', 'error', null
    const [focusedField, setFocusedField] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            // Combine City into Service or just append to ensure it's captured if backend doesn't support it directly
            const finalService = formData.city
                ? `${serviceName} (City: ${formData.city})`
                : serviceName;

            await leadAPI.create({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: finalService,
                status: 'New'
            });

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', city: '' });
        } catch (error) {
            console.error("Lead submission failed:", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300 bg-emerald-50/50 rounded-xl border border-emerald-100 p-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md ring-4 ring-emerald-50">
                    <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Request Submitted!</h3>
                <p className="text-slate-600 text-sm mb-6 max-w-[240px] mx-auto leading-relaxed">
                    Thank you! Our expert will connect with you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus(null)}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 text-sm font-semibold rounded-full transition-all shadow-sm hover:shadow"
                >
                    Submit Another Request
                </button>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="relative group">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'name' ? 'text-[#00695C]' : 'text-slate-400'}`}>
                    <User size={18} />
                </div>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/10 transition-all shadow-sm group-hover:border-slate-300"
                    placeholder="Full Name"
                    type="text"
                />
            </div>

            {/* Email Input */}
            <div className="relative group">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'email' ? 'text-[#00695C]' : 'text-slate-400'}`}>
                    <Mail size={18} />
                </div>
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/10 transition-all shadow-sm group-hover:border-slate-300"
                    placeholder="Email Address"
                    type="email"
                    autoComplete="email"
                />
            </div>

            {/* Phone Input */}
            <div className="relative group">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'phone' ? 'text-[#00695C]' : 'text-slate-400'}`}>
                    <Phone size={18} />
                </div>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/10 transition-all shadow-sm group-hover:border-slate-300"
                    placeholder="Mobile Number"
                    type="tel"
                />
            </div>

            {/* City Input */}
            <div className="relative group">
                <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${focusedField === 'city' ? 'text-[#00695C]' : 'text-slate-400'}`}>
                    <MapPin size={18} />
                </div>
                <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00695C] focus:ring-4 focus:ring-[#00695C]/10 transition-all shadow-sm group-hover:border-slate-300"
                    placeholder="City / Pincode"
                    type="text"
                />
            </div>

            {
                status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-xs animate-pulse border border-red-100">
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>Something went wrong. Please try again.</span>
                    </div>
                )
            }

            <button
                type="submit"
                disabled={loading}
                className={`group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00695C] to-[#004D40] text-white py-3.5 font-bold rounded-xl hover:shadow-lg hover:shadow-[#00695C]/30 transform active:scale-[0.98] transition-all duration-300 text-sm tracking-wide ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Processing...</span>
                    </>
                ) : (
                    <>
                        <span>{btnText}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <p className="text-[11px] text-slate-400 font-medium">
                    100% Secure & Confidential
                </p>
            </div>
        </form >
    );
}
