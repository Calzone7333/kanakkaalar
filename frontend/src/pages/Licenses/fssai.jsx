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
    Users,
    DollarSign,
    Clock,
    Landmark,
    MapPin,
    Lightbulb,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- FSSAI REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'fssai-overview-content', label: 'Overview' },
    { id: 'fssai-eligibility-content', label: 'Eligibility' },
    { id: 'fssai-benefits-content', label: 'Benefits' },
    { id: 'fssai-documents-content', label: 'Documents' },
    { id: 'fssai-process-content', label: 'Process' },
    { id: 'fssai-process-content', label: 'Process' },
    { id: 'fssai-pricing-content', label: 'Pricing' },
    { id: 'fssai-why-Bizzfiling', label: 'Why Us' },
    { id: 'fssai-faqs-content', label: 'FAQs' },
];

const fssaiIntroBullets = [
    "Expert guidance to choose the right FSSAI license for your business scale.",
    "Fast and secure document filing with registration completed in as little as 5 days.",
    "Easy renewal and modification in just 48 hours with full expert support.",
];

const fssaiEligibility = [
    { title: "Basic Registration", turnover: "Upto ₹12 lakhs p.a.", criteria: "Small-scale operators, home-based ventures, petty retailers.", icon: Handshake },
    { title: "State License", turnover: "₹12 lakhs to ₹20 crores p.a.", criteria: "Mid-level manufacturers, restaurants, and caterers within one state.", icon: Briefcase },
    { title: "Central License", turnover: "> ₹20 crores or Interstate", criteria: "Large importers, manufacturers, or multi-state suppliers.", icon: Landmark },
];

const fssaiChecklist = [
    "Valid ID & Address Proof for proprietor and key personnel.",
    "Identify Business Type (Manufacturing, Retail, Catering).",
    "Identify Turnover Bracket for correct license selection.",
    "Fixed Business Premises for verifiable food operations.",
    "Adherence to FSSAI Hygiene & Safety guidelines.",
];

const fssaiBenefits = [
    { title: "Legal Recognition", icon: Scale, detail: "Grants authorization to operate, ensuring compliance and avoiding penalties." },
    { title: "Business Expansion", icon: TrendingUp, detail: "Facilitates enter into new markets and retail outlets with brand authority." },
    { title: "Trusted Logo Use", icon: Zap, detail: "Display the FSSAI logo on products to enhance consumer confidence." },
    { title: "Consumer Security", icon: Handshake, detail: "Builds assurance that products meet rigorous safety benchmarks." },
    { title: "Financial Access", icon: DollarSign, detail: "Helps in securing loans as banks prefer licensed entities." },
    { title: "Operational Continuity", icon: Clock, detail: "Avoid disruption with a valid, government-issued food safety cert." },
];

const fssaiDocuments = [
    { title: "Photo ID Proof", detail: "Aadhar, PAN, or Passport of the applicant.", icon: Users },
    { title: "Registration Proof", detail: "COI, Partnership Deed, or MOA/AOA.", icon: Briefcase },
    { title: "Address Proof", detail: "Rent agreement or utility bills for the premises.", icon: MapPin },
    { title: "Safety Plan (FSMS)", detail: "Mandatory document for specific license types.", icon: FileText },
    { title: "Product List", detail: "Categories of food being handled or stored.", icon: FileText },
    { title: "NOC Authorities", detail: "Municipal NOC if applicable locally.", icon: Landmark },
];

const fssaiRegistrationProcess = [
    "Select License Type based on turnover and scale.",
    "Gather Documentation for identity and premises proof.",
    "Draft & Submit Form (Form A or Form B) on the FSSAI portal.",
    "Fee Payment for desired validity (1 to 5 years).",
    "Verification/Inspection for State & Central tiers.",
    "E-Certificate Issuance after successful approval.",
];

const fssaiPenalties = [
    { title: "Sub-standard Quality", fine: "₹2 Lakh - ₹5 Lakh", icon: Scale },
    { title: "Misbranded Products", fine: "₹3 Lakh", icon: Scale },
    { title: "False Advertising", fine: "₹10 Lakh", icon: Scale },
];

const fssaiWhyBizzfiling = [
    { title: "End-to-End Support", detail: "Handling everything from documentation to final delivery.", icon: Briefcase },
    { title: "Licensed Consultants", detail: "Predictive advice tailored to your food business niche.", icon: Lightbulb },
    { title: "One of India's fastest turnarounds for food licenses.", detail: "Reliable compliance before deadlines.", icon: Clock },
    { title: "Fixed Pricing", detail: "Competitive rates with no hidden professional fees.", icon: DollarSign },
];

const fssaiPlans = [
    {
        title: "Standard",
        price: "₹1,000",
        description: "For small businesses turnover up to ₹12L.",
        features: [
            "15-minutes call with food license experts",
            "Assistance with selecting the right license type",
            "Your food license application filing done in 24 hours",
            "99% faster application approval",
            "FSSAI Certificate"
        ],
        isRecommended: false,
    },
    {
        title: "Premium",
        price: "₹16,899",
        description: "For turnovers ₹12L - ₹20Cr.",
        features: [
            "15-minutes call with food license experts",
            "Assistance with selecting the right license type",
            "Your food license application filing done in 24 hours",
            "99% faster application approval",
            "FSSAI Certificate",
            "GST Registration",
            "GST filing for one financial year (upto 300 transactions)",
            "ITR Filings for one financial year (upto 40 lakhs) - Rs. 2500"
        ],
        isRecommended: true,
    },
    {
        title: "Elite",
        price: "₹19,399",
        description: "For turnovers > ₹20Cr or Importers.",
        features: [
            "15-minutes call with food license experts",
            "Assistance with selecting the right license type",
            "Your food license application filing done in 24 hours",
            "99% faster application approval",
            "FSSAI Certificate"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const fssaiFAQs = [
    { q: "What is FSSAI Registration?", a: "It's a mandatory license for food business operators (FBOs) to ensure hygiene and safety." },
    { q: "Who must apply for the license?", a: "Anyone involved in manufacturing, storing, distributing, or selling food items." },
    { q: "What are the three tiers of licensing?", a: "Basic (upto 12L), State (up to 20Cr), and Central (above 20Cr or interstate)." },
    { q: "How long does the process take?", a: "Basic takes ~7 days, while State/Central can take 20-30 days including inspection." },
    { q: "Is GST mandatory for FSSAI?", a: "Not for Basic registration, but typically required for State/Central tiers." },
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
    <section id="fssai-overview-content" className="py-20 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Compliance" title="FSSAI Registration" description="Ensuring food safety standards for vendors, manufacturers, and exporters across India." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-slate-600 leading-relaxed italic">
                    <p>
                        Every food business in India, from small vendors to large manufacturers, is legally required to complete <strong>FSSAI Registration online</strong> to ensure food safety and consumer trust.
                    </p>
                    <p>
                        FSSAI monitors the quality of food products, ensuring that businesses adhere to proper safety standards and regulations, minimizing the risk of food adulteration and protecting public health.
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase">Food Safety Act</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase">Hygiene Audit</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl border-l-[12px] border-l-[#1A7F7D]">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tight uppercase italic">Who Needs It?</h4>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 italic">Mandatory for anyone in production, processing, packaging, or sale of edible items, including dietary supplements.</p>
                    <div className="grid grid-cols-3 gap-5">
                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <MapPin size={24} className="mx-auto text-[#1A7F7D] mb-2" />
                            <span className="text-sm text-slate-400 uppercase font-bold">Local</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <TrendingUp size={24} className="mx-auto text-[#1A7F7D] mb-2" />
                            <span className="text-sm text-slate-400 uppercase font-bold">State</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <Landmark size={24} className="mx-auto text-[#1A7F7D] mb-2" />
                            <span className="text-sm text-slate-400 uppercase font-bold">Central</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const EligibilityContent = () => (
    <section id="fssai-eligibility-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="License Categories" description="Determined primarily by annual turnover and operational reach." />
            <div className="grid md:grid-cols-3 gap-10 mb-12">
                {fssaiEligibility.map((item, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center space-y-8 shadow-sm hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1A7F7D] shadow-inner"><item.icon size={28} /></div>
                        <h5 className="font-extrabold text-[#103B3E] text-lg">{item.title}</h5>
                        <p className="text-sm text-[#C59B4E] font-bold uppercase tracking-widest">{item.turnover}</p>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.criteria}</p>
                    </div>
                ))}
            </div>
            <div className="p-8 bg-slate-900 rounded-[32px] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#1A7F7D]/20 rounded-bl-full"></div>
                <h6 className="text-sm font-bold uppercase text-[#C59B4E] mb-6 flex items-center gap-5 italic"><CheckCircle size={18} /> Compliance Checklist</h6>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {fssaiChecklist.map((c, idx) => (
                        <p key={idx} className="text-sm text-slate-300 flex items-center gap-5 italic leading-relaxed"><span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#1A7F7D]"></span>{c}</p>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="fssai-benefits-content" className="py-20 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Value" title="FSSAI Advantages" description="Building an ecosystem of safety and financial reliability." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {fssaiBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#1A7F7D]/30 hover:shadow-2xl transition-all h-full">
                        <item.icon className="w-10 h-10 text-[#C59B4E] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-lg mb-3 uppercase tracking-tighter">{item.title}</h6>
                        <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="fssai-documents-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Archives" title="Required Paperwork" description="Essential documentation to verify business legitimacy and food safety systems." />
            <div className="grid md:grid-cols-3 gap-10">
                {fssaiDocuments.map((doc, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex gap-5 items-start shadow-sm transition-transform hover:-translate-y-1">
                        <div className="w-10 h-10 bg-[#1A7F7D]/10 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-lg mb-1">{doc.title}</h6>
                            <p className="text-sm text-slate-500 italic leading-relaxed">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="fssai-process-content" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Timeline" title="Execution Steps" description="A streamlined procedure for official food safety certification." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-10 relative">
                {fssaiRegistrationProcess.map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
                            <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">✓</div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed font-semibold italic">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FssaiPricingContent = () => (
    <section id="fssai-pricing-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Economics" title="FSSAI Fees & Plans" description="Official government charges for different license tiers." />
            <PricingCards plans={fssaiPlans} serviceName="Food License" />
            <div className="mt-12 p-8 bg-[#EF4444]/5 border-l-8 border-l-[#EF4444] rounded-2xl flex flex-col md:flex-row gap-10 md:items-center">
                <Scale className="text-[#EF4444] shrink-0" size={32} />
                <div>
                    <h6 className="text-[#EF4444] font-bold text-sm uppercase italic">Strict Penalty Warning</h6>
                    <p className="text-sm text-[#7F1D1D] italic leading-relaxed">Operating without registration can lead to heavy penalties of up to ₹10 Lakh or business closure. Renewal must be filed 30 days before expiry.</p>
                </div>
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="fssai-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Advocacy" title="Why Choose Bizzfiling?" description="Ensuring accuracy across all FSSAI filing tiers with professional oversight." align="left" />
                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        {fssaiWhyBizzfiling.map((s, i) => (
                            <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:scale-105">
                                <div className="w-10 h-10 bg-[#1A7F7D]/10 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-4"><s.icon size={20} /></div>
                                <h6 className="font-bold text-slate-800 text-lg mb-1">{s.title}</h6>
                                <p className="text-sm text-slate-500 italic">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-slate-900 p-12 rounded-[40px] text-white flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B4E]/10 rounded-full blur-3xl"></div>
                    <Star size={64} className="text-[#C59B4E] mb-6 animate-spin-slow" />
                    <h4 className="text-2xl font-bold font-serif mb-4 italic tracking-tight uppercase">ISO Certified Consultancy</h4>
                    <p className="text-slate-400 text-sm italic mb-8">"Managing FSSAI portfolios for thousands of high-growth food brands since 2018."</p>
                    <button className="px-10 py-4 bg-[#C59B4E] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#a37d35] transition-all">Submit Documents</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function FSSAIRegistrationPage() {
    const [activeTab, setActiveTab] = useState('fssai-overview-content');
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
                    <img src={BackgroundImageSrc} alt="FSSAI Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Award size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Official FoSCos Guidance Port</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                Official <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Food License (FSSAI)</span>
                            </h1>
                            <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                                Ensure food safety and legal compliance for your business. From basic registration to central licenses, we handle the entire FoSCos process for you.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> 7-Day Processing
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> Govt Certified
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Secure License</h3>
                                    <LeadForm serviceName="FSSAI Registration" btnText="Apply Now" />
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
            <ProcessContent />
            <FssaiPricingContent />
            <WhyBizzfiling />

            <section id="fssai-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="FSSAI Knowledge Hub" description="Essential guidance for food business operators in India." />
                    <div className="space-y-8 pt-10">
                        {fssaiFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}