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
    Users,
    DollarSign,
    Clock,
    Landmark,
    AlertTriangle,
    BookOpen,
    MapPin,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Gem
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- HALLMARK REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'hallmark-overview-content', label: 'Overview' },
    { id: 'hallmark-metals-standards', label: 'Metals' },
    { id: 'hallmark-benefits-content', label: 'Benefits' },
    { id: 'hallmark-framework-content', label: 'Legal Framework' },
    { id: 'hallmark-eligibility-docs', label: 'Eligibility' },
    { id: 'hallmark-procedure-content', label: 'Procedure' },
    { id: 'hallmark-compliance-content', label: 'Compliance' },
    { id: 'hallmark-faqs-content', label: 'FAQs' },
];

const hallmarkIntroBullets = [
    "Get a competitive edge with BIS hallmark certification, ensuring product purity.",
    "Build customer trust by certifying your products meet India’s highest standards.",
    "Expert-assisted, hassle-free registration and HUID compliance starting at ₹5000 + GST.",
];

const metalsAndPurity = [
    { metal: "Gold Purity", detail: "Levels from 999 (24K) to 750 (18K) purity tags.", icon: DollarSign },
    { metal: "Silver Grade", detail: "Symbols like 925 (92.5%) and lion passant stamps.", icon: Scale },
    { metal: "Platinum Tech", detail: "99.9 purest grades with diamond shape scale marks.", icon: Gem },
];

const hallmarkBenefits = [
    { title: "Consumer Credibility", icon: Handshake, detail: "Boosts trust by confirming products meet BIS purification standards." },
    { title: "BIS Act Safety", icon: Scale, detail: "Safeguards against legal violations via mandatory hallmarking compliance." },
    { title: "Market Premium", icon: TrendingUp, detail: "Hallmarked pieces hold higher market and resale value globally." },
    { title: "Transparency", icon: Zap, detail: "Prevents trade fraud and protects buyers from substandard metal alloys." },
    { title: "Traceability", icon: Search, detail: "HUID system ensures item-level tracking back to the source center." },
    { title: "Quality Shield", icon: CheckCircle, detail: "Official guarantee of purity, fineness, and precious metal weight." },
];

const hallmarkFramework = [
    { title: "BIS Act 2016", detail: "The apex legislation authorizing BIS to set purity standards.", icon: BookOpen },
    { title: "HUID Regulation", detail: "6-digit unique IDs mandatory for all gold pieces since 2023.", icon: CheckCircle },
    { title: "Audit Protocols", detail: "Regular center and shop audits to ensure stamping integrity.", icon: Landmark },
];

const hallmarkDocs = [
    { title: "ROC/Deed", detail: "Proof of legal entity registration status.", icon: Briefcase },
    { title: "GST Certificate", detail: "Active GSTIN mandatory for bullion trade.", icon: DollarSign },
    { title: "Premise Proof", detail: "Sale deed or valid lease agreement for the outlet.", icon: MapPin },
    { title: "CA Certificate", detail: "Revenue proof if turnover exceeds ₹40 lakhs.", icon: FileText },
    { title: "Director KYC", detail: "Aadhaar/PAN of the authorized signatory.", icon: Users },
    { title: "Signatures", detail: "Aadhaar-based e-sign or digital verification data.", icon: Zap },
];

const procedureStages = [
    "Homogeneity: Sampling metal pieces per BIS batch regulation.",
    "Purity Assay: XRF or Fire Assay testing at recognized centers.",
    "Final Stamping: Applying HUID, BIS logo, and Jeweller marks.",
];

const complianceNexus = [
    { title: "Authorized Testing", detail: "Goods must be processed at BIS-certified Assaying centers.", icon: CheckCircle },
    { title: "Audit Readiness", detail: "BIS officials conduct unscheduled purity checks and audits.", icon: Landmark },
    { title: "Record Keeper", detail: "Detailed transaction and certification logs must be maintained.", icon: FileText },
    { title: "Annual Renewal", detail: "Licensing requires periodic renewal and technical data updates.", icon: Clock },
];

const hallmarkFAQs = [
    { q: "What is HUID?", a: "Hallmark Unique Identification is a 6-digit alphanum code mandatory for gold jewelry since 2023." },
    { q: "Is hallmarking mandatory?", a: "Yes, for gold artifacts and jewelry sold by registered retailers in India." },
    { q: "How long does it take?", a: "The BIS registration process usually spans 30 to 45 days including center nexus setup." },
    { q: "How much does it cost?", a: "Nominal fees apply for assaying per piece PLUS the statutory registration charges." },
    { q: "Can consumers verify it?", a: "Yes, the BIS Care mobile app allows anyone to check HUID and jeweler authenticity." },
];

// --- Design Components ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
    <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1.5 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-semibold text-[11px] uppercase tracking-widest mb-3 border border-[#B2DFDB]">
            {subtitle}
        </span>
        <h3 className="mb-3 text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
            {title}
        </h3>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
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
            <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
                {faq.a}
            </p>
        </div>
    </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
    <section id="hallmark-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Authenticity" title="BIS Hallmarking Standards" description="The definitive certificate of quality and purity for gold and silver in the Indian market." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        Hallmark registration in India is managed by the <strong>Bureau of Indian Standards (BIS)</strong>. It certifies the fineness and purity of precious metals, aligning with specific Indian Standards.
                    </p>
                    <p>
                        Every piece includes a Jeweller Mark, Assay Center sign, and the mandatory <strong>HUID (Hallmark Unique ID)</strong>. This ensures traceability and builds premium consumer confidence.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">BIS ACCREDITED</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">HUID MANDATORY</span>
                    </div>
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[50px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A7F7D]/5 rounded-bl-full group-hover:scale-110 transition-all"></div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6 tracking-tight uppercase italic flex items-center gap-2">
                        <Search size={20} className="text-[#1A7F7D]" />
                        Traceability
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic mb-6">Since 2023, the 6-digit HUID tag is mandatory. Buyers can check the purity and source jeweler instantly using the official BIS Care mobile application.</p>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#C19A5B] shadow-sm"><FilePenLine size={20} /></div>
                        <span className="text-[9px] font-extrabold text-slate-700 uppercase tracking-widest leading-tight italic">Laser Serial Marking <br /> 100% Tamper Proof</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const MetalsContent = () => (
    <section id="hallmark-metals-standards" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Assets" title="Precious Metals Scope" description="Standards for gold, silver and platinum purity grades per BIS norms." />
            <div className="grid md:grid-cols-3 gap-8 text-center">
                {metalsAndPurity.map((m, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm text-[#1A7F7D] flex items-center justify-center mx-auto mb-6"><m.icon size={32} /></div>
                        <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic">{m.metal}</h6>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed">{m.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="hallmark-benefits-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Value" title="Premium Competitive Edge" description="Scaling jeweler credibility through official purity guarantees and HUID tech." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hallmarkBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-xs text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FrameworkContent = () => (
    <section id="hallmark-framework-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Legal" title="Legislative Pure-Metal Hub" description="The BIS Act 2016 and the mandatory hallmarking guidelines for retailers." />
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {hallmarkFramework.map((f, i) => (
                    <div key={i} className="p-8 bg-slate-900 rounded-[40px] text-white flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-[#C59B4E]/10 flex items-center justify-center text-[#C59B4E] rounded-full"><f.icon size={24} /></div>
                        <h6 className="font-bold text-sm uppercase italic tracking-widest">{f.title}</h6>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic">{f.detail}</p>
                    </div>
                ))}
            </div>
            <div className="p-10 bg-indigo-50 rounded-[48px] border-l-8 border-l-[#1A7F7D] flex flex-col md:flex-row gap-8 items-center shadow-xl">
                <Rocket size={48} className="text-[#1A7F7D] shrink-0" />
                <div>
                    <h5 className="font-bold text-slate-800 text-sm uppercase italic tracking-tighter mb-2">Registration Categories</h5>
                    <p className="text-xs text-slate-500 leading-relaxed italic"><strong>Jeweller Outlets:</strong> Mandatory for every physical shop selling gold articles. <br /><strong>Assaying Centers:</strong> Third-party recognized labs that certify metal purity for jewelers.</p>
                </div>
            </div>
        </div>
    </section>
);

const EligibilityDocs = () => (
    <section id="hallmark-eligibility-docs" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Vault" title="Who Must Register?" description="Retailers, Manufacturers and Exporters of bullion/jewelry items." />
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                {['Jewellers & Retailers', 'Jewellery Manufacturers', 'Exporters & Importers'].map((t, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 italic font-bold uppercase tracking-tight text-[#1A7F7D] text-xs shadow-sm shadow-slate-200">
                        {t}
                    </div>
                ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hallmarkDocs.map((doc, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex gap-4 items-center shadow-sm">
                        <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><doc.icon size={20} /></div>
                        <div className="text-left">
                            <h6 className="font-bold text-slate-800 text-xs italic uppercase mb-1 tracking-tight">{doc.title}</h6>
                            <p className="text-[10px] text-slate-400 italic font-medium">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcedureContent = () => (
    <section id="hallmark-procedure-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Methodology" title="BIS Testing Workflow" description="A scientific 3-stage process involving homogeneity checks and fire assay." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {procedureStages.map((step, idx) => (
                    <div key={idx} className="relative p-10 bg-slate-50 rounded-[50px] border border-slate-100 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A7F7D]/5 rounded-bl-[100px] group-hover:scale-125 transition-all"></div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A7F7D] font-bold shadow-md border border-slate-200">0{idx + 1}</div>
                        <p className="text-xs text-slate-700 leading-relaxed font-bold italic uppercase tracking-tighter">{step}</p>
                    </div>
                ))}
            </div>
            <div className="mt-16 grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900 text-white rounded-[40px] text-left border-b-4 border-b-[#C59B4E]">
                    <h4 className="font-bold text-[#C59B4E] uppercase italic text-xs mb-4 flex items-center gap-2 tracking-widest leading-tight italic decoration-[#C59B4E] underline underline-offset-8"> Fire Assay Testing (Cupellation)</h4>
                    <p className="text-[11px] text-slate-400 italic">Considered the global gold standard for purity testing. The metal is melted to separate impurities, leaving the 100% pure core for measurement.</p>
                </div>
                <div className="p-8 bg-slate-900 text-white rounded-[40px] text-left border-b-4 border-b-[#C59B4E]">
                    <h4 className="font-bold text-[#C59B4E] uppercase italic text-xs mb-4 flex items-center gap-2 tracking-widest leading-tight italic decoration-[#C59B4E] underline underline-offset-8"> XGF / XRF Rapid Testing</h4>
                    <p className="text-[11px] text-slate-400 italic">A non-destructive method using X-ray tech to determine precious metal content instantly, perfect for high-volume initial screening.</p>
                </div>
            </div>
        </div>
    </section>
);

const ComplianceNexusContent = () => (
    <section id="hallmark-compliance-content" className="py-20 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Integrity" title="Post-Registration Nexus" description="Continuous adherence to technical audits and record-keeping mandates." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {complianceNexus.map((c, i) => (
                    <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 flex flex-col items-start gap-4 hover:shadow-xl transition-all h-full">
                        <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><c.icon size={20} /></div>
                        <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter leading-tight">{c.title}</h6>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">{c.detail}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-10 bg-[#103B3E] rounded-[48px] text-white flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="flex gap-6 items-center">
                    <Award className="text-[#C59B4E] shrink-0" size={48} />
                    <div>
                        <h5 className="font-bold text-[#C59B4E] uppercase italic tracking-widest mb-2 underline decoration-[#C59B4E] underline-offset-8">Bureau of Indian Standards Hub</h5>
                        <p className="text-xs text-slate-400 italic">"Simplifying hallmark compliance for the Indian jewelry industry."</p>
                    </div>
                </div>
                <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function HallmarkRegistrationPage() {
    const [activeTab, setActiveTab] = useState('hallmark-overview-content');
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

            {/* Hero */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Hallmark Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">Hallmark <br /> Registration</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">BIS CERTIFIED</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Bulllion <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">Pure Purity</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {hallmarkIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">BIS</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Accredited</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">HUID</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Standard Tag</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">Hallmark Now</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Official BIS Jeweller Hub</p>
                                <LeadForm serviceName="Hallmark Registration" btnText="Apply Now" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center gap-6 md:gap-12 py-0 min-w-max list-none">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    className={`py-5 text-[11px] md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-widest ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <OverviewContent />
            <MetalsContent />
            <BenefitsContent />
            <FrameworkContent />
            <EligibilityDocs />
            <ProcedureContent />
            <ComplianceNexusContent />

            <section id="hallmark-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Bullion Intelligence" description="Clearing compliance and registry protocols for purity Grade and BIS marking." />
                    <div className="space-y-4 pt-10">
                        {hallmarkFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}