import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// Consolidated lucide-react icons for sole proprietorship registration page
import {
    ChevronDown,
    MapPin,
    Briefcase,
    ArrowRight,
    UserCheck,
    CheckCircle,
    FileText,
    Scale,
    Calculator,
    Download,
    Zap,
    Star,
    Shield,
    Activity,
    Award,
    Timer,
    FilePenLine,
    Rocket,
    Search,
    Users,
    Layers,
    Home,
    Trello,
    BadgeCheck,
    FileCheck,
    Calendar,
    UserCircle,
    CreditCard,
    DollarSign
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'overview-content', label: 'Overview' },
    { id: 'benefits-content', label: 'Benefits' },
    { id: 'pricing-content', label: 'Pricing' },
    { id: 'registration-types', label: 'Types' },
    { id: 'documents-content', label: 'Documents' },
    { id: 'process-content', label: 'Process' },
    { id: 'faqs-content', label: 'FAQs' },
];

const spPlans = [
    {
        title: "Basic Registration",
        price: "₹499",
        originalPrice: "₹999",
        discountText: "50% off",
        description: "Ideal for small vendors and home-based businesses starting small.",
        features: [
            "Expert assisted process",
            "Udyam (MSME) Registration",
            "Consultation on Bank A/c",
            "Business Name Recommendation",
            "Digital Certificate delivery"
        ],
        isRecommended: false,
    },
    {
        title: "Professional",
        price: "₹3,499",
        originalPrice: "₹4,999",
        discountText: "30% off",
        description: "Perfect for shops and service providers needing GST portal access.",
        features: [
            "All Basic Features",
            "GST Registration Certificate",
            "Shop & Establishment License",
            "Dedicated Account Manager",
            "GST Returns (2 Months Free)",
            "Business Logo Design Template"
        ],
        isRecommended: true,
    },
    {
        title: "Compliance Plus",
        price: "₹5,999",
        originalPrice: "₹8,260",
        discountText: "27% off",
        description: "Complete peace of mind for an entire year of business operation.",
        features: [
            "All Professional Features",
            "1 Year GST Filing Support",
            "1 Year Income Tax Filing (ITR-3/4)",
            "Unlimited Tax Consultation",
            "Digital Signature (DSC)",
            "Monthly Compliance Alerts"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const spEligibility = [
    { icon: UserCircle, title: "Indian Resident", description: "Must be a resident of India and at least 18 years old." },
    { icon: Briefcase, title: "Solo Proprietor", description: "The individual must be the sole owner of the business venture." },
    { icon: FileText, title: "Legally Capable", description: "Owner should have the legal capacity to enter into contracts." },
    { icon: Layers, title: "Lawful Purpose", description: "The business activity must be legal and compliant with local laws." },
];

const spDocuments = [
    { category: "For the Owner", items: ["Aadhaar Card", "PAN Card", "Passport Size Photo", "Personal Bank Account Details"] },
    { category: "For Shop/Office", items: ["Utility Bill (Electricity/Water)", "Rent Agreement (if rented)", "NOC from Landlord", "Property Tax Receipt (if owned)"] }
];

const spFAQs = [
    { q: "What is a Sole Proprietorship?", a: "It is a business structure owned and operated by a single person. In this entity, there is no legal distinction between the owner and the business." },
    { q: "Is a Sole Proprietorship a separate legal entity?", a: "No, a sole proprietorship is not a separate legal entity. The owner is personally liable for all business debts and obligations." },
    { q: "What are the common registration methods for a proprietorship?", a: "Since there is no specific 'Proprietorship Act' in India, it is recognized through other registrations like GST, MSME (Udyam), or the Shop & Establishment Act." },
    { q: "Can I use a business name instead of my own name?", a: "Yes, you can choose a trade name (e.g., 'Star Enterprises') for your business, but all legal documents will also reflect your personal name as the proprietor." },
    { q: "Is it mandatory to have a GST registration for a proprietorship?", a: "GST is mandatory if your turnover exceeds the threshold (₹40/₹20 lakhs) or if you engage in interstate trade or e-commerce. Otherwise, it is optional but recommended for a professional image." },
    { q: "Can I convert my proprietorship to a Private Limited Company?", a: "Yes, you can convert it as your business scales. This involves a legal transfer of assets and liabilities to the new company structure." },
    { q: "What taxes does a sole proprietor pay?", a: "A sole proprietor pays personal income tax on the profits derived from the business. Business income is added to other income for tax calculation." },
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
            <SectionHeading subtitle="Introduction" title="Sole Proprietorship" description="The simplest path to small business ownership in India." />

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-slate-800">Direct & Simple</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Sole Proprietorship is the most common form of business in India, favored by small scale traders, freelancers, and service providers. It is an unorganized structure where one person manages everything—from capital to operations to profits.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Technically, there is no separate registration required for a proprietorship. Instead, you establish it through secondary registrations like GST or the Shop and Establishment Act. It is ideal for those who want to start their business immediately with zero overhead and minimal legal fees.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Instant Setup</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Nil Audit Requirements</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Absolute Privacy</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <DollarSign className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Low Cost</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Shield className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Total Control</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <FileText className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Personal Taxation</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Rocket className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Easy Exit</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Users className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Solo Ownership</h4>
                    <p className="text-gray-300 text-sm">You are the mastermind. All profits are yours and decisions move at your speed.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Timer className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Fast Launch</h4>
                    <p className="text-gray-300 text-sm">Get registered via MSME within 24 hours and start billing your customers today.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Scale className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">No Complex Filings</h4>
                    <p className="text-gray-300 text-sm">Forget board meetings and ROC filings. Focus strictly on growing your business.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Advantages" title="Why Choose Proprietorship?" description="The leanest structure for solo fighters." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Absolute Privacy</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Unlike companies, your financial data isn't public. Your success remains your secret.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Direct Profit</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">No dividends, no salaries, no partners. Every rupee earned is a rupee in your pocket.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Flexible Setup</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Change your business model overnight without asking for permission or filing forms.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Minimal Compliance</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Only Income Tax and GST returns (if active). No statutory audits or complex registers.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Pricing" title="Unbeatable Plans" description="Low-cost entry for big-time dreams." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spPlans.map((plan, i) => (
                    <div key={i} className={`flex flex-col p-6 rounded-2xl border ${plan.isRecommended ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        {plan.isRecommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Best Seller</span>}
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
                        <button className={`w-full py-4 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${plan.isPremium ? 'bg-[#C59B4E] hover:bg-[#A37D35]' : 'bg-[#1A7F7D] hover:bg-[#146361]'} text-white shadow-md`}>Buy Now</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TypesSection = () => (
    <section id="registration-types" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Structure" title="Ways to Register" description="A proprietorship can be established using any of these legal certificates." />
            <div className="grid md:grid-cols-3 gap-8">
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Zap className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">MSME / Udyam</h5>
                    <p className="text-xs text-slate-500 mb-4">Fastest method. Provides government subsidies, bank interest rebates and protection against delayed payments.</p>
                    <span className="text-[10px] font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 1 Day</span>
                </div>
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Activity className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">GST Registration</h5>
                    <p className="text-xs text-slate-500 mb-4">Mandatory for selling online or across state lines. Acts as a valid proof for opening a current account.</p>
                    <span className="text-[10px] font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 3-5 Days</span>
                </div>
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Home className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">Shop Act License</h5>
                    <p className="text-xs text-slate-500 mb-4">Required for any physical shop, office, or commercial establishment within municipal limits.</p>
                    <span className="text-[10px] font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 7 Days</span>
                </div>
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
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Just the basics. No complex legal forms needed.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {spDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Journey" title="How It Works" description="Go from idea to bank account in 4 steps." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Search, title: "Name Pick", desc: "Select a name for your business (it doesn't need MCA approval)." },
                    { icon: FileCheck, title: "License Filing", desc: "We apply for MSME, GST, or Shop Act on your behalf." },
                    { icon: BadgeCheck, title: "Certificate Approved", desc: "Receive your legal certificates via email within days." },
                    { icon: CreditCard, title: "Bank Account", desc: "Open a current account and start accepting payments." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:-translate-y-1">
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

export default function SolePropPage() {
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
                    <img src={BackgroundImageSrc} alt="Sole Prop Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">Sole <br /> Proprietorship</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">Verified</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                                    Sole <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Proprietorship</span>
                                </h1>
                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed">The easiest way to start your business individually. Full control, low cost, and minimal hassle. <span className="text-[#C59B4E] font-bold uppercase tracking-widest text-xs ml-2">Legacy starts here.</span></p>
                            </div>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">₹499</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Expert Start</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">24h</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Udyam Lead Time</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:w-[400px]">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Start Today</h2>
                                <p className="text-[11px] text-slate-500 mb-6 text-center">Fill the form to register your firm!</p>
                                <LeadForm serviceName="Sole Proprietorship Registration" btnText="Get Started" />
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
            <TypesSection />
            <DocumentsContent />
            <ProcessContent />

            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Proprietorship Guide" description="Frequently asked questions about individual business setup." />
                    <div className="space-y-4">
                        {spFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}