import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
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
    Banknote,
    RefreshCw,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

const Factory = ({ size, className }) => <Briefcase size={size} className={className} />;

// --- SPICE BOARD REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'spice-overview-content', label: 'Overview' },
    { id: 'spice-eligibility-content', label: 'Eligibility' },
    { id: 'spice-benefits-content', label: 'Benefits' },
    { id: 'spice-documents-content', label: 'Documents' },
    { id: 'spice-fees-compliance', label: 'Fees' },
    { id: 'spice-renewal-penalties', label: 'Renewal' },
    { id: 'spice-why-Bizzfiling', label: 'Why Us' },
    { id: 'spice-faqs-content', label: 'FAQs' },
];

const spiceIntroBullets = [
    "Grow Your Spice Import-Export Business with Expert Spice Board Registration.",
    "Seamless online registration with full documentation and compliance support.",
    "Expand globally with trusted guidance from experienced legal professionals.",
];

const spiceBoardOverview = {
    detail: "The Spice Board of India acts as a regulatory body under the Ministry of Commerce & Industry, promoting Indian spices in global markets.",
    mandate: "The Spices Board Act of 1986 mandates CRES (Certificate of Registration as Exporter of Spices) for anyone dealing with spice exports.",
    crese: "CRES acts as the mandatory Registration Cum Membership Certificate (RCMC) for spice exporters."
};

const spiceEligibility = [
    { title: "Registered Entity", detail: "Must be registered under Companies Act or Partnership Act.", icon: Briefcase },
    { title: "Valid IEC Code", detail: "Mandatory Import-Export Code issued by DGFT.", icon: FileText },
    { title: "Minimum Turnover", detail: "₹2.5 lakhs or more for the previous financial year.", icon: DollarSign },
    { title: "Premises & Storage", detail: "Permanent business place with adequate spice storage.", icon: MapPin },
    { title: "FSSAI Compliance", detail: "Central FSSAI License is mandatory for food products.", icon: Scale },
    { title: "Quality Systems", detail: "Necessary technical know-how and quality control systems.", icon: CheckCircle },
];

const spiceBenefits = [
    { title: "Legal Safety", icon: Scale, detail: "Ensures compliance with the 1986 Act, avoiding arrests and heavy fines." },
    { title: "Global Authority", icon: Globe, detail: "Fulfills key export requirements and enhances international brand credibility." },
    { title: "Export Incentives", icon: TrendingUp, detail: "Access to promotion schemes, financial assistance, and govt subsidies." },
    { title: "Networking", icon: Handshake, detail: "Interaction with foreign buyers via exhibitions and trade groups." },
    { title: "Quality Upgradation", icon: Zap, detail: "Supports technology and quality branding for product development." },
    { title: "Data Access", icon: Search, detail: "Access to current importer and exporter data banks for intelligence." },
];

const spiceDocuments = [
    { title: "IEC Certificate", detail: "Self-attested copy issued by DGFT.", icon: FileText },
    { title: "Bank Report", detail: "Confidential report on financial status/net worth.", icon: Banknote },
    { title: "FSSAI License", detail: "Valid copy of the Central FSSAI License.", icon: Scale },
    { title: "Business Proof", detail: "COI, Partnership Deed, or MOA/AOA.", icon: Briefcase },
    { title: "Tax Proof", detail: "GST and entity PAN card copies.", icon: FileText },
    { title: "Unit Proof", detail: "MSME or PCB Consent (for Manufacturers only).", icon: Factory },
];

const spicePlans = [
    {
        title: "Manufacturer Exporter",
        price: "₹17,700",
        description: "Complete Manufacturer Exporter service.",
        features: [
            "Incl",
            "18% GST",
        ],
        isRecommended: false,
    },
    {
        title: "Merchant Exporter",
        price: "₹11,800",
        description: "Complete Merchant Exporter service.",
        features: [
            "Incl",
            "18% GST",
        ],
        isRecommended: true,
    },
];

const spiceWhyBizzfiling = [
    { title: "Holistic Support", detail: "Attorneys and experts providing end-to-end filing nexus.", icon: UserCheck },
    { title: "Efficient Issue", detail: "Fast CRES certificate issuance with zero portal lag.", icon: Clock },
    { title: "Zero Error Filings", detail: "Ensuring FSSAI and Bank Reports are technically perfect.", icon: Zap },
    { title: "Compliance Hub", detail: "Guidance on Form B (Quarterly Returns) and renewal cycles.", icon: Scale },
];

const spiceFAQs = [
    { q: "What is the CRES certificate?", a: "The Certificate of Registration as Exporter of Spices, serving as the industry's RCMC." },
    { q: "Is registration mandatory for spices?", a: "Yes, for any export dealing with the 52 specified spices as per the 1986 Act." },
    { q: "What is the validity period?", a: "Issued for a block period of three financial years, requiring renewal thereafter." },
    { q: "What are the return obligations?", a: "Mandatory Quarterly Returns (Form B) must be filed to avoid fines." },
    { q: "What is the turnover requirement?", a: "A minimum of ₹2.5 lakhs for the preceding financial year is mandatory." },
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
            <h3 className={`text-sm md:text-base font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
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
    <section id="spice-overview-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Spices" title="CRES Registration" description="Mandatory certification for producer-exporters dealing with official Indian spices." />
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-8 text-slate-600 leading-relaxed italic">
                    <p>
                        The <strong>Spice Board of India</strong> acts as a regulatory body Promoting Indian spices in foreign markets.
                        It is mandatory to possess a <strong>CRES (Certificate of Registration as Exporter of Spices)</strong> for anyone dealing with spice exports.
                    </p>
                    <p>
                        Trading without this certificate may result in <strong>arrest and imprisonment</strong> for up to a year.
                        It acts as the Registration-Cum-Membership Certificate (RCMC) for the entire spice vertical.
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase">52 Spices Covered</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase">Min. ₹2.5L Turnover</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden group">
                    <AlertCircle className="absolute -top-4 -right-4 w-24 h-24 text-red-500/5 group-hover:scale-125 transition-all" />
                    <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tight uppercase italic">Compliance mandate</h4>
                    <p className="text-sm text-slate-500 mb-6 italic">Per Spices Board Act 1986: Regulating the export of cardamom and 51 other specified spices.</p>
                    <div className="flex items-center gap-5 p-4 bg-red-50 rounded-xl border-l-4 border-l-red-500">
                        <Scale className="text-red-500 shrink-0" size={24} />
                        <span className="text-sm font-bold text-red-700 uppercase italic">Violation: Up to 1 Year Detention</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const EligibilityContent = () => (
    <section id="spice-eligibility-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="Eligibility Check" description="Minimum legal and infrastructure standards for spice exporters." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {spiceEligibility.map((item, i) => (
                    <div key={i} className="flex gap-5 p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-[#1A7F7D] flex items-center justify-center shrink-0"><item.icon size={24} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg mb-1 italic">{item.title}</h6>
                            <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="spice-benefits-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Advantage" title="Strategic Export Benefits" description="Building international brand value and accessing government subsidies." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {spiceBenefits.map((item, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#1A7F7D]/30 transition-all group">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-lg mb-3 uppercase tracking-tighter italic">{item.title}</h6>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="spice-documents-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Archive" title="Documentation Requirements" description="Financial and legal proof needed for CRES issuance." />
            <div className="grid md:grid-cols-3 gap-10">
                {spiceDocuments.map((doc, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex gap-5 items-center">
                        <div className="w-10 h-10 bg-white rounded-xl text-[#1A7F7D] flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg italic uppercase mb-1 tracking-tight">{doc.title}</h6>
                            <p className="text-sm text-slate-400 font-semibold">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FeesCompliance = () => (
    <section id="spice-fees-compliance" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Economics" title="Filing Fees & Compliance" description="Government charges and mandatory quarterly reporting obligations." />
            <PricingCards plans={spicePlans} serviceName="SPICE Registration" />
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12">
            <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                <h5 className="font-bold text-[#C59B4E] uppercase italic mb-6 flex items-center gap-5 tracking-widest"><FilePenLine size={20} /> Quarterly Returns (Form B)</h5>
                <p className="text-sm text-slate-400 italic leading-relaxed mb-6">Filing Quarterly Returns is <strong>mandatory</strong>. Failure to comply on time results in a recurring fine of ₹500 and possible deactivation of the export status.</p>
                <div className="flex gap-5">
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold tracking-widest uppercase italic">Every 3 Months</span>
                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-bold tracking-widest uppercase italic">Digital Submission</span>
                </div>
            </div>
        </div>
    </section >
);

const RenewalPenalties = () => (
    <section id="spice-renewal-penalties" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Continuity" title="Validity & Renewal Cycles" description="Maintaining your exporter status through block-year renewals." />
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="p-8 bg-slate-50 rounded-2xl flex gap-10 items-center">
                        <Clock className="text-[#1A7F7D]" size={32} />
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg uppercase italic mb-1">3-Year Block Period</h6>
                            <p className="text-sm text-slate-500 italic">CRES is issued for a fixed block year and must be renewed 2 months before expiry.</p>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50 rounded-2xl flex gap-10 items-center">
                        <RefreshCw className="text-[#1A7F7D]" size={32} />
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg uppercase italic mb-1">Renewal Filing</h6>
                            <p className="text-sm text-slate-500 italic">Mandatory two months lead time before the block-year closes.</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 bg-red-900 rounded-[40px] text-white relative overflow-hidden flex flex-col justify-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
                    <Scale className="text-[#C59B4E] mb-4" size={32} />
                    <h5 className="font-bold text-sm uppercase tracking-widest mb-3 italic underline decoration-[#C59B4E] underline-offset-8">Penalty Scrutiny</h5>
                    <p className="text-sm text-slate-300 italic leading-relaxed">Lack of spice export activity for 3 years leads to certificate <strong>Cancellation</strong>. Trading without renewal can lead to fines and imprisonment up to 12 months.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="spice-why-Bizzfiling" className="py-12 md:py-16 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Trust" title="Why Exporters Trust Us" description="Handling FSSAI, IEC, and Spice Board protocols under one professional roof." align="left" />
                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        {spiceWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-start gap-5">
                                <div className="w-10 h-10 bg-[#1A7F7D]/10 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><s.icon size={20} /></div>
                                <div>
                                    <h6 className="font-bold text-slate-800 text-lg mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                    <p className="text-sm text-slate-500 italic leading-relaxed">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tight">Spice Global Alliance</h4>
                    <p className="text-slate-400 text-sm italic mb-8">"Providing regulatory assurance for India's leading spice export houses."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-sm">Talk to consultant</button>
                </div>
            </div>
        </div>
    </section>
);



// --- Main Component ---

export default function SpiceBoardRegistrationPage() {
    const [activeTab, setActiveTab] = useState('spice-overview-content');
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
                    <img src={BackgroundImageSrc} alt="Spice Board Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Award size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Official Spices Board CRES Licensing</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Spice Export <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">CRES License</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                Expand your spice business globally. Get your Certificate of Registration as Exporter of Spices (CRES) with our expert-assisted Spice Board filing service.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Mandatory RCMC
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Globe size={18} className="text-[#C59B4E]" /> International Reach
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Online</h3>
                                    <LeadForm serviceName="Masala Board/Spice Board Registration" btnText="Apply Now" />
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
            <EligibilityContent />
            <BenefitsContent />
            <DocumentsContent />
            <FeesCompliance />
            <RenewalPenalties />
            <WhyBizzfiling />

            <section id="spice-faqs-content" className="py-16 md:py-20 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Spice Intelligence" description="Clearing compliance and registration protocols for global spice traders." />
                    <div className="space-y-8 pt-10">
                        {spiceFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}