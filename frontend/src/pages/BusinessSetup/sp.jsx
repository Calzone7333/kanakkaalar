import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
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
import StartNowButton from "../../components/StartNowButton";

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
        title: "Standard",
        price: "₹1,499",
        description: "Focus on essential GST identity for your business.",
        features: [
            "Expert assisted process",
            "GST registration"
        ],
        isRecommended: false,
        isPremium: false,
    },
    {
        title: "Premium",
        price: "₹10,799",
        description: "Comprehensive package with MSME and one-year GST filing support.",
        features: [
            "Expert assisted process",
            "GST registration",
            "MSME registration (Udyam)",
            "GST filing for one financial year (upto 300 transactions)"
        ],
        isRecommended: true,
        isPremium: false,
    },
    {
        title: "Elite",
        price: "₹16,499",
        description: "The ultimate solo business plan with higher transaction volume and ITR support.",
        features: [
            "Expert assisted process",
            "GST registration",
            "MSME registration (Udyam)",
            "GST filing for one financial year (upto 500 transactions)",
            "ITR filing turnover upto 40 lakh"
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

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
    <div className={`p-8 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
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
        <p className={`text-sm leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
            {description}
        </p>
        <div className={`flex items-center text-sm font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-5 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 ml-1" />
        </div>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-4
       ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg scale-[1.01]' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
    `}>
        <button className="flex items-center justify-between w-full p-8 text-left" onClick={onClick}>
            <h3 className={`text-sm md:text-base font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
            </div>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <p className={`px-6 pb-6 text-sm md:text-base leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
        </div>
    </div>
);

// --- Sections ---

const OverviewContent = () => (
    <section id="overview-content" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl px-6 mx-auto">
            <SectionHeading subtitle="Introduction" title="Sole Proprietorship" description="The simplest path to small business ownership in India." />

            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-slate-800">Direct & Simple</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Sole Proprietorship is the most common form of business in India, favored by small scale traders, freelancers, and service providers. It is an unorganized structure where one person manages everything—from capital to operations to profits.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Technically, there is no separate registration required for a proprietorship. Instead, you establish it through secondary registrations like GST or the Shop and Establishment Act. It is ideal for those who want to start their business immediately with zero overhead and minimal legal fees.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Instant Setup</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Nil Audit Requirements</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Absolute Privacy</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <DollarSign className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Low Cost</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Shield className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Total Control</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <FileText className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Personal Taxation</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Rocket className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Easy Exit</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
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
    <section id="benefits-content" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Advantages" title="Why Choose Proprietorship?" description="The leanest structure for solo fighters." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Absolute Privacy</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Unlike companies, your financial data isn't public. Your success remains your secret.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><DollarSign className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Direct Profit</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">No dividends, no salaries, no partners. Every rupee earned is a rupee in your pocket.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Calendar className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Flexible Setup</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Change your business model overnight without asking for permission or filing forms.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Minimal Compliance</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Only Income Tax and GST returns (if active). No statutory audits or complex registers.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Pricing" title="Unbeatable Plans" description="Low-cost entry for big-time dreams." />
            <PricingCards plans={spPlans} serviceName="Sole Proprietorship" />
        </div>
    </section>
);

const TypesSection = () => (
    <section id="registration-types" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Structure" title="Ways to Register" description="A proprietorship can be established using any of these legal certificates." />
            <div className="grid md:grid-cols-3 gap-10">
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Zap className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">MSME / Udyam</h5>
                    <p className="text-sm text-slate-500 mb-4">Fastest method. Provides government subsidies, bank interest rebates and protection against delayed payments.</p>
                    <span className="text-sm font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 1 Day</span>
                </div>
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Activity className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">GST Registration</h5>
                    <p className="text-sm text-slate-500 mb-4">Mandatory for selling online or across state lines. Acts as a valid proof for opening a current account.</p>
                    <span className="text-sm font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 3-5 Days</span>
                </div>
                <div className="border border-slate-100 rounded-3xl p-8 hover:bg-slate-50 transition-colors">
                    <Home className="text-[#C59B4E] mb-4" />
                    <h5 className="font-bold mb-3">Shop Act License</h5>
                    <p className="text-sm text-slate-500 mb-4">Required for any physical shop, office, or commercial establishment within municipal limits.</p>
                    <span className="text-sm font-bold text-[#1A7F7D] uppercase tracking-wider">Estimated 7 Days</span>
                </div>
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="documents-content" className="py-12 md:py-16 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <span className="text-[#C59B4E] font-bold text-sm uppercase tracking-widest mb-3 block">Paperwork</span>
                <h3 className="text-3xl font-bold mb-4">Checklist</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Just the basics. No complex legal forms needed.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                {spDocuments.map((doc, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 transition-transform hover:scale-[1.02]">
                        <h4 className="text-xl font-bold text-[#1A7F7D] mb-6 flex items-center gap-5">
                            <span className="w-8 h-8 rounded-full bg-[#1A7F7D]/20 flex items-center justify-center text-sm text-[#1A7F7D]">{idx + 1}</span>
                            {doc.category}
                        </h4>
                        <ul className="grid grid-cols-1 gap-5">
                            {doc.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-5 text-slate-300 text-sm">
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
    <section id="process-content" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Journey" title="How It Works" description="Go from idea to bank account in 4 steps." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Search, title: "Name Pick", desc: "Select a name for your business (it doesn't need MCA approval)." },
                    { icon: FileCheck, title: "License Filing", desc: "We apply for MSME, GST, or Shop Act on your behalf." },
                    { icon: BadgeCheck, title: "Certificate Approved", desc: "Receive your legal certificates via email within days." },
                    { icon: CreditCard, title: "Bank Account", desc: "Open a current account and start accepting payments." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:-translate-y-1">
                            <step.icon className="w-7 h-7 text-[#1A7F7D]" />
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">{idx + 1}</div>
                        </div>
                        <h5 className="text-lg font-bold text-slate-800">{step.title}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed px-4">{step.desc}</p>
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
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Sole Prop Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Briefcase size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Solo Business Support</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Sole <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Proprietorship Registration</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                The easiest way to start your business individually. Full control, low cost, and minimal hassle. Connect with experts for reliable proprietorship setup.
                            </p>
<StartNowButton />
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Direct Ownership
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> Complete Privacy
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Register Now</h3>
                                    <LeadForm serviceName="Sole Proprietorship Registration" btnText="Start Registration" />
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
            <BenefitsContent />
            <PricingContent />
            <TypesSection />
            <DocumentsContent />
            <ProcessContent />

            <section id="faqs-content" className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Proprietorship Guide" description="Frequently asked questions about individual business setup." />
                    <div className="space-y-8">
                        {spFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}