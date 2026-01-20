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
    Briefcase,
    IndianRupee,
    Activity,
    Zap,
    Scale,
    FileCheck,
    BadgeCheck,
    Calendar,
    Calculator,
    Home,
    ShieldCheck,
    Gavel,
    Handshake
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

const partnershipPlans = [
    {
        title: "Standard",
        price: "₹4,999",
        description: "Perfect for partners who just need a legally sound agreement.",
        features: [
            "Expert assisted process",
            "Partnership deed drafting in 3 days",
            "Deed submission to the local registar on your behalf",
            "PAN Card",
            "Zero balance current account with 7% interest",
            "GSTR-1 & 3B for 12 months(Up to 300 transactions)",
            "Zero balance current account with 7% interest"
        ],
        isRecommended: false,
    },
    {
        title: "Premium",
        price: "₹20,898",
        description: "Includes official registration with the Registrar of Firms (RoF).",
        features: [
            "Expert assisted process",
            "Partnership deed drafting in 3 days",
            "Deed submission to the local registar on your behalf",
            "PAN Card",
            "GST registration",
            "GSTR-1 & 3B for 12 months(Up to 300 transactions)",
            "Zero balance current account with 7% interest",
            "Trademark Registration for your Brand",
            "ITR Filing for one financial year (Up to 40 lakhs)"
        ],
        isRecommended: true,
    },
    {
        title: "Elite",
        price: "₹30,398",
        description: "End-to-end setup including trademark protection.",
        features: [
            "Dedicated account manager",
            "Partnership deed drafting in 3 days",
            "Deed submission to the local registar on your behalf",
            "PAN Card",
            "GST registration"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const partnershipRequirements = [
    { icon: Handshake, title: "Minimum 2 Partners", description: "At least two persons are required. Maximum limit is 20 for most businesses." },
    { icon: FileText, title: "Agreement (Deed)", description: "A written partnership deed on stamp paper defining profit sharing and roles." },
    { icon: Briefcase, title: "Business Name", description: "A unique name that doesn't violate existing trademarks or company names." },
    { icon: Scale, title: "Capacity to Contract", description: "Partners must be of sound mind and at least 18 years of age." },
    { icon: Home, title: "Address Proof", description: "A dedicated office or place of business with valid occupancy proof." },
    { icon: Gavel, title: "Lawful Business", description: "The object of the partnership must be for carrying out a legal business activity." }
];

const partnershipDocuments = [
    { category: "For All Partners", items: ["PAN Card copies", "Aadhaar Card with updated Address", "Latest Passport size photos", "Recent Utility Bill/Bank Statement"] },
    { category: "For Firm Registration", items: ["Partnership Deed (signed by all)", "Draft of the Deed", "Power of Attorney (if applicable)", "NOC from Landlord"] }
];

const partnershipFAQs = [
    { q: "Is it mandatory to register a partnership firm?", a: "No, registration is optional under the Indian Partnership Act, 1932. However, an unregistered firm cannot sue third parties or other partners in court." },
    { q: "What is a Partnership Deed?", a: "It is a legal document that contains the terms and conditions the partners have agreed upon, such as profit sharing, capital contribution, and dispute resolution." },
    { q: "How long is a partnership valid?", a: "A partnership continues as long as the partners wish. It can be dissolved by agreement, death of a partner, or by order of the court." },
    { q: "Can a minor be a partner?", a: "A minor can be admitted only to the 'benefits' of a partnership with the consent of all other partners, but cannot be held personally liable for losses." },
    { q: "Can a partnership be converted into a Private Limited Company?", a: "Yes, once the business reaches a certain scale, it can be converted into a Private Limited Company or an LLP to limit liability and attract investment." },
    { q: "What is the tax rate for a partnership firm?", a: "Partnership firms are taxed at a flat rate of 30% on their total income, plus applicable surcharges and cess." },
    { q: "Is a partnership firm a separate legal entity?", a: "No, under the law, the firm and the partners are the same. Partners have unlimited liability for the firm's debts." },
];

// --- Components ---

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
            <h3 className={`text-lg md:text-xl font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
            </div>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <p className={`px-6 pb-6 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
        </div>
    </div>
);

// --- Sections ---

const OverviewContent = () => (
    <section id="overview-content" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl px-6 mx-auto">
            <SectionHeading subtitle="Introduction" title="Partnership Firm Setup" description="Unite strengths and share responsibilities through a formal partnership." />

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-slate-800">Together Everyone Achieves More</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Partnership Firm is a popular form of business for small ventures where two or more persons come together to manage a business according to the terms and goals set out in the Partnership Deed. It is governed by the Indian Partnership Act, 1932.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        The beauty of a partnership lies in its simplicity and the ability to combine various skills and capital. While it doesn't offer limited liability like an LLP or Private Limited, it's remarkably easy to set up and has much lower annual compliance costs.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Simple Drafting</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Low Compliance</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Scale Ready</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Handshake className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Trust Based</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Legal Deed</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Calculator className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Income Tax (ITR-5)</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Users className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Shared Liability</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Users className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Skill Combination</h4>
                    <p className="text-gray-300 text-sm">Combine technical skills with marketing or financial prowess for a balanced business.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Timer className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Quick Decisions</h4>
                    <p className="text-gray-300 text-sm">No board meetings or voting formalities required; partners can decide and act instantly.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Scale className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Low Overhead</h4>
                    <p className="text-gray-300 text-sm">Minimal statutory filings compared to a company, saving you time and professional fees.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Pros" title="Benefits of Partnership" description="Why partners choose this traditional yet effective model." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Handshake className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Collective Synergy</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Leverage the combined intelligence and experience of multiple partners.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><IndianRupee className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Shared Capital</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Raise capital easily through contributions from all the partners involved.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Briefcase className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Operational Ease</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Fewer legal formalities allow you to focus on core business growth and sales.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Flexibility</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Easy to change rules, profit ratios, and business objects via a supplementary deed.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Uncomplicated Pricing" description="Clear, upfront costs with no hidden legal fees." />
            <PricingCards plans={partnershipPlans} serviceName="Partnership Firm" />
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Compliance Criteria" description="The basic building blocks for a legal partnership." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {partnershipRequirements.map((item, i) => (
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
    <section id="documents-content" className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
                <span className="text-[#C59B4E] font-bold text-sm uppercase tracking-widest mb-3 block">Paperwork</span>
                <h3 className="text-3xl font-bold mb-4">Required Documents</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Collate these documents to begin the drafting process.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                {partnershipDocuments.map((doc, idx) => (
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
    <section id="process-content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Cycle" title="The Registration Journey" description="From drafting the deed to final certification." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: FilePenLine, title: "Drafting", desc: "Our legal team drafts a customized deed based on your terms." },
                    { icon: Layers, title: "Execution", desc: "Printing on stamp paper and notarization by the partners." },
                    { icon: Timer, title: "RoF Filing", desc: "Official submission of documents to the Registrar of Firms." },
                    { icon: Award, title: "Certificate", desc: "Receive your Acknowledgement and Firm PAN Card." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:scale-110">
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

export default function PartnershipPage() {
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
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Partnership Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Handshake size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Partnership Firm Support</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                Partnership Firm <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
                            </h1>
                            <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                                Build a stronger future together. Register your partnership firm with expert drafting and filing support. Connect with specialists for reliable firm formation.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Shared Strength
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
                                    <LeadForm serviceName="Partnership Firm Registration" btnText="Start Registration" />
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

            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Partnership Insights" description="Answers to common questions about firm registration and deeds." />
                    <div className="space-y-8">
                        {partnershipFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}