import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
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
    Calculator,
    Lightbulb,
    Award,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- MSME REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'msme-overview-content', label: 'Overview' },
    { id: 'msme-classification-content', label: 'Classification' },
    { id: 'msme-benefits-content', label: 'Benefits' },
    { id: 'msme-documents-content', label: 'Documents' },
    { id: 'msme-features-content', label: 'Features' },
    { id: 'msme-process-content', label: 'Process' },
    { id: 'msme-why-Bizzfiling', label: 'Why Us?' },
    { id: 'msme-faqs-content', label: 'FAQs' },
];

const msmeIntroBullets = [
    "Give your startup official government recognition through MSME registration. T&C*",
    "Expert legal help for smooth documentation, filing, and full compliance.",
    "Fast, error-free process supported by top legal professionals.",
];

const msmeClassification = [
    { category: "Micro", investment: "Up to Rs. 1 crore", turnover: "Up to Rs. 5 crore" },
    { category: "Small", investment: "Up to Rs. 10 crore", turnover: "Up to Rs. 50 crore" },
    { category: "Medium", investment: "Up to Rs. 20 crore", turnover: "Up to Rs. 250 crore" },
];

const msmeDocuments = [
    { title: "Aadhar Number", detail: "The Aadhaar number of the business owner or authorized signatory.", icon: Users },
    { title: "PAN Number", detail: "The Permanent Account Number (PAN) of the business entity.", icon: FileText },
    { title: "Bank Account Details", detail: "Bank account number and IFSC code of the business's primary bank account.", icon: DollarSign },
    { title: "Investment Details", detail: "Total value of investment in Plant & Machinery or Equipment.", icon: Calculator },
    { title: "Turnover Details", detail: "Annual turnover as per the new MSME definition and tax returns.", icon: TrendingUp },
    { title: "Business Address & Activity", detail: "Address of the business and NIC 2-digit code for the main activity.", icon: Briefcase },
];

const msmeBenefits = [
    { title: "Easier Access to Credit", icon: DollarSign, detail: "Avail cheaper credit facilities and collateral-free loans under the CGTMSE scheme." },
    { title: "Access to Government Schemes", icon: Landmark, detail: "Eligible for various government schemes, subsidies, and financial assistance packages." },
    { title: "Protection of IPR", icon: Scale, detail: "Helps protect Intellectual Property Rights (IPR), including trademarks and patents." },
    { title: "Priority for Government Tenders", icon: CheckCircle, detail: "Enables businesses to participate in government tenders with preferential procurement policies." },
    { title: "Protection Against Delayed Payments", icon: Clock, detail: "Access specialized dispute resolution mechanisms for timely payment redressal." },
    { title: "Subsidies & Tax Benefits", icon: TrendingUp, detail: "Benefits from subsidies for technology upgradation and extended tax benefits." },
];

const udyamFeatures = [
    "Fully digitalized and paperless registration process.",
    "Completely free on the official portal (expert fee for assisted filing).",
    "Instant e-certificate issued online upon completion.",
    "No document upload required (Aadhaar & PAN linked).",
    "Integrated with Income Tax and GSTIN systems.",
    "Only one Udyam Registration allowed per enterprise.",
    "Permanent identification number with no mandatory renewal.",
    "Dynamic QR code for easy verification.",
];

const msmeRegistrationProcess = [
    "Access the Udyam Registration Portal: Choose the appropriate option (New or Existing).",
    "Aadhaar Verification: Enter Aadhaar and name, verify via OTP.",
    "PAN & GSTIN Verification: Validate organisation type and PAN details.",
    "Form Completion: Fill personal, enterprise, and employment details.",
    "Classification Data: Enter investment and turnover for Micro/Small/Medium status.",
    "Final Submission: Submit via OTP and receive your COI via email.",
];

const howBizzfilingHelps = [
    { title: "Expertise & Compliance", detail: "Specialized team for MSME registration and government regulations.", icon: Lightbulb },
    { title: "Accuracy Guarantee", detail: "Ensuring error-free data entry to avoid delays or rejections.", icon: CheckCircle },
    { title: "Time and Cost Savings", detail: "Save resources by outsourcing the complex filing process.", icon: Clock },
    { title: "Convenience & Support", detail: "User-friendly platform with end-to-end guidance.", icon: Handshake },
];

const msmeFAQs = [
    { q: "What is the role of the Ministry of MSME?", a: "The Ministry is responsible for formulating and administering rules, regulations, and laws relating to MSMEs in India." },
    { q: "Is there a charge for Udyam registration?", a: "Udyam Registration is free on the official government portal. Service providers charge for expert-assisted filing." },
    { q: "What are the benefits of Udyog Aadhaar?", a: "It provides access to cheaper loans, government tenders, subsidies, and tax benefits." },
    { q: "Why is Aadhaar mandatory for MSME registration?", a: "Aadhaar is the primary key for identity verification and auto-fetching tax data." },
    { q: "How long to get the Udyam Certificate?", a: "The e-certificate is usually issued instantly upon successful submission." },
    { q: "Who is eligible for MSME registration?", a: "Any manufacturing or service enterprise (Proprietorship, HUF, Firm, Company) meeting the investment/turnover criteria." },
];

// --- Design Components ---

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
        <button
            className="flex items-center justify-between w-full p-4 text-left"
            onClick={onClick}
        >
            <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                {faq.q}
            </h3>
            <div className="flex-shrink-0">
                {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
            </div>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
                {faq.a}
            </p>
        </div>
    </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
    <section id="msme-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Recognition" title="MSME (Udyam) Registration" description="The backbone of India's economy, providing formal recognition and government benefits." />
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed">
                        In India, MSME registration is a government initiative to provide formal recognition to Micro, Small, and Medium Enterprises. These enterprises gain access to a domain of benefits curated by the government for their establishment and growth.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        The process is fully online, paperless, and provides the business with a permanent <strong>Udyam Registration Number (URN)</strong>. The classification is based on composite criteria of Investment and Annual Turnover.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">PAN/Aadhaar Linked</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">No Document Upload</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Lifetime Validity</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm border-l-8 border-l-[#1A7F7D]">
                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#1A7F7D]" /> Form Details</h4>
                    <p className="text-sm text-slate-500 italic mb-4">Mandatory info includes: Legal name, Entity type, Aadhaar of signatory, and Investment/Turnover data.</p>
                    <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-slate-50 rounded-xl text-center">
                            <span className="block text-xl font-bold text-slate-800">100%</span>
                            <span className="block text-[10px] text-slate-400 uppercase">Online</span>
                        </div>
                        <div className="flex-1 p-4 bg-slate-50 rounded-xl text-center">
                            <span className="block text-xl font-bold text-slate-800">INR 0</span>
                            <span className="block text-[10px] text-slate-400 uppercase">Govt Fee</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ClassificationContent = () => (
    <section id="msme-classification-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Taxonomy" title="MSME Classification" description="New composite criteria based on investment and turnover thresholds." />
            <div className="overflow-hidden border border-slate-100 rounded-3xl shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-[#103B3E] text-white">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Investment</th>
                            <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Annual Turnover</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {msmeClassification.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-6 text-sm font-bold text-slate-800">{row.category}</td>
                                <td className="px-6 py-6 text-sm text-slate-500 italic">{row.investment}</td>
                                <td className="px-6 py-6 text-sm text-slate-500 italic">{row.turnover}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="msme-benefits-content" className="py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Advantages" title="Key MSME Benefits" description="Leverage government-backed schemes and financial security." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {msmeBenefits.map((item, i) => (
                    <div key={i} className="group p-8 bg-white rounded-3xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-xl transition-all h-full flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-slate-50 text-[#1A7F7D] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1A7F7D] group-hover:text-white transition-all"><item.icon className="w-7 h-7" /></div>
                        <h5 className="font-bold text-slate-800 text-base mb-3">{item.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="msme-documents-content" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Checklist" title="Required Details" description="Udyam registration is information-based and paperless." />
            <div className="grid md:grid-cols-3 gap-6">
                {msmeDocuments.map((doc, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-white text-[#C59B4E] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"><doc.icon className="w-5 h-5" /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm mb-1">{doc.title}</h6>
                            <p className="text-[10px] text-slate-500 leading-relaxed">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FeaturesContent = () => (
    <section id="msme-features-content" className="py-20 bg-slate-900 text-white overflow-hidden relative scroll-mt-24">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <span className="text-[#C59B4E] font-bold text-xs uppercase tracking-widest mb-3 block">Innovation</span>
                <h3 className="text-3xl font-bold mb-4">Udyam Portal Features</h3>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">Modern digital infrastructure for Ease of Doing Business.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {udyamFeatures.map((f, i) => (
                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-transform hover:scale-105">
                        <p className="text-xs text-slate-300 italic leading-relaxed">{f}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="msme-process-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <SectionHeading subtitle="Steps" title="Registration Journey" description="From portal access to instant certification." />
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
                {msmeRegistrationProcess.map((step, idx) => (
                    <div key={idx} className="space-y-4">
                        <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
                            <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white">✓</div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhyBizzfiling = () => (
    <section id="msme-why-Bizzfiling" className="py-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <SectionHeading subtitle="Assistance" title="How Bizzfiling Helps" description="Ensure seamless, accurate, and compliant MSME registration." align="left" />
                    <div className="grid sm:grid-cols-2 gap-4">
                        {howBizzfilingHelps.map((s, i) => (
                            <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm group hover:border-[#1A7F7D]/50 transition-all">
                                <div className="w-10 h-10 bg-[#F0FDFA] text-[#1A7F7D] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><s.icon size={20} /></div>
                                <h6 className="font-bold text-slate-800 text-sm mb-1">{s.title}</h6>
                                <p className="text-[10px] text-slate-500">{s.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#103B3E] p-10 rounded-[32px] text-white flex flex-col items-center text-center shadow-2xl">
                    <Star className="w-16 h-16 text-[#C59B4E] mb-6" />
                    <h4 className="text-2xl font-bold mb-4 font-serif italic">Verified MSME Consultants</h4>
                    <p className="text-slate-400 text-sm italic mb-8">"Providing expert oversight to thousands of small businesses across India."</p>
                    <button className="px-10 py-4 bg-[#C59B4E] hover:bg-[#a37d35] text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all">Request Proposal</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function MSMERegistrationPage() {
    const [activeTab, setActiveTab] = useState('msme-overview-content');
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

            {/* Hero */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="MSME Hero Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2">
                                    <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                                    <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">MSME <br /> Registration</span>
                                    <span className="text-white text-[8px] uppercase mt-1 opacity-70">Aadhar Based</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                                    MSME <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Registration</span>
                                </h1>
                                <div className="space-y-3 pt-2">
                                    {msmeIntroBullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                                            <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 py-2">
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic tracking-tighter uppercase">Verified</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">Legal Service</span>
                                </div>
                                <div className="h-10 w-[1px] bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-white text-2xl font-bold italic tracking-tighter uppercase">Instant</span>
                                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">E-Certificate</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:w-[400px]">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Get Assistance</h2>
                                <p className="text-[11px] text-slate-500 mb-6 text-center">Incorporate your MSME with top-tier specialists!</p>
                                <LeadForm serviceName="MSME Registration" btnText="Get Legal Aid" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center gap-8 md:gap-16 py-0 min-w-max list-none">
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
            <ClassificationContent />
            <BenefitsContent />
            <DocumentsContent />
            <FeaturesContent />
            <ProcessContent />
            <WhyBizzfiling />

            <section id="msme-faqs-content" className="py-24 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="MSME Guide" description="Everything you need to know about MSME legal structures." />
                    <div className="space-y-4">
                        {msmeFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}