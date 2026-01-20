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
    Shield,
    MapPin,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Truck,
    Box,
    FileSearch
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

const Activity = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);

// --- CUSTOMS CLEARANCE STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'customs-overview-content', label: 'Overview' },
    { id: 'customs-process-content', label: 'Process' },
    { id: 'customs-benefits-content', label: 'Benefits' },
    { id: 'customs-documents-content', label: 'Documents' },
    { id: 'customs-types-content', label: 'Clearance Types' },
    { id: 'customs-compliance-content', label: 'Compliance' },
    { id: 'customs-why-Bizzfiling', label: 'Why Us' },
    { id: 'customs-faqs-content', label: 'FAQs' },
];

const customsIntroBullets = [
    "Fast and compliant clearance for your imports and exports across all major Indian ports.",
    "Accurate HSN classification and duty assessment to minimize statutory costs.",
    "End-to-end ICEGATE e-filing and AD Code registration support for global trade.",
];

const clearanceBenefits = [
    { title: "Statutory Shield", icon: Shield, detail: "Ensures compliance with Customs Act 1962, preventing cargo seizure and legal fines." },
    { title: "Demurrage Zero", icon: Clock, detail: "Speeds up port clearance to minimize warehouse rent and demurrage charges." },
    { title: "Duty Precision", icon: DollarSign, detail: "Accurate HSN valuation to avoid overpayment of duties or subsequent DRI scrutiny." },
    { title: "Incentive Hub", icon: TrendingUp, detail: "Seamlessly avail government schemes like Duty Drawback and RoDTEP rewards." },
    { title: "Supply Chain Velocity", icon: Zap, detail: "Reduces transit bottlenecks through pre-arrival documentation and Green Channel." },
    { title: "Port Mobilization", icon: MapPin, detail: "Dedicated support for clearance at JNPT, Chennai, Mundra, and various ICD hubs." },
];

const processSteps = [
    { title: "Doc Verification", detail: "Filing Bill of Entry/Shipping Bill on ICEGATE with commercial invoices.", icon: FileSearch },
    { title: "Duty Assessment", detail: "Customs audit of HSN codes to calculate IGST, Cess, and Tariff rates.", icon: Scale },
    { title: "Cargo Examination", detail: "Physical or non-intrusive inspection to verify declaration against goods.", icon: Box },
    { title: "LEO/OOC Order", detail: "Final 'Let Export' or 'Out of Charge' order enabling cargo movement.", icon: Truck },
];

const requiredDocs = [
    { title: "ICEGATE Bill", detail: "Bill of Entry (Import) or Shipping Bill (Export) primary forms.", icon: FileText },
    { title: "Trade Invoice", detail: "Commercial invoice and packing list with transaction value.", icon: FileSearch },
    { title: "Transport Docket", detail: "Bill of Lading or Airway Bill establishing document of title.", icon: Box },
    { title: "Entity IDs", detail: "DGFT Import Export Code (IEC) and GSTIN linked to the firm.", icon: Briefcase },
    { title: "AD Code Link", detail: "Bank authorization registered on Customs portal for FX trade.", icon: DollarSign },
    { title: "Mandate Letter", detail: "Authorisation for the licensed Customs Broker to act on your behalf.", icon: UserCheck },
];

const clearanceTypes = [
    { title: "Import Flow", detail: "Gaining Out of Charge (OOC) for goods entering the Indian territory.", icon: Box },
    { title: "Export Hub", detail: "Securing Let Export Order (LEO) before the carrier leaves the port.", icon: Globe },
    { title: "Green Channel", detail: "Prior filing for trusted traders to expedite documentation processing.", icon: Zap },
    { title: "Transit Bond", detail: "For goods moving through a territory to reach a final destination.", icon: Truck },
];

const complianceNorms = [
    { title: "HSN Taxonomy", detail: "Choosing precise HSN/SAC codes to determine correct tariff liability.", icon: Scale },
    { title: "Valuation Rules", detail: "Declaring transaction values as per Valuation Rules to avoid Penalties.", icon: DollarSign },
    { title: "Agency Sync", detail: "Certifications from FSSAI, BIS, or CDSCO before customs release.", icon: CheckCircle },
    { title: "Audit Archive", detail: "Maintaining trade records for 5+ years for post-clearance audits.", icon: FileSearch },
];

const whyBizzfiling = [
    { title: "Digital ICEGATE Hub", detail: "Complete end-to-end e-filing and port coordination via digital portal.", icon: Zap },
    { title: "HSN Accuracy Lab", detail: "Minimizing risk of misdeclaration and maximizing export drawback gains.", icon: Search },
    { title: "PGA Coordination", detail: "Managing Partner Government Agencies for health/safety clearances.", icon: Handshake },
    { title: "Real-Time Tracking", detail: "Dedicated dashboard for tracking your container status at any port.", icon: Activity },
];

const customsFAQs = [
    { q: "What is a Bill of Entry?", a: "A legal document filed by importers detailing the nature, quantity, and value of goods." },
    { q: "Is AD Code separate from IEC?", a: "Yes, IEC is from DGFT, while AD Code is your bank's register on ICEGATE." },
    { q: "How long is the process?", a: "Standard clearance takes 24-72 hours, but can be longer if examination is needed." },
    { q: "What is IGST on imports?", a: "A tax levied on imported goods in addition to basic customs duty, which is creditable." },
    { q: "Can I do it without a broker?", a: "Technically yes, but using a licensed broker is standard practice to avoid delays." },
];

// --- Design Components ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
    <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1.5 px-4 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-sm uppercase tracking-widest mb-4 border border-[#B2DFDB]">
            {subtitle}
        </span>
        <h3 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {title}
        </h3>
        <p className="text-slate-500 text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed mx-auto">
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
            <h3 className={`text-lg md:text-xl font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                {faq.q}
            </h3>
            <div className="flex-shrink-0">
                {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
            </div>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <p className={`px-4 pb-4 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
                {faq.a}
            </p>
        </div>
    </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
    <section id="customs-overview-content" className="py-20 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Trade Gateway" title="National Port Clearance Nexus" description="Customs clearance is the final legal permission for goods to transit across national borders." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-slate-600 leading-relaxed italic">
                    <p>
                        Involving the verification of trade documentation and statutory duty assessment, this process ensures compliance with <strong>Customs Act 1962</strong> and international trade laws.
                    </p>
                    <p>
                        Efficient movement across port hubs prevents Supply Chain detention, minimizing costs while maintaining your status as a compliant global trade entity.
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">ICEGATE HUB</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">CBIC COMPLIANT</span>
                    </div>
                </div>
                <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl text-center">
                    <Globe className="w-16 h-16 text-[#C59B4E] mx-auto mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Exim Velocity</h4>
                    <p className="text-sm text-slate-400 italic mb-6 leading-relaxed">Strategic hub for managing import-export documentation to accelerate 'Let Export Order' and 'Out of Charge' commands.</p>
                    <div className="flex justify-center gap-5">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm font-bold text-white uppercase tracking-widest italic border border-white/10">SEA CARGO</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm font-bold text-white uppercase tracking-widest italic border border-white/10">AIR Hub</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-sm font-bold text-white uppercase tracking-widest italic border border-white/10">ICD Port</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="customs-process-content" className="py-24 bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Lifecycle" title="Port Clearance workflow" description="A multi-stage statutory procedure mandated by the CBIC for cross-border cargo." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative">
                {processSteps.map((step, idx) => (
                    <div key={idx} className="relative p-8 bg-white/5 border border-white/10 rounded-[40px] overflow-hidden group hover:bg-[#C59B4E] transition-all">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold group-hover:bg-white group-hover:text-amber-900 transition-colors">0{idx + 1}</div>
                        <h5 className="text-[#C59B4E] font-bold text-sm uppercase italic mb-3 group-hover:text-white transition-colors">{step.title}</h5>
                        <p className="text-sm text-slate-400 leading-relaxed font-bold italic uppercase tracking-tighter group-hover:text-amber-900">{step.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="customs-benefits-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Advantage" title="Trade Optimization" description="Accelerating port turnaround and maximizing center-sponsored export incentives." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {clearanceBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col items-center hover:bg-white hover:shadow-xl transition-all h-full">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0"><item.icon size={32} /></div>
                        <h6 className="font-bold text-slate-800 text-lg mb-2 uppercase italic tracking-tighter">{item.title}</h6>
                        <p className="text-sm text-slate-500 italic leading-relaxed font-medium">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="customs-documents-content" className="py-20 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Archive" title="Consolidated Trade proofs" description="Legal and transport documentation required for seamless ICEGATE declaration." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {requiredDocs.map((doc, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl flex gap-5 items-center shadow-sm">
                        <div className="w-10 h-10 bg-slate-50 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg italic uppercase mb-1 tracking-tight">{doc.title}</h6>
                            <p className="text-sm text-slate-400 italic font-medium">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TypesContent = () => (
    <section id="customs-types-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Modules" title="Clearance Categories" description="Specialized procedures for varying trade directions and transit speeds." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {clearanceTypes.map((item, i) => (
                    <div key={i} className="group p-8 bg-[#F8FAFC] border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-lg mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceContent = () => (
    <section id="customs-compliance-content" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Tiers" title="Regulatory Requirements" description="Holistic compliance management across parallel government agencies." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {complianceNorms.map((item, i) => (
                    <div key={i} className="p-8 bg-white border-b-4 border-b-[#1F4B4E] rounded-[40px] shadow-xl flex flex-col items-center text-center space-y-8">
                        <div className="w-12 h-12 bg-slate-50 text-[#1F4B4E] rounded-full flex items-center justify-center shrink-0"><item.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-lg italic uppercase tracking-tighter leading-tight">{item.title}</h6>
                        <p className="text-sm text-slate-500 italic leading-relaxed font-bold">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="customs-why-Bizzfiling" className="py-20 bg-white scroll-mt-24 text-center">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 text-left">
                    <SectionHeading subtitle="Strategy" title="Trade Intelligence hub" description="Navigating tariff classification and Customs portal through specialized legal expertise." align="left" />
                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        {whyBizzfiling.map((s, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-start gap-5 shadow-sm">
                                <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                                <div>
                                    <h6 className="font-bold text-slate-800 text-lg mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                    <p className="text-sm text-slate-500 italic leading-relaxed font-bold">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center relative overflow-hidden group">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Global Trade Nexus</h4>
                    <p className="text-slate-400 text-sm italic mb-8 px-10">"Facilitating Customs Authority compliance for India's leading global exporters and importers."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-sm hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function CustomsClearancePage() {
    const [activeTab, setActiveTab] = useState('customs-overview-content');
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
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Customs Clearance" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Award size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Official Customs Clearance & Port Agency</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                Customs <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Clearance Hub</span>
                            </h1>
                            <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                                Accelerate your cross-border trade with compliant and fast customs clearance. Expert HSN classification, duty assessment, and port handling.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> ICEGATE Filing
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Globe size={18} className="text-[#C59B4E]" /> Universal Port Support
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Now</h3>
                                    <LeadForm serviceName="Customs Clearance Services" btnText="Apply Now" />
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
            <ProcessContent />
            <BenefitsContent />
            <DocumentsContent />
            <TypesContent />
            <ComplianceContent />
            <WhyBizzfiling />

            <section id="customs-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Trade Law Intelligence" description="Clearing compliance and registry protocols for BoE, Shipping Bills and Tariff rules." />
                    <div className="space-y-8 pt-10">
                        {customsFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}