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
    Globe,
    MapPin,
    RefreshCw,
    Calculator,
    AlertTriangle,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Factory
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- BIS REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'bis-overview-content', label: 'Overview' },
    { id: 'bis-benefits-content', label: 'Benefits' },
    { id: 'bis-types-content', label: 'Schemes & Products' },
    { id: 'bis-documents-content', label: 'Documents' },
    { id: 'bis-process-content', label: 'Process' },
    { id: 'bis-validity-content', label: 'Validity' },
    { id: 'bis-why-Bizzfiling', label: 'Why Us' },
    { id: 'bis-faqs-content', label: "FAQs" },
];

const bisIntroBullets = [
    "Boost your product credibility with an official ISI mark and BIS certification.",
    "Expert support throughout the BIS registration and factory audit process.",
    "Ensure quality compliance to build trust and expand your global market reach.",
];

const bisRoles = [
    { title: "Standard Formulation", icon: Landmark, detail: "Publishes Indian Standards (IS) defining quality and safety benchmarks." },
    { title: "Certification Power", icon: CheckCircle, detail: "Mandatory and voluntary schemes allowing products to display the BIS Mark." },
    { title: "Conformity Assessment", icon: Briefcase, detail: "Conducts testing and factory audits to ensure consistent production." },
    { title: "Consumer Shield", icon: Users, detail: "Provides assurance of product reliability, safety, and durability." },
];

const bisBenefits = [
    { title: "ISI Trust Mark", icon: CheckCircle, detail: "Credible proof of safety and reliability, enhancing consumer loyalty." },
    { title: "Market Reputation", icon: Zap, detail: "Demonstrates commitment to high-end compliance and quality culture." },
    { title: "TQM Implementation", icon: Scale, detail: "Frame for implementing Total Quality Management in production lines." },
    { title: "Global Scaling", icon: Globe, detail: "Facilitates recognition and compliance with international quality norms." },
    { title: "Cost Reduction", icon: TrendingUp, detail: "Adhering to standards reduces waste and eliminates overhead expenses." },
    { title: "Expert Guideline", icon: Lightbulb, detail: "Implementation of customized quality systems for specific sectors." },
];

const compulsoryProducts = [
    "Electronics & IT Goods",
    "Automobile Components",
    "Cement & Building Materials",
    "Household Electricals",
    "Food & Edible Items",
    "Medical Devices",
    "Steel Products",
    "Toys & Educational Gear",
];

const bisDocuments = [
    { title: "Test Reports", detail: "From BIS-recognized labs verifying IS code compliance.", icon: FileText },
    { title: "Production Plan", detail: "Quality control measures during manufacturing cycles.", icon: Briefcase },
    { title: "Factory Proof", detail: "Document confirming precise location of production units.", icon: MapPin },
    { title: "Trademark Info", detail: "Authorization to use specific brands on certified goods.", icon: FileText },
    { title: "Payment Ledger", detail: "Proof of statutory application and auditing fee payouts.", icon: DollarSign },
    { title: "Tech Description", detail: "Detailed manufacturing process and intended product use.", icon: FileText },
];

const registrationSteps = [
    "Product ID: Checking if product qualifies for Mandatory ISI/CRS.",
    "Data Filing: Completing portal forms with tech specifications.",
    "Verification: BIS review of tech reports and factory credentials.",
    "Factory Audit: Physical inspection by BIS-appointed officials.",
    "Sample Testing: Lab assessment of production-line samples.",
    "License Issue: Grant of BIS certificate and mark authorization.",
];

const bisValidity = [
    { title: "Block Period", detail: "Certificates are usually valid for one to five years.", icon: Clock },
    { title: "Renewal Ledger", detail: "Updating test reports before current certificate expires.", icon: RefreshCw },
    { title: "Annual Audit", icon: Calculator, detail: "Regular surveillance audits to maintain the BIS status." },
];

const bisWhyBizzfiling = [
    { title: "Protocol Experts", detail: "Navigating the complex CRS and ISI factory audit technicals.", icon: UserCheck },
    { title: "Lab Nexus", detail: "Assistance in coordinating with recognized labs for fast reports.", icon: Beaker },
    { title: "Error-Free Data", detail: "Precision in tech specifications to avoid application rejection.", icon: Zap },
    { title: "End-to-End Hub", detail: "From product ID to final surveillance and renewal cycles.", icon: ShieldCheck },
];

const bisFAQs = [
    { q: "What is CRS?", a: "Compulsory Registration Scheme for electronics and IT products under BIS norms." },
    { q: "How long is it valid?", a: "Minimum of 1 and maximum of 5 years depending on the category and product." },
    { q: "What is the ISI mark?", a: "A mark for industrial products in India, certifying that a product conforms to an Indian Standard." },
    { q: "Is factory audit mandatory?", a: "Yes, for the ISI marking scheme, a BIS inspector must visit the production unit." },
    { q: "What is the cost?", a: "Filing services start at ₹4,500 plus statutory testing and lab charges." },
];

const Beaker = ({ size, className }) => <Search size={size} className={className} />;
const ShieldCheck = ({ size, className }) => <CheckCircle size={size} className={className} />;

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
    <section id="bis-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Standards" title="BIS National Authority" description="The Bureau of Indian Standards (BIS) establishes the quality, safety, and reliability benchmark for products in India." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        Established under the <strong>BIS Act, 2016</strong>, the Bureau functions as the national standards body. It formulates and implements benchmarks across various sectors.
                    </p>
                    <p>
                        The goal is to enhance consumer protection and promote the <strong>'Made in India'</strong> brand globally. Products meeting these norms display the prestigious BIS certificate.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">BIS Act 2016</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">ISI TRUST MARK</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {bisRoles.map((role, i) => (
                        <div key={i} className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col items-center text-center">
                            <role.icon size={28} className="text-[#1A7F7D] mb-4" />
                            <h6 className="font-bold text-slate-800 text-[10px] uppercase italic mb-1 tracking-tighter">{role.title}</h6>
                            <p className="text-[9px] text-slate-400 leading-relaxed italic">{role.detail}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="bis-benefits-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Advantage" title="Value of Certification" description="Implementing customized quality management systems to scale market reputation." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {bisBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-xs text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TypesContent = () => (
    <section id="bis-types-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="Schemes & Mandatory Products" description="Understanding the Compulsory Registration Scheme (CRS) and ISI Marking products." />
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <div className="p-10 bg-slate-900 rounded-[48px] text-white flex gap-8 items-center group relative overflow-hidden">
                    <Scale size={48} className="text-[#C59B4E] shrink-0" />
                    <div>
                        <h5 className="font-bold text-sm uppercase italic tracking-widest text-[#C59B4E] mb-2">Mandatory Nexus</h5>
                        <p className="text-xs text-slate-400 italic font-medium leading-relaxed">Required for IT, Electronics, Steel and Cement sectors before any sale.</p>
                    </div>
                </div>
                <div className="p-10 bg-slate-900 rounded-[48px] text-white flex gap-8 items-center group relative overflow-hidden">
                    <Zap size={48} className="text-[#C59B4E] shrink-0" />
                    <div>
                        <h5 className="font-bold text-sm uppercase italic tracking-widest text-[#C59B4E] mb-2">Voluntary Hub</h5>
                        <p className="text-xs text-slate-400 italic font-medium leading-relaxed">Strategic certification for non-regulated sectors to build market value.</p>
                    </div>
                </div>
            </div>
            <div className="mb-4 text-center">
                <h4 className="text-sm font-bold text-slate-800 uppercase italic mb-8 tracking-widest underline decoration-[#C19A5B] underline-offset-8">Compulsory Products Checklist</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {compulsoryProducts.map((p, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 italic shadow-sm">
                            <AlertTriangle size={16} className="text-red-500 shrink-0" />
                            <span className="text-[10px] font-bold text-slate-700 tracking-tight">{p}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="bis-documents-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Vault" title="Verification Documents" description="Lab reports and factory blueprints required for high-end certification." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bisDocuments.map((doc, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col items-center shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0"><doc.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic tracking-tighter">{doc.title}</h6>
                        <p className="text-[10px] text-slate-400 italic font-bold leading-relaxed">{doc.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="bis-process-content" className="py-24 bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Protocol" title="Registration Lifecycle" description="From digital filing to physical audits and lab sample testing." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
                {registrationSteps.map((step, idx) => (
                    <div key={idx} className="relative p-6 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:bg-[#C59B4E] transition-all">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold group-hover:bg-white group-hover:text-amber-900 transition-colors">0{idx + 1}</div>
                        <p className="text-[9px] text-slate-300 leading-relaxed font-bold italic uppercase tracking-tighter group-hover:text-blue-900">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ValidityContent = () => (
    <section id="bis-validity-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Continuity" title="Validity & Surveillance" description="Ensuring license maintenance through regular auditing cycles." />
            <div className="grid md:grid-cols-3 gap-12">
                {bisValidity.map((v, i) => (
                    <div key={i} className="flex gap-6 items-start p-8 bg-slate-50 rounded-[40px] group hover:bg-white hover:shadow-2xl transition-all">
                        <div className="w-12 h-12 bg-white rounded-2xl text-[#1A7F7D] shadow-sm flex items-center justify-center shrink-0"><v.icon size={28} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm italic mb-2 tracking-tight uppercase">{v.title}</h6>
                            <p className="text-[11px] text-slate-500 italic leading-relaxed">{v.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-8 bg-blue-50 border-l-8 border-l-blue-600 rounded-[40px] shadow-sm flex items-center gap-6">
                <RefreshCw size={48} className="text-blue-600 animate-spin-slow shrink-0" />
                <div>
                    <h5 className="font-extrabold text-blue-900 text-xs italic tracking-widest mb-1 uppercase">Surveillance Audit Protocol</h5>
                    <p className="text-xs text-blue-700 italic font-medium leading-relaxed">Regular checks of the manufacturing unit after certification to ensure any changes in production maintain the original ISI standard mark integrity.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="bis-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Confidence" title="BIS Strategic Partner" description="Simplifying the maze of test reports and factory inspection technicalities." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {bisWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 flex flex-col items-start gap-4">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                                <div>
                                    <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                    <p className="text-[10px] text-slate-500 italic leading-relaxed">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter leading-tight italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">ISI Mark Quality Nexus</h4>
                    <p className="text-slate-400 text-xs italic mb-8 px-8">"Facilitating Bureau of Indian Standards compliance for world-class manufacturing houses."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function BISRegistrationPage() {
    const [activeTab, setActiveTab] = useState('bis-overview-content');
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
            <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

            {/* Hero */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="BIS Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">BIS <br /> Registration</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">ISI Mark</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Quality <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">Statutory Mark</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {bisIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">ISI</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Standard Hub</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">CRS</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Portal Filing</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">BIS Apply</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Official Production Quality Hub</p>
                                <LeadForm serviceName="BIS Registration" btnText="Apply Now" />
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
            <BenefitsContent />
            <TypesContent />
            <DocumentsContent />
            <ProcessContent />
            <ValidityContent />
            <WhyBizzfiling />

            <section id="bis-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="BIS Quality Intelligence" description="Clearing compliance and registry protocols for ISI marks and compulsory schemes." />
                    <div className="space-y-4 pt-10">
                        {bisFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}