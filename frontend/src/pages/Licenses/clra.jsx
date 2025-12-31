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
    Shield,
    AlertTriangle,
    Lightbulb,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    HardHat
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- CLRA REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'clra-overview-content', label: 'Overview' },
    { id: 'clra-benefits-content', label: 'Benefits' },
    { id: 'clra-eligibility-content', label: 'Eligibility' },
    { id: 'clra-documents-content', label: 'Documents' },
    { id: 'clra-compliances-content', label: 'Compliances' },
    { id: 'clra-penalties-content', label: 'Penalties' },
    { id: 'clra-why-Bizzfiling', label: 'Why Us' },
    { id: 'clra-faqs-content', label: 'FAQs' },
];

const clraIntroBullets = [
    "Legalise your contract employment with expert CLRA registration & licensing.",
    "Simplify compliance with professional support for documentation and portal filing.",
    "Experience 100% online error-free processing backed by veteran labor law experts.",
];

const clraBenefits = [
    { title: "Statutory Shield", icon: Scale, detail: "Ensures legal compliance and helps avoid intricate labor court complications." },
    { title: "Worker Welfare", icon: Users, detail: "Guarantees rights like fair wages and safety amenities as mandated by the Act." },
    { title: "Liability Mitigation", icon: Shield, detail: "Reduces principal employer liability during accidental injuries or legal disputes." },
    { title: "Efficiency Boost", icon: TrendingUp, detail: "Mandated record-keeping increases operational transparency and workflow." },
    { title: "Brand Credibility", icon: Handshake, detail: "Demonstrates commitment to ethical labor practices and worker welfare." },
    { title: "Govt Nexus", icon: Landmark, detail: "Registration enables eligibility for various labor-centric government schemes." },
];

const clraEligibility = [
    { title: "20+ Labourers", detail: "Threshold for establishments employing contract workers in a FY.", icon: Users },
    { title: "Corporate status", detail: "PSUs and private firms engaged in trades listed in the CLRA Schedule.", icon: Briefcase },
    { title: "Registration Mandatory", detail: "Principal Employers must register BEFORE starting contract work.", icon: FilePenLine },
];

const clraExemptions = [
    "Casual work not exceeding 120 days in 12 months.",
    "Seasonal characters not exceeding 60 days in a year.",
    "Work done by immediate family of the employer.",
    "Apprentices under the Apprentices Act 1961.",
    "Construction work with total workforce below twenty.",
];

const clraDocs = [
    { title: "Trade License", detail: "Active municipal or trade permit of the establishment.", icon: Briefcase },
    { title: "Entity Proof", detail: "MOA/AOA or Partnership Deed for the legal firm.", icon: FileText },
    { title: "Factory License", detail: "Required if the site is a manufacturing unit.", icon: Landmark },
    { title: "Work Proof", detail: "Details of contract labour and deployment scope.", icon: FilePenLine },
    { title: "KYC Archive", detail: "Identity and address proof of the authorized person.", icon: Users },
    { title: "Signatories", detail: "Digital data for Aadhaar-based portal verification.", icon: Zap },
];

const employerResponsibilities = [
    "Registration: Official portal filing before project kick-off.",
    "Amenities: Providing canteens, restrooms, and daycare (creches).",
    "Fair Wages: Ensuring minimum wage compliance for all contract staff.",
    "Safety Gear: Providing protective equipment and on-site training.",
    "Returns: Periodic filing of registers and labor returns to the dept.",
];

const clraPenalties = [
    { title: "Non-Registration", penalty: "Imprisonment up to 3 months or ₹1,000 fine.", icon: DollarSign },
    { title: "Prohibited Labor", penalty: "Imprisonment up to 6 months or ₹2,000 fine.", icon: AlertTriangle },
    { title: "Condition Breach", penalty: "Revocation of license and statutory legal action.", icon: Shield },
    { title: "Willful Neglect", penalty: "Severe fines for ignoring safety or wage mandates.", icon: AlertTriangle },
];

const clraWhyBizzfiling = [
    { title: "Labor Law Specialists", detail: "Deep expertise in the 1970 Act and state-specific labor codes.", icon: UserCheck },
    { title: "Risk Identification", detail: "Proactive audit of site readiness to avoid departmental rejection.", icon: Search },
    { title: "Full Portal Sync", detail: "Handling the intricate Shram Suvidha and state portal filings.", icon: Zap },
    { title: "Custom Guidance", detail: "Tailored registers and return formats for specific industries.", icon: Lightbulb },
];

const clraFAQs = [
    { q: "Who is a Principal Employer?", a: "The person or entity who engages contract labour through a contractor." },
    { q: "What is the threshold?", a: "Applicable if 20 or more contract labourers are employed on any day of the year." },
    { q: "Is registration separate from license?", a: "Yes. PE gets Registration; Contractor gets the official License." },
    { q: "What are the amenity rules?", a: "Employers must provide basic facilities like clean water, restrooms, and canteens." },
    { q: "How long does it take?", a: "The processing time is usually 2-4 weeks depending on the state authority speed." },
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
    <section id="clra-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Regulation" title="CLRA Act 1970 Nexus" description="The Contract Labour (Regulation and Abolition) Act mandates licensing for fair worker treatment." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        The <strong>CLRA Act, 1970</strong> governs the employment of contract labour in India. It aims to abolish labor exploitation while regulating conditions in certain sectors.
                    </p>
                    <p>
                        Applicable to establishments with <strong>20 or more labourers</strong>, it requires Principal Employers to register and Contractors to hold a valid license to operate legally.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">LABOUR COMPLIANCE</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">WORKER RIGHTS HUB</span>
                    </div>
                </div>
                <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl">
                    <HardHat className="absolute -top-6 -right-6 w-32 h-32 text-[#C59B4E]/10 group-hover:rotate-12 transition-all" />
                    <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Core Duties</h4>
                    <ul className="space-y-3 text-[10px] uppercase font-bold tracking-widest list-none">
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#C59B4E]" /> Minimum Wage Adherence</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#C59B4E]" /> Canteen & Restroom Amenities</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#C59B4E]" /> Creches for mothers</li>
                        <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#C59B4E]" /> Safety Training & Equipment</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="clra-benefits-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Advantage" title="Employer & Worker Protection" description="Reducing liabilities and ensuring ethical deployment through professional labor registry." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clraBenefits.map((item, i) => (
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

const EligibilityContent = () => (
    <section id="clra-eligibility-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="Eligibility & Specific Exemptions" description="Minimum thresholds and categories where the Act does not apply." />
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                    {clraEligibility.map((item, i) => (
                        <div key={i} className="flex gap-6 items-start p-8 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl transition-all">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl text-[#1A7F7D] flex items-center justify-center shrink-0 shadow-sm"><item.icon size={24} /></div>
                            <div>
                                <h6 className="font-bold text-slate-800 text-xs italic uppercase mb-1 tracking-widest">{item.title}</h6>
                                <p className="text-[10px] text-slate-500 italic leading-relaxed">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-10 bg-white border border-slate-100 rounded-[48px] shadow-sm">
                    <h4 className="text-sm font-bold text-slate-800 uppercase italic mb-8 tracking-widest underline decoration-[#C19A5B] underline-offset-8">Cases for Exemption</h4>
                    <div className="space-y-4">
                        {clraExemptions.map((e, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl italic border border-slate-100">
                                <AlertTriangle size={14} className="text-[#C19A5B] shrink-0" />
                                <span className="text-[10px] font-bold text-slate-600 tracking-tight">{e}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="clra-documents-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Archive" title="Documents & Registry Data" description="Legal proof of entity and contract scope required for portal filing." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clraDocs.map((doc, i) => (
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

const CompliancesContent = () => (
    <section id="clra-compliances-content" className="py-24 bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Workflow" title="Statutory Compliances" description="Mandatory labor returns and amenities for consistent welfare." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                {employerResponsibilities.map((step, idx) => (
                    <div key={idx} className="relative p-6 bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:bg-[#C59B4E] transition-all">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold group-hover:bg-white group-hover:text-amber-900 transition-colors">0{idx + 1}</div>
                        <p className="text-[10px] text-slate-300 leading-relaxed font-bold italic uppercase tracking-tighter group-hover:text-blue-900">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const PenaltiesContent = () => (
    <section id="clra-penalties-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Risk" title="Penalties & Violations" description="Failing to obtaining registration can result in severe fines or imprisonment." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {clraPenalties.map((item, i) => (
                    <div key={i} className="p-8 bg-white border-b-4 border-b-red-500 rounded-[40px] shadow-xl flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0"><item.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-xs italic uppercase tracking-tighter leading-tight">{item.title}</h6>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed font-bold">{item.penalty}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 p-8 bg-blue-50 border-l-8 border-l-blue-600 rounded-[40px] shadow-sm flex items-center gap-6">
                <Timer size={48} className="text-blue-600 shrink-0" />
                <div>
                    <h5 className="font-extrabold text-blue-900 text-xs italic tracking-widest mb-1 uppercase">Immediate Application</h5>
                    <p className="text-xs text-blue-700 italic font-medium leading-relaxed">You should apply for CLRA registration as soon as the principal employer starts employing contract labour. Delay results in non-compliance pentalties.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="clra-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Strategy" title="CLRA Labour Specialist" description="Simplifying intricate labor court compliance and customized returns." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {clraWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 flex flex-col items-start gap-4">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                                <div>
                                    <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                    <p className="text-[10px] text-slate-500 italic leading-relaxed font-medium">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter leading-tight italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Worker Welfare Nexus</h4>
                    <p className="text-slate-400 text-xs italic mb-8 px-10">"Facilitating Contract Labour Act compliance for India's leading industrial houses."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function CLRARegistrationPage() {
    const [activeTab, setActiveTab] = useState('clra-overview-content');
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
                    <img src={BackgroundImageSrc} alt="CLRA Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2 text-center">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">CLRA <br /> License</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70 italic tracking-widest leading-tight">Labour Registry</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Worker <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">Labour Rights hub</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {clraIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">CLRA</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">1970 Act Hub</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">On-Tap</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Portal Registry</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">Register Now</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Official Labour Portal Hub</p>
                                <LeadForm serviceName="CLRA Registration & Licensing" btnText="Apply Now" />
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
            <EligibilityContent />
            <DocumentsContent />
            <CompliancesContent />
            <PenaltiesContent />
            <WhyBizzfiling />

            <section id="clra-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Labor Law Intelligence" description="Clearing compliance and registry protocols for principal employers and contractors." />
                    <div className="space-y-4 pt-10">
                        {clraFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}