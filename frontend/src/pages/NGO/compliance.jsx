import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Credibility/Audit-Ready
    Briefcase, // For Compliance/Annual Filings/Governance
    ArrowRight,
    Star,
    CheckCircle,
    FileText, // For document/Forms 10BD/10BE
    Scale, // For Regulatory Requirements/Compliance
    Handshake, // For Consultations/Assistance
    TrendingUp, // For Tax Benefits/Grants/Funding
    Lightbulb, // For Expert Guidance/Updates
    Users, // For Members/Directors/Governing Body
    DollarSign, // For Fees/Donations/Funding
    Clock, // For Timely Filing/Deadlines
    Landmark, // For MCA/CBDT/ROC/Government
    MapPin,
    BookOpen,
    RefreshCw, // For Revalidation/Renewal
    Shield, // For Mitigating Risks/Non-Compliance
    AlertTriangle,
    Calendar  // For Consequences/Penalties
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/compliance_hero_bg.png"; // Specific background

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

// --- NGO COMPLIANCE STATIC DATA DEFINITIONS ---

const complianceTabs = [
    { id: 'compliance-overview-content', label: 'Overview' },
    { id: 'compliance-darpan-section', label: 'NGO Darpan & CSR-1' },
    { id: 'compliance-tax-revalidation', label: '80G & 12A Revalidation' },
    { id: 'compliance-tax-forms', label: 'Form 10BD & 10BE' },
    { id: 'compliance-sec8-annual', label: 'Section 8 Annual' },
    { id: 'compliance-why-Bizzfiling', label: 'Why Bizzfiling?' },
    { id: 'compliance-faqs-content', label: "FAQs" },
];

const darpanDocuments = [
    "Copy of the registration certificate as a PDF or JPG.",
    "Pan card of NGO.",
    "PAN and Aadhaar card copies of 3 members in the executive committee.",
    "Name, Address, Registration Number, and Date of Registration of NGO/VO.",
    "Details about funding from the government and chief area of working.",
];

const taxRevalidationDetails = {
    overview: "All NGOs relying on donations for tax exemption must register/revalidate under Section 80G (for donor tax deduction) and Section 12A (for NGO income tax exemption). This is mandatory and often requires prior Darpan registration.",
    timeline: "The overall process may take up to **three months**. The registration must be revalidated every **5 years**, with re-application made six months before the date of expiry.",
    documents: [
        "Pan Card of NGO, Registration Number, and Date of registration.",
        "PAN and Aadhaar card copies of 3 members in the executive committee.",
        "Name, Address, and Details of three members of the executive committee.",
        "Details about funding from the government and chief area of working.",
    ]
};

const csr1Details = {
    eligibility: "Mandatory for all NGOs that receive Corporate Social Responsibility (CSR) funds from companies (Net worth over ₹500 crores, Turnover over ₹1,000 crores, or Net Profit over ₹5 crores).",
    form: "Filing Form CSR-1 with the Ministry of Corporate Affairs (MCA) for 'Registration of Entities for Undertaking CSR Activities'.",
    timeline: "Registration is usually done within **one week** of the submission of all documents.",
    documents: [
        "Copy of PAN card of the NGO registration.",
        "Mail ID and mobile number.",
        "Details of Governing Body Members and Copy of registration certificate.",
        "NGO Darpan ID.",
        "Digital Signature of the authorised person with their PAN.",
    ]
};

const form10BDConsequences = [
    { title: "Fee for Delayed Filing", penalty: "A fee of **₹200/- per day** of delay will be charged to the reporting entity (under section 234G).", icon: Clock },
    { title: "Penalty for Non-filing", penalty: "A penalty under section 271K, which shall **not be less than ₹10,000/- and may extend to ₹1,00,000**.", icon: AlertTriangle },
    { title: "Loss of Donor Benefit", penalty: "Failure to file Form 10BD prevents donors from claiming the deduction on their income tax return.", icon: DollarSign },
];

const section8Compliances = [
    "Appointment of an auditor.",
    "Maintenance of a register.",
    "Convening statutory meetings.",
    "Report by directors.",
    "Financial statements of the company.",
    "Tax returns.",
    "Filing of financial statements and annual returns.",
];

const ngoWhyBizzfiling = [
    "Expert Assistance: Team of expert lawyers and Chartered Accountants (CAs) to completely handle the process.",
    "Consultation and Guidance: We set up a call to explain the nuances of NGO registration and compliance (including CSR-1 filing).",
    "Transparency: Our process is completely transparent, and you will get timely updates.",
    "Affordable & Hassle-Free: We provide legal services at an affordable price in a hassle-free way.",
    "Ongoing Support: Get assistance from our team of experts if you have any questions during the compliance process.",
];

const ngoComplianceFAQs = [
    { q: "What are some common complications in NGO compliance?", a: "Common issues include failing to file annual returns (AOC-4/MGT-7), missing the revalidation deadline for 12A/80G (every 5 years), and non-filing of Form 10BD for donor transparency." },
    { q: "How can NGOs ensure ongoing compliance?", a: "By engaging expert services like Bizzfiling, maintaining proper books of accounts, conducting timely annual audits, and utilizing compliance packages designed specifically for their organizational type (Trust/Society/Section 8)." },
    { q: "What are the consequences of non-compliance for NGOs?", a: "Consequences include loss of valuable tax exemptions (12A/80G), imposition of daily penalty fees (e.g., Form 10BD), revocation of licenses (e.g., Section 8 or FCRA), and loss of public credibility." },
    { q: "How can NGOs mitigate the risks of non-compliance?", a: "Mitigation involves setting a compliance calendar, utilizing digital platforms for timely filing, and ensuring the appointment of qualified CAs/CSs for annual statutory obligations." },
    { q: "Can non-compliance result in legal consequences for NGOs?", a: "Yes. Severe non-compliance, fund misuse, or fraud can lead to heavy financial penalties, prosecution of directors, and even the winding up or dissolution of the organization by the regulatory body (MCA/ROC)." },
];

// --- REUSABLE COMPONENTS ---

const ReviewBox = ({ score, reviews, source }) => (
    <div className="flex flex-col items-center justify-center w-full p-3 border shadow-lg bg-white/10 rounded-xl border-white/20">
        <div className="flex items-center mb-1 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
        </div>
        <p className="text-sm font-semibold text-white/80">{source}</p>
        <p className="mt-1 text-xl font-bold text-white">{score}</p>
        <p className="text-sm text-white/90">{reviews}</p>
    </div>
);

const DetailItem = ({ title, description, icon: Icon }) => (
    <div className="flex items-start gap-5 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
        <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
        <div>
            <h4 className="mb-1 text-lg font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

// --- TAB CONTENT COMPONENTS (NGO Compliance Content) ---

const ComplianceOverviewContent = () => (
    <section id="compliance-overview-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="NGO Compliance Fundamentals"
                description="Meeting all regulatory requirements to maintain legal status and funding eligibility."
            />

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "NGO Darpan", desc: "Mandatory for government funding access.", icon: Landmark },
                    { title: "CSR-1 Filing", desc: "For NGOs receiving corporate CSR funds.", icon: Briefcase },
                    { title: "Tax Revalidation", desc: "80G & 12A renewal every 5 years.", icon: TrendingUp },
                    { title: "Annual Returns", desc: "Mandatory annual filing (10BD, AOC-4).", icon: FileText },
                ].map((item, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center">
                        <div className="w-12 h-12 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center mx-auto mb-4">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-lg md:text-xl text-slate-900 mb-2">{item.title}</h4>
                        <p className="text-base text-slate-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceDarpanSection = () => (
    <section id="compliance-darpan-section" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Significance"
                title="NGO Darpan & CSR-1"
                description="Critical registrations for government funding and corporate sponsorships."
            />

            <div className="grid gap-10 lg:grid-cols-2">
                {/* NGO Darpan */}
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-900">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Landmark className="w-5 h-5" /></div>
                        NGO Darpan Registration
                    </h4>
                    <p className="mb-6 text-slate-600 leading-relaxed">
                        Operated by the Ministry of Rural Development, this portal is mandatory for NGOs receiving government funding. Completing registration is crucial for credibility.
                    </p>
                    <h5 className="mb-3 font-bold text-slate-800 text-base uppercase tracking-wide">Required Documents:</h5>
                    <ul className="space-y-8">
                        {darpanDocuments.slice(0, 5).map((doc, i) => (
                            <li key={i} className="flex items-start gap-5 text-base text-slate-600">
                                <CheckCircle className="flex-shrink-0 w-4 h-4 mt-0.5 text-indigo-500" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CSR-1 Registration */}
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-900">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600"><Briefcase className="w-5 h-5" /></div>
                        CSR-1 Registration
                    </h4>
                    <p className="mb-6 text-slate-600 leading-relaxed text-base">
                        Mandatory for all NGOs receiving **Corporate Social Responsibility (CSR) funds**. File Form CSR-1 with the MCA as soon as possible.
                    </p>
                    <h5 className="mb-3 font-bold text-slate-800 text-base uppercase tracking-wide">Required Documents:</h5>
                    <ul className="space-y-8">
                        {csr1Details.documents.map((doc, i) => (
                            <li key={i} className="flex items-start gap-5 text-base text-slate-600">
                                <CheckCircle className="flex-shrink-0 w-4 h-4 mt-0.5 text-green-500" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm font-semibold text-slate-500 border border-slate-100">
                        Timeline: Registration usually done within **one week** of submission.
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ComplianceTaxRevalidation = () => (
    <section id="compliance-tax-revalidation" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Revalidation"
                title="80G & 12A Renewal"
                description="Mandatory re-validation under Sections 80G and 12A for all existing NGOs."
            />

            <div className="grid gap-10 md:grid-cols-2">
                <div className="p-8 bg-slate-50 border border-slate-100 shadow-sm rounded-2xl">
                    <h4 className="mb-6 text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Timeline and Process</h4>
                    <div className="space-y-8 text-slate-700 text-base">
                        <p className="flex items-center gap-5 p-3 bg-white rounded-lg shadow-sm"><Clock className="w-5 h-5 flex-shrink-0 text-[#00695C]" /> Process takes up to **three months**.</p>
                        <p className="flex items-center gap-5 p-3 bg-white rounded-lg shadow-sm"><Calendar className="w-5 h-5 flex-shrink-0 text-[#00695C]" /> Re-validate every **5 years**.</p>
                        <p className="flex items-center gap-5 p-3 bg-white rounded-lg shadow-sm"><AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500" /> Apply **six months before** expiry.</p>
                    </div>
                </div>
                <div className="p-8 bg-slate-50 border border-slate-100 shadow-sm rounded-2xl">
                    <h4 className="mb-6 text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Required Documents</h4>
                    <ul className="space-y-8">
                        {taxRevalidationDetails.documents.slice(0, 5).map((doc, i) => (
                            <li key={i} className="flex items-start gap-5 text-base text-slate-600 bg-white p-3 rounded-lg shadow-sm">
                                <FileText className="flex-shrink-0 w-4 h-4 mt-0.5 text-[#00695C]" />
                                {doc}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const ComplianceTaxForms = () => (
    <section id="compliance-tax-forms" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Transparency"
                title="Form 10BD & 10BE"
                description="Charitable Organizations must file Form 10BD electronically each financial year."
            />

            <h4 className="mb-8 text-xl font-bold text-center text-slate-800">Consequences of Non-filing Form 10BD</h4>
            <div className="grid gap-10 md:grid-cols-3">
                {form10BDConsequences.map((item, i) => (
                    <div key={i} className="p-8 border border-red-100 shadow-sm bg-red-50/50 rounded-xl hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 text-red-500">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="mb-2 text-xl font-bold text-slate-800">{item.title}</h4>
                        <p className="text-base font-medium text-slate-600 leading-relaxed">{item.penalty}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceSec8Annual = () => (
    <section id="compliance-sec8-annual" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Section 8"
                title="Annual Compliances"
                description="Strict annual compliances under the Companies Act, 2013 for Section 8 companies."
            />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {section8Compliances.map((compliance, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00695C]">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-700 text-lg">{compliance}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceWhyBizzfiling = () => (
    <section id="compliance-why-Bizzfiling" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Why Bizzfiling?"
                description="Expert lawyers and CAs to enable your seamless transition to fully compliant status."
            />

            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {ngoWhyBizzfiling.map((service, i) => {
                    const [title, detail] = service.includes(':') ? service.split(':').map(s => s.trim()) : [service.split('.')[0].trim(), service.split('.').slice(1).join('.').trim()];
                    const Icon = i % 5 === 0 ? Users : i % 5 === 1 ? Handshake : i % 5 === 2 ? Zap : i % 5 === 3 ? DollarSign : Lightbulb;
                    return (
                        <div key={i} className="flex items-start gap-5 p-8 border border-slate-100 shadow-sm bg-white rounded-xl hover:-translate-y-1 transition-transform">
                            <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-bold text-slate-800">{title}</h4>
                                <p className="text-base text-slate-600 leading-relaxed">{detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

const ComplianceFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="compliance-faqs-content" className="max-w-7xl mx-auto py-20 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Common Compliance Queries"
            description="Answers to frequent questions about NGO compliance complications."
        />

        <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((f, i) => (
                <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${faqOpen === i ? 'border-[#00695C] shadow-lg' : 'border-slate-200 hover:border-[#00695C]/50'}`}>
                    <button
                        className={`w-full flex justify-between items-center p-5 text-left transition-colors ${faqOpen === i ? 'bg-[#00695C] text-white' : 'bg-white text-slate-800'}`}
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    >
                        <span className="text-lg md:text-xl font-bold pr-8">{f.q}</span>
                        <ChevronDown
                            className={`w-5 h-5 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180 text-white" : "text-slate-400"}`}
                        />
                    </button>
                    <motion.div
                        initial={false}
                        animate={{ height: faqOpen === i ? "auto" : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="px-5 py-5 text-slate-600 bg-white text-base leading-relaxed border-t border-slate-100">
                            {f.a}
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    </section>
);


// --- MAIN COMPONENT ---
export default function NGOCompliancePage() {
    const [activeTab, setActiveTab] = useState(complianceTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = complianceTabs.map(tab => tab.id);

        const handleScroll = () => {
            let currentActiveTab = sectionIds[0];

            for (let i = 0; i < sectionIds.length; i++) {
                const sectionId = sectionIds[i];
                const section = document.getElementById(sectionId);

                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= SCROLL_OFFSET) {
                        currentActiveTab = sectionId;
                    }
                }
            }

            const isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
            if (isScrolledToBottom) {
                currentActiveTab = sectionIds[sectionIds.length - 1];
            }

            setActiveTab(prevActiveTab => {
                if (prevActiveTab !== currentActiveTab) {
                    return currentActiveTab;
                }
                return prevActiveTab;
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to handle smooth scrolling when a tab is clicked
    const handleTabClick = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - SCROLL_OFFSET,
                behavior: 'smooth'
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* === HERO SECTION (UPDATED PREMIUM DESIGN) === */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <img
                        src={BackgroundImageSrc}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>

                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

                        {/* Left Content */}
                        <div className="w-full lg:w-1/2 text-left space-y-8 flex flex-col items-start">
                            {/* Gold Seal Badge */}
                            <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#C59B4E] shadow-xl">
                                    <div className="absolute inset-1 rounded-full border border-[#C59B4E]/30"></div>
                                    <div className="text-center px-1">
                                        <div className="flex justify-center gap-0.5 mb-1.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="fill-[#C59B4E] text-[#C59B4E]" />)}
                                        </div>
                                        <span className="block text-[#C59B4E] font-serif font-bold text-[9px] lg:text-sm leading-tight uppercase tracking-wider mb-1">
                                            Legal<br />Services<br />In India
                                        </span>
                                        <div className="w-12 lg:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                                        <span className="block text-white text-[8px] lg:text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                                    NGO Compliance <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Services</span>
                                </h1>

                                <p className="text-lg md:text-xl text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Ensure 100% compliance for your NGO with expert legal guidance. We handle 12A, 80G, CSR-1, and annual filings efficiently.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Review of Annual Activities & Financials</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Filing of Income Tax Returns (ITR-7)</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Maintenance of Minutes Books & Statutory Registers</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Consultation on FCRA & CSR Compliance</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Audit Ready</span>
                                </div>
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Shield className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Risk Free</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Form Card */}
                        <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-4 md:p-8">
                                    <div className="text-center mb-4 md:mb-6">
                                        <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Get Started</h2>
                                        <p className="text-slate-500 text-sm md:text-sm px-2 leading-relaxed">
                                            Fill the form to start your compliance check.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="NGO Compliance" btnText="Check Compliance" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* === Main Content Tabs Navigation (Sticky) === */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-10 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
                        {complianceTabs.map((tab) => (
                            <li key={tab.id} className="flex-shrink-0">
                                <button
                                    className={`
                                        relative py-4 text-sm font-bold tracking-wide transition-all duration-200 border-b-[3px]
                                        ${activeTab === tab.id
                                            ? 'text-[#0F4C49] border-[#0F4C49]'
                                            : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}
                                    `}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick(tab.id);
                                    }}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* === All Tab Content Sections Rendered Sequentially === */}
            <ComplianceOverviewContent />
            <ComplianceDarpanSection />
            <ComplianceTaxRevalidation />
            <ComplianceTaxForms />
            <ComplianceSec8Annual />
            <ComplianceWhyBizzfiling />
            <ComplianceFAQsContent faqs={ngoComplianceFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}