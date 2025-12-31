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
    Banknote,
    BookOpen,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- APEDA REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'apeda-overview-content', label: 'Overview' },
    { id: 'apeda-products-content', label: 'Products & Role' },
    { id: 'apeda-benefits-content', label: 'Benefits' },
    { id: 'apeda-eligibility-content', label: 'Eligibility' },
    { id: 'apeda-process-content', label: 'Process' },
    { id: 'apeda-challenges-content', label: 'Challenges' },
    { id: 'apeda-why-Bizzfiling', label: 'Why Us' },
    { id: 'apeda-faqs-content', label: 'FAQs' },
];

const apedaIntroBullets = [
    "Streamline your agri-export business with expert-assisted APEDA registration.",
    "100% online process including documentation, DGFT filing, and RCMC application.",
    "Top legal support to comply with all export regulations and grow global.",
];

const apedaProducts = [
    "Fruits & Vegetables", "Meat & Meat Products", "Poultry & Dairy", "Confectionery & Bakery",
    "Honey & Sugar", "Cocoa & Chocolates", "Alcoholic Beverages", "Cereal & Cereal Products",
    "Floriculture Products", "Herbal & Medicinal", "Guar Gum & Pickles"
];

const apedaRoles = [
    { title: "Export Development", detail: "Actively supports production and development of scheduled goods for export.", icon: TrendingUp },
    { title: "Quality Inspection", detail: "Sets strict requirements and inspects products to guarantee market conformity.", icon: Scale },
    { title: "Financial Subsidies", detail: "Provides assistance for infrastructure, quality, and market development.", icon: DollarSign },
    { title: "Packaging Support", detail: "Offers assistance in improving marketing tactics to stand out internationally.", icon: Zap },
    { title: "Market Intelligence", detail: "Gathers global demand data and offers training on global standards.", icon: Lightbulb },
];

const apedaBenefits = [
    { title: "Legal Authority (RCMC)", icon: BookOpen, detail: "Grants legal authority to export scheduled products and confirms compliance." },
    { title: "Global Market Access", icon: Globe, detail: "Mandatory for international markets and helps streamline customs clearance." },
    { title: "Govt Incentives", icon: Handshake, detail: "Eligibility for financial assistance, subsidies, and export tax benefits." },
    { title: "Infrastructure Support", icon: CheckCircle, detail: "Access to subsidies for cold storage and integrated pack houses." },
    { title: "Enhanced Visibility", icon: Zap, detail: "Enhance brand credibility in the global market with a competitive edge." },
    { title: "Capacity Building", icon: Users, detail: "Participate in APEDA-organized training to improve export scale." },
];

const apedaDocuments = [
    { title: "Import Export Code", detail: "IEC certificate issued by DGFT.", icon: FileText },
    { title: "Bank Certificate", detail: "Signed bank proof confirming account details.", icon: Banknote },
    { title: "Statement", detail: "Latest two months' bank statement of the firm.", icon: DollarSign },
    { title: "FSSAI Certificate", detail: "Mandatory for food safety standards.", icon: Briefcase },
    { title: "PAN/GST Proof", detail: "Entity identity and tax registration cards.", icon: FileText },
    { title: "Portal Form", detail: "Duly filled application on APEDA portal.", icon: FileText },
];

const apedaProcessSteps = [
    "Portal Registration: Verify IE Code, Mobile, and Email via OTP.",
    "Fill Application: Enter business, product, and bank details.",
    "Upload Documents: PAN, IEC, Bank Cert in PDF/JPEG format.",
    "Filing Fees: Pay prescribed fee (INR 5000+ for MSMEs).",
    "Verification: APEDA officials review and approve the dataset.",
    "Download RCMC: Issue and download certificate from portal login.",
];

const apedaFees = [
    { category: "MSME Entities", fee: "₹5,000 + GST", validity: "5 Financial Years" },
    { category: "Large Enterprises", fee: "₹10,000 + GST", validity: "5 Financial Years" },
];

const apedaChallenges = [
    { title: "Documentation Complexity", issue: "Dealing with FSSAI, IEC, and Bank formats often lead to rejections.", solution: "Meticulous review ensuring all formats match DGFT standards.", icon: FileText },
    { title: "Verification Delays", issue: "Slow government processing or incorrect info can pause approval.", solution: "Proactive tracking and follow-up with APEDA regional offices.", icon: Clock },
    { title: "FSSAI Pre-requisite", issue: "FSSAI must be ready first, adding complexity.", solution: "Simultaneous FSSAI + APEDA processing to save 2-3 weeks.", icon: CheckCircle },
];

const apedaWhyBizzfiling = [
    { title: "Expert-Assisted", detail: "Our team handles the entire documentation and DGFT nexus.", icon: UserCheck },
    { title: "Turnaround Speed", detail: "Quick filing to ensure the RCMC is issued without portal lag.", icon: Clock },
    { title: "Regulatory Nexus", detail: "We manage IEC, GST, and FSSAI prerequisites seamlessly.", icon: Scale },
    { title: "Zero Error Guarantee", detail: "Minimizing risks of cancellation or deactivation.", icon: Zap },
];

const apedaFAQs = [
    { q: "What is APEDA authority?", a: "A statutory body established in 1985 to promote and develop export of scheduled agricultural products." },
    { q: "How long does the RCMC process take?", a: "Filing takes 2 days; Approval usually takes 7-15 working days post-verification." },
    { q: "What are the registration costs?", a: "Government fee starts at ₹5,000 + GST for MSMEs. Professional fees vary." },
    { q: "Can I export multiple products under one RCMC?", a: "Yes, once registered, multiple scheduled products can be exported under a single RCMC." },
    { q: "Is it mandatory for domestic sales?", a: "No, APEDA RCMC is only required for the export of scheduled agricultural items." },
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
    <section id="apeda-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Agri-Export" title="APEDA RCMC Authority" description="The mandatory gateway for agricultural exporters to access global food markets." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        The <strong>APEDA</strong> is a statutory body established in 1985 to promote the export of fruits, meat, dairy, and alcoholic beverages.
                    </p>
                    <p>
                        To export these goods, you must obtain an <strong>Import Export Code (IEC)</strong> and then complete APEDA registration to receive the <strong>RCMC Certificate</strong>, which is mandatory for customs clearance.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase tracking-tighter">Statutory Body</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase tracking-tighter">RCMC Verification</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl border-r-[12px] border-r-[#1A7F7D]">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tight uppercase italic">RCMC Required For:</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {apedaProducts.slice(0, 4).map((p, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                                <CheckCircle size={14} className="text-[#1A7F7D]" />
                                <span className="text-[10px] font-bold text-slate-600 uppercase">{p}</span>
                            </div>
                        ))}
                        <div className="col-span-2 flex items-center justify-center p-2 bg-[#E0F2F1] rounded-xl text-[10px] font-bold text-[#1A7F7D] uppercase">
                            & 10+ Other Categories
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ProductsRoleContent = () => (
    <section id="apeda-products-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Ecosystem" title="The Role & Coverage" description="How APEDA supports development and inspections for Indian farm produce." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {apedaRoles.map((role, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col space-y-4 hover:bg-white hover:shadow-2xl transition-all h-full">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center shrink-0"><role.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-sm italic uppercase tracking-tighter">{role.title}</h6>
                        <p className="text-xs text-slate-500 italic leading-relaxed">{role.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="apeda-benefits-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Strategic Plan" title="RCMC Registration Value" description="Building a legal and financial foundation for global competitiveness." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {apedaBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:rotate-12 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-xs text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const EligibilityContent = () => (
    <section id="apeda-eligibility-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Policy" title="Who Can Register?" description="Eligibility for manufacturers and exporters of scheduled agricultural goods." />
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 rounded-[40px] bg-slate-900 text-white relative flex flex-col items-center text-center group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:w-40 transition-all"></div>
                    <Ship size={40} className="text-[#C59B4E] mb-6" />
                    <h5 className="text-lg font-bold mb-4 uppercase italic">Merchant Exporters</h5>
                    <p className="text-xs text-slate-400 italic leading-relaxed">Companies that procure and export scheduled products must register to access international markets.</p>
                </div>
                <div className="p-8 rounded-[40px] bg-slate-900 text-white relative flex flex-col items-center text-center group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full group-hover:w-40 transition-all"></div>
                    <Factory size={40} className="text-[#C59B4E] mb-6" />
                    <h5 className="text-lg font-bold mb-4 uppercase italic">Manufacturers</h5>
                    <p className="text-xs text-slate-400 italic leading-relaxed">Agri-manufacturers wishing to export their production can register with proof of industrial COI or FPO status.</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {apedaFees.map((fee, i) => (
                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center shadow-sm">
                        <div>
                            <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fee.category}</h6>
                            <p className="text-xl font-extrabold text-[#1A7F7D] italic tracking-tight">{fee.fee}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-800 uppercase italic">Validity</span>
                            <p className="text-xs text-slate-500 italic">{fee.validity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="apeda-process-content" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Application" title="RCMC Portal Journey" description="A structured verification path handled entirely on the official APEDA e-Governance portal." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
                {apedaProcessSteps.map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:rotate-6">
                            <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white">✓</div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ChallengesContent = () => (
    <section id="apeda-challenges-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Scrutiny" title="Risks & Expert Solutions" description="Overcoming documentation logic and portal technicalities proactively." />
            <div className="grid md:grid-cols-3 gap-8">
                {apedaChallenges.map((item, i) => (
                    <div key={i} className="p-8 bg-slate-900 rounded-[32px] text-white space-y-4 hover:shadow-2xl transition-all border-b-8 border-b-[#C59B4E]">
                        <item.icon className="text-[#C59B4E]" size={32} />
                        <h6 className="font-bold text-sm tracking-widest uppercase italic">{item.title}</h6>
                        <p className="text-[10px] text-slate-400 leading-relaxed italic"><strong>Problem:</strong> {item.issue}</p>
                        <p className="text-[10px] text-[#A7F3D0] font-bold uppercase underline">Expert Fix: {item.solution}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="apeda-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Confidence" title="Assisted Agri-Exporters" description="Ensuring zero-error compliance across all APEDA and DGFT protocols." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {apedaWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-4"><s.icon size={20} /></div>
                                <h6 className="font-bold text-slate-800 text-sm mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                <p className="text-[10px] text-slate-500 italic">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] text-white flex flex-col items-center text-center shadow-3xl">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase">Excellence in Export</h4>
                    <p className="text-slate-400 text-xs italic mb-8">"Facilitating agricultural trade worth billions of dollars for Indian enterprises annually."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] shadow-lg hover:bg-[#a37d35] transition-all">Contact Expert</button>
                </div>
            </div>
        </div>
    </section>
);

const Factory = ({ size, className }) => <Users size={size} className={className} />;
const Ship = ({ size, className }) => <Globe size={size} className={className} />;

// --- Main Component ---

export default function APEDARegistrationPage() {
    const [activeTab, setActiveTab] = useState('apeda-overview-content');
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
                    <img src={BackgroundImageSrc} alt="APEDA Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">APEDA <br /> Registration</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">RCMC Authority</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Agri-Export <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest">RCMC Power</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {apedaIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white lg:text-3xl text-2xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">MSME</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Incentives</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white lg:text-3xl text-2xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">Global</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Recognition</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[48px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">Secure RCMC</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Professional APEDA Compliance</p>
                                <LeadForm serviceName="APEDA Registration" btnText="Apply Now" />
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
            <ProductsRoleContent />
            <BenefitsContent />
            <EligibilityContent />
            <ProcessContent />
            <ChallengesContent />
            <WhyBizzfiling />

            <section id="apeda-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="APEDA Knowledge Hub" description="Essential guidance for exporters dealing with scheduled products." />
                    <div className="space-y-4 pt-10">
                        {apedaFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}