import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// Consolidated lucide-react icons for opc registration page
import {
    ChevronDown,
    ArrowRight,
    CheckCircle,
    FileText,
    Zap,
    Star,
    Shield,
    Award,
    Timer,
    FilePenLine,
    Rocket,
    Users,
    Layers,
    Home,
    Trello,
    Scale,
    Briefcase,
    Globe,
    FileCheck,
    Cpu,
    BadgeCheck,
    Calendar,
    Calculator,
    UserCircle
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

const opcPlans = [
    {
        title: "Starter",
        price: "₹999",
        originalPrice: "₹1,499",
        discountText: "33% discount",
        description: "Perfect for budding entrepreneurs ready to formalize their solo venture.",
        features: [
            "Expert assisted process",
            "Name filed in 2 - 4 days",
            "DSC (1 Director)",
            "DIN (1 Director)",
            "Drafting of MOA & AOA",
            "SPICe+ form filing",
            "Company PAN+TAN Filing"
        ],
        isRecommended: false,
        isPremium: false,
    },
    {
        title: "Standard",
        price: "₹1,499",
        originalPrice: "₹2,999",
        discountText: "50% off",
        description: "Faster processing for entrepreneurs who want to start quickly.",
        features: [
            "All Starter Features",
            "Priority Name Filing",
            "Certificate in 14 - 21 days",
            "GST Registration Free",
            "MSME (Udyam) Registration",
            "Digital Welcome Kit (Templates)",
            "Dedicated Support Manager"
        ],
        isRecommended: true,
        isPremium: false,
    },
    {
        title: "Pro Compliance",
        price: "₹12,499",
        originalPrice: "₹19,999",
        discountText: "37% off",
        description: "Complete solution including incorporation + 1-year annual compliance.",
        features: [
            "Includes Standard Incorporation",
            "ADT-1 filing (Auditor Appt)",
            "AOC-4 (Financial State filing)",
            "MGT-7 (Annual Return filing)",
            "Director's KYC (DIR-3)",
            "1 Year Business ITR Filing",
            "Quarterly Compliance Review"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const opcRequirements = [
    { icon: Users, title: "Single Member", description: "Only one natural person, who is an Indian citizen and resident, can be the sole member." },
    { icon: UserCircle, title: "Nominee Required", description: "A nominee must be appointed who will take over the company in case of the member's death." },
    { icon: FileText, title: "No Min Capital", description: "Start with any amount. Authorized capital of ₹1 Lakh is standard." },
    { icon: Award, title: "DIN & DSC", description: "The sole director must have a Director Identification Number and Digital Signature." },
    { icon: Home, title: "Registered Office", description: "A physical address in India is mandatory to serve as the company's registered office." },
    { icon: Trello, title: "Constitutional Docs", description: "MOA and AOA must be specially drafted to reflect the OPC structure." },
];

const opcDocuments = [
    { category: "For Director & Nominee", items: ["PAN Card (Mandatory)", "Aadhaar Card", "Photo", "Bank Statement / Utility Bill (latest)"] },
    { category: "For Registered Office", items: ["NOC from Property Owner", "Electricity/Gas Bill (not older than 2 months)", "Rent Agreement (if applicable)"] }
];

const opcFAQs = [
    { q: "Can a person be a member of more than one OPC?", a: "No. A natural person shall not be eligible to incorporate more than one OPC or become a nominee in more than one OPC." },
    { q: "Is it possible to convert an OPC into a Private Limited Company?", a: "Yes, an OPC can be voluntarily converted into a Private Limited Company or a Public Limited Company at any time. Earlier there were threshold limits, but recent amendments have made it much easier." },
    { q: "Does an OPC need to hold an Annual General Meeting (AGM)?", a: "No, an OPC is exempted from the requirement of holding an AGM under Section 96 of the Companies Act." },
    { q: "What are the rules for a Nominee in an OPC?", a: "The nominee must be an Indian citizen and resident. Their prior written consent is required in Form INC-3. They can withdraw their consent at any time, or the member can change the nominee." },
    { q: "Is a statutory audit mandatory for an OPC?", a: "Yes, like any other company, an OPC must get its account audited by a Chartered Accountant every financial year." },
    { q: "What happens if the sole member dies?", a: "In the event of death or incapacity of the member, the Nominee becomes the member of the company and manages its affairs until a new member is officially recorded." },
    { q: "Can a foreigner start an OPC in India?", a: "No. Only a natural person who is an Indian citizen and resident (stayed in India for at least 120 days during the financial year) is eligible." },
];

// --- Reusable Components ---

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
            <SectionHeading subtitle="Introduction" title="One Person Company (OPC)" description="Revolutionizing solo entrepreneurship with corporate benefits." />

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-slate-800">Why Choose OPC?</h4>
                    <p className="text-slate-600 leading-relaxed">
                        Introduced by the Companies Act, 2013, One Person Company (OPC) allows a single entrepreneur to operate a corporate entity with limited liability protection. It is essentially a hybrid between a Sole Proprietorship and a Private Limited Company.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        For solopreneurs, it offers the perfect balance—complete control over business decisions while ensuring that personal assets are legally protected from business debts. It also provides a more professional image to clients, banks, and investors.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">100% Ownership</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Limited Liability</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">No AGM Required</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Shield className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Asset Protection</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Scale className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Legal Status</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Briefcase className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Solo Control</span>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Globe className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Growth Ready</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Shield className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Limited Liability</h4>
                    <p className="text-gray-300 text-sm">Your personal property is safe; your liability is limited only to the extent of your investment.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Scale className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Separate Legal Entity</h4>
                    <p className="text-gray-300 text-sm">The OPC is a legal "person" in the eyes of the law, capable of owning property and suing in its own name.</p>
                </div>
                <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                    <Zap className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">Easy to Acquire Loans</h4>
                    <p className="text-gray-300 text-sm">Banks and financial institutions prefer lending to companies rather than proprietorships.</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Advantages" title="Why Register an OPC?" description="Empower your solo journey with official recognition." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Cpu className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Sole Control</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">No requirement of sharing profits or decision-making power with any other director or partner.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><BadgeCheck className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Reduced Compliance</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Exempted from many procedures like AGM and certain secretarial records required for PLCs.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Globe className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Perpetual Succession</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">The company remains in existence even after the death of the owner, through the nominee member.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Scale className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Highly Credible</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">Being a "Private Limited" entity, it gains trust from vendors and larger corporations.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Plans" title="Transparent Pricing" description="Flexible packages designed for single founders." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {opcPlans.map((plan, i) => (
                    <div key={i} className={`flex flex-col p-6 rounded-2xl border ${plan.isRecommended ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                        {plan.isRecommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Best Value</span>}
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
            <SectionHeading subtitle="Checklist" title="OPC Compliance Standards" description="Ensure you meet these legal criteria before filing." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opcRequirements.map((req, i) => (<ServiceCard key={i} title={req.title} description={req.description} icon={req.icon} />))}
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
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Upload these digital copies for a one-day submission process.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {opcDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Lifecycle" title="How It Works" description="Registration to operational in 4 simple steps." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Zap, title: "DSC & DIN", desc: "Digital signatures and Director ID numbers procurement." },
                    { icon: FilePenLine, title: "Name Booking", desc: "Reserving your unique company name on MCA portal." },
                    { icon: Rocket, title: "E-Filing", desc: "Submission of SPICe+ forms with the ROC." },
                    { icon: Award, title: "Registration", desc: "Issuance of Incorporation Certificate and PAN/TAN." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:rotate-6">
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
                        subtitle="Future"
                        title="Annual Compliance"
                        description="Stay legally healthy with timely filings and records."
                        align="left"
                    />
                </div>
                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#C59B4E]" /> AOC-4
                        </h6>
                        <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Financial Statement</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Filing of balance sheet and profit & loss account within 180 days of FY end.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#C59B4E]" /> MGT-7A
                        </h6>
                        <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Annual Return</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Specific annual return form for OPCs and Small Companies due by 30th Nov.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-[#C59B4E]" /> ITR-6
                        </h6>
                        <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Income Tax Return</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Mandatory tax filing for the company entity, even with zero turnover.</p>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <BadgeCheck className="w-4 h-4 text-[#C59B4E]" /> Statutory Audit
                        </h6>
                        <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">CA Audit</p>
                        <p className="text-xs text-slate-600 leading-relaxed">All companies (including OPC) must get accounts audited by a CA.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default function OpcPage() {
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
                    <img src={BackgroundImageSrc} alt="OPC Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">One Person <br /> Company</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">Verified</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                                    OPC <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Registration</span>
                                </h1>
                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed">The perfect hybrid for solo entrepreneurs. Get big business credibility under a single owner with limited liability protection. <span className="text-[#C59B4E] font-bold">Fast-track your legacy today.</span></p>
                            </div>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic">₹999</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Professional Fee</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col text-center">
                                    <div className="bg-[#C59B4E]/20 text-[#C59B4E] px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-1">Recommended</div>
                                    <span className="text-white text-sm font-medium">Standard Plan</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:w-[400px] relative z-30">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
                                <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Register Solo</h2>
                                <p className="text-[11px] text-slate-500 mb-6 text-center">Launch your OPC in as little as 7 working days!</p>
                                <LeadForm serviceName="OPC Registration" btnText="Start My Incorporation" />
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
                                    className={`py-4 text-xs md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-wider ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-500 border-transparent hover:text-[#0F4C49]'}`}
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
                    <SectionHeading subtitle="FAQ" title="Your OPC Queries Answered" description="Everything you need to know about starting as a solo director." />
                    <div className="space-y-4">
                        {opcFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}