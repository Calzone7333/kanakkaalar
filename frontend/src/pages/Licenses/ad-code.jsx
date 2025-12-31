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
    MapPin,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- AD CODE REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'adcode-overview-content', label: 'Overview' },
    { id: 'adcode-benefits-content', label: 'Benefits' },
    { id: 'adcode-eligibility-content', label: 'Eligibility' },
    { id: 'adcode-documents-content', label: 'Documents' },
    { id: 'adcode-procedure-content', label: 'Procedure' },
    { id: 'adcode-consequences-content', label: 'Compliance Risk' },
    { id: 'adcode-why-Bizzfiling', label: 'Why Us' },
    { id: 'adcode-faqs-content', label: 'FAQs' },
];

const adCodeIntroBullets = [
    "Expert-assisted AD Code registration to simplify your cross-border transactions.",
    "Fast processing of bank authorization and Customs (ICEGATE) portal mapping.",
    "100% online hybrid process handled by seasoned FEMA and trade legal experts.",
];

const adCodeBenefits = [
    { title: "FX Liquidity", icon: DollarSign, detail: "Ensures legal validation for foreign currency payments to overseas suppliers." },
    { title: "Customs Velocity", icon: Clock, detail: "Accelerates icegate clearance for shipments at various Indian ports." },
    { title: "Statutory Perks", icon: TrendingUp, detail: "Unlocks eligibility for MEIS/SEIS and other trade incentives from the center." },
    { title: "FEMA Shield", icon: Shield, detail: "Maintains compliance with RBI norms to avoid money laundering flags." },
    { title: "Port Mobility", icon: MapPin, detail: "Allows seamless export-import operations across all major Indian port hubs." },
    { title: "Global Trust", icon: Globe, detail: "A validated trade entity profile for international vendor negotiations." },
];

const adCodeEligibility = [
    { title: "DGFT IEC", detail: "Must possess a valid Import Export Code issued by the DGFT.", icon: FileText },
    { title: "Current Account", detail: "Active account with an AD Category-I bank authorized for FX.", icon: Landmark },
    { title: "ICEGATE Link", detail: "Mapping of code on Customs Electronic Gateway for port clearance.", icon: Globe },
];

const adCodeDocs = [
    { title: "IEC Certificate", detail: "The primary DGFT registration for trade operations.", icon: FileText },
    { title: "Bank Docket", detail: "Branch address, IFSC, and validated current account details.", icon: Landmark },
    { title: "KYC Vault", detail: "PAN and Aadhaar for authorized signatories of the firm.", icon: Users },
    { title: "Address Proof", detail: "Utility bills or lease for the business registered office.", icon: MapPin },
    { title: "Power of Attorney", detail: "Board resolution or letter authorizing the AD filing.", icon: Briefcase },
    { title: "Digital Sign", detail: "Required for secure ICEGATE portal submissions.", icon: Zap },
];

const procedureSteps = [
    { title: "Bank Filing", detail: "Obtaining the 14-digit authorization line from your AD-I bank branch.", icon: Landmark },
    { title: "ICEGATE Mapping", detail: "Digital registration on Customs portal for specific port locations.", icon: Globe },
];

const riskFactors = [
    { title: "FX Transaction Block", penalty: "Inability to settle overseas invoices or receive export payouts.", icon: DollarSign },
    { title: "Shipment Hold", penalty: "Goods stuck at container depots due to lack of custom validation.", icon: Clock },
    { title: "PMLA Risk", penalty: "Severe prosecution under anti-money laundering laws for illegal outflow.", icon: Scale },
    { title: "Incentive Loss", penalty: "Disqualification from statutory export schemes and rebate cycles.", icon: TrendingUp },
];

const whyBizzfiling = [
    { title: "RBI Policy Experts", detail: "Deep understanding of FEMA 1999 and Authorised Dealer guidelines.", icon: UserCheck },
    { title: "Hybrid Workflow", detail: "Handling the physical bank leg and the digital ICEGATE leg in sync.", icon: Zap },
    { title: "Precision Mapping", detail: "Ensuring IFSC and Bank Code match to avoid portal sync rejection.", icon: Search },
    { title: "Port Support", detail: "Dedicated assistance for mapping codes to Chennai, Mumbai, or ICD ports.", icon: MapPin },
];

const adCodeFAQs = [
    { q: "What is the length of the code?", a: "It is a unique 14-digit number issued by your banker." },
    { q: "Can I register for multiple ports?", a: "Yes, once obtained, it must be mapped to each port (Mumbai, Chennai, etc.) separately." },
    { q: "Is the process purely online?", a: "Hybrid: Bank issuance is often offline; ICEGATE registration is fully online." },
    { q: "Who issues the AD code?", a: "An Authorised Dealer (AD) Category-I bank where you hold your current account." },
    { q: "Is it a one-time process?", a: "Usually yes, unless you change your bank branch or account details." },
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
    <section id="adcode-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Trade Identity" title="14-Digit Banking Nexus" description="The Authorised Dealer (AD) Code is mandatory for all foreign currency trade cycles." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 leading-relaxed italic">
                    <p>
                        Issued by AD Category-I banks, this 14-digit code verifies that your foreign currency transactions are genuine and compliant with <strong>Foreign Exchange Management Act (FEMA)</strong>.
                    </p>
                    <p>
                        Without this registration, exporters cannot receive payments or clear shipments at Indian customs, making it a critical hub for international market players.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">FEMA 1999</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">ICEGATE HUB</span>
                    </div>
                </div>
                <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl text-center">
                    <Landmark className="w-16 h-16 text-[#C59B4E] mx-auto mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Financial Guard</h4>
                    <p className="text-[10px] text-slate-400 italic mb-6 leading-relaxed">Assessing authenticity to block illegal outflow of forex and prevent money laundering activities as per RBI guidelines.</p>
                    <div className="flex justify-center gap-4">
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-white uppercase tracking-widest italic border border-white/10 italic">RBI COMPLIANT</span>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-white uppercase tracking-widest italic border border-white/10 italic">DGFT SYNCED</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="adcode-benefits-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Value" title="Optimizing Export Workflow" description="Accelerating port clearances and unlocking statutory government incentives." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {adCodeBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-xs text-slate-500 leading-relaxed italic font-medium">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const EligibilityContent = () => (
    <section id="adcode-eligibility-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="Trade Prerequisites" description="Determining eligibility through DGFT IEC and banking credentials." />
            <div className="grid md:grid-cols-3 gap-8">
                {adCodeEligibility.map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0 shadow-sm"><item.icon size={32} /></div>
                        <h6 className="font-bold text-slate-800 text-sm italic uppercase mb-2 tracking-widest">{item.title}</h6>
                        <p className="text-[11px] text-slate-500 italic leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="adcode-documents-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Archive" title="Registry Documentation" description="Hybrid archival records for bank branch and electronic customs portal." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adCodeDocs.map((doc, i) => (
                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4 items-center shadow-sm text-left">
                        <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
                        <div>
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
    <section id="adcode-procedure-content" className="py-24 bg-slate-900 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Workflow" title="Registration Lifecycle" description="Coordinating between Bank branch authorization and ICEGATE port mapping." />
            <div className="grid md:grid-cols-2 gap-12 mt-16 max-w-4xl mx-auto">
                {procedureSteps.map((step, idx) => (
                    <div key={idx} className="relative p-10 bg-white/5 border border-white/10 rounded-[48px] overflow-hidden group hover:bg-[#C59B4E] transition-all">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 text-white font-bold group-hover:bg-white group-hover:text-amber-900 transition-colors text-lg">0{idx + 1}</div>
                        <h5 className="text-[#C59B4E] font-bold text-sm uppercase italic mb-4 group-hover:text-white transition-colors">{step.title}</h5>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-bold italic uppercase tracking-tighter group-hover:text-amber-900">{step.detail}</p>
                    </div>
                ))}
            </div>
            <div className="mt-16 p-8 bg-white/10 rounded-[32px] border border-white/20 italic max-w-2xl mx-auto">
                <p className="text-white text-xs leading-relaxed"><strong>Port Specific:</strong> Separate digital registration is mandatory for each port location (Mumbai, JNPT, Kolkata, ICDs) where exports will be physically handled.</p>
            </div>
        </div>
    </section>
);

const ConsequencesContent = () => (
    <section id="adcode-consequences-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Risk" title="Non-Compliance Penalties" description="Severe financial blocks and regulatory prosecution under FEMA or PMLA." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {riskFactors.map((item, i) => (
                    <div key={i} className="p-8 bg-white border-b-4 border-b-red-500 rounded-[40px] shadow-xl flex flex-col items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0"><item.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-xs italic uppercase tracking-tighter leading-tight">{item.title}</h6>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed font-bold">{item.penalty}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="adcode-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Trust" title="FX Strategy Partner" description="Simplifying Authorised Dealer code linkage through up-to-date RBI knowledge." align="left" />
                    <div className="grid sm:grid-cols-2 gap-6 pt-4">
                        {whyBizzfiling.map((s, i) => (
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
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter leading-tight italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Trade Quality Nexus</h4>
                    <p className="text-slate-400 text-xs italic mb-8 px-10">"Facilitating AD Code & ICEGATE port mapping for India's leading global exporters."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function ADCodeRegistrationPage() {
    const [activeTab, setActiveTab] = useState('adcode-overview-content');
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
                    <img src={BackgroundImageSrc} alt="AD Code Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2 text-center">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">AD <br /> Code</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70 italic tracking-widest leading-tight">Banking Registry</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                                    Trade <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">Exim Nexus hub</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {adCodeIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">AD</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">14-Digit Link</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col shrink-0">
                                    <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">ICEGATE</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Port Mapping</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm lg:w-[400px]">
                            <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">Apply Now</h2>
                                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Cross-Border Banking Hub</p>
                                <LeadForm serviceName="AD Code Registration" btnText="Get Code" />
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
            <ProcedureContent />
            <ConsequencesContent />
            <WhyBizzfiling />

            <section id="adcode-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Trade Law Intelligence" description="Clearing compliance and registry protocols for Authorised Dealer codes and FEMA rules." />
                    <div className="space-y-4 pt-10">
                        {adCodeFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}