import React, { useState, useEffect } from "react";
import { X, Lock, CheckCircle, CreditCard, ShieldCheck, Sparkles, Clock, ArrowLeft, User, Mail, Phone, ArrowRight, MapPin, Building2, FileText, HelpCircle } from "lucide-react";
import { leadAPI, paymentsAPI } from "../lib/api";
import toast from "react-hot-toast";
import logo from "../assets1/img/kanakkaalar_logo.png";

const LeadModal = ({ isOpen, onClose, plan, serviceName, price }) => {
    const [step, setStep] = useState(1); // 1: Details, 2: Payment
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        city: "",
        requirements: "",
    });
    const [loading, setLoading] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Determines dynamic field based on service name
    const getServiceFieldConfig = () => {
        const lowerName = serviceName?.toLowerCase() || "";

        if (lowerName.includes('talk') || lowerName.includes('consult')) {
            return {
                label: "Subject / Query",
                placeholder: "Brief description of your issue",
                icon: <HelpCircle size={20} strokeWidth={1.5} />,
                type: "text"
            };
        }
        if (lowerName.includes('registration') || lowerName.includes('incorporation') || lowerName.includes('company') || lowerName.includes('llp') || lowerName.includes('opc')) {
            return {
                label: "Proposed Company Name",
                placeholder: "Proposed Company Name (Optional)",
                icon: <Building2 size={20} strokeWidth={1.5} />,
                type: "text"
            };
        }
        if (lowerName.includes('gst') || lowerName.includes('license') || lowerName.includes('trademark') || lowerName.includes('fssai')) {
            return {
                label: "Business Name",
                placeholder: "Business Name (If applicable)",
                icon: <Building2 size={20} strokeWidth={1.5} />,
                type: "text"
            };
        }
        // Default
        return {
            label: "Specific Requirements",
            placeholder: "Any specific details we should know?",
            icon: <FileText size={20} strokeWidth={1.5} />,
            type: "text"
        };
    };

    // Get dynamic content for the left panel
    const getServiceContent = () => {
        const lowerName = serviceName?.toLowerCase() || "";

        if (lowerName.includes('registration') || lowerName.includes('incorporation') || lowerName.includes('company')) {
            return {
                title: <>We Register Nearly <span className="text-blue-600 inline-block border-b-4 border-[#1A7F7D] leading-none">10%</span> of All Indian Businesses</>,
                subtitle: <>Join thousands of entrepreneurs who trust <span className="text-slate-900 font-bold">Kanakkaalar</span> to kickstart their journey.</>,
                benefits: [
                    { title: "Company registration done within 7–14 days", desc: "Get your business officially registered fast, with zero hassle or delays." },
                    { title: "24x7 Expert Support", desc: "Our professionals are available around the clock to guide you at every step." },
                    { title: "Post-registration Support Provided", desc: "From compliance to tax filings we're with you even after your company is set up." }
                ]
            };
        } else if (lowerName.includes('gst') || lowerName.includes('return') || lowerName.includes('filing') || lowerName.includes('compliance')) {
            return {
                title: <>End-to-End <span className="text-blue-600 inline-block border-b-4 border-[#1A7F7D] leading-none">Compliance</span> Management</>,
                subtitle: <>Stay 100% compliant with zero penalties. We handle everything from filing to notices.</>,
                benefits: [
                    { title: "Zero Penalties Guarantee", desc: "Timely filings ensure you never have to pay late fees or penalties." },
                    { title: "Dedicated CA Support", desc: "Get assigned a dedicated Chartered Accountant for your business accounts." },
                    { title: "Real-time Status Updates", desc: "Track your filing status and acknowledgments directly from your dashboard." }
                ]
            };
        } else if (lowerName.includes('trademark') || lowerName.includes('copyright') || lowerName.includes('patent')) {
            return {
                title: <>Protect Your <span className="text-blue-600 inline-block border-b-4 border-[#1A7F7D] leading-none">Brand</span> & Assets</>,
                subtitle: <>Secure your intellectual property with India's most trusted legal experts.</>,
                benefits: [
                    { title: "Comprehensive Search Report", desc: "We conduct thorough checks to ensure your brand name is unique." },
                    { title: "Filing within 24 Hours", desc: "Rapid application submission to secure your priority date immediately." },
                    { title: "Objection Handling Included", desc: "Our legal team drafts professional responses to any government objections." }
                ]
            };
        } else {
            // Default / Consulting
            return {
                title: <>Expert <span className="text-blue-600 inline-block border-b-4 border-[#1A7F7D] leading-none">Financial</span> & Legal Guidance</>,
                subtitle: <>Get the right advice to grow your business. Simple, affordable, and professional.</>,
                benefits: [
                    { title: "Tailored Professional Advice", desc: "Solutions customized specifically for your business model and industry." },
                    { title: "Transparent Pricing", desc: "No hidden charges. Pay only for the services you need." },
                    { title: "Confidential & Secure", desc: "Your business data is protected with enterprise-grade security." }
                ]
            };
        }
    };

    const serviceContent = getServiceContent();

    const fieldConfig = getServiceFieldConfig();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setLoading(false);
            setProcessingPayment(false);
            setFormData(prev => ({ ...prev, requirements: "" }));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Submit Lead first
            await leadAPI.createPublic({
                ...formData,
                service: `${serviceName} - ${plan}`,
                status: "New",
                message: formData.requirements, // Send requirements as message
            });

            // 2. If price is available, move to payment step
            if (price) {
                setStep(2);
            } else {
                toast.success("Request received! We'll contact you shortly.");
                onClose();
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to submit details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessingPayment(true);
        //const amountInPaise = parseInt(price.replace(/[^0-9]/g, ''), 10) * 100;

        let numericPrice = 0;
        if (typeof price === 'string') {
            numericPrice = parseInt(price.replace(/[^0-9]/g, ''), 10);
        } else {
            numericPrice = price;
        }

        // Fallback or validation
        if (!numericPrice || isNaN(numericPrice)) {
            toast.error("Invalid price for this service.");
            setProcessingPayment(false);
            return;
        }

        const amountInPaise = numericPrice * 100;

        try {
            // 1. Get Razorpay Key
            const keyRes = await paymentsAPI.getKey();
            const key = keyRes.data.key;

            // 2. Create Order
            const orderRes = await paymentsAPI.createOrder({
                amount: amountInPaise,
                currency: "INR",
                description: `Payment for ${serviceName} (${plan})`,
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
            });
            const orderData = orderRes.data;

            // 3. Open Razorpay
            const options = {
                key: key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Kanakkaalar",
                description: `Payment for ${serviceName}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        await paymentsAPI.confirm({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                        });
                        toast.success("Payment Successful!");
                        onClose();
                    } catch (err) {
                        console.error(err);
                        toast.error("Payment confirmation failed.");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#2E96FF",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error(error);
            toast.error("Process failed. Please try again.");
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#F2F5F9]/95 backdrop-blur-sm animate-fade-in text-slate-900">
            {/* Main Container */}
            <div className="w-full max-w-6xl relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 p-6">

                {/* Close Button Trigger for Mobile/Desktop */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 md:top-4 md:right-8 lg:right-0 bg-white text-slate-400 hover:text-red-500 rounded-full p-1.5 shadow-sm border border-slate-200 z-50 transition-all hover:rotate-90 duration-300"
                >
                    <X size={18} />
                </button>

                {/* Left Panel - Text Content */}
                <div className="hidden md:block w-full md:w-1/2 lg:w-5/12">
                    <h2 className="text-2xl lg:text-3xl font-bold mb-6 leading-[1.2] text-slate-800">
                        {serviceContent.title}
                    </h2>
                    <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                        {serviceContent.subtitle}
                    </p>

                    <div className="space-y-6">
                        {serviceContent.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3 group">
                                <div className="mt-0.5 bg-white p-1 rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform shrink-0">
                                    <CheckCircle size={20} strokeWidth={3} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{benefit.title}</h4>
                                    <p className="text-slate-500 text-xs mt-0.5">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - White Card */}
                <div className="w-full md:w-1/2 lg:w-[450px] bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-5 relative border border-slate-100">

                    {/* Logo Area */}
                    <div className="flex justify-center mb-3">
                        <img src={logo} alt="Kanakkaalar Logo" className="h-7 object-contain" />
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            <span>{step === 1 ? '0/2' : '1/2'} complete</span>
                            <span>Takes &lt; 1 min</span>
                        </div>
                        <div className="flex gap-2 h-1">
                            <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-[#1A7F7D]' : 'bg-slate-100'}`}></div>
                            <div className={`flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-[#1A7F7D]' : 'bg-slate-100'}`}></div>
                        </div>
                    </div>

                    {/* Content */}
                    {step === 1 ? (
                        <div className="animate-fade-in-up">
                            <h3 className="text-base font-bold text-slate-800 mb-5">Enter the basic information to get started</h3>
                            <form onSubmit={handleDetailsSubmit} className="space-y-3">
                                {/* Name */}
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-sm placeholder:text-slate-400 placeholder:text-xs"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Email */}
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} strokeWidth={1.5} />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-sm placeholder:text-slate-400 placeholder:text-xs"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} strokeWidth={1.5} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Mobile Number"
                                        maxLength={10}
                                        className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-sm placeholder:text-slate-400 placeholder:text-xs"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* City/Pincode */}
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City / Pincode"
                                        className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-sm placeholder:text-slate-400 placeholder:text-xs"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Dynamic Service Field */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        {React.cloneElement(fieldConfig.icon, { size: 18 })}
                                    </div>
                                    <input
                                        type={fieldConfig.type}
                                        name="requirements"
                                        placeholder={fieldConfig.placeholder}
                                        className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-medium text-sm placeholder:text-slate-400 placeholder:text-xs"
                                        value={formData.requirements}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Buttons - Split Layout */}
                                <div className="grid grid-cols-2 gap-3 mt-5 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="py-2.5 px-4 border border-slate-800 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="py-2.5 px-4 bg-[#0B1120] text-white font-bold rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200 text-sm"
                                    >
                                        {loading ? "Processing..." : <>Next <ArrowRight size={16} /></>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        // Step 2 Payment
                        <div className="animate-fade-in-up">
                            <div className="text-center py-2">
                                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-100">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">Details Verified!</h3>
                                <p className="text-slate-500 text-xs mb-4">Review your plan details below.</p>

                                <div className="bg-slate-50 rounded-lg p-4 mb-4 text-left border border-slate-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full -mr-2 -mt-2"></div>

                                    <div className="flex justify-between mb-2 relative z-10">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Service</span>
                                        <span className="font-bold text-slate-800 text-xs text-right max-w-[60%]">{serviceName}</span>
                                    </div>
                                    <div className="flex justify-between mb-2 relative z-10">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Plan</span>
                                        <span className="font-bold text-slate-800 text-xs">{plan}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-200 mt-2 relative z-10 items-center">
                                        <span className="text-xs font-bold text-slate-800">Total Payable</span>
                                        <span className="text-xl font-black text-blue-600">₹{price?.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="py-2.5 px-4 border border-slate-800 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm"
                                    >
                                        <ArrowLeft size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={processingPayment}
                                        className="py-2.5 px-4 bg-[#2E96FF] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200 text-sm"
                                    >
                                        {processingPayment ? "Wait..." : <>Pay Now <Lock size={16} /></>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
