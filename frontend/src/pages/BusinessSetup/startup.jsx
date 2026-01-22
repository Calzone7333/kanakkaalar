import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
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
    Lightbulb,
    Trophy
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";
import StartNowButton from "../../components/StartNowButton";

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

const startupPlans = [
    {
        title: "DPIIT Recognition",
        price: "₹3,999",
        originalPrice: "₹5,500",
        discountText: "27% off",
        description: "Get officially recognized by the Govt. of India as a Startup.",
        features: [
            "DPIIT Application Drafting",
            "Write-up on Innovation",
            "Registration on Startup India Portal",
            "Follow-up with Authorities",
            "Eligibility Review",
            "DPIIT Certificate Procurement"
        ],
        isRecommended: false,
    },
    {
        title: "Standard Pro",
        price: "₹7,999",
        originalPrice: "₹11,500",
        discountText: "30% off",
        description: "DPIIT recognition plus essential IP and tax setups.",
        features: [
            "Includes DPIIT Recognition Plan",
            "Pitch Deck Fine-Tuning",
            "Trademark Application (1 Class)",
            "80-IAC Tax Exemption Filing",
            "MSME (Udyam) Registration",
            "Dedicated Startup Consultant"
        ],
        isRecommended: true,
    },
    {
        title: "Funding Ready",
        price: "₹14,999",
        originalPrice: "₹22,900",
        discountText: "35% off",
        description: "Full compliance and documentation for raising VC/Angel funds.",
        features: [
            "Includes Standard Pro Plan",
            "Section 56 Exemption (Angel Tax)",
            "Standard Founder Agreements",
            "1 Year Secretarial Support",
            "Investor Reporting Templates",
            "Priority Processing"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const startupRequirements = [
    { icon: Layers, title: "Entity Type", description: "Must be a Private Limited, LLP, or a Registered Partnership Firm." },
    { icon: Timer, title: "Business Age", description: "The entity should not be older than 10 years from its date of incorporation." },
    { icon: Activity, title: "Turnover Limit", description: "Annual turnover must not have exceeded ₹100 Crore in any previous financial year." },
    { icon: Lightbulb, title: "Innovation", description: "Must work towards development or improvement of a product/service/process." },
    { icon: Zap, title: "Scalability", description: "The business model should have high potential for wealth creation and employment." },
    { icon: ShieldCheck, title: "Originality", description: "Must not be formed by splitting up or reconstruction of an existing business." }
];

const startupDocuments = [
    { category: "Mandatory Files", items: ["Certificate of Incorporation / Registration", "PAN Card of the Entity", "Write-up on Nature of Business (Innovation)", "Brief Pitch Deck / Website Link", "Authorized Signatory Details"] },
    { category: "Optional (For Tax Benefits)", items: ["Detailed Business Plan", "Financial Statements of previous years", "Patent/Trademark details (if any)", "Product Video / Live Demo link"] }
];

const startupFAQs = [
    { q: "What is DPIIT Recognition?", a: "DPIIT (Department for Promotion of Industry and Internal Trade) recognition is the official status granted by the Ministry of Commerce & Industry that allows startups to avail various government benefits." },
    { q: "What are the tax benefits for startups?", a: "Recognized startups can apply for a 3-year income tax holiday under Section 80-IAC and exemption from Angel Tax under Section 56(2)(viib) of the Income Tax Act." },
    { q: "Who can apply for Startup India?", a: "Any unit that is incorporated as a Private Limited Company, a Registered Partnership Firm, or a Limited Liability Partnership can apply, provided it meets the innovation and turnover criteria." },
    { q: "Is a proprietary concern eligible for Startup India?", a: "No, sole proprietorships and unregistered partnership firms are not eligible for DPIIT recognition. You must first convert into a Private Ltd, LLP, or Registered Partnership." },
    { q: "How long is the DPIIT certificate valid?", a: "The recognition is valid for 10 years from the date of incorporation or until the turnover exceeds ₹100 crore, whichever is earlier." },
    { q: "Do I need a patent to get recognized?", a: "No, a patent is not mandatory. However, you must demonstrate that your business is innovative and has the potential for scalability and employment." },
    { q: "What is the 80-IAC exemption?", a: "Section 80-IAC allows recognized startups to claim a 100% tax rebate on their profits for 3 consecutive years out of their first 10 years of operation." },
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
            <SectionHeading subtitle="Innovation" title="Startup India Registration" description="Unlock exclusive ecosystem benefits reserved for India's innovators." />

            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-slate-800">The DPIIT Advantage</h4>
                    <p className="text-slate-600 leading-relaxed">
                        The Startup India initiative is a flagship project by the Government of India, intended to build a strong ecosystem for nurturing innovation and Startups in the country that will drive sustainable economic growth and generate large scale employment opportunities.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Gaining recognition from DPIIT opens doors to significant tax exemptions, intellectual property rebates, and simplified compliance for labor and environmental laws. It's the hallmark of a high-growth, innovative technology company.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">100% Tax Relief</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Angel Tax Exemption</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Govt. Tender Priority</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Rocket className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Fast-Track Entry</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">IP Protection</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Trophy className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Prestige & Rating</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <IndianRupee className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Seed Fund Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Zap className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Self-Certification</h4>
                    <p className="text-gray-300 text-sm">Startups can self-certify compliance for 6 labor laws and 3 environmental laws for a period of 5 years.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Layers className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Public Procurement</h4>
                    <p className="text-gray-300 text-sm">Exemption from 'prior experience/turnover' criteria in all central government tenders.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Scale className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Faster Exit</h4>
                    <p className="text-gray-300 text-sm">Winding up a company is easier with the 90-day fast-track exit under Insolvency & Bankruptcy Code.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Advantages" title="Unmatched Startup Perks" description="Fuel your R&D and operations with government support." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Lightbulb className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Patent Rebates</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Save up to 80% on costs for patent filing and 50% on trademark costs.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Tax Holiday</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">3-year income tax exemption out of the first 10 years for qualifying startups.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Gavel className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Tender Priority</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Benefit from relaxed norms in EMD and experience for central government projects.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Activity className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Networking</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Access to government-led incubators, awareness programs, and global startup events.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Start Your Legacy" description="Professional drafting and portal assistance at fixed prices." />
            <PricingCards plans={startupPlans} serviceName="Startup India Registration" />
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Are You Eligible?" description="Check if your business qualifies for DIPP recognition." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {startupRequirements.map((item, i) => (
                    <div
                        key={i}
                        className={`group relative rounded-2xl border p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center
                            ${i === 1
                                ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10'
                                : 'bg-white border-slate-100 text-slate-800 hover:border-[#1A7F7D]/30'
                            }`}
                    >

                        {/* Hover Top Border */}
                        {i !== 1 && (
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#1A7F7D] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                        )}

                        {/* Icon */}
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner group-hover:shadow-lg mt-2
                            ${i === 1
                                ? 'bg-white text-[#0F2D30]'
                                : 'bg-[#F0FDFA] text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white'
                            }
                        `}>
                            {item.icon ? <item.icon size={36} strokeWidth={1.5} /> : <FileText size={36} strokeWidth={1.5} />}
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl font-bold mb-4 transition-colors ${i === 1 ? 'text-white' : 'text-slate-800 group-hover:text-[#1A7F7D]'}`}>
                            {item.title}
                        </h3>

                        {/* Description */}
                        <p className={`text-[15px] leading-relaxed mb-6 min-h-[80px] ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                            {item.description}
                        </p>

                        {/* Read More Button */}
                        <div className="mt-auto">
                            <button className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300
                                ${i === 1
                                    ? 'bg-[#1A7F7D] text-white hover:bg-[#156664] hover:shadow-lg'
                                    : 'bg-[#F0FDFA] text-[#1A7F7D] hover:bg-[#1A7F7D] hover:text-white'
                                }
                            `}>
                                Read More
                            </button>
                        </div>
                    </div>
                ))}
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
                <h3 className="text-3xl font-bold mb-4">Required Documents</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Collate these digital assets to start your DPIIT journey.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                {startupDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Journey" title="Recognition Process" description="Direct path to becoming a verified Indian Startup." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Home, title: "Incorporation", desc: "Form a Private Ltd, LLP or a Registered Partnership." },
                    { icon: Rocket, title: "Portal Setup", desc: "Profile creation on the National Startup India platform." },
                    { icon: Lightbulb, title: "Write-up", desc: "Preparing the pitch for innovation and scalability." },
                    { icon: Trophy, title: "DPIIT Issued", desc: "Receipt of the Recognition Certificate via email." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-all hover:scale-110">
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

export default function StartupPage() {
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
                    <img src={BackgroundImageSrc} alt="Startup Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Rocket size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified DPIIT Support</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Startup India <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                Ignite your growth with official DPIIT recognition. Access funding, tax breaks, and global mentor networks. Connect with experts for reliable startup formation.
                            </p>
<StartNowButton />
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Tax Holiday
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> 100% Compliant
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Now</h3>
                                    <LeadForm serviceName="Startup India Registration (DPIIT)" btnText="Start Application" />
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
            <RequirementsContent />
            <DocumentsContent />
            <ProcessContent />

            <section id="faqs-content" className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Ecosystem Guide" description="Common questions about DPIIT recognition and Startup India." />
                    <div className="space-y-8">
                        {startupFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}