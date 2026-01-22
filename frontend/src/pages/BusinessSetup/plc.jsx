import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
import {
    ChevronDown,
    ArrowRight,
    UserCheck,
    CheckCircle,
    FileText,
    Scale,
    Calculator,
    Zap,
    Star,
    Shield,
    Award,
    Rocket,
    Users,
    Layers,
    Home,
    Globe,
    FileCheck,
    Building,
    Calendar,
    IndianRupee,
    ShieldCheck,
    Briefcase
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

const pvtPlans = [
    {
        title: "Standard Incorporation",
        price: "₹4,999",
        description: "Core registration for your Private Limited Company.",
        features: [
            "Name Approval",
            "SPICe+ form filing",
            "Incorporation Certificate",
            "DIN for Directors",
            "DSC for 2 Directors",
            "Company PAN+TAN"
        ],
        isRecommended: false,
    },
    {
        title: "Premium",
        price: "₹5,499",
        description: "Incorporation plus essential tax registrations.",
        features: [
            "Name Approval",
            "SPICe+ form filing",
            "Incorporation Certificate",
            "DIN for Directors",
            "DSC for 2 Directors",
            "Company PAN+TAN",
            "MSME registration Free"
        ],
        isRecommended: true,
    },
    {
        title: "Elite",
        price: "₹6,799",
        description: "Incorporation plus 1 year of compliance support.",
        features: [
            "Name Approval",
            "SPICe+ form filing",
            "Incorporation Certificate",
            "DIN for Directors",
            "DSC for 2 Directors",
            "Company PAN+TAN",
            "INC 20A filing",
            "MSME registration Free",
            "ADT 1 filing"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const pvtRequirements = [
    { icon: Users, title: "Minimum 2 Members", description: "A minimum of 2 shareholders are required to register a Private Limited Company." },
    { icon: UserCheck, title: "Minimum 2 Directors", description: "Must have at least 2 directors. Directors and shareholders can be the same people." },
    { icon: IndianRupee, title: "Capital Requirement", description: "No minimum paid-up capital required. You can start with as low as ₹10,000." },
    { icon: FileText, title: "DSC & DIN", description: "Digital Signature Certificate (DSC) and Director Identification Number (DIN) for directors." },
    { icon: Home, title: "Registered Office", description: "A physical address in India is mandatory to be registered as the official office." },
    { icon: Globe, title: "Unique Name", description: "The company name must be unique and not resemble any existing company or trademark." }
];

const pvtDocuments = [
    { category: "For Directors & Shareholders", items: ["PAN Card (Mandatory for Indians)", "Aadhaar Card / Voter ID / Passport", "Latest Photograph", "Bank Statement / Mobile Bill (Latest)"] },
    { category: "For Registered Office", items: ["Electricity / Gas / Water Bill (Latest)", "No Objection Certificate (NOC) from Owner", "Rent Agreement (If Rented)"] }
];

const pvtFAQs = [
    { q: "What is a Private Limited Company?", a: "A Private Limited Company is a privately held small business entity, held by private owners. The liability of the members is limited to the extent of shares held by them." },
    { q: "Can a salaried person be a director?", a: "Yes, a salaried person can become a director in a private limited company, provided their employment agreement allows it." },
    { q: "Is a committed office space required?", a: "No, a rented or owned residential address can also be used as the registered office of the company." },
    { q: "What is the minimum capital required?", a: "There is no minimum capital requirement. You can register a company with a capital as low as ₹1,000, though ₹1 Lakh is standard practice." },
    { q: "Can I convert my Pvt Ltd to Public Limited later?", a: "Yes, a Private Limited Company can be converted into a Public Limited Company by following the procedures laid down in the Companies Act, 2013." },
    { q: "Do I need to be physically present for registration?", a: "No, the entire process is 100% online. You do not need to visit any government office." },
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
            <SectionHeading subtitle="Overview" title="Private Limited Company" description="The most trusted and popular legal structure for startups and businesses in India." />

            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <div className="space-y-8">
                    <h4 className="text-2xl font-bold text-slate-800">Ideal for Startups & Growth</h4>
                    <p className="text-slate-600 leading-relaxed">
                        A Private Limited Company is held by small groups of people. It is registered as a separate legal entity from its owners, offering limited liability protection. This means your personal assets are safe if the business incurs debts.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        It is preferred by investors (VCs/Angels) because it allows for easy equity funding. With high credibility and perpetual succession, it is the gold standard for building a scalable business.
                    </p>
                    <div className="flex flex-wrap gap-5">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Limited Liability</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Easy Funding</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Separate Legal Entity</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <ShieldCheck className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Asset Protection</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Rocket className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Scalability</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Building className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">Credibility</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                        <Users className="w-8 h-8 text-[#1A7F7D] mb-3" />
                        <span className="text-sm font-bold text-slate-800">ESOPs</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Benefits" title="Why Register as Pvt Ltd?" description="Unlock the full potential of your business." />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Limited Liability</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">Shareholders are not personally liable for company debts beyond their share capital.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><IndianRupee className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Fund Raising</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">The only structure that allows you to raise venture capital and angel investment easily.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><Building className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Separate Entity</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">The company can own assets, sue, and be sued in its own name, distinct from directors.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><Layers className="w-6 h-6" /></div>
                    <h5 className="font-bold text-slate-800">Perpetual Existence</h5>
                    <p className="text-sm text-slate-500 leading-relaxed">The company continues to exist even if directors or shareholders change or pass away.</p>
                </div>
            </div>
        </div>
    </section>
);

const PricingContent = () => (
    <section id="pricing-content" className="py-12 md:py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Packages" title="Affordable Pricing" description="Choose the plan that suits your business needs." />
            <PricingCards plans={pvtPlans} serviceName="Private Limited Company" />
        </div>
    </section>
);

const RequirementsContent = () => (
    <section id="requirements-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Minimum Requirements" description="What you need to start a Private Limited Company." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {pvtRequirements.map((item, i) => (
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

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner group-hover:shadow-lg mt-2
                            ${i === 1
                                ? 'bg-white text-[#0F2D30]'
                                : 'bg-[#F0FDFA] text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white'
                            }
                        `}>
                            {item.icon ? <item.icon size={36} strokeWidth={1.5} /> : <FileText size={36} strokeWidth={1.5} />}
                        </div>

                        <h3 className={`text-xl font-bold mb-4 transition-colors ${i === 1 ? 'text-white' : 'text-slate-800 group-hover:text-[#1A7F7D]'}`}>
                            {item.title}
                        </h3>

                        <p className={`text-[15px] leading-relaxed mb-6 min-h-[80px] ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                            {item.description}
                        </p>
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
                <h3 className="text-3xl font-bold mb-4">Documents Required</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Scan these documents for a smooth online registration process.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                {pvtDocuments.map((doc, idx) => (
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
            <SectionHeading subtitle="Process" title="Steps to Incorporation" description="We handle the entire process online." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                {[
                    { icon: Rocket, title: "DSC & DIN", desc: "Obtaining Digital Signatures and DIN for directors." },
                    { icon: FileCheck, title: "Name Approval", desc: "Submitting company name for reservation." },
                    { icon: FileText, title: "Documents Filing", desc: "Drafting MoA, AoA and filing SPICe+ forms." },
                    { icon: Award, title: "Incorporation", desc: "Receipt of COI, PAN, and TAN." }
                ].map((step, idx) => (
                    <div key={idx} className="space-y-8">
                        <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
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

const ComplianceContent = () => (
    <section id="compliance-content" className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="lg:w-1/3">
                    <SectionHeading
                        subtitle="Maintainance"
                        title="Annual Compliance"
                        description="Keep your company active and penalty-free."
                        align="left"
                    />
                </div>
                <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                            <Calendar className="w-4 h-4 text-[#C59B4E]" /> Auditor Appointment
                        </h6>
                        <p className="text-sm text-slate-600 leading-relaxed">Appointment of First Auditor within 30 days of incorporation.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                            <FileText className="w-4 h-4 text-[#C59B4E]" /> Annual General Meeting
                        </h6>
                        <p className="text-sm text-slate-600 leading-relaxed">Holding one AGM every year and 4 board meetings.</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                            <Calculator className="w-4 h-4 text-[#C59B4E]" /> ROC Filing
                        </h6>
                        <p className="text-sm text-slate-600 leading-relaxed">Filing of Form AOC-4 (Financials) and MGT-7 (Annual Return).</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-[#1A7F7D]/50 border-l-4 border-l-[#1A7F7D]">
                        <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                            <Award className="w-4 h-4 text-[#C59B4E]" /> ITR Filing
                        </h6>
                        <p className="text-sm text-slate-600 leading-relaxed">Filing of Income Tax Return for the company (Form ITR-6).</p>
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
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="PLC Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Building size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Most Popular</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Private Limited <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Company Registration</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                The gold standard for business in India. Register your Pvt Ltd Company with expert guidance and seamless online process.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Limited Liability
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> Easy Funding
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Register Now</h3>
                                    <LeadForm serviceName="Private Limited Company Registration" btnText="Start Registration" />
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
            <ComplianceContent />

            <section id="faqs-content" className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Your Questions Answered" description="Common queries about Private Limited Company registration." />
                    <div className="space-y-8">
                        {pvtFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}