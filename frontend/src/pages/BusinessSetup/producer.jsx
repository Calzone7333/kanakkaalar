import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// Consolidated lucide-react icons for producer company registration page
import {
    ChevronDown,
    ArrowRight,
    CheckCircle,
    FileText,
    Star,
    Shield,
    Award,
    Timer,
    FilePenLine,
    Rocket,
    Users,
    Layers,
    Home,
    IndianRupee,
    Activity,
    Zap,
    Scale,
    Briefcase,
    FileCheck,
    Cpu,
    BadgeCheck,
    Calendar,
    ShieldCheck,
    Gavel,
    Globe
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'overview-content', label: 'Overview' },
    { id: 'benefits-content', label: 'Benefits' },
    { id: 'pricing-content', label: 'Pricing' },
    { id: 'requirements-content', label: 'Requirements' },
    { id: 'documents-content', label: 'Documents' },
    { id: 'process-content', label: 'Process' },
    { id: 'faqs-content', label: 'FAQs' },
];

const producerPlans = [
    {
        title: "FPO Essentials",
        price: "₹19,999",
        originalPrice: "₹24,999",
        discountText: "20% off",
        description: "Foundational registration for 10 individual producers.",
        features: [
            "DSC & DIN for 5 Directors",
            "Name Approval (RUN)",
            "Incorporation Certificate",
            "MoA & AoA Drafting",
            "PAN & TAN Registration",
            "Basic Member Ledger Setup"
        ],
        isRecommended: false,
    },
    {
        title: "Standard Growth",
        price: "₹34,999",
        originalPrice: "₹45,999",
        discountText: "24% off",
        description: "Complete setup with business licenses for operations.",
        features: [
            "Includes FPO Essentials Plan",
            "GST Registration",
            "MSME (Udyam) Registration",
            "FSSAI Basic License*",
            "Bank Account Assistance",
            "Customized Bylaws Drafting"
        ],
        isRecommended: true,
    },
    {
        title: "Comprehensive Farm",
        price: "₹59,999",
        originalPrice: "₹89,999",
        discountText: "33% off",
        description: "End-to-end setup + first year compliance & grant advisory.",
        features: [
            "Includes Standard Growth Plan",
            "1 Year Compliance Support",
            "Statutory Audit Assistance",
            "Grant/Subsidy Eligibility Review",
            "Member Training session",
            "Dedicated Relationship Manager"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const producerRequirements = [
    { icon: Users, title: "10 Individual Producers", description: "Must have at least 10 primary producers or 2 producer institutions." },
    { icon: BadgeCheck, title: "5 Directors", description: "A minimum of 5 directors are required to govern the producer company." },
    { icon: IndianRupee, title: "Capital Contribution", description: "Minimum paid-up capital of ₹5,00,000 is required at incorporation." },
    { icon: Globe, title: "Producer Proof", description: "Evidence of being a producer (Artisan/Farmer) is mandatory for members." },
    { icon: ShieldCheck, title: "Objective Clause", description: "Business must involve production, marketing, or export of primary produce." },
    { icon: Home, title: "Registered Address", description: "Valid address proof for the firm's head office with NOC from owner." }
];

const producerDocuments = [
    { category: "For Members & Directors", items: ["PAN Card (Mandatory)", "Aadhaar Card", "Latest Passport size photos", "Farmer/Producer Certificate (7/12 extract or similar)", "Utility Bill / Bank Statement (recent)"] },
    { category: "For Registered Office", items: ["Utility Bill (Electricity/Water/Gas)", "NOC from Property Owner", "Rent Agreement (if rented)"] }
];

const producerFAQs = [
    { q: "What is a Producer Company?", a: "A Producer Company is a hybrid between a cooperative society and a private limited company, designed for farmers, artisans, and primary producers to scale their business legally." },
    { q: "What are the benefits of an FPO?", a: "Benefits include better bargaining power, easier access to credit, limited liability for farmers, and eligibility for various central and state government schemes (like the 10,000 FPO scheme)." },
    { q: "Is there a limit on the number of members?", a: "No, there is no maximum limit on the number of members in a Producer Company." },
    { q: "Can a Producer Company be converted into a Public Limited Company?", a: "No, a Producer Company can never be converted into a regular Public Limited Company, but it can be converted into a Multi-state Cooperative Society." },
    { q: "What defines a 'Producer'?", a: "A producer is any person engaged in any activity connected with or related to primary produce (farming, animal husbandry, horticulture, handloom, etc.)." },
    { q: "Are dividends paid in a Producer Company?", a: "Yes, members can receive dividends (called patronage bonus) based on the quantity of produce they supply to the company, rather than just their shareholding." },
    { q: "How are votes calculated?", a: "Every member has a single vote, regardless of their shareholding, ensuring democratic control by the producers themselves." },
];

// --- Components ---

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

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
    <div className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
    ${isHighlighted
            ? 'bg-gradient-to-br from-[#E8DCC2] to-[#D4B982] border-transparent shadow-lg transform -translate-y-1'
            : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
       ${isHighlighted ? 'bg-white/30 text-[#8C6B28]' : 'bg-slate-50 text-[#1A7F7D]'}
    `}>
            {Icon ? <Icon className="w-5 h-5" /> : (isHighlighted ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />)}
        </div>
        <h3 className={`text-base font-bold mb-2 ${isHighlighted ? 'text-[#5C4518]' : 'text-slate-800'}`}>
            {title}
        </h3>
        <p className={`text-xs leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
            {description}
        </p>
        <div className={`flex items-center text-xs font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-2 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 ml-1" />
        </div>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
        <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
            <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
            </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
        </div>
    </div>
);

// --- Sections ---

const OverviewContent = () => (
    <section id="overview-content" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl px-6 mx-auto">
            <SectionHeading subtitle="Scale" title="Producer Company Registration" description="The power of a corporation, the heart of a cooperative." />

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-slate-800">Uniting Primary Producers</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Producer Company is a unique legal structure in India that allows 10 or more primary producers (farmers, artisans, etc.) to come together and incorporate a company. It blends the best of both worlds: the democratic governance of a cooperative society and the administrative efficiency of a private limited company.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        By forming a Producer Company (often called an FPO), members gain institutional standing, making it significantly easier to access bank credit, government subsidies, and broader markets both domestically and internationally.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Farmer Empowerment</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Scale Efficiencies</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">FPO Scheme Eligible</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Activity className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Market Power</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Limited Liability</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Users className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Democratic Voting</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <IndianRupee className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Equity Access</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Activity className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Better Pricing</h4>
                    <p className="text-gray-300 text-sm">Collective marketing allows members to bypass middlemen and command higher prices for their produce.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Zap className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Grant Eligibility</h4>
                    <p className="text-gray-300 text-sm">Qualify for exclusive central and state government funding designed to support rural entrepreneurship.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Cpu className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Modern Technology</h4>
                    <p className="text-gray-300 text-sm">Pool resources to purchase modern farming equipment or processing machinery as a group.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Pros" title="Growth for Producers" description="Formalizing agriculture for professional success." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Professional Admin</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Run your farm like a business with professional directors and management.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Scale className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Legal Protection</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Unlike a cooperative, it offers the legal autonomy and continuity of a company.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Globe className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Easy Exit</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Membership can be easily managed and transferred within the producer community.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Rocket className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Scheme Access</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Gain priority access to SFAC and NABARD support for equity and credit links.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Professional FPO Setup" description="Clear pricing to launch your producer cooperative enterprise." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {producerPlans.map((plan, i) => (
                    <div key={i} className={`flex flex-col p-6 rounded-2xl border ${plan.isRecommended ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        {plan.isRecommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Farmer's Choice</span>}
                        <h3 className="text-lg font-bold mb-1 text-slate-800">{plan.title}</h3>
                        <p className="text-[10px] text-slate-500 mb-4 h-8">{plan.description}</p>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                            {plan.originalPrice && <span className="text-sm text-slate-400 line-through font-medium">{plan.originalPrice}</span>}
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                            {plan.features.map((feat, j) => (
                                <li key={j} className="flex items-start gap-3 text-xs text-slate-600">
                                    <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                                    <span className="leading-tight">{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`w-full py-4 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${plan.isPremium ? 'bg-[#C59B4E] hover:bg-[#A37D35]' : 'bg-[#1A7F7D] hover:bg-[#146361]'} text-white shadow-md`}>Get Started</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="The Regulatory Bar" description="Must-have criteria for an authentic producer company." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {producerRequirements.map((req, i) => (<ServiceCard key={i} title={req.title} description={req.description} icon={req.icon} />))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="documents-content" className="py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <span className="text-[#C59B4E] font-bold text-xs uppercase tracking-widest mb-3 block">Paperwork</span>
                <h3 className="text-3xl font-bold mb-4">Checklist</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Digitized file preparation for all 10+ members.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {producerDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 transition-transform hover:scale-[1.02]">
                        <h4 className="text-xl font-bold text-[#1A7F7D] mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#1A7F7D]/20 flex items-center justify-center text-xs text-[#1A7F7D]">{idx + 1}</span>
                            {doc.category}
                        </h4>
                        <ul className="grid grid-cols-1 gap-4">
                            {doc.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                    <FileCheck className="w-4 h-4 text-[#C59B4E]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="process-content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Step-by-Step" title="Incorporation Cycle" description="From digital keys to producer license." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Rocket, title: "DSC & DIN", desc: "Digital signatures for all 5 proposed directors." },
                    { icon: BadgeCheck, title: "Name Pick", desc: "Choosing a name ending with 'Producer Company Limited'." },
                    { icon: FilePenLine, title: "Drafting", desc: "Customized MOA & AOA tailored for farm producers." },
                    { icon: Award, title: "Final License", desc: "Issue of Certificate of Incorporation by the ROC." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:-rotate-6">
                            <step.icon className="w-7 h-7 text-[#1A7F7D]" />
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">{idx + 1}</div>
                        </div>
                        <h5 className="text-lg font-bold text-slate-800">{step.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed px-4">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default function ProducerPage() {
    const [activeTab, setActiveTab] = useState('overview-content');
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
            window.scrollTo({ top: element.offsetTop - SCROLL_OFFSET + 20, behavior: 'smooth' });
            setActiveTab(id);
        }
    };

    return (
        <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 selection:bg-[#1A7F7D] selection:text-white">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            {/* Hero */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Producer Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">Producer <br /> Limited</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">Verified</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                                    Producer <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Registration</span>
                                </h1>
                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed">Empower your agricultural community. Build a robust Farmer Producer Organization (FPO) with us. <span className="text-[#C59B4E] font-bold uppercase tracking-wider text-xs ml-2">Roots of Success.</span></p>
                            </div>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">₹19,999</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Starting Price</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">10+</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Producer Members</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:w-[400px]">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Form your FPO</h2>
                                <p className="text-[11px] text-slate-500 mb-6 text-center">Expert assistance for Producer Companies!</p>
                                <LeadForm serviceName="Producer Company Registration" btnText="Get Started" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center gap-8 md:gap-16 py-0 min-w-max">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    className={`py-4 text-xs md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-wider ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <OverviewContent />
            <BenefitsContent />
            <PricingContent />
            <RequirementsContent />
            <DocumentsContent />
            <ProcessContent />

            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Agricultural Insights" description="Everything you need to know about Producer Companies." />
                    <div className="space-y-4">
                        {producerFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}