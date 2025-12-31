import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// Consolidated lucide-react icons for plc registration page
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
    Trello,
    Home,
    Globe,
    FileCheck,
    Cpu,
    BadgeCheck,
    Calendar,
    IndianRupee,
    ShieldCheck,
    Gavel
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
    { id: 'compliance-content', label: 'Compliance' },
    { id: 'faqs-content', label: 'FAQs' },
];

const plcPlans = [
    {
        title: "Standard Incorporation",
        price: "₹19,999",
        originalPrice: "₹24,999",
        discountText: "20% off",
        description: "Complete registration for your Public Limited Company.",
        features: [
            "DSC & DIN for 3 Directors",
            "Name Reservation (RUN)",
            "MoA & AoA Drafting",
            "SPICe+ Form Filing",
            "Incorporation Certificate",
            "Company PAN & TAN"
        ],
        isRecommended: false,
    },
    {
        title: "Business Ready",
        price: "₹29,999",
        originalPrice: "₹39,999",
        discountText: "25% off",
        description: "Incorporation plus essential business registrations.",
        features: [
            "All Standard Features",
            "Commencement Certificate (INC-20A)",
            "GST Registration",
            "MSME (Udyam) Registration",
            "Digital Welcome Kit",
            "Dedicated Support Manager"
        ],
        isRecommended: true,
    },
    {
        title: "Enterprise Compliance",
        price: "₹74,999",
        originalPrice: "₹99,999",
        discountText: "25% off",
        description: "Incorporation plus a full year of statutory compliance support.",
        features: [
            "Includes Business Ready Plan",
            "First Year Statutory Audit",
            "Annual Filing (AOC-4 & MGT-7)",
            "Secretarial Audit Review",
            "Income Tax Filing (ITR-6)",
            "Minutes Book Maintenance"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const plcRequirements = [
    { icon: Users, title: "Minimum 7 Members", description: "At least 7 shareholders are required to form a Public Limited Company." },
    { icon: UserCheck, title: "Minimum 3 Directors", description: "Must have at least 3 directors, with one being an Indian resident." },
    { icon: IndianRupee, title: "Authorized Capital", description: "While there's no legal minimum, 5 Lakhs is the common starting capital." },
    { icon: FileText, title: "Digital Signature", description: "DSC is required for all directors to sign electronic forms with the MCA." },
    { icon: Home, title: "Registered Office", description: "A physical address in India is mandatory as the registered office of the company." },
    { icon: Globe, title: "Public Participation", description: "Can raise capital from the general public through shares." }
];

const plcDocuments = [
    { category: "For Directors & Members", items: ["PAN Card (Mandatory)", "Aadhaar Card", "Latest Passport size photos", "Current Address Proof (Bank Statement/Utility Bill)"] },
    { category: "For Registered Office", items: ["Latest Electricity/Gas/Water Bill", "No Objection Certificate (NOC) from owner", "Rent Agreement (if applicable)"] }
];

const plcFAQs = [
    { q: "What is a Public Limited Company?", a: "It is a company that has limited liability and offers shares to the general public. Its stock can be acquired by anyone, either privately during initial offering or through stock market trading." },
    { q: "What are the main advantages of a PLC?", a: "Unlimited capital raising potential, high level of transparency, brand reputation, and easy transferability of shares." },
    { q: "How many directors are needed for a PLC?", a: "A minimum of 3 directors are required, and the maximum can go up to 15 (which can be increased by passing a special resolution)." },
    { q: "Can a Public Limited Company be listed on the Stock Exchange?", a: "Yes, once the company meets the criteria set by SEBI and the respective exchange, it can go for an IPO and get listed." },
    { q: "Is there a limit on the maximum number of members?", a: "Unlike a Private Limited Company which is capped at 200, a Public Limited Company has no limit on the maximum number of shareholders." },
    { q: "What is the INC-20A form?", a: "It is the declaration of commencement of business. Every PLC must file this within 180 days of incorporation before starting operations or exercising borrowing powers." },
    { q: "Are PLC compliances tougher than Pvt Ltd?", a: "Yes, Public Limited Companies have much stricter disclosure and reporting requirements to ensure protection of public interest." },
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
            <SectionHeading subtitle="Scale" title="Public Limited Company" description="The ultimate vehicle for high-scale business operations and public capital." />

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-slate-800">For Large Enterprises</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Public Limited Company (PLC) is a voluntary association of members, which has a separate legal existence and the liability of whose members is limited. PLCs are suitable for companies planning large-scale operations and wanting to raise capital from the general public.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Because they deal with public money, PLCs are subject to rigorous regulatory oversight by the MCA and, if listed, SEBI. This high level of compliance translates to immense brand trust and credibility in the national and international markets.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Raise Public Capital</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Unlimited Members</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Market Visibility</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Globe className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Global Reach</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">High Trust</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Scale className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Legal Independence</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Rocket className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">IP-Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Shield className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Maximum Credibility</h4>
                    <p className="text-gray-300 text-sm">PLCs are perceived as more stable and transparent, attracting top-tier talent and partners.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <IndianRupee className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Fund Raising</h4>
                    <p className="text-gray-300 text-sm">Issue various types of shares and debt instruments to a wide group of investors.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Briefcase className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Growth Potential</h4>
                    <p className="text-gray-300 text-sm">Designed for scalability from day one, allowing for limitless institutional growth.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Advantages" title="The Power of Public Limited" description="Institutionalize your business for the long term." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Globe className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Market Prestige</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Boost your corporate image significantly by holding 'Public Limited' status.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Transferability</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Shares in a PLC are freely transferable, providing liquidity to all shareholders.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Layers className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Diversified Risk</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">As the shareholding is spread across many members, the risk is widely distributed.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Asset Safety</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">The company can own property and incur debt in its own name, protecting owners.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Transparent Packages" description="Expert assistance for high-value incorporations." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plcPlans.map((plan, i) => (
                    <div key={i} className={`flex flex-col p-6 rounded-2xl border ${plan.isRecommended ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        {plan.isRecommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Professional Value</span>}
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
                        <button className={`w-full py-4 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${plan.isPremium ? 'bg-[#C59B4E] hover:bg-[#A37D35]' : 'bg-[#1A7F7D] hover:bg-[#146361]'} text-white shadow-md`}>Select Plan</button>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Compliance" title="Mandatory Criteria" description="The legal foundation for public entities." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plcRequirements.map((req, i) => (<ServiceCard key={i} title={req.title} description={req.description} icon={req.icon} />))}
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
                <h3 className="text-3xl font-bold mb-4">Required Documents</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Collate digital versions of these documents for SPICe+ filing.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {plcDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Journey" title="How It Works" description="Go from name reservation to business commencement." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Rocket, title: "DSC & DIN", desc: "Digital credentials for at least 3 directors." },
                    { icon: FileCheck, title: "Name Booking", desc: "Reservation of your unique 'Limited' company name." },
                    { icon: FilePenLine, title: "E-Filing", desc: "Detailed submission of MOA/AOA and SPICe+ forms." },
                    { icon: Award, title: "Commencement", desc: "Issue of COI and filing for INC-20A to begin operations." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
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

const ComplianceContent = () => (
    <section id="compliance-content" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                <div className="lg:w-1/3">
                    <SectionHeading
                        subtitle="Ethics"
                        title="Corporate Governance"
                        description="Stay on the right side of the law with timely statutory reports."
                        align="left"
                    />
                </div>
                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#C59B4E]" /> AGM & Board Meetings
                        </h6>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Transparency</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Holding regular board meetings and one Annual General Meeting for all shareholders.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#C59B4E]" /> Form MGT-7
                        </h6>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Annual Return</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Detailed report on shareholders, directors, and share capital changes annually.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-[#C59B4E]" /> Form AOC-4
                        </h6>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">Financials</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Mandatory filing of audited balance sheet and profit and loss accounts with ROC.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Award className="w-4 h-4 text-[#C59B4E]" /> Statutory Audit
                        </h6>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold mb-2">External CA</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Compulsory audit of company accounts by an independent Chartered Accountant.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function PlcPage() {
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
                    <img src={BackgroundImageSrc} alt="PLC Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">Public <br /> Limited</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">Verified</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                                    Public Limited <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Company</span>
                                </h1>
                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed">Scale your enterprise with institutional capital and ultimate market trust. Form a legal entity that can go public. <span className="text-[#C59B4E] font-bold uppercase tracking-wider text-xs ml-2">Global Ambitions.</span></p>
                            </div>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">₹19,999</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Expert Prep</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">7+</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Min Shareholders</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:w-[400px]">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Launch Big</h2>
                                <p className="text-[11px] text-slate-500 mb-6 text-center">Incorporate your Public Limited with specialists!</p>
                                <LeadForm serviceName="Public Limited Company Registration" btnText="Start Now" />
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
            <ComplianceContent />

            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Enterprise Guide" description="Everything you need to know about Public Limited structures." />
                    <div className="space-y-4">
                        {plcFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}