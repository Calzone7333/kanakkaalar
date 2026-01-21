import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRightIcon,
    DocumentMagnifyingGlassIcon,
    ShieldCheckIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; // distinct style for checkmarks
import { serviceHubAPI, processAPI, serviceItemAPI } from "../../../lib/api"; // Added serviceItemAPI

// Remove static tabData
// const tabData = { ... } 

// ===========================================
// 1. ComplianceCardSmall Component
// ===========================================

const ComplianceCardSmall = ({ title, desc, to, categoryKey, onClick }) => (
    <div
        onClick={() => onClick({ title, desc, to, categoryKey })}
        className="block flex-1 flex flex-col justify-start bg-white border border-[#94C8FA] rounded-xl p-3 cursor-pointer transition-transform transform hover:scale-[1.03] hover:shadow-xl shadow-md"
    >
        <div className="w-8 h-8 bg-[#E5F7F7] rounded-lg mb-2 flex items-center justify-center">
            {/* Placeholder Icon */}
            <svg
                className="w-4 h-4 text-[#5FA1F9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        </div>
        <div className="text-xs font-semibold text-gray-800">{title}</div>
        <div className="text-[11px] text-[#515554] mt-1 line-clamp-2 flex-grow">{desc}</div>
        <div className="mt-1 text-[11px] text-[#5FA1F9] font-bold hover:text-[#2E96FF] transition-colors flex items-center">
            View Details <ChevronRightIcon className="w-2.5 h-2.5 ml-1" />
        </div>
    </div>
);

const PricingPlans = ({ plans, serviceTitle, serviceDesc }) => {
    if (!plans) return null;
    const navigate = useNavigate();

    const tiers = [
        { key: 'standard', name: 'Starter', color: 'text-slate-600', accent: 'bg-white', border: 'border-slate-200' },
        { key: 'premium', name: 'Professional', color: 'text-white', accent: 'bg-[#F0F9FF]', border: 'border-[#2E96FF]', isPopular: true },
        { key: 'elite', name: 'Enterprise', color: 'text-amber-700', accent: 'bg-white', border: 'border-slate-200' }
    ];

    const handlePlanSelect = (planKey, planPrice) => {
        const params = new URLSearchParams({
            title: serviceTitle,
            desc: serviceDesc,
            plan: planKey,
            price: planPrice
        });
        navigate(`/dashboard/user/service-order?${params.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-stretch">
            {tiers.map(tier => {
                const plan = plans[tier.key];
                if (!plan) return null;
                return (
                    <div
                        key={tier.key}
                        className={`relative flex flex-col p-6 rounded-xl transition-all duration-300 border ${tier.border} ${tier.accent} hover:shadow-lg hover:-translate-y-1`}
                    >
                        {tier.isPopular && (
                            <div className="absolute top-0 right-0">
                                <span className="bg-[#2E96FF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                                    Popular
                                </span>
                            </div>
                        )}

                        <div className="mb-6">
                            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.isPopular ? 'text-[#2E96FF]' : 'text-slate-500'}`}>
                                {tier.name}
                            </h4>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                                    ₹{plan.price?.toLocaleString()}
                                </span>
                                <span className="text-xs font-medium text-slate-400">/ service</span>
                            </div>
                        </div>

                        <ul className="flex-1 mb-8 space-y-3">
                            {plan.features?.length > 0 ? (
                                plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-1 w-4 h-4 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                            <CheckIcon className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 leading-snug">
                                            {feature}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm italic text-slate-400">Standard implementation included.</li>
                            )}
                        </ul>

                        <button
                            onClick={() => handlePlanSelect(tier.key, plan.price)}
                            className={`w-full py-2.5 text-sm font-bold rounded-lg transition-colors border ${tier.isPopular
                                ? 'bg-[#2E96FF] text-white border-[#2E96FF] hover:bg-[#2579cd]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-[#2E96FF] hover:text-[#2E96FF]'
                                }`}
                        >
                            Select Plan
                        </button>
                    </div>
                )
            })}
        </div>
    );
};

// Component: show GST orders for the authenticated user
function GstOrdersList() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const user = getAuth()?.user;

    React.useEffect(() => {
        let mounted = true;
        setLoading(true);
        serviceHubAPI.myOrders('GST Registration').then(r => {
            if (!mounted) return;
            setOrders(r.data);
            setError(null);
        }).catch(err => { if (mounted) setError(err); }).finally(() => { if (mounted) setLoading(false); });
        return () => mounted = false;
    }, []);

    if (loading) return <div className="text-sm text-gray-500">Loading your GST orders...</div>;
    if (error) return <div className="text-sm text-red-600">Failed to load orders</div>;
    if (!orders.length) return <div className="text-sm text-gray-600">You have no GST registration orders yet. <Link to="/Licenses/gst" className="text-blue-600">Start now</Link></div>;

    return (
        <div className="space-y-4">
            {orders.map((entry) => (
                <div key={entry.order.id} className="p-3 bg-white border rounded">
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium">Order #{entry.order.id} — {entry.order.serviceName}</div>
                            <div className="text-xs text-gray-500">Status: {entry.order.status}</div>
                        </div>
                        <div className="text-xs text-right text-gray-500">Created: {new Date(entry.order.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="mt-3">
                        <div className="mb-2 text-sm font-semibold">Process Stages</div>
                        <ul className="space-y-2">
                            {entry.stages.map(s => (
                                <li key={s.id} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm">{s.stage}</div>
                                        <div className="text-xs text-gray-500">{s.status} — {s.notes}</div>
                                    </div>
                                    <div>
                                        {/* No actions for user */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Component: admin/employee GST orders with quick actions
function GstAdminList() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const user = getAuth()?.user;

    const load = () => {
        setLoading(true);
        serviceHubAPI.orders('GST Registration').then(r => { setOrders(r.data); setError(null); }).catch(e => setError(e)).finally(() => setLoading(false));
    };

    React.useEffect(() => { load(); }, []);

    const markStage = async (orderId, stageName) => {
        try {
            await processAPI.addStage(orderId, { stage: stageName, status: 'completed', notes: 'Marked completed via dashboard' });
            load();
        } catch (err) {
            alert('Failed to update stage');
        }
    };

    if (loading) return <div className="text-sm text-gray-500">Loading GST orders...</div>;
    if (error) return <div className="text-sm text-red-600">Failed to load orders</div>;
    if (!orders.length) return <div className="text-sm text-gray-600">No GST orders found.</div>;

    return (
        <div className="space-y-4">
            {orders.map((entry) => (
                <div key={entry.order.id} className="p-3 bg-white border rounded">
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium">Order #{entry.order.id} — {entry.order.serviceName}</div>
                            <div className="text-xs text-gray-500">Status: {entry.order.status} — Assigned: {entry.order.assigneeEmail || 'unassigned'}</div>
                        </div>
                        <div className="text-xs text-right text-gray-500">Created: {new Date(entry.order.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="mt-3">
                        <div className="mb-2 text-sm font-semibold">Process Stages</div>
                        <ul className="space-y-2">
                            {entry.stages.map(s => (
                                <li key={s.id} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm">{s.stage}</div>
                                        <div className="text-xs text-gray-500">{s.status} — {s.notes}</div>
                                    </div>
                                    <div>
                                        {s.status !== 'completed' && (
                                            <button onClick={() => markStage(entry.order.id, s.stage)} className="px-2 py-1 text-xs text-white bg-green-600 rounded">Mark Completed</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

const getServiceSpecificContent = (service) => {
    // Process steps for generic services, based on category
    const processStepData = {
        licenses: [
            { icon: DocumentMagnifyingGlassIcon, title: "Document Vetting", desc: "Specialists review your identity, address, and business documents for compliance." },
            { icon: ShieldCheckIcon, title: "Application Filing", desc: "The application is prepared and submitted to the relevant government portal." },
            { icon: BanknotesIcon, title: "Fee Payment & Receipt", desc: "Government fees are paid, and the official application receipt is generated." },
            { icon: CheckCircleIcon, title: "Certificate Delivery", desc: "Upon approval, the final license or registration certificate is uploaded." },
        ],
        ip: [
            { icon: DocumentMagnifyingGlassIcon, title: "Preliminary Search", desc: "Comprehensive search to ensure the trademark or patent is unique and registrable." },
            { icon: ShieldCheckIcon, title: "Drafting & Filing", desc: "Application specifications are drafted by legal experts and filed with the IP office." },
            { icon: ClockIcon, title: "Examination & Hearing", desc: "Handling official objections or hearing requirements on your behalf." },
            { icon: CheckCircleIcon, title: "Registration Granted", desc: "The final registration certificate is secured, granting you exclusive rights." },
        ],
        tax: [
            { icon: DocumentMagnifyingGlassIcon, title: "Data Collection", desc: "Gathering necessary financial data, invoices, and expense details." },
            { icon: ShieldCheckIcon, title: "Return Preparation", desc: "Our CAs prepare the ITR, GSTR, or TDS forms ensuring zero errors and maximum compliance." },
            { icon: BanknotesIcon, title: "E-Filing & Acknowledgment", desc: "The returns are filed electronically, and the official government acknowledgment is provided." },
            { icon: CheckCircleIcon, title: "Audit Support", desc: "Ongoing support provided for any notices or inquiries." },
        ],
        // Defaulting to a sensible set for 'company', 'formation', 'closure' etc.
        legal: [
            { icon: DocumentMagnifyingGlassIcon, title: "Requirement Gathering", desc: "Detailed consultation to understand the scope and intent of the agreement." },
            { icon: ShieldCheckIcon, title: "Drafting by Lawyer", desc: "The contract/agreement is drafted by a legal expert to ensure enforceability." },
            { icon: ClockIcon, title: "Review & Revisions", desc: "Up to two rounds of revisions based on client feedback." },
            { icon: CheckCircleIcon, title: "Final E-Sign Delivery", desc: "The final, legally vetted document is delivered for execution." },
        ],
        company: [ // Using a sensible default for company changes
            { icon: DocumentMagnifyingGlassIcon, title: "Data Collection & Vetting", desc: "Gathering required director/partner, shareholding, or objective data." },
            { icon: ShieldCheckIcon, title: "Drafting Resolutions & Forms", desc: "Preparation of Board Resolutions, EGM/AGM minutes, and statutory forms." },
            { icon: BanknotesIcon, title: "RoC Filing", desc: "Filing of required E-forms (e.g., MGT-14, DIR-12, INC-24) with the Registrar of Companies." },
            { icon: CheckCircleIcon, title: "Approval & Certificate Update", desc: "Receiving the official RoC approval and updated company certificate/documents." },
        ],
        formation: [ // Using a sensible default for new business
            { icon: DocumentMagnifyingGlassIcon, title: "Name Approval", desc: "Filing for name reservation (RUN) with the RoC or equivalent authority." },
            { icon: ShieldCheckIcon, title: "Document Submission", desc: "Filing of all incorporation documents (MoA, AoA, etc.) and fees." },
            { icon: BanknotesIcon, title: "PAN, TAN, Bank A/C", desc: "Application for PAN, TAN, and guidance on opening the corporate bank account." },
            { icon: CheckCircleIcon, title: "Certificate of Incorporation", desc: "Final delivery of the Certificate of Incorporation/Registration and other key documents." },
        ],
        closure: [ // Using a sensible default for closure
            { icon: DocumentMagnifyingGlassIcon, title: "Compliance Check", desc: "Verifying all pending tax and statutory liabilities." },
            { icon: ShieldCheckIcon, title: "Application Filing", desc: "Preparation and filing of the closure application (e.g., STK-2 or GST cancellation request)." },
            { icon: ClockIcon, title: "Authority Processing", desc: "Monitoring the process through the respective government authority." },
            { icon: CheckCircleIcon, title: "Final Approval Order", desc: "Delivery of the final order/notification confirming the successful closure/cancellation." },
        ]
    };

    const processDetails = processStepData[service.categoryKey] || processStepData.licenses;

    let pricingSection = null;
    // Check if any valid plan exists (Standard, Premium, or Elite)
    const hasPlans = service.plans && (service.plans.standard || service.plans.premium || service.plans.elite);

    if (hasPlans) {
        pricingSection = {
            id: 'pricing_group',
            title: 'Pricing Plans',
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#003366]">Transparent Pricing</h3>
                    <PricingPlans plans={service.plans} serviceTitle={service.title} serviceDesc={service.desc} />
                </div>
            )
        };
    } else {
        // Fallback for services without specific plans (e.g. "Contact Expert")
        pricingSection = {
            id: 'pricing_group',
            title: 'Get Started',
            content: (
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100 text-center">
                    <h3 className="text-xl font-bold text-[#003366] mb-2">Interested in this service?</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Our experts are ready to assist you with {service.title}. Get a personalized quote and guidance tailored to your business needs.
                    </p>
                    <button
                        onClick={() => {
                            const params = new URLSearchParams({
                                title: service.title,
                                desc: service.desc || 'Custom Service Request',
                                plan: 'custom',
                                price: '0' // Flag for custom pricing
                            });
                            navigate(`/dashboard/user/service-order?${params.toString()}`);
                        }}
                        className="px-8 py-3 bg-[#2E96FF] text-white font-bold rounded-xl shadow-lg hover:bg-[#2579cd] hover:shadow-xl transition-all"
                    >
                        Request Consultation / Quote
                    </button>
                    <p className="mt-4 text-xs text-gray-500">
                        No immediate payment required. We will contact you to discuss details.
                    </p>
                </div>
            )
        };
    }

    // --- Generic Content for ALL services - NEAT & COMPACT REDESIGN ---
    return {
        isSpecific: false,
        sections: [
            {
                id: 'overview_group',
                title: 'Overview',
                content: (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="text-slate-600 leading-relaxed text-sm">
                                <h4 className="text-lg font-bold text-slate-800 mb-4 tracking-tight">Professional Analysis</h4>
                                <p className="font-medium">
                                    {service.description || `Experience high-end professional assistance for your ${service.title}. Our dedicated team meticulously handles every detail to ensure 100% compliance and expedited delivery.`}
                                </p>
                            </div>
                            <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100 shadow-sm">
                                <h5 className="font-bold text-[#003366] mb-4 flex items-center text-xs uppercase tracking-wider">
                                    <ShieldCheckIcon className="w-4 h-4 mr-2 text-[#2E96FF]" />
                                    Executive Highlights
                                </h5>
                                <div className="text-2xl font-bold text-[#2E96FF] mb-2 tracking-tight">
                                    {service.priceDescription ? `₹${service.priceDescription.replace(/[^0-9]/g, '')}` : 'Professional Quote'}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 border-b border-blue-100 pb-4 mb-4">BASE SERVICE FEE</div>

                                {service.duration && (
                                    <div className="text-sm font-bold text-slate-700">
                                        <span className="block mb-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Turnaround</span>
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <ClockIcon className="w-4 h-4 text-amber-500" />
                                            {service.duration}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Benefits */}
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Strategic Advantages</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { emoji: '⚖️', label: 'Compliance', desc: 'Maintained at the highest regulatory standards.', color: 'emerald' },
                                    { emoji: '⚡', label: 'Precision', desc: 'Expert-led execution with zero error tolerance.', color: 'blue' },
                                    { emoji: '🔒', label: 'Security', desc: 'Enterprise-grade data protection protocol.', color: 'indigo' }
                                ].map((benefit, i) => (
                                    <div key={i} className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
                                        <div className={`w-10 h-10 bg-${benefit.color}-50 rounded-lg flex items-center justify-center mb-4 text-xl`}>{benefit.emoji}</div>
                                        <h5 className="font-bold text-slate-900 mb-2 text-sm">{benefit.label}</h5>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            },
            ...(pricingSection ? [pricingSection] : []),
            {
                id: 'process_docs_group',
                title: 'Process & Documents',
                content: (
                    <div className="space-y-8">
                        {/* Process Steps */}
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 mb-8 tracking-tight">The Roadmap</h4>
                            <div className="relative pl-5 space-y-8">
                                <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-100 rounded-full"></div>
                                {processDetails.map((step, index) => (
                                    <div key={index} className="relative pl-10 group">
                                        <div className="absolute left-0 top-0 w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center z-10 shadow-sm group-hover:border-[#2E96FF] group-hover:text-[#2E96FF] transition-all duration-300">
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <div className="pt-1">
                                            <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Documents Required */}
                        <div className="pt-4">
                            <h4 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">Essential Documentation</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    "Certificate of Identity",
                                    "Proof of Registered Address",
                                    "Business Authorization Letters",
                                    "Financial Statements"
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#2E96FF] hover:bg-white hover:shadow-sm transition-all group cursor-default">
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#2E96FF] mr-3 shadow-sm group-hover:bg-[#2E96FF] group-hover:text-white transition-all">
                                            <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-700">{doc}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold text-xs shrink-0">i</div>
                                <p className="text-xs text-amber-900 font-medium leading-relaxed mt-0.5">
                                    A precise personalized document checklist will be compiled and shared by your assigned expert following the initial consultation.
                                </p>
                            </div>
                        </div>
                    </div>
                )
            },
        ],
    };
};

// ===========================================
// 3. ServiceDetailDrawer Component (The Popup)
// ===========================================

const ServiceDetailDrawer = ({ service, onClose }) => {
    // Disable body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const { sections } = getServiceSpecificContent(service);
    const navigate = useNavigate();

    // State and Refs for Navigation
    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null);
    const sectionRefs = useRef({});
    const contentRef = useRef(null);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
    };

    const scrollToSection = (id) => {
        const element = sectionRefs.current[id];
        if (element && contentRef.current) {
            const offset = element.offsetTop;
            const isMobile = window.innerWidth < 768;
            const scrollOffset = isMobile ? 140 : 40;
            contentRef.current.scrollTo({ top: offset - scrollOffset, behavior: 'smooth' });
            setActiveSectionId(id);
        }
    };

    useEffect(() => {
        if (!contentRef.current || sections.length === 0) return;
        const observerOptions = {
            root: contentRef.current,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSectionId(entry.target.id);
                }
            });
        }, observerOptions);
        const currentRefs = sectionRefs.current;
        const elements = sections.map(s => currentRefs[s.id]).filter(Boolean);
        elements.forEach(el => observer.observe(el));
        return () => elements.forEach(el => observer.unobserve(el));
    }, [sections, service.title]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#001529]/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-6xl h-full max-h-[90vh] bg-white relative flex flex-col md:flex-row overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] rounded-[2rem]"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- Sidebar (Desktop) --- */}
                <div className="hidden md:flex w-64 bg-slate-50 border-r border-slate-100 flex-col shrink-0 h-full">
                    <div className="p-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#2E96FF] mb-4">
                            <ShieldCheckIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 leading-tight">
                            {service.title}
                        </h2>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Expert Verified</span>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center group
                                    ${activeSectionId === section.id
                                        ? "bg-white text-[#2E96FF] shadow-sm ring-1 ring-slate-200"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-all duration-300 ${activeSectionId === section.id ? 'bg-[#2E96FF]' : 'bg-slate-300 group-hover:bg-slate-400'}`}></span>
                                {section.title}
                            </button>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto">
                        <div className="bg-slate-800 rounded-xl p-3 text-white">
                            <p className="text-[10px] font-bold opacity-60 uppercase mb-0.5">Need help?</p>
                            <p className="text-[11px] font-medium leading-relaxed">Our experts are available for a 1:1 call.</p>
                        </div>
                    </div>
                </div>

                {/* --- Mobile Header --- */}
                <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#2E96FF]">
                                <ShieldCheckIcon className="w-5 h-5" />
                            </div>
                            <h2 className="text-base font-bold text-gray-800 truncate max-w-[200px]">
                                {service.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <nav className="flex overflow-x-auto px-4 pb-0 hide-scrollbar space-x-6">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all
                                    ${activeSectionId === section.id
                                        ? "text-[#2E96FF] border-[#2E96FF]"
                                        : "text-slate-400 border-transparent"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* --- Main Content --- */}
                <div className="flex-1 relative flex flex-col h-full bg-white">
                    {/* Desktop Close Button */}
                    <button
                        onClick={onClose}
                        className="hidden md:flex absolute top-6 right-6 z-50 w-8 h-8 items-center justify-center bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all group border border-slate-100"
                    >
                        <XMarkIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 pb-32">
                            {/* Stats Summary Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                        <BanknotesIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Investment</div>
                                        <div className="text-sm font-bold text-slate-800 leading-none">
                                            {service.desc?.split('|')[0] || "Consultation"}
                                        </div>
                                    </div>
                                </div>

                                {service.duration && (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-amber-500">
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Timeline</div>
                                            <div className="text-sm font-bold text-slate-800 leading-none">{service.duration}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Main Body Sections */}
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    ref={(el) => (sectionRefs.current[section.id] = el)}
                                    className="scroll-mt-10"
                                >
                                    {section.title !== 'Overview' && (
                                        <div className="flex items-center gap-3 mb-6">
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{section.title}</h3>
                                            <div className="h-px flex-1 bg-slate-100"></div>
                                        </div>
                                    )}
                                    <div className="text-slate-600">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer / CTA - Mobile Only (Floating) */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex gap-3 z-50">
                        <button
                            onClick={() => scrollToSection('pricing_group')}
                            className="flex-1 py-4 bg-[#2E96FF] text-white text-sm font-black rounded-2xl shadow-lg shadow-blue-200"
                        >
                            View Pricing
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};


// ===========================================
// MAIN COMPONENT: ServicesHub
// ===========================================

export default function ServicesHub() {
    const navigate = useNavigate();
    const location = useLocation();
    const tabNavRef = useRef(null);
    const tabRefs = useRef({});

    // State for dynamic data
    const [serviceData, setServiceData] = useState({});
    const [loadingServices, setLoadingServices] = useState(true);
    const [error, setError] = useState(null);

    const tabKeys = useMemo(() => Object.keys(serviceData), [serviceData]);

    // Initialize State
    const [activeTab, setActiveTab] = useState("");
    const [activeSubTab, setActiveSubTab] = useState("");
    const [selectedService, setSelectedService] = useState(null);

    // Fetch data
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoadingServices(true);
                const response = await serviceItemAPI.getActiveGrouped();
                setServiceData(response.data);
            } catch (err) {
                console.error("Failed to load services:", err);
                setError("Failed to load services. Please try again later.");
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    // Initialize active tab when data is loaded
    useEffect(() => {
        if (tabKeys.length > 0 && (!activeTab || !tabKeys.includes(activeTab))) {
            setActiveTab(tabKeys[0]);
        }
    }, [tabKeys, activeTab]);

    // Effect to reset sub-tab when main tab changes
    useEffect(() => {
        if (activeTab && serviceData[activeTab]) {
            const subCats = Object.keys(serviceData[activeTab]);
            if (subCats.length > 0) {
                setActiveSubTab(subCats[0]);
            } else {
                setActiveSubTab("");
            }
        } else {
            setActiveSubTab("");
        }
        setSelectedService(null);
    }, [activeTab, serviceData]);

    // Effect to check location state for incoming service requests
    useEffect(() => {
        if (location.state?.serviceTitle && Object.keys(serviceData).length > 0) {
            const requestedService = location.state.serviceTitle.toLowerCase().trim();

            // Search through serviceData to find the matching service
            for (const [tabKey, subTabs] of Object.entries(serviceData)) {
                for (const [subTabKey, services] of Object.entries(subTabs)) {
                    if (Array.isArray(services)) {
                        const match = services.find(s =>
                            (s.name && s.name.toLowerCase().trim() === requestedService) ||
                            (s.title && s.title.toLowerCase().trim() === requestedService) ||
                            (s.title && s.title.toLowerCase().includes(requestedService))
                        );

                        if (match) {
                            setActiveTab(tabKey);
                            setActiveSubTab(subTabKey);
                            // Optionally auto-open the detail drawer
                            setSelectedService(match);
                            return; // Stop searching once found
                        }
                    }
                }
            }
        }
    }, [location.state, serviceData]);

    // Effect for smooth scrolling the main tab navigation bar
    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        const navContainer = tabNavRef.current;

        if (activeTabElement && navContainer) {
            const scrollPosition =
                activeTabElement.offsetLeft -
                navContainer.offsetWidth / 2 +
                activeTabElement.offsetWidth / 2;

            navContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, [activeTab]);


    const [searchTerm, setSearchTerm] = useState("");

    // Flatten all services for search
    const allServices = useMemo(() => {
        const services = [];
        Object.entries(serviceData).forEach(([category, subCats]) => {
            Object.entries(subCats).forEach(([subCat, items]) => {
                items.forEach(item => {
                    services.push({ ...item, category, subCat });
                });
            });
        });
        return services;
    }, [serviceData]);

    const subTabs = Object.keys(serviceData[activeTab] || {});
    const contentKey = `${activeTab}-${activeSubTab}`;

    // Determine which data to display: Search Results OR Current Tab Data
    const baseData = searchTerm
        ? allServices.filter(s => {
            const matchesName = (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.title && s.title.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesDesc = (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (s.desc && s.desc.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesName || matchesDesc;
        })
        : (serviceData[activeTab]?.[activeSubTab] || []);

    // Dynamic Pricing Integration
    const displayedData = baseData.map(item => {
        let plans = null;
        try {
            if (item.pricingPlans) {
                if (typeof item.pricingPlans === 'object' && item.pricingPlans !== null) {
                    plans = item.pricingPlans;
                } else {
                    plans = JSON.parse(item.pricingPlans);
                    if (typeof plans === 'string') {
                        plans = JSON.parse(plans);
                    }
                }

                if (plans) {
                    ['standard', 'premium', 'elite'].forEach(tier => {
                        if (plans[tier] && !Array.isArray(plans[tier].features)) {
                            plans[tier].features = [];
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Error parsing pricingPlans for " + item.name, e);
        }

        let priceVal = null;
        if (plans && plans.standard && plans.standard.price) {
            priceVal = `₹${plans.standard.price.toLocaleString()}`;
        } else if (item.priceDescription) {
            priceVal = `₹${item.priceDescription.replace(/[^0-9]/g, '')}`;
        }

        return {
            ...item,
            title: item.name || item.title,
            desc: item.desc || item.description || "",
            price: priceVal || "Contact",
            duration: item.duration || "Express",
            plans: plans,
            to: item.route || `/dashboard/user/service-order?title=${encodeURIComponent(item.name || item.title)}`,
            categoryKey: item.categoryKey || "licenses"
        };
    });
    const placeholdersCount = Math.max(0, 10 - displayedData.length);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm(""); // Clear search when manually changing tabs
    };

    const handleCardClick = (service) => {
        // This opens the ServiceDetailDrawer popup
        setSelectedService(service);
    };

    if (loadingServices) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E96FF]"></div>
                <span className="ml-4 text-gray-500 font-medium">Loading Services Hub...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-gray-800 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-700 transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="font-sans antialiased">
            <div className="p-4 bg-white rounded-xl md:p-8">

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2E96FF] focus:border-transparent transition-all duration-200 sm:text-sm shadow-sm"
                        placeholder="Search for services (e.g., GST, Trademark, Payroll)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* 1. Main Tab Navigation (Hidden when searching) */}
                {!searchTerm && (
                    <nav
                        ref={tabNavRef}
                        className="flex px-4 pt-4 mb-6 -mx-4 overflow-x-auto border-b border-gray-200 whitespace-nowrap md:-mx-8 md:px-8"
                        style={{
                            scrollbarWidth: "none", // Firefox
                            msOverflowStyle: "none", // IE 10+
                        }}
                    >
                        {tabKeys.map((tab) => (
                            <button
                                key={tab}
                                ref={el => tabRefs.current[tab] = el}
                                onClick={() => handleTabChange(tab)}
                                className={`flex-shrink-0 pb-3 px-4 md:px-5 text-xs md:text-sm font-semibold transition-colors border-b-2
                                    ${activeTab === tab
                                        ? "text-[#2E96FF] border-[#2E96FF]"
                                        : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                )}

                {/* 2. Sub Tabs (Hidden when searching) */}
                {!searchTerm && subTabs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 md:gap-3">
                        {subTabs.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveSubTab(sub)}
                                className={`py-1.5 px-3 text-[11px] md:text-xs rounded-full transition-colors duration-200 font-semibold border
                                    ${activeSubTab === sub
                                        ? "bg-[#2E96FF] text-white border-[#2E96FF] shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results Header */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-500 font-medium">
                        Found {displayedData.length} results for "{searchTerm}"
                    </div>
                )}

                {/* 3. Grid Content */}

                {/* 3. Grid Content with Framer Motion Transition and Uniform Card Height */}
                <div className="mt-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={contentKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                        >
                            {Array.isArray(displayedData) && displayedData.length > 0 ? (
                                displayedData.map((service, i) => (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                                        className="flex h-full"
                                    >
                                        <ComplianceCardSmall
                                            {...service}
                                            onClick={() => handleCardClick(service)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                        <DocumentMagnifyingGlassIcon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">No results found</h3>
                                    <p className="text-slate-500 max-w-xs font-medium">
                                        We couldn't find any services matching your current selection or search terms.
                                    </p>
                                </div>
                            )}

                            {/* Placeholder divs for consistent grid layout */}
                            {Array.from({ length: placeholdersCount }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="hidden xl:block" />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Detail Drawer - The Popup that opens on card click */}
            <AnimatePresence>
                {selectedService && (
                    <ServiceDetailDrawer
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
