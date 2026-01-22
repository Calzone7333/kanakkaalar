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
    FileCheck,
    Briefcase,
    BadgeCheck,
    Calendar,
    Calculator,
    Gavel,
    PiggyBank
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'overview-content', label: 'Overview' },
    { id: 'importance-content', label: 'Benefits' },
    { id: 'pricing-content', label: 'Pricing' },
    { id: 'requirements-content', label: 'Requirements' },
    { id: 'documents-content', label: 'Documents' },
    { id: 'process-content', label: 'Process' },
    { id: 'faqs-content', label: 'FAQs' },
];

const nidhiPlans = [
    {
        title: "Standard Incorporation",
        price: "₹14,999",
        originalPrice: "₹19,999",
        discountText: "25% off",
        description: "Essential registration for mutual benefit societies.",
        features: [
            "DSC & DIN for 3 Directors",
            "Name Approval (RUN)",
            "Incorporation Certificate",
            "MoA & AoA Drafting",
            "PAN & TAN Registration",
            "EPF/ESI Registration (if applicable)"
        ],
        isRecommended: false,
    },
    {
        title: "Professional",
        price: "₹24,999",
        originalPrice: "₹34,999",
        discountText: "28% off",
        description: "Incorporation plus initial regulatory setup guidance.",
        features: [
            "All Standard Features",
            "Internal Management Training",
            "Member Entry Documentation",
            "Loan Policy Drafting",
            "Fixed Deposit Receipt Templates",
            "Drafting of NDH-1 Filing"
        ],
        isRecommended: true,
    },
    {
        title: "Nidhi Compliance Pack",
        price: "₹49,999",
        originalPrice: "₹74,999",
        discountText: "33% off",
        description: "Complete incorporation + end-to-end first year compliance.",
        features: [
            "Includes Professional Plan",
            "Half Yearly Return (NDH-3)",
            "Status Declaration (NDH-4)",
            "Tax Compliance (ITR Filing)",
            "Financial Audit Support",
            "Member Audit Review"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const nidhiRequirements = [
    { icon: Users, title: "7 Members", description: "A minimum of 7 members are required at the time of incorporation." },
    { icon: Shield, title: "3 Directors", description: "At least 3 directors are required to start the company operations." },
    { icon: IndianRupee, title: "NOF Ratio", description: "Net Owned Funds (NOF) to deposits ratio must be strictly maintained at 1:20." },
    { icon: FileText, title: "Naming Convention", description: "The name of the company must end with 'Nidhi Limited'." },
    { icon: Home, title: "Registered Office", description: "A physical address proof like a utility bill and NOC from the owner is mandatory." },
    { icon: PiggyBank, title: "Minimum Fund", description: "A minimum equity share capital of ₹5,00,000 is required at incorporation." }
];

const nidhiDocuments = [
    { category: "For Directors & Members", items: ["PAN Card (Mandatory)", "Aadhaar Card", "Passport Size Photos", "Latest Bank Statement / Utility Bill"] },
    { category: "For Office Address", items: ["Electricity/Water/Gas Bill (latest)", "Rent Agreement (if rented)", "NOC from Property Owner", "Sale Deed (if owned)"] }
];

const nidhiFAQs = [
    { q: "What business can a Nidhi Company do?", a: "Nidhi companies can only take deposits from their members and lend only to their members against specified securities like gold, property, or fixed deposits." },
    { q: "Can a Nidhi company open branches?", a: "A Nidhi can open branches only if it has earned net profits after tax continuously during the preceding three financial years and follows specific territorial restrictions." },
    { q: "Are Nidhi companies regulated by RBI?", a: "While Nidhi companies are a type of NBFC, they are exempted from the core provisions of the RBI Act and are primarily regulated by the Ministry of Corporate Affairs (MCA)." },
    { q: "What are the restrictions on Nidhi companies?", a: "Nidhi companies cannot do chit fund business, hire purchase, insurance business, or issue preference shares, debentures, or any other debt instrument." },
    { q: "What is the 200 members rule?", a: "Every Nidhi must ensure that it has at least 200 members within one year from the date of its incorporation." },
    { q: "Can a Nidhi company provide personal loans?", a: "Nidhi companies can only provide loans against collateral like gold, property, or fixed deposits. Unsecured personal loans are strictly prohibited." },
    { q: "Is a Nidhi company allowed to advertise?", a: "Nidhi companies can only advertise for deposits among their own members. They are not allowed to solicit deposits from the general public." },
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
            <SectionHeading subtitle="Introduction" title="Nidhi Company Registration" description="The most secure way to establish a community-based lending business." />

            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-slate-800">Mutual Benefit Societies</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Nidhi Company is a type of NBFC (Non-Banking Financial Company) in India that works on the principle of mutual benefit. Its primary objective is to cultivate the habit of thrift and savings among its members. It carries out the business of accepting deposits and lending money only to its members.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Since Nidhi companies only deal with their own members, they are regulated primarily by the Ministry of Corporate Affairs rather than the RBI, making the registration and compliance process much easier compared to traditional banks.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">MCA Regulated</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">No RBI Approval Needed</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Member-Only Trading</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <PiggyBank className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Savings Focused</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Shield className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Secured Lending</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Gavel className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Legal Status</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Activity className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Community Growth</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Activity className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Internal Banking</h4>
                    <p className="text-gray-300 text-sm">Operates as an internal micro-bank for members without complex RBI capital requirements.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Zap className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Efficient Lending</h4>
                    <p className="text-gray-300 text-sm">Processes loans for members at interest rates lower than traditional banks or moneylenders.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Scale className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Exempted Status</h4>
                    <p className="text-gray-300 text-sm">Enjoys several exemptions from the stringent regulatory framework of the RBI Act.</p>
                </div>
            </div>
        </div>
    </section>
);

const ImportanceContent = () => (
    <section id="importance-content" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Benefits" title="Why Start a Nidhi Company?" description="Bridging the gap in rural and semi-urban finance." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Low Capital</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Unlike regular NBFCs that require ₹2 Crore, a Nidhi can start with just ₹5 Lakhs.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Compliant Lending</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Authorized by the government to lend money legally within the defined member circle.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Scale className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Limited Liability</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Directors' personal wealth is protected from any business losses or debts.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">High Trust</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Being a registered 'Limited' entity, it carries significant trust among its community of members.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Choose Your Launch Plan" description="Professional assistance at every stage of your Nidhi setup." />
            <PricingCards plans={nidhiPlans} serviceName="Nidhi Company" />
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Legal Standards" description="Mandatory criteria to qualify as a Nidhi entity." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {nidhiRequirements.map((item, i) => (
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
                <h3 className="text-3xl font-bold mb-4">Checklist</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Digitized file preparation for the SPICe+ form.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                {nidhiDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Step-by-Step" title="Incorporation Journey" description="Guided path from DSC to Certificate." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-10 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Rocket, title: "DSC/DIN", desc: "Digital keys procurement for all three directors." },
                    { icon: Timer, title: "Name Pick", desc: "Approval of specific name ending with 'Nidhi Limited'." },
                    { icon: FilePenLine, title: "Drafting", desc: "Preparation of MoA and AoA as per Nidhi Rules." },
                    { icon: Layers, title: "E-Filing", desc: "Submission of SPICe+ form with MCA." },
                    { icon: Award, title: "COI Issued", desc: "Final Certificate of Incorporation from the ROC." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:rotate-6">
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

export default function NidhiPage() {
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
                    <img src={BackgroundImageSrc} alt="Nidhi Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <PiggyBank size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Mutual Benefit Support</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Nidhi Company <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                Promote savings and mutual financial growth. Register your Nidhi Limited with expert support. Connect with specialists for reliable Nidhi formation.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Member-Specific
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> 100% Tax Compliant
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Register Now</h3>
                                    <LeadForm serviceName="Nidhi Company Registration" btnText="Start Registration" />
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
            <ImportanceContent />
            <PricingContent />
            <RequirementsContent />
            <DocumentsContent />
            <ProcessContent />

            <section id="faqs-content" className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Mutual Benefit Guide" description="Everything you need to know about Nidhi Company operations." />
                    <div className="space-y-8">
                        {nidhiFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}