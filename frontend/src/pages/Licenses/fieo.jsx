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
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- FIEO REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'fieo-overview-content', label: 'Overview' },
    { id: 'fieo-rcmc-content', label: 'RCMC & Eligibility' },
    { id: 'fieo-benefits-content', label: 'Benefits' },
    { id: 'fieo-services-content', label: 'Services' },
    { id: 'fieo-documents-content', label: 'Documents' },
    { id: 'fieo-fees-content', label: 'Fees' },
    { id: 'fieo-why-Bizzfiling', label: 'Why Us' },
    { id: 'fieo-faqs-content', label: 'FAQs' },
];

const fieoIntroBullets = [
    "Get FIEO-RCMC registration done in simple steps with expert legal assistance.",
    "RCMC certificate delivered on time for legal compliance and export benefits.",
    "100% online process for new registration and renewals with full compliance.",
];

const rcmcEligibility = [
    { title: "Exporter Status", detail: "Entity must be genuinely engaged in exporting goods or services from India.", icon: Briefcase },
    { title: "Valid IEC Code", detail: "Self-certified copy of the Import Export Code (IEC) is mandatory.", icon: FileText },
    { title: "Trade Overview", detail: "Explicit declaration of main business line and export categories handled.", icon: TrendingUp },
    { title: "Board Approval", detail: "Authorization from product-specific Board or FIEO (for general products).", icon: Scale },
];

const fieoBenefits = [
    { title: "Trade Concessions", icon: Scale, detail: "Access concessions and benefits under the Foreign Trade Policy." },
    { title: "MAI Grant Access", icon: DollarSign, detail: "Market Access Initiative grants for overseas exhibitions at subsidised costs." },
    { title: "High Visibility", icon: Zap, detail: "Profile hosting on FIEO global dashboard searchable by world buyers." },
    { title: "Policy Resolution", icon: Lightbulb, detail: "Platform to resolve issues with Customs, DGFT and port authorities." },
    { title: "Travel Credentials", icon: FileText, detail: "Certificate of Origin and Visa recommendation letters for global travel." },
    { title: "Market Intelligence", icon: Globe, detail: "Access to Indian Trade Portal with preferential tariffs and stats info." },
];

const fieoServices = [
    { title: "Weekly e-Bulletin", detail: "National and international trade-related news and global stage updates.", icon: Lightbulb },
    { title: "FOREX Services", detail: "Spot rates, forward rates, and historical calculators for traders.", icon: DollarSign },
    { title: "Trade Facilitation", detail: "Guidance on export regulations, customs procedures, and documentation.", icon: Briefcase },
    { title: "Policy Advocacy", detail: "Organising high-level meetings between govt officials and exporters.", icon: Landmark },
];

const fieoDocuments = [
    { title: "IEC Number", detail: "Self-certified copy of the DGFT import export code.", icon: FileText },
    { title: "Auth Letter", detail: "Letterhead authorization for the firm's representative.", icon: FileText },
    { title: "SSI/Industrial", detail: "License copy or IEM registration where applicable.", icon: Briefcase },
    { title: "Export House Cert", detail: "Star Export House certificates (1-5 Star) if held.", icon: CheckCircle },
    { title: "Director KYC", detail: "ID proofs (PAN/Aadhaar) of partners or owners.", icon: Users },
    { title: "Financials/GST", detail: "Foreign exchange earnings data and GST certificates.", icon: DollarSign },
];

const fieoFeesGrid = [
    { category: "Individual / Service Providers", fee: "₹6,250/-", note: "Starting subscription" },
    { category: "EOUs / One Star House", fee: "₹9,375/-", note: "Promotion category" },
    { category: "Two Star Export House", fee: "₹12,500/-", note: "Mid-tier scale" },
    { category: "Four Star Export House", fee: "₹50,000/-", note: "High-scale enterprise" },
];

const fieoWhyBizzfiling = [
    { title: "Top Legal Team", detail: "Attorneys specializing in foreign trade and RCMC nexus.", icon: UserCheck },
    { title: "Full Documentation", detail: "Preparing IEC, financials, and authority letters accurately.", icon: Briefcase },
    { title: "Zero Lag Filing", detail: "Efficient processing avoiding common portal verification errors.", icon: Zap },
    { title: "Holistic Nexus", detail: "Support across multiple sectors and board requirements.", icon: Scale },
];

const fieoFAQs = [
    { q: "What is FIEO RCMC?", a: "A certificate issued by FIEO validating a firm as an exporter, mandatory for DGFT benefits." },
    { q: "Is FIEO a government body?", a: "It is an apex body of Indian export promotion organizations set up by the Ministry of Commerce." },
    { q: "How long is registration valid?", a: "RCMC is valid for five financial years, requiring renewal cycles thereafter." },
    { q: "What are the benefits for E-commerce?", a: "Access to MAI grants and profile hosting to attract international B2B buyers." },
    { q: "Can multi-product exporters join?", a: "Yes, FIEO is the primary body for exporters dealing in non-specific or multi-product lines." },
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
    <section id="fieo-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Export Promotion" title="FIEO Federation Hub" description="The apex body supervising India's international trade footprint under Ministry of Commerce." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        The <strong>Federation of Indian Export Organisations (FIEO)</strong> was established to supervise and promote India's exports. Its objective is to help members go global by resolving regulatory challenges.
                    </p>
                    <p>
                        Membership works to resolve issues with Customs, banks and DGFT efficiently. It's the designated government council for multi-product exporters seeking <strong>RCMC status</strong>.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">Apex Export Body</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">DGFT RCMC Authority</span>
                    </div>
                </div>
                <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#1A7F7D]/5 rounded-bl-full group-hover:scale-110 transition-all"></div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6 tracking-tight uppercase italic flex items-center gap-2">
                        <Globe size={20} className="text-[#1A7F7D]" />
                        Global Impact
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic mb-6">FIEO membership opens doors to international trade portal statistics, mfn tariffs, and preferential duty info for 200+ countries.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                            <CheckCircle size={20} className="text-[#1A7F7D] mb-2" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase">Verified</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center">
                            <TrendingUp size={20} className="text-[#1A7F7D] mb-2" />
                            <span className="text-[10px] font-bold text-slate-700 uppercase">Incentives</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const RCMCContent = () => (
    <section id="fieo-rcmc-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Status" title="RCMC & Membership Tiers" description="Essential eligibility criteria and the two primary membership categories for Indian firms." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {rcmcEligibility.map((item, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-lg transition-all">
                        <item.icon size={24} className="text-[#1A7F7D] mb-4 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-xs mb-2 uppercase italic">{item.title}</h6>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-900 rounded-[48px] text-white flex gap-6 items-center border-l-8 border-l-[#C59B4E] shadow-xl">
                    <Users size={48} className="text-[#C59B4E] shrink-0" />
                    <div>
                        <h5 className="font-bold text-sm tracking-widest uppercase italic mb-2">Ordinary Membership</h5>
                        <p className="text-xs text-slate-400 italic leading-relaxed">Designated for startups and entities that have recently entered the international trade ecosystem.</p>
                    </div>
                </div>
                <div className="p-10 bg-slate-900 rounded-[48px] text-white flex gap-6 items-center border-l-8 border-l-[#C59B4E] shadow-xl">
                    <TrendingUp size={48} className="text-[#C59B4E] shrink-0" />
                    <div>
                        <h5 className="font-bold text-sm tracking-widest uppercase italic mb-2">Partner Membership</h5>
                        <p className="text-xs text-slate-400 italic leading-relaxed">For established entities with a proven track record. Features higher access and fee modules.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="fieo-benefits-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Advantage" title="Premium Membership Perks" description="From MAI grants to high-visibility global profiles on the official trade hub." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fieoBenefits.map((item, i) => (
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

const ServicesContent = () => (
    <section id="fieo-services-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Facilitation" title="Exporters Services Desk" description="Weekly intel, FOREX trackers, and policy advocacy for Indian trade firms." />
            <div className="grid md:grid-cols-2 gap-8">
                {fieoServices.map((s, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-6 items-center hover:bg-white hover:shadow-xl transition-all h-full">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center shrink-0"><s.icon size={28} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic tracking-tighter">{s.title}</h6>
                            <p className="text-[11px] text-slate-500 italic leading-relaxed">{s.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="fieo-documents-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Necessary Documentation" description="Self-certified financial and identity proofs for smooth RCMC issuance." />
            <div className="grid md:grid-cols-3 gap-6">
                {fieoDocuments.map((doc, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 flex gap-4 items-start shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 mt-1"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-xs italic uppercase mb-1 tracking-tight">{doc.title}</h6>
                            <p className="text-[10px] text-slate-400 italic leading-relaxed">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FeesContent = () => (
    <section id="fieo-fees-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Investment" title="Membership Subscription Tiers" description="Fees scaled based on exporter status and export house star-rating." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {fieoFeesGrid.map((f, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center text-center space-y-3 shadow-sm hover:scale-105 transition-all">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.category}</span>
                        <p className="text-2xl font-black text-[#1A7F7D] italic tracking-tight">{f.fee}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase italic">{f.note}</p>
                    </div>
                ))}
            </div>
            <div className="p-10 bg-red-900 rounded-[48px] text-white flex flex-col md:flex-row gap-8 items-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
                <Clock size={48} className="text-[#C59B4E] shrink-0" />
                <div>
                    <h5 className="font-bold text-[#C59B4E] text-sm uppercase italic tracking-widest mb-2 underline decoration-[#C59B4E] underline-offset-8">5-Year Validity Nexus</h5>
                    <p className="text-xs text-slate-300 leading-relaxed italic">The RCMC is valid for a block of five financial years. Renewal must be finalized before March 31 of the final licensing year to avoid incentive forfeiture.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="fieo-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Expertise" title="Why Exporters Scale With Us" description="Managing the legal nexus between DGFT mandates and FIEO memberships." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {fieoWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm transition-all hover:-translate-y-1">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-4"><s.icon size={20} /></div>
                                <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                <p className="text-[10px] text-slate-500 italic leading-relaxed">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tight">Apex Compliance</h4>
                    <p className="text-slate-400 text-xs italic mb-8">"Facilitating export credentials for India's leading multi-product trade houses."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px]">Talk to consultant</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function FIEORegistrationPage() {
    const [activeTab, setActiveTab] = useState('fieo-overview-content');
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
                    <img src={BackgroundImageSrc} alt="FIEO Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">FIEO <br /> Membership</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">DGFT Official</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Export <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">RCMC Portal</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {fieoIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">RCMC</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Verification</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">FIEO</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Registration</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">Secure RCMC</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Professional FIEO Compliance</p>
                                <LeadForm serviceName="FIEO Registration" btnText="Apply Now" />
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
            <RCMCContent />
            <BenefitsContent />
            <ServicesContent />
            <DocumentsContent />
            <FeesContent />
            <WhyBizzfiling />

            <section id="fieo-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="FIEO Knowledge Hub" description="Essential guidance for Indian exporters dealing with DGFT and RCMC mandates." />
                    <div className="space-y-4 pt-10">
                        {fieoFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}