import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Quicker Approval/Efficiency
    Briefcase, // For Legal Documentation/NGO Governance
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Benefits
    FileText, // For document/Form 10A/10G
    Scale, // For Legal Compliance/Tax Immunity
    Handshake, // For Government Support/Contributors
    TrendingUp, // For Tax Exemption/Funding
    Lightbulb, // For Expert Guidance/Clarity
    Users, // For Trusts/Societies/Companies
    DollarSign, // For Tax Benefits/Income
    Clock, // For Timely Filing/5 Days
    Landmark, // For Income Tax Department/Commissioner
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/80g_hero_bg.png"; // Specific background

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
    <div className={`mb-12 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-[10px] uppercase tracking-wider mb-2 border border-[#B2DFDB]">
            {subtitle}
        </span>
        <h3 className="mb-3 text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {title}
        </h3>
        <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
            {description}
        </p>
    </div>
);

// --- 80G & 12A REGISTRATION STATIC DATA DEFINITIONS ---

const taxExemptionTabs = [
    { id: 'tax-exemption-overview', label: 'Overview' },
    { id: 'tax-exemption-benefits', label: 'Benefits' },
    { id: 'tax-exemption-documents', label: 'Documents Required' },
    { id: 'tax-exemption-procedure', label: 'Procedure' },
    { id: 'tax-exemption-why', label: 'Why Bizzfiling' },
    { id: 'tax-exemption-faqs', label: 'FAQs' },
];

const exemptionBenefits = [
    { title: "Tax Exemption for NGO", icon: DollarSign, detail: "The NGO/society's additional income would be exempt from paying taxes by providing the 12A certificate." },
    { title: "More Contributors", icon: Users, detail: "Improves the organization's reputation, making donors eligible for tax exemptions, thus encouraging more donations." },
    { title: "Government Support", icon: Landmark, detail: "NGOs and societies with these certificates are more likely to receive various grants and related funding from the government." },
    { title: "Proof of Existence", icon: Scale, detail: "Serves as a legally binding declaration of the entity's registered status, aiding in securing loans or grants." },
    { title: "Donor Tax Benefit", icon: TrendingUp, detail: "Helps donors reduce their tax obligations, providing a set amount of tax immunity to the appropriate government agencies." },
];

const docs80G = [
    "Trust deed (for a trust) or Memorandum of Association (MOA) (for society/Section 8 Company).",
    "Registration certificate (for society/Section 8 company).",
    "Certificate of no objection from the property proprietor where the registered department is located.",
    "Form 10G (Application form).",
    "PAN document of the NGO.",
    "Copy of a utility bill (electricity or water) or property tax receipt.",
    "The last three years' books of accounts and income tax returns online.",
    "A list of welfare initiatives implemented and a three-year progress report.",
    "Latest business documents.",
];

const docs12A = [
    "Form 10A (Application form).",
    "Trust deed / Memorandum of Association (MOA) / AOA of the company.",
    "Certificate of incorporation / Registration certificate.",
    "Legal ID proof of the achievement of the Trust or NGO.",
    "The Trust's three-year bank account statement.",
    "PAN of the firm.",
];

const procedure80G = [
    "Bring the essential paperwork and a request for an 80G certificate to the Commissioner of Income Tax (Exemption) in the region under the entity's council.",
    "The Income Tax agency conducts an on-site examination following the submission of the form and necessary paperwork.",
    "If documentation appears insufficient or something is missing, officials may request more documents or proof.",
    "The Commissioner issues the institution with an 80G certificate after thoroughly verifying the paperwork.",
];

const procedure12A = [
    "File an application in the Form 10A in accord with the jurisdictional Commissioner of Income Tax's instructions.",
    "After receiving the Form and verifying documentation, the Commissioner substantiates the legitimacy of the organisation's activity.",
    "The Commissioner has the right to request any additional paperwork or information deemed appropriate.",
    "The Commissioner provides a written declaration granting 12A registration based on the reasonable report.",
    "The applicant is given a fair opportunity to be heard if the application is rejected because the Commissioner is not satisfied.",
];

const whyBizzfiling = [
    "Clear Insights: Our team of experts provides clear insights about Section 80G registration and certification.",
    "Compliance Guarantee: We help register your entity without breaching any compliance, ensuring smooth processing.",
    "Query Resolution: Book a slot with our registration experts right away to resolve all your queries and kickstart the process.",
    "Error-Free Filing: Meticulous preparation and filing of documentation to achieve accurate submission in just 5 days.",
];

const exemptionFAQs = [
    { q: "What is an 80G certificate?", a: "It supports financial contributions to certain non-profit organizations. Donors can reduce the donated amount from their total income, resulting in a tax immunity, provided they furnish the donation receipt." },
    { q: "Why is 12A registration necessary?", a: "NGOs receive income, and without Section 12A registration, they must pay tax at formal rates on their surplus income. 12A provides a one-time tax exemption on this additional income." },
    { q: "Can we combine 12A and 80G applications?", a: "Yes, you can file both applications simultaneously. Having 12A registration is a prerequisite for obtaining 80G certification." },
    { q: "Are 12A and 80G the same?", a: "No. **12A** exempts the **NGO's income** from taxation. **80G** allows **donors** to claim a tax deduction on their donations to the NGO." },
    { q: "Who is qualified to register under 12A?", a: "Trusts, NGOs, and Section 8 Companies that engage in charitable and non-profit endeavors are eligible to apply for 12A registration." },
];

// --- REUSABLE COMPONENTS ---

const ReviewBox = ({ score, reviews, source }) => (
    <div className="bg-white/10 rounded-xlshadow-lg w-full flex flex-col items-center justify-center border border-white/20">
        <div className="text-yellow-400 flex items-center mb-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
        </div>
        <p className="text-xs font-semibold text-white/80">{source}</p>
        <p className="mt-1 font-bold text-xl text-white">{score}</p>
        <p className="text-xs text-white/90">{reviews}</p>
    </div>
);

const DetailItem = ({ title, description, icon: Icon }) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
        <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
        <div>
            <h4 className="font-semibold text-lg text-gray-800 mb-1">{title}</h4>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

const DocumentBox = ({ document, requiredFor }) => (
    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg shadow-md border-l-4 border-red-500">
        <FileText className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
        <div>
            <p className="text-gray-800 font-medium">{document}</p>
            <p className="text-xs text-gray-600 font-medium">{requiredFor}</p>
        </div>
    </div>
);

const ProcedureStep = ({ stepNumber, step }) => (
    <li className="flex items-start gap-4">
        <div className="bg-[#022B50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            {stepNumber}
        </div>
        <span className="text-gray-700 text-lg">{step}</span>
    </li>
);

// --- TAB CONTENT COMPONENTS (80G & 12A Registration Content) ---

const TaxExemptionOverview = () => (
    <section id="tax-exemption-overview" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="The Basics of Registration"
                description="Vital for any non-profit entity seeking financial legitimacy and tax advantages in India."
            />

            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-all">
                    <h4 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg text-[#00695C]"><DollarSign className="w-6 h-6" /></div>
                        What Is an 80G Certificate?
                    </h4>
                    <p className="text-slate-600 leading-relaxed">The 80G certificate benefits the **donor**. When a person donates to an 80G-certified charity, they are allowed to **reduce that amount from their total taxable income**, resulting in tax immunity.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100/50 hover:shadow-md transition-all">
                    <h4 className="font-bold text-xl text-slate-800 mb-4 flex items-center gap-3">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg text-[#00695C]"><TrendingUp className="w-6 h-6" /></div>
                        About 12A Registration
                    </h4>
                    <p className="text-slate-600 leading-relaxed">The 12A registration benefits the **NGO itself**. Entities with 12A registration are **free from paying tax on their surplus or additional income**, which must be reinvested for charitable purposes.</p>
                </div>
            </div>
        </div>
    </section>
);

const TaxExemptionBenefits = () => (
    <section id="tax-exemption-benefits" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Benefits"
                title="Key Advantages"
                description="Unlock significant benefits for your organization and donors."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exemptionBenefits.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-[#E0F2F1] flex items-center justify-center mb-6 group-hover:bg-[#B2DFDB] transition-colors">
                            <item.icon className="w-6 h-6 text-[#00695C]" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TaxExemptionDocuments = () => {
    // Separate documents for clarity
    const commonDocs = [
        "Trust deed / Memorandum of Association (MOA)",
        "Registration certificate (for Section 8 Company/Societies)",
        "PAN of the firm.",
    ];

    const specificDocs = [
        { doc: "Form 10G and Details of Donors", req: "Mandatory for 80G application." },
        { doc: "Form 10A", req: "Mandatory for 12A application." },
        { doc: "Certificate of no objection from the proprietor of the property", req: "Required for 80G application." },
        { doc: "The last three years' books of accounts and ITR", req: "Required for 80G application." },
        { doc: "The Trust's three-year bank account statement", req: "Required for 12A application." },
        { doc: "A list of welfare initiatives implemented and a three-year progress report", req: "Required for 80G application." },
    ];

    return (
        <section id="tax-exemption-documents" className="py-20 scroll-mt-24 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <SectionHeading
                    subtitle="Documents"
                    title="Required Documents"
                    description="Prepare these essential documents for a smooth registration process."
                />

                <h4 className="text-xl font-bold mb-6 text-slate-800">Common and Mandatory Documents</h4>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {commonDocs.map((doc, i) => (
                        <div key={i} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-100">
                            <FileText className="w-5 h-5 text-[#00695C] flex-shrink-0 mt-0.5" />
                            <p className="text-slate-700 text-sm font-medium">{doc}</p>
                        </div>
                    ))}
                </div>

                <h4 className="text-xl font-bold mb-6 text-slate-800">Specific Documents by Requirement</h4>
                <div className="grid md:grid-cols-2 gap-6">
                    {specificDocs.map((doc, i) => (
                        <div key={i} className="flex items-start gap-3 p-5 bg-slate-50 rounded-xl border border-slate-100">
                            <FileText className="w-5 h-5 text-[#00695C] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-slate-800 text-sm font-bold mb-1">{doc.doc}</p>
                                <p className="text-xs text-slate-500">{doc.req}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TaxExemptionProcedure = () => (
    <section id="tax-exemption-procedure" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Registration Procedure"
                description="A step-by-step guide to obtaining your 80G and 12A certificates."
            />

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText className="w-5 h-5" /></div>
                        Procedure for 80G
                    </h4>
                    <ol className="space-y-6 relative border-l-2 border-slate-100 ml-3">
                        {procedure80G.map((step, i) => (
                            <li key={i} className="ml-6 relative">
                                <span className="absolute -left-[31px] top-0 flex items-center justify-center w-6 h-6 bg-white border-2 border-[#00695C] text-[#00695C] rounded-full text-xs font-bold">
                                    {i + 1}
                                </span>
                                <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText className="w-5 h-5" /></div>
                        Procedure for 12A
                    </h4>
                    <ol className="space-y-6 relative border-l-2 border-slate-100 ml-3">
                        {procedure12A.map((step, i) => (
                            <li key={i} className="ml-6 relative">
                                <span className="absolute -left-[31px] top-0 flex items-center justify-center w-6 h-6 bg-white border-2 border-[#00695C] text-[#00695C] rounded-full text-xs font-bold">
                                    {i + 1}
                                </span>
                                <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    </section>
);

const TaxExemptionWhyBizzfiling = () => (
    <section id="tax-exemption-why" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Why Bizzfiling?"
                description="Expert guidance for a seamless registration experience."
            />

            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {whyBizzfiling.map((service, i) => {
                    const [title, detail] = service.split(':').map(s => s.trim());
                    const Icon = i % 4 === 0 ? Lightbulb : i % 4 === 1 ? CheckCircle : i % 4 === 2 ? Handshake : Zap;
                    return (
                        <div key={i} className="p-6 bg-slate-50 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4 hover:-translate-y-1 transition-transform">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#00695C]">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-800 mb-2">{title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 bg-[#E0F2F1] rounded-2xl border border-[#B2DFDB] text-center">
                <p className="text-lg text-[#00695C] font-semibold">Ready to get started? Book a slot with our experts today.</p>
            </div>
        </div>
    </section>
);

const TaxExemptionFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="tax-exemption-faqs" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
                subtitle="FAQ"
                title="Frequently Asked Questions"
                description="Find answers to common queries about 80G and 12A registration."
            />

            <div className="space-y-4">
                {faqs.map((f, i) => (
                    <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${faqOpen === i ? 'border-[#00695C] shadow-lg' : 'border-slate-200 hover:border-[#00695C]/50'}`}>
                        <button
                            className={`w-full flex justify-between items-center p-5 text-left transition-colors ${faqOpen === i ? 'bg-[#00695C] text-white' : 'bg-white text-slate-800'}`}
                            onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                        >
                            <span className="font-bold text-base md:text-lg pr-8">{f.q}</span>
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
                            <div className="px-5 py-5 text-slate-600 bg-white text-sm leading-relaxed border-t border-slate-100">
                                {f.a}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);


// --- MAIN COMPONENT ---
export default function TaxExemptionRegistrationPage() {
    const [activeTab, setActiveTab] = useState(taxExemptionTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = taxExemptionTabs.map(tab => tab.id);

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
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

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
                                        <span className="block text-[#C59B4E] font-serif font-bold text-[9px] lg:text-[10px] leading-tight uppercase tracking-wider mb-1">
                                            Legal<br />Services<br />In India
                                        </span>
                                        <div className="w-12 lg:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                                        <span className="block text-white text-[8px] lg:text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                                    Section 80G - 12A <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>

                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Secure **tax exemptions** and gain donor trust with 12A & 80G registration. Fast, secure, and fully guided process.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Eligibility Check for Tax Exemption</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Preparation of Projected Balance Sheets</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Filing of Form 10A / 10AB with Income Tax Dept</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Resolution of Queries raised by CIT</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Verified Experts</span>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Fast Approval</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Form Card */}
                        <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-4 md:p-8">
                                    <div className="text-center mb-4 md:mb-6">
                                        <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Get Started</h2>
                                        <p className="text-slate-500 text-[10px] md:text-xs px-2 leading-relaxed">
                                            Fill the details below to register your NGO.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Section 80G - 12A Registration" btnText="Register Now" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* === Main Content Tabs Navigation (Sticky) === */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
                        {taxExemptionTabs.map((tab) => (
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
            <TaxExemptionOverview />
            <TaxExemptionBenefits />
            <TaxExemptionDocuments />
            <TaxExemptionProcedure />
            <TaxExemptionWhyBizzfiling />
            <TaxExemptionFAQsContent faqs={exemptionFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}