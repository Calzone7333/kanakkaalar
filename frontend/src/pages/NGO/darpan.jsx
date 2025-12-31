import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Credibility/Trust/Fast Service
    Briefcase, // For Compliance/Documentation
    ArrowRight,
    Star,
    CheckCircle, // For Eligibility/Benefits/Checklist
    FileText, // For document/MOA/Trust Deed
    Scale, // For Transparency/Legal Compliance
    Handshake, // For Government Grants/Coordination
    TrendingUp, // For Funding/Growth
    Lightbulb, // For Expert Guidance/Updates
    Users, // For Trusts/Societies/Companies
    DollarSign, // For Grants/Financial Support
    Clock, // For Timely Delivery
    Landmark,
    BookOpen,
    MapPin,
    Globe,
    AlertTriangle // For NITI Aayog/Government
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/darpan_hero_bg.png"; // Specific background

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

// --- NGO DARPAN REGISTRATION STATIC DATA DEFINITIONS ---

const darpanTabs = [
    { id: 'darpan-overview-content', label: 'Overview' },
    { id: 'darpan-eligibility-content', label: 'Eligibility' },
    { id: 'darpan-benefits-content', label: 'Benefits' },
    { id: 'darpan-documents-content', label: 'Documents' },
    { id: 'darpan-process-content', label: 'Process' },
    { id: 'darpan-issues-content', label: 'Common Issues' },
    { id: 'darpan-why-Bizzfiling', label: 'Why Choose Bizzfiling' },
    { id: 'darpan-faqs-content', label: "FAQs" },
];

const darpanEligibleEntities = [
    { title: "Trusts", detail: "Registered under the Indian Trusts Act.", icon: Landmark },
    { title: "Societies", detail: "Registered under the Societies Registration Act.", icon: Users },
    { title: "Section 8 Companies", detail: "Registered under the Indian Companies Act.", icon: Briefcase },
];

const darpanBenefits = [
    { title: "Eligibility for Government Grants", icon: DollarSign, detail: "NGOs can apply for government grants from various ministries and departments." },
    { title: "Official Recognition & Visibility", icon: Landmark, detail: "Registration gives your NGO visibility on the official NGO Darpan website, enhancing credibility." },
    { title: "Access to Government Schemes", icon: Handshake, detail: "Only registered NGOs on the portal can access and apply for specific government schemes." },
    { title: "Timely Updates from Ministries", icon: Lightbulb, detail: "Receive important updates and notifications directly from relevant government agencies." },
    { title: "Easier Documentation & Compliance", icon: FileText, detail: "Pre-verified details simplify future processes like FCRA information filing." },
    { title: "Enhanced Credibility & Transparency", icon: Zap, detail: "Increases trust with donors, partners, and the public due to government verification." },
];

const darpanDocuments = [
    { name: "NGO PAN Card", description: "Mandatory for verification.", icon: FileText },
    { name: "Registration Certificate", description: "From Trust Act, Societies Act, or Companies Act.", icon: FileText },
    { name: "MOA or Trust Deed", description: "Foundational document of NGO.", icon: BookOpen },
    { name: "Rules and Regulations", description: "Applicable for Societies and Section 8 Companies.", icon: BookOpen },
    { name: "Governing Body Details", description: "Including name, mobile number, email, Aadhaar card.", icon: Users },
    { name: "Contact Details", description: "Address, mobile number, email of the NGO.", icon: MapPin },
    { name: "FCRA Certificate (if applicable)", description: "For NGOs receiving foreign contributions.", icon: Globe },
    { name: "Annual Financial Statements", description: "For past 3 years, if applicable.", icon: DollarSign },
];

const darpanProcessSteps = [
    "Visit the NGO Darpan Portal: Go to the official NGO Darpan website and set up a login ID.",
    "Enter Organizational Details: Provide NGO name, registration number, address, etc.",
    "Upload Required Documents: Upload necessary documents (as listed above) in the correct format.",
    "Enter Governing Body Details: Include PAN, Aadhaar, and mobile numbers of all members (PAN and Aadhaar data must exactly match official records).",
    "Submit the Application: Once details are reviewed, submit for verification by NITI Aayog.",
    "Receive Darpan ID & Certificate: On approval, a unique Darpan ID is issued, and the certificate is available for download.",
];

const darpanCommonIssues = [
    { title: "Document Mismatch", issue: "Differences in PAN/Aadhaar vs. registered details cause delays.", help: "Bizzfiling pre-verifies documents to avoid mismatch.", icon: Scale },
    { title: "Verification Delays", issue: "Caused by incorrect entries or missing information.", help: "Our experts ensure accurate data entry and prompt follow-up.", icon: Clock },
    { title: "Rejected Applications", issue: "Due to incomplete forms or invalid documents.", help: "We assist with end-to-end review before submission.", icon: AlertTriangle },
    { title: "Technical Glitches", issue: "Occasional server errors or bugs on the portal.", help: "Our team coordinates with portal administrators for resolution.", icon: Lightbulb },
];

const darpanWhyBizzfiling = [
    { title: "Dedicated Support", detail: "End-to-end registration guidance from initial query to certificate issuance.", icon: Handshake },
    { title: "Accurate Documentation", detail: "Full assistance with all NGO Darpan registration documents, ensuring accurate and compliant uploads.", icon: Briefcase },
    { title: "Timely Delivery", detail: "Quick turnaround with tracking updates to ensure the fastest possible registration.", icon: Clock },
    { title: "100% Compliance", detail: "Ensures smooth approvals by adhering strictly to NITI Aayog's guidelines.", icon: CheckCircle },
    { title: "Trusted Service", detail: "Trusted by thousands of NGOs and professionals (Over 1 Lakh Clients Served).", icon: Zap },
];

const darpanFAQs = [
    { q: "Is NGO Darpan registration required for government grants?", a: "Yes, NGO Darpan registration is generally mandatory to apply for government grants and financial assistance from various ministries and departments." },
    { q: "How can I get my NGO Darpan certificate online?", a: "After successful registration, you log in to the official Darpan portal, navigate to the 'Certificates' section on your dashboard, and click 'Download NGO Darpan Certificate' as a PDF." },
    { q: "Can a Trust or Section 8 Company apply for Darpan registration?", a: "Yes, Trusts, Societies, and Section 8 Companies (registered under the respective Acts) are the eligible entities to apply for Darpan registration." },
    { q: "What is the purpose of getting a Darpan ID for NGOs?", a: "The Darpan ID is a unique identification number that provides official recognition and credibility, and simplifies interactions with various government departments and ministries." },
    { q: "Can I register on the Darpan portal without a PAN card?", a: "No, a valid PAN card of the NGO is mandatory for verification and successful Darpan registration." },
    { q: "What should I do if my NGO Darpan application is rejected?", a: "If rejected, you should review the reason provided by NITI Aayog, correct the errors (usually document mismatch or missing details), and resubmit the application with the corrected information." },
];

// --- REUSABLE COMPONENTS ---

// Reusing components from previous designs

const ReviewBox = ({ score, reviews, source }) => (
    <div className="flex flex-col items-center justify-center w-full p-3 border shadow-lg bg-white/10 rounded-xl border-white/20">
        <div className="flex items-center mb-1 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
        </div>
        <p className="text-xs font-semibold text-white/80">{source}</p>
        <p className="mt-1 text-xl font-bold text-white">{score}</p>
        <p className="text-xs text-white/90">{reviews}</p>
    </div>
);

const DetailItem = ({ title, description, icon: Icon }) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
        <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
        <div>
            <h4 className="mb-1 text-lg font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

const FeatureBox = ({ title, detail, icon: Icon }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Icon className="w-6 h-6 mb-2 text-amber-500" />
        <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{detail}</p>
    </div>
);


// --- TAB CONTENT COMPONENTS (NGO Darpan Registration Content) ---

const DarpanOverviewContent = () => (
    <section id="darpan-overview-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="NGO Darpan Registration"
                description="Enhancing transparency and facilitating government interaction for NGOs."
            />

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <p>
                        **NGO Darpan registration** is a highly beneficial step for non-governmental organizations (NGOs) in India. Managed by **NITI Aayog**, the portal offers a national database of verified NGOs, significantly enhancing **transparency** between the voluntary sector and the government.
                    </p>
                    <p>
                        Through Darpan registration, NGOs receive a unique **Darpan ID**, which is an **essential credential** for interactions with various government departments and ministries, especially when applying for grants and schemes.
                    </p>
                </div>
                <div className="bg-[#F8FDFC] p-8 rounded-2xl border border-[#E0F2F1]">
                    <h4 className="text-xl font-bold text-slate-800 mb-4">What is the Portal?</h4>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        The NGO Darpan portal is a **single-window system** developed by NITI Aayog. It simplifies registration and ensures improved transparency and accountability for accessing:
                    </p>
                    <ul className="space-y-3">
                        {["Government Schemes", "Financial Support", "Multiple Grants"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-[#00695C]" />
                                <span className="text-slate-700 font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const DarpanEligibilityContent = () => (
    <section id="darpan-eligibility-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Eligibility"
                title="Who is Eligible?"
                description="Entities eligible to apply for NGO Darpan registration."
            />

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                {darpanEligibleEntities.map((entity, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all text-center">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center mb-4">
                            <entity.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">{entity.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{entity.detail}</p>
                    </div>
                ))}
            </div>

            <div className="max-w-3xl mx-auto p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-3 text-orange-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Note: A valid PAN card of the NGO is **mandatory** for successful registration and verification on the portal.</p>
            </div>
        </div>
    </section>
);

const DarpanBenefitsContent = () => (
    <section id="darpan-benefits-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Benefits"
                title="Why Register?"
                description="Strategic advantages of obtaining a Darpan ID."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {darpanBenefits.map((benefit, i) => (
                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-xl shadow-sm hover:border-[#00695C] transition-all group">
                        <benefit.icon className="w-8 h-8 mb-4 text-[#00695C] group-hover:scale-110 transition-transform" />
                        <h4 className="mb-2 text-lg font-bold text-slate-800">{benefit.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{benefit.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DarpanDocumentsContent = () => (
    <section id="darpan-documents-content" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Documents"
                title="Required Documentation"
                description="Ensure accurate and verified documents for a quick application."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {darpanDocuments.map((doc, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg text-[#00695C] flex-shrink-0">
                            <doc.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm mb-1">{doc.name}</p>
                            <p className="text-xs text-slate-500 leading-relaxed">{doc.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DarpanProcessContent = () => (
    <section id="darpan-process-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Registration Process"
                description="Step-by-step guide to obtaining your Darpan ID & Certificate."
            />

            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-8">Step-by-Step Procedure</h4>
                    <ol className="relative border-l border-slate-200 space-y-8 ml-3">
                        {darpanProcessSteps.map((step, i) => (
                            <li key={i} className="ml-6">
                                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-[#00695C] rounded-full ring-4 ring-white">
                                    <span className="text-white text-xs font-bold">{i + 1}</span>
                                </span>
                                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200 h-fit">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">How to Download Certificate?</h4>
                    <ul className="space-y-6">
                        <li className="flex items-start gap-4">
                            <ArrowRight className="w-5 h-5 text-[#00695C] mt-1 flex-shrink-0" />
                            <span className="text-slate-700">Log in to the official NGO Darpan portal.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <ArrowRight className="w-5 h-5 text-[#00695C] mt-1 flex-shrink-0" />
                            <span className="text-slate-700">Click on the profile dashboard, then navigate to the "Certificates" section.</span>
                        </li>
                        <li className="flex items-start gap-4">
                            <ArrowRight className="w-5 h-5 text-[#00695C] mt-1 flex-shrink-0" />
                            <span className="text-slate-700">Click "Download NGO Darpan Certificate." The certificate will be available as a downloadable PDF.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const DarpanIssuesContent = () => (
    <section id="darpan-issues-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Support"
                title="Common Issues & Solutions"
                description="We help preempt and resolve technical errors and data mismatches."
            />

            <div className="grid gap-6 md:grid-cols-2">
                {darpanCommonIssues.map((issue, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 shadow-sm rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                <issue.icon className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">{issue.title}</h4>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600"><span className="font-semibold text-red-600">Issue:</span> {issue.issue}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold text-[#00695C]">Solution:</span> {issue.help}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DarpanWhyBizzfiling = () => (
    <section id="darpan-why-Bizzfiling" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Why Bizzfiling?"
                description="Comprehensive support for a successful application and certification."
            />

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {darpanWhyBizzfiling.map((service, i) => {
                    const Icon = service.icon || CheckCircle;
                    const [title, detail] = service.title ? [service.title, service.detail] : service.detail.split(':').map(s => s.trim());

                    let CurrentIcon;
                    if (service.title === "Dedicated Support") CurrentIcon = Handshake;
                    else if (service.title === "Accurate Documentation") CurrentIcon = Briefcase;
                    else if (service.title === "Timely Delivery") CurrentIcon = Clock;
                    else if (service.title === "100% Compliance") CurrentIcon = CheckCircle;
                    else if (service.title === "Trusted Service") CurrentIcon = Zap;
                    else CurrentIcon = CheckCircle;

                    return (
                        <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-100 shadow-sm rounded-xl hover:-translate-y-1 transition-transform">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00695C] flex-shrink-0">
                                <CurrentIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="mb-2 text-lg font-bold text-slate-800">{title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{detail}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </section>
);

const DarpanFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="darpan-faqs-content" className="max-w-7xl mx-auto py-20 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Find answers to common queries about NGO Darpan."
        />

        <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((f, i) => (
                <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${faqOpen === i ? 'border-[#00695C] shadow-lg' : 'border-slate-200 hover:border-[#00695C]/50'}`}>
                    <button
                        className={`w-full flex justify-between items-center p-5 text-left transition-colors ${faqOpen === i ? 'bg-[#00695C] text-white' : 'bg-white text-slate-800'}`}
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    >
                        <span className="text-base md:text-lg font-bold pr-8">{f.q}</span>
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
    </section>
);


// --- MAIN COMPONENT ---
export default function NGODarpanRegistrationPage() {
    const [activeTab, setActiveTab] = useState(darpanTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = darpanTabs.map(tab => tab.id);

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
                                    Darpan <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>

                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert-assisted **100% online** NGO Darpan registration process. Trusted by 5000+ trusts and NGOs for **fast and reliable service**.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Profile Creation on NITI Aayog Portal</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Linking of PAN & Aadhaar of Key Functionaries</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Generation of Unique NGO Darpan ID</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Grant Eligibility Mapping</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Verified NGOs</span>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Fast Process</span>
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
                                            Register your NGO with NITI Aayog today.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Darpan Registration" btnText="Register Now" />
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
                        {darpanTabs.map((tab) => (
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
            <DarpanOverviewContent />
            <DarpanEligibilityContent />
            <DarpanBenefitsContent />
            <DarpanDocumentsContent />
            <DarpanProcessContent />
            <DarpanIssuesContent />
            <DarpanWhyBizzfiling />
            <DarpanFAQsContent faqs={darpanFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}