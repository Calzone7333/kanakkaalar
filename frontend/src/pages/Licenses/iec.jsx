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
    Globe,
    Banknote,
    MapPin,
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

// --- IEC REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'iec-overview-content', label: 'Overview' },
    { id: 'iec-benefits-content', label: 'Benefits' },
    { id: 'iec-eligibility-content', label: 'Eligibility' },
    { id: 'iec-documents-content', label: 'Documents' },
    { id: 'iec-process-content', label: 'Process' },
    { id: 'iec-compliance-content', label: 'Compliance' },
    { id: 'iec-why-Bizzfiling', label: 'Why Us' },
    { id: 'iec-faqs-content', label: 'FAQs' },
];

const iecIntroBullets = [
    "Expert assisted 100% online IEC Registration, filing done in just 2 Days!",
    "Go global with end-to-end IEC registration support across India.",
    "IEC registration made easy for 10,000+ businesses since 2011.",
];

const iecBenefits = [
    { title: "Access to World Market", icon: Globe, detail: "Allows the market reach of businesses around the globe, streamlining international trade." },
    { title: "Government Schemes", icon: TrendingUp, detail: "Avail schemes, tax benefits, and export incentives for developing international trade." },
    { title: "Opportunities for Expansion", icon: Handshake, detail: "Opening opportunities for global expansion and enhancing international relationships." },
    { title: "Lifetime Validity", icon: Clock, detail: "Offers lifetime validity with no annual renewal fee (mandatory periodic updates apply)." },
    { title: "Customs Clearance", icon: Briefcase, detail: "Essential for customs clearance and smooth handling of shipments without delay." },
    { title: "Legal Compliance", icon: Scale, detail: "Ensures legal following, improving global reputation and cross-border trust." },
];

const iecEligibility = [
    { entity: "Proprietorship", requirements: "PAN card, bank account, and proof of address for business.", icon: Users },
    { entity: "Partnership / LLP", requirements: "Deed/Certificate, PAN, bank account, and business address proof.", icon: Briefcase },
    { entity: "Limited Companies", requirements: "COI, PAN, and business address proof registered under Indian law.", icon: Landmark },
    { entity: "Societies & HUFs", requirements: "Registration certificate, PAN card, and address proof.", icon: Users },
];

const iecDocuments = [
    { title: "PAN Card", detail: "PAN card for the business or individual appicant.", icon: FileText },
    { title: "Address Proof", detail: "Electricity bill, rent agreement, or property papers.", icon: MapPin },
    { title: "Bank Certificate", detail: "Bank certificate or canceled cheque with the business name.", icon: Banknote },
    { title: "DSC Certificate", detail: "Digital Signature may be required for specific online filings.", icon: Zap },
    { title: "Status Proof", detail: "COI or Partnership Deed as per business structure.", icon: FileText },
];

const iecProcessSteps = [
    "Create Profile on DGFT Website using PAN and business details.",
    "Upload Mandatory Documents accurately per DGFT standards.",
    "Online Fee Payment via net banking or credit/debit cards.",
    "DGFT Verification of address and PAN details.",
    "IEC Certificate Issuance - download your 10-digit code instantly.",
];

const iecComplianceObligations = [
    { title: "Annual Profile Update", detail: "Mandatory update every year (April-June) to prevent deactivation.", icon: Clock },
    { title: "Foreign Trade Policy", detail: "Adhering to India's FTP to avoid penalties and trade suspensions.", icon: Scale },
    { title: "Annual Filing", detail: "Businesses must file returns to access Advance Authorization benefits.", icon: FileText },
    { title: "Record Keeping", detail: "Maintain trade logs to comply with customs and anti-bribery laws.", icon: Briefcase },
];

const iecWhyBizzfiling = [
    { title: "Expert Assistance", detail: "Legal experts ensure all documents are correctly submitted.", icon: Briefcase },
    { title: "DGFT Management", detail: "We manage the entire backend process on the DGFT website.", icon: Zap },
    { title: "Speedy Approval", detail: "Filing done in as little as 2 Days with minimal errors.", icon: Clock },
    { title: "Business Focus", detail: "Get your code quickly while you focus on global trade growth.", icon: Rocket },
];

const iecFAQs = [
    { q: "How Long Does IEC Registration Take?", a: "Filing is done in 2 days. Final approval depends on DGFT verification speed." },
    { q: "What Are the Costs Involved?", a: "DGFT fees are minimal. The primary cost is for expert consultant oversight." },
    { q: "Is IEC Mandatory for Service Exporters?", a: "Yes, it is required for all international trade unless specifically exempted." },
    { q: "Can I use one IEC for multiple businesses?", a: "No, one IEC is assigned per PAN/Legal Entity." },
    { q: "How to check application status?", a: "Check via the DGFT platform using your SRN or PAN number." },
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
    <section id="iec-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Trade" title="Import Export Code" description="The mandatory 10-digit identification for global trade transactions from India." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        Import-Export Code or <strong>IEC registration</strong> is mandatory for every person and organization engaged in importing and exporting activities from India. This code is issued by the Directorate General of Foreign Trade (DGFT).
                    </p>
                    <p>
                        The IEC is necessitated for carrying out customs clearance, availing export benefits, and expansion in international markets. It is valid for life with no annual renewal fees required.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase tracking-tighter">10-Digit DGFT Code</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase tracking-tighter">Lifetime Validity</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center text-center group translate-y-4">
                        <Globe size={32} className="text-[#1A7F7D] mb-4 group-hover:rotate-12 transition-transform" />
                        <h6 className="text-[10px] font-bold text-slate-800 uppercase italic">World Market</h6>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center text-center group -translate-y-4">
                        <TrendingUp size={32} className="text-[#1A7F7D] mb-4 group-hover:-translate-y-1 transition-transform" />
                        <h6 className="text-[10px] font-bold text-slate-800 uppercase italic">Export Benefits</h6>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center text-center group translate-y-4">
                        <Scale size={32} className="text-[#1A7F7D] mb-4 group-hover:skew-x-2 transition-transform" />
                        <h6 className="text-[10px] font-bold text-slate-800 uppercase italic">Trade Ethics</h6>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl flex flex-col items-center text-center group -translate-y-4">
                        <DollarSign size={32} className="text-[#1A7F7D] mb-4 group-hover:scale-110 transition-transform" />
                        <h6 className="text-[10px] font-bold text-slate-800 uppercase italic">Zero Renewal</h6>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="iec-benefits-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Global Reach" title="Strategic Trade Benefits" description="Unlock the legal pathway for international business expansion." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {iecBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-[#1A7F7D]/30 transition-all">
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
    <section id="iec-eligibility-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Status" title="Eligible Entities" description="Who can apply and the governing trade framework in India." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {iecEligibility.map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <item.icon className="w-8 h-8 text-[#1A7F7D] mb-4" />
                        <h6 className="font-bold text-slate-800 text-xs mb-2 uppercase">{item.entity}</h6>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">{item.requirements}</p>
                    </div>
                ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                    <h5 className="text-sm font-bold text-[#C59B4E] uppercase mb-4 flex items-center gap-2 italic"><BookOpen size={16} /> Trade Act, 1992</h5>
                    <p className="text-xs text-slate-400 italic leading-relaxed">Mandates the Central Government to oversee international trade and IEC issuance for all trans-border commerce.</p>
                </div>
                <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                    <h5 className="text-sm font-bold text-[#C59B4E] uppercase mb-4 flex items-center gap-2 italic"><Landmark size={16} /> DGFT Regulation</h5>
                    <p className="text-xs text-slate-400 italic leading-relaxed">The regulatory body enforcing trade laws, managing policies, and ensuring global reputational standards.</p>
                </div>
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="iec-documents-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Verification" title="Checklist" description="Necessary identification to secure your 10-digit DGFT code." />
            <div className="grid md:grid-cols-3 gap-6">
                {iecDocuments.map((doc, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 items-start hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-tight italic">{doc.title}</h6>
                            <p className="text-[10px] text-slate-500 italic leading-relaxed">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="iec-process-content" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="DGFT" title="Online Filing Steps" description="A simplified, digital identification journey through the e-Governance platform." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
                {iecProcessSteps.map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
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

const ComplianceContent = () => (
    <section id="iec-compliance-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Integrity" title="Post-Filing Compliance" description="Mandatory annual updates to keep your lifetime trade code active." />
            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {iecComplianceObligations.map((item, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex gap-6 hover:bg-white hover:shadow-xl transition-all h-full items-center">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center shrink-0"><item.icon size={24} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic tracking-tighter">{item.title}</h6>
                            <p className="text-xs text-slate-500 italic leading-relaxed">{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-8 bg-red-900 rounded-[32px] text-white flex flex-col md:flex-row gap-6 items-center shadow-2xl">
                <Scale size={48} className="text-[#C59B4E] shrink-0" />
                <div>
                    <h5 className="font-bold text-[#C59B4E] text-sm uppercase italic mb-2 tracking-widest">Surrender or Deactivation</h5>
                    <p className="text-xs text-slate-400 leading-relaxed italic">Deactivation due to missing the annual April-June update window means no trade activity is permitted legally. Surrender can be filed on the DGFT portal if trade is discontinued.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="iec-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Expertise" title="Importer Exporter Experts" description="Speed up your global footprint with our dedicated trade consultancy." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {iecWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-4"><s.icon size={20} /></div>
                                <h6 className="font-bold text-slate-800 text-sm mb-1 italic uppercase tracking-tighter">{s.title}</h6>
                                <p className="text-[10px] text-slate-500 italic">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[40px] text-white flex flex-col items-center text-center shadow-3xl relative overflow-hidden">
                    <Globe className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif mb-4 italic tracking-tight italic uppercase">Go Global Faster</h4>
                    <p className="text-slate-400 text-xs italic mb-8">"Managing international trade credentials for over 10,000+ top Indian exporters."</p>
                    <button className="px-12 py-4 bg-[#C59B4E] text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Get Your IEC</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function IECRegistrationPage() {
    const [activeTab, setActiveTab] = useState('iec-overview-content');
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
                    <img src={BackgroundImageSrc} alt="IEC Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">IEC <br /> Registration</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">DGFT Official</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Global <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Identity</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {iecIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-2xl font-bold tracking-tighter italic uppercase underline decoration-[#C59B4E]">2 Days</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Processing</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-2xl font-bold tracking-tighter italic uppercase underline decoration-[#C59B4E]">Lifetime</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Validity</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[48px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <Search className="absolute -top-6 -right-6 text-slate-100 w-24 h-24 group-hover:scale-125 transition-all" />
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter">Enter Global Market</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Register Your IEC Code</p>
                                <LeadForm serviceName="Importer Exporter Code (IEC)" btnText="Talk to Expert" />
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
            <ProcessContent />
            <ComplianceContent />
            <WhyBizzfiling />

            <section id="iec-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Trade Intelligence" description="Clearing standard doubts on IEC registration and foreign trade policy." />
                    <div className="space-y-4 pt-10">
                        {iecFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}