import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import {
    ChevronDown,
    Zap,
    Briefcase,
    ArrowRight,
    Star,
    CheckCircle,
    FileText,
    Scale,
    Handshake,
    TrendingUp,
    Lightbulb,
    Users,
    DollarSign,
    Clock,
    Landmark,
    Shield,
    Globe,
    Calculator,
    RefreshCw,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";
import StartNowButton from "../../components/StartNowButton";

// --- ISO CERTIFICATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'iso-overview-content', label: 'Overview' },
    { id: 'iso-standards-content', label: 'Standards' },
    { id: 'iso-benefits-content', label: 'Benefits' },
    { id: 'iso-framework-content', label: 'Framework' },
    { id: 'iso-documents-content', label: 'Docs & Cost' },
    { id: 'iso-process-content', label: 'Process' },
    { id: 'iso-renewal-content', label: 'Renewal' },
    { id: 'iso-why-Bizzfiling', label: 'Why Us' },
    { id: 'iso-faqs-content', label: 'FAQs' },
];

const isoIntroBullets = [
    "Get ISO certified online with expert support—fast, simple, and reliable.",
    "Complete ISO compliance, audits, and certification assistance provided.",
    "All-in-one ISO certification packages starting at ₹1499 with guidance.",
];

const popularISOStandards = [
    { title: "ISO 9001:2015 – Quality Management (QMS)", icon: CheckCircle, detail: "Ensures consistency in meeting customer requirements and enhances satisfaction." },
    { title: "ISO 27001:2022 – Information Security (ISMS)", icon: Shield, detail: "Establishing, implementing, and maintaining robust information security controls." },
    { title: "ISO 14001 – Environmental Management (EMS)", icon: Globe, detail: "Helps organisations reduce environmental impact and promoting sustainable operations." },
    { title: "ISO 45001 – Health and Safety (OHSMS)", icon: Users, detail: "Aims to prevent work-related injuries by implementing sound OHS practices." },
    { title: "ISO 13485:2016 – Medical Devices QMS", icon: Briefcase, detail: "Tailored for the medical device industry, ensuring quality and regulatory compliance." },
    { title: "ISO 22301 – Business Continuity (BCMS)", icon: Clock, detail: "Ensures that an organisation can continue operations during and after disruptions." },
];

const isoBenefits = [
    { title: "Enhanced Credibility", icon: Zap, detail: "Enhances an organization's credibility, instilling confidence in customers." },
    { title: "Access to New Markets", icon: Globe, detail: "Certification opens doors to new markets, including government tenders." },
    { title: "Increased Customer Trust", icon: Handshake, detail: "Meeting recognized quality standards leads to increased customer satisfaction." },
    { title: "Competitive Advantage", icon: TrendingUp, detail: "Allows companies to stand out from uncertified competitors." },
    { title: "Regulatory Compliance", icon: Scale, detail: "Especially important in strict industries like medical devices or food safety." },
    { title: "Business Efficiency", icon: Briefcase, detail: "Adopting best practices enhances operational efficiency and reduces waste." },
];

const legalFramework = [
    { title: "Bureau of Indian Standards (BIS)", role: "The National Standards Body of India, promoting standards across industries.", icon: Landmark },
    { title: "NABCB (Accreditation Body)", role: "Accredits organizations that certify businesses per international standards.", icon: Scale },
    { title: "QCI (Quality Council of India)", role: "Promotes high standards and ensures certification bodies meet ISO standards.", icon: CheckCircle },
];

const isoDocuments = [
    { name: "Company Registration copy", icon: FileText },
    { name: "ID Proof of Directors", icon: Users },
    { name: "GST Copy", icon: FileText },
    { name: "The Scope of work", icon: Briefcase },
    { name: "Purchase and sale invoice", icon: DollarSign },
    { name: "Company board photos", icon: Zap },
    { name: "PAN card of the company", icon: FileText },
];

const isoProcessSteps = [
    "Selecting the Right ISO Standard: Choose based on goals and industry requirements.",
    "Choosing Accredited Body: Work with recognized IAF-accredited agencies.",
    "Preparing for ISO: Conduct internal audits, gap analysis, and staff training.",
    "Submitting Application: Formally apply with documentation and applicable fees.",
    "Certification Audit: Stage 1 (Documentation) and Stage 2 (Implementation) review.",
    "Getting Your Certificate: Official ISO certificate is issued upon success.",
    "Maintaining Compliance: Commit to regular surveillance audits (annually).",
];

const isoCostTime = {
    cost: "Starting at ₹1499, depending on scope, size, and standard type.",
    timeBreakdown: [
        "First Draft: 3 to 5 working days.",
        "Soft Copy: 3 to 4 working days post-approval.",
        "Final Certificate: 5 to 7 working days.",
        "Total Time: 13 to 15 working days.",
    ],
};

const isoRenewal = {
    renewalProcess: "Certifications typically last 3 years. Renewal requires a new audit to ensure continued adherence.",
    auditFrequency: "Surveillance audits are conducted annually or semi-annually to verify ongoing compliance.",
};

const isoFAQs = [
    { q: "What is ISO certification and how is it different from registration?", a: "Certification confirms meeting standards via audit; Registration is the formal process of being listed by a recognized registrar." },
    { q: "What are the benefits for Indian businesses?", a: "Enhanced credibility, market access, customer trust, and operational efficiency." },
    { q: "How long is an ISO certificate valid?", a: "IAF-accredited certifications are valid for 3 years, with annual surveillance audits." },
    { q: "Can an organization fail the audit?", a: "Yes, if major non-conformities are found. These must be addressed via corrective action." },
    { q: "What are the basic requirements to apply?", a: "Legal entity proof, scope of work definition, and operational documentation." },
];

// --- Design Components ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
    <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1.5 px-4 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-sm uppercase tracking-widest mb-4 border border-[#B2DFDB]">
            {subtitle}
        </span>
        <h3 className="mb-4 text-2xl md:text-3xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
        </h3>
        <p className="text-slate-500 text-sm md:text-base max-w-3xl leading-relaxed mx-auto">
            {description}
        </p>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
        <button
            className="flex items-center justify-between w-full p-4 text-left"
            onClick={onClick}
        >
            <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                {faq.q}
            </h3>
            <div className="flex-shrink-0">
                {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
            </div>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <p className={`px-4 pb-4 text-sm md:text-base leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
                {faq.a}
            </p>
        </div>
    </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
    <section id="iso-overview-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Standards" title="Global Excellence" description="Standardize your business practices to compete on an international stage." />
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-8 text-slate-600 leading-relaxed">
                    <p>
                        <strong>ISO Certification</strong> is the process of proving that your business meets international standards, such as quality management or information security, through audits by an accredited certification body.
                    </p>
                    <p>
                        It ensures compliance with global benchmarks, builds customer trust, and enhances your market reputation. ISO helps businesses improve efficiency and credibility globally.
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">IAF Accredited</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Govt Recognized</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Global Scale</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A7F7D]/5 rounded-bl-full transition-all group-hover:w-32 group-hover:h-32"></div>
                    <Award className="w-12 h-12 text-[#1A7F7D] mb-6" />
                    <h4 className="text-xl font-bold text-slate-800 mb-2 uppercase tracking-wide">Standardized Practices</h4>
                    <p className="text-sm text-slate-500 italic mb-6">Promoting quality management and continuous improvement via globally recognized benchmarks.</p>
                    <div className="flex gap-5">
                        <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center">
                            <span className="block text-2xl font-bold text-[#1A7F7D]">3Y</span>
                            <span className="block text-sm text-slate-400 uppercase">Validity</span>
                        </div>
                        <div className="flex-1 bg-slate-50 p-4 rounded-xl text-center">
                            <span className="block text-2xl font-bold text-[#1A7F7D]">Annual</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const StandardsContent = () => (
    <section id="iso-standards-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Portfolio" title="Popular ISO Standards" description="Tailored support for operational excellence across various industries." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {popularISOStandards.map((std, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:border-[#1A7F7D]/20 space-y-8">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1A7F7D] mx-auto"><std.icon size={24} /></div>
                        <h5 className="font-bold text-slate-800 text-lg">{std.title}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{std.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="iso-benefits-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Impact" title="Business Transformation" description="Why ISO certification is a strategic investment for growth." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {isoBenefits.map((item, i) => (
                    <div key={i} className="flex gap-5 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-[#F0FDFA] text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><item.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg mb-1">{item.title}</h6>
                            <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FrameworkContent = () => (
    <section id="iso-framework-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Compliance" title="Legal Framework in India" description="A structured ecosystem overseen by national bodies to ensure international quality." />
            <div className="grid md:grid-cols-3 gap-10">
                {legalFramework.map((body, i) => (
                    <div key={i} className="p-8 bg-slate-900 rounded-3xl text-white relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:bg-white/10 transition-all"></div>
                        <body.icon className="w-10 h-10 text-[#C59B4E] mb-6" />
                        <h5 className="text-lg font-bold mb-3">{body.title}</h5>
                        <p className="text-sm text-slate-400 leading-relaxed italic">{body.role}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-8 bg-[#E0F2F1] rounded-2xl border-l-4 border-l-[#1A7F7D] text-slate-700 italic text-sm text-center">
                "Compliance involves regular evaluations by NABCB/QCI recognized bodies to ensure authenticity."
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="iso-documents-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <SectionHeading subtitle="Paperwork" title="Checklist & Costs" description="Advance planning ensures a smooth certification journey." align="left" />
                    <div className="grid grid-cols-2 gap-5">
                        {isoDocuments.map((doc, i) => (
                            <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-5">
                                <doc.icon size={16} className="text-[#C59B4E]" />
                                <span className="text-sm font-semibold text-slate-600 uppercase tracking-tight">{doc.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-8 pt-10">
                    <div className="p-8 bg-[#103B3E] rounded-3xl text-white">
                        <h4 className="text-lg font-bold text-[#C59B4E] mb-4 flex items-center gap-5"><DollarSign size={20} /> Pricing</h4>
                        <p className="text-sm italic text-slate-400 mb-6">{isoCostTime.cost}</p>
                        <h4 className="text-base font-bold text-white mb-4">Time Breakdown</h4>
                        <ul className="space-y-8">
                            {isoCostTime.timeBreakdown.map((t, idx) => (
                                <li key={idx} className="flex gap-5 text-sm text-slate-300 italic group items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C59B4E] group-hover:scale-125 transition-all"></div>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="iso-process-content" className="py-16 md:py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Journey" title="Step-by-Step ISO" description="A structured, multi-stage audit and implementation process." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-10 relative">
                {isoProcessSteps.map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
                            <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">✓</div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed italic px-2 font-medium">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const RenewalContent = () => (
    <section id="iso-renewal-content" className="py-12 md:py-16 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Continuity" title="Maintenance & Audits" description="Commitment to excellence beyond the initial certificate." />
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-8">
                    <div className="w-12 h-12 bg-slate-50 text-[#1A7F7D] rounded-xl flex items-center justify-center"><RefreshCw size={24} /></div>
                    <h4 className="text-xl font-bold text-slate-800">Renewal Logistics</h4>
                    <p className="text-sm text-slate-500 leading-relaxed italic">{isoRenewal.renewalProcess}</p>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-8">
                    <div className="w-12 h-12 bg-slate-50 text-[#1A7F7D] rounded-xl flex items-center justify-center"><Search size={24} /></div>
                    <h4 className="text-xl font-bold text-slate-800">Surveillance Audits</h4>
                    <p className="text-sm text-slate-500 leading-relaxed italic">{isoRenewal.auditFrequency}</p>
                    <p className="text-sm text-[#C59B4E] font-bold uppercase tracking-wider">Purpose: Check ongoing compliance.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="iso-why-Bizzfiling" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 lg:pr-10">
                    <SectionHeading subtitle="Value" title="ISO Assistance with Confidence" description="Transparency and Expertise for a faster turnaround." align="left" />
                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        <div className="space-y-8">
                            <h6 className="font-bold text-slate-800 flex items-center gap-5 text-lg"><CheckCircle className="text-[#1A7F7D]" size={16} /> End-to-End</h6>
                            <p className="text-sm text-slate-500 italic">Guidance from document prep to final certificate issuance.</p>
                        </div>
                        <div className="space-y-8">
                            <h6 className="font-bold text-slate-800 flex items-center gap-5 text-lg"><DollarSign className="text-[#1A7F7D]" size={16} /> Transparent</h6>
                            <p className="text-sm text-slate-500 italic">All-in-one packages with zero hidden costs.</p>
                        </div>
                        <div className="space-y-8">
                            <h6 className="font-bold text-slate-800 flex items-center gap-5 text-lg"><Clock className="text-[#1A7F7D]" size={16} /> Fast Processing</h6>
                            <p className="text-sm text-slate-500 italic">Approx. 13-15 working days turnaround for most standards.</p>
                        </div>
                        <div className="space-y-8">
                            <h6 className="font-bold text-slate-800 flex items-center gap-5 text-lg"><Scale className="text-[#1A7F7D]" size={16} /> Compliance</h6>
                            <p className="text-sm text-slate-500 italic">Ensuring adherence to IAF and legal regulations.</p>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col items-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <Award className="w-16 h-16 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold text-white mb-4 text-center font-serif">India's Leading ISO Facilitator</h4>
                    <p className="text-slate-400 text-sm text-center italic mb-8">"Streamlining global standards for small and large enterprises."</p>
                    <button className="px-10 py-4 bg-[#C59B4E] hover:bg-[#a37d35] text-white font-bold uppercase tracking-widest text-sm rounded-full transition-all">Apply Now</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function ISOCertificationPage() {
    const [activeTab, setActiveTab] = useState('iso-overview-content');
    const [faqOpen, setFaqOpen] = useState(null);
    const SCROLL_OFFSET = 140;

    useEffect(() => {
        const sectionIds = tabs.map(tab => tab.id);
        const handleScroll = () => {
            let currentActiveTab = sectionIds[0];
            for (let i = 0; i < sectionIds.length; i++) {
                const sectionId = sectionIds[i];
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= SCROLL_OFFSET + 50) currentActiveTab = sectionId;
                }
            }
            setActiveTab(prev => (prev !== currentActiveTab ? currentActiveTab : prev));
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - SCROLL_OFFSET + 20,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 selection:bg-[#1A7F7D] selection:text-white">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            {/* Hero Section - Premium Style */}
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="ISO Certification" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Award size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">IAF Accredited ISO Solutions</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Get Your Business <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">ISO Certified</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                Standardize your operations and build global trust. We provide end-to-end certification support for ISO 9001, 27001, 14001, and more.
                            </p>
<StartNowButton />
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> 100% Verified
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Globe size={18} className="text-[#C59B4E]" /> Global Acceptance
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Online</h3>
                                    <LeadForm serviceName="ISO Certification" btnText="Apply Now" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-10 overflow-x-auto no-scrollbar py-0">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    className={`py-5 text-sm md:text-sm font-bold uppercase tracking-widest border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#0F2D30] border-[#C59B4E]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <OverviewContent />
            <StandardsContent />
            <BenefitsContent />
            <FrameworkContent />
            <DocumentsContent />
            <ProcessContent />
            <RenewalContent />
            <WhyBizzfiling />

            <section id="iso-faqs-content" className="py-16 md:py-20 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="Guide" title="ISO Frequently Asked" description="Clarifying standard protocols and audit requirements." />
                    <div className="space-y-8 pt-10">
                        {isoFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}