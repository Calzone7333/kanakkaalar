import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Efficiency/Clarity
    Briefcase, // For MCA/Corporate/Compliance
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Benefits/Compliance
    FileText, // For document/Form CSR-1
    Scale, // For Legal Clarity/Compliance
    Handshake, // For Collaboration/Partnerships
    TrendingUp, // For Funding/Resources
    Lightbulb, // For Expert Guidance/Updates
    Users, // For Entities/Governing Body
    DollarSign, // For Cost/Funding
    Clock, // For Timeline/Efficiency
    Landmark, // For MCA Portal/Government
    BookOpen, // For Law Governing
    Shield, // For Trust/Accountability
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/csr_hero_bg.png"; // Specific background

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

// --- CSR-1 REGISTRATION STATIC DATA DEFINITIONS ---

const csr1Tabs = [
    { id: 'csr1-overview-content', label: 'Overview' },
    { id: 'csr1-eligibility-content', label: 'Eligibility' },
    { id: 'csr1-documents-content', label: 'Documents & Types' },
    { id: 'csr1-process-content', label: 'Registration Process' },
    { id: 'csr1-law-purpose-content', label: 'Law & Benefits' },
    { id: 'csr1-status-fees-content', label: 'Status & Fees' },
    { id: 'csr1-faqs-content', label: "FAQs" },
];

const eligibilityCriteria = [
    "Entity type: Must be a Section 8 company, public trust, or society.",
    "Registration: Must be registered under Section 12A and 80G of the Income Tax Act.",
    "Track record: A proven track record of at least 3 years in undertaking relevant social, environmental, or developmental activities is advisable.",
    "Governance: Must have a sound governance structure with transparent financial management practices.",
    "Compliance: Must be compliant with all applicable laws and regulations.",
];

const eligibleNGOTypes = [
    { title: "Section 8 Companies", detail: "Incorporated under the Companies Act, 2013, with charitable or non-profit objectives.", icon: Briefcase },
    { title: "Public Trusts", detail: "Registered under the Indian Trusts Act, 1882, or any other relevant law for public charitable purposes.", icon: Landmark },
    { title: "Societies (12A & 80G)", detail: "Registered under the Societies Registration Act, 1860, and must have received Income Tax exemption under Section 12A and 80G.", icon: Scale },
];

const csr1Documents = [
    { title: "Registration Certificate", detail: "Copy of the entity's registration certificate (MoA, Trust Deed, etc.).", icon: FileText },
    { title: "PAN Card", detail: "Copy of the entity's PAN card.", icon: FileText },
    { title: "12A and 80G Certificates", detail: "Copies of the Income Tax exemption certificates (if applicable).", icon: TrendingUp },
    { title: "NGO Darpan ID", detail: "If the entity is registered on the NGO Darpan portal.", icon: Landmark },
    { title: "Digital Signature Certificate (DSC)", detail: "DSC of the authorized person signing the form, along with their PAN card.", icon: Zap },
    { title: "Resolution Copy", detail: "Copy of the resolution authorizing the person to sign the form, along with the resolution number and date.", icon: Briefcase },
];

const csr1Contents = [
    "Part A - Basic Information: Entity Name, State of Registration, Contact Details, Authorized Person Details, Registration Number, PAN, Website, Date of Registration, Address, Names of Directors/Trustees/CEO/Chairperson.",
    "Part B - Subsidiary and Other Entities (if applicable): Details of subsidiaries and other entities included in CSR activities.",
    "Part C - Certification: Declaration by authorized person and Certificate by practising professional (CA, CS, or Cost Accountant).",
];

const csr1FilingProcess = [
    "Access the MCA Portal: Visit the Ministry of Corporate Affairs (MCA) portal and download eForm CSR-1.",
    "Attach Documents: Gather and attach all mandatory documents (Registration certificate, PAN, 12A/80G, DSC, Resolution).",
    "Fill the Form: Complete Part A (Basic Info) and Part B (Subsidiaries, if applicable).",
    "Obtain Verification: Get the form digitally verified by a practising professional (CA, CS, or Cost Accountant).",
    "Upload and Pay: Upload the completed and verified form to the MCA portal and pay the applicable filing fee online.",
    "Track Status: Monitor the status of your application on the MCA portal until the registration certificate is issued.",
];

const csr1Benefits = [
    { title: "Access to CSR Funds", icon: TrendingUp, detail: "Qualify to receive CSR funding from eligible companies, expanding resources for social impact." },
    { title: "Transparency and Accountability", icon: Shield, detail: "The filing ensures transparency in the use of CSR funds, building trust with donors and stakeholders." },
    { title: "Credibility Enhancement", icon: Zap, detail: "Signals commitment to responsible social practices, boosting the NGO's credibility and recognition." },
    { title: "Collaboration Opportunities", icon: Handshake, detail: "Facilitates strategic partnerships with companies for effective CSR project implementation." },
    { title: "Compliance with Regulations", icon: Scale, detail: "Demonstrates adherence to legal requirements, minimizing risks of non-compliance and penalties." },
];

const csr1Law = [
    { title: "Companies Act, 2013 (Section 135)", detail: "Requires eligible companies to engage in CSR activities and regulates the registration process for CSR-1.", icon: BookOpen },
    { title: "Companies (CSR Policy) Rules, 2014", detail: "Provides detailed guidelines for CSR activities, eligible entities, and registration procedures.", icon: BookOpen },
];

const csr1FAQs = [
    { q: "Who needs to file Form CSR-1?", a: "Form CSR-1 is mandatory for all entities seeking CSR funding: Section 8 companies, public trusts, and societies registered under Section 12A and 80G of the Income Tax Act." },
    { q: "When is the deadline for submitting Form CSR-1?", a: "Form CSR-1 is a one-time registration, not an annual return. It must be filed before undertaking any CSR activity to receive funding from an eligible company." },
    { q: "What are the key benefits of ensuring compliance with Form CSR-1 filing requirements?", a: "The key benefits are **access to corporate CSR funds**, enhanced **transparency and accountability**, and improved **credibility** among corporate partners." },
    { q: "How often is Form CSR-1 required to be filed?", a: "Form CSR-1 is a **one-time** registration required to obtain the unique CSR registration number." },
    { q: "Are there any penalties for errors or inaccuracies in CSR-1 filings?", a: "While Form CSR-1 itself is a filing for registration, providing inaccurate information can lead to rejection or penalty if found misleading later, as all filings are subject to MCA scrutiny." },
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

const FeatureBox = ({ title, detail, icon: Icon }) => (
    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Icon className="w-6 h-6 mb-2 text-amber-500" />
        <h4 className="mb-1 text-xl font-bold text-gray-800">{title}</h4>
        <p className="text-base text-gray-600">{detail}</p>
    </div>
);

// --- TAB CONTENT COMPONENTS (CSR-1 Registration Content) ---

const CSR1OverviewContent = () => (
    <section id="csr1-overview-content" className="py-12 md:py-16 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="What is CSR-1 Filing?"
                description="A mandatory mechanism for entities seeking CSR funding to ensure transparency and accountability."
            />

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                    <p className="text-slate-600 leading-relaxed text-lg mb-6">
                        The **CSR-1 Registration** mechanism, introduced by the **Ministry of Corporate Affairs (MCA)**, is mandatory for entities seeking to undertake CSR activities and **receive funding from eligible companies**. This process formalizes and regulates CSR efforts in India.
                    </p>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Filing the CSR-1 form is the crucial step to demonstrate how **CSR funding is managed** and how social development activities are organized.
                    </p>
                </div>
                <div className="bg-[#F8FDFC] p-8 rounded-2xl border border-[#E0F2F1]">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 border-b pb-4 border-slate-200">Applicability Checklist</h4>
                    <ul className="space-y-8">
                        {["Section 8 Companies", "Public Trusts", "Registered Societies (12A & 80G)"].map((item, i) => (
                            <li key={i} className="flex items-center gap-5">
                                <CheckCircle className="w-5 h-5 text-[#00695C]" />
                                <span className="text-slate-700 font-medium text-lg">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-sm text-slate-400 font-medium bg-slate-100 p-3 rounded-lg">
                        * Note: Not applicable to individual beneficiaries, government entities, or foreign organizations.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const CSR1EligibilityContent = () => (
    <section id="csr1-eligibility-content" className="py-12 md:py-16 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Eligibility"
                title="Who Can Register?"
                description="Specific criteria to ensure legal compliance and activity integrity."
            />

            <div className="grid gap-10 md:grid-cols-2">
                {eligibilityCriteria.map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-base font-medium text-slate-700 leading-relaxed">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CSR1DocumentsContent = () => (
    <section id="csr1-documents-content" className="py-12 md:py-16 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Documents"
                title="Required Documentation"
                description="Essential documents needed for filing Form CSR-1."
            />

            <h4 className="mb-6 text-xl font-bold text-slate-800">Documents Required</h4>
            <div className="grid gap-10 mb-16 md:grid-cols-2 lg:grid-cols-3">
                {csr1Documents.map((doc, i) => (
                    <div key={i} className="flex items-start gap-5 p-8 bg-slate-50 border border-slate-100 rounded-xl shadow-sm hover:border-[#00695C] transition-colors group">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-[#00695C] group-hover:text-[#004D40] transition-colors">
                            <doc.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 mb-1 text-lg">{doc.title}</p>
                            <p className="text-base text-slate-600 leading-relaxed">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="mb-6 text-xl font-bold text-slate-800">Eligible NGO Types</h4>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {eligibleNGOTypes.map((type, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <type.icon className="w-8 h-8 mb-4 text-[#00695C]" />
                        <h4 className="mb-2 text-xl font-bold text-slate-800">{type.title}</h4>
                        <p className="text-base text-slate-600 leading-relaxed">{type.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CSR1ProcessContent = () => (
    <section id="csr1-process-content" className="py-12 md:py-16 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Filing Process"
                description="Step-by-step guide to obtaining your CSR registration number."
            />

            <div className="relative mb-16">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-200"></div>

                <div className="space-y-8">
                    {csr1FilingProcess.map((step, i) => (
                        <div key={i} className="relative flex items-start gap-10 group">
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-[#00695C] text-[#00695C] font-bold text-xl flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:bg-[#00695C] group-hover:text-white transition-colors">
                                {i + 1}
                            </div>
                            <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                <p className="text-slate-700 font-medium leading-relaxed text-lg">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="mb-6 text-xl font-bold text-slate-800">Form CSR-1 Components</h4>
                <ul className="grid md:grid-cols-2 gap-5">
                    {csr1Contents.map((content, i) => (
                        <li key={i} className="flex items-start gap-5 text-slate-600 text-base p-3 bg-slate-50 rounded-lg">
                            <FileText className="flex-shrink-0 w-4 h-4 mt-0.5 text-[#00695C]" />
                            <span>{content}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
);

const CSR1LawPurposeContent = () => (
    <section id="csr1-law-purpose-content" className="py-12 md:py-16 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Legal Framework"
                title="Law & Benefits"
                description="Understanding the governing laws and advantages of CSR-1 registration."
            />

            <h4 className="text-xl font-bold text-slate-800 mb-6">Governing Law</h4>
            <div className="grid gap-10 mb-16 md:grid-cols-2">
                {csr1Law.map((law, i) => (
                    <div key={i} className="flex items-start gap-5 p-8 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="p-3 bg-white rounded-lg text-[#00695C] shadow-sm">
                            <law.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">{law.title}</h4>
                            <p className="text-base text-slate-600 leading-relaxed">{law.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-6">Registration Benefits</h4>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {csr1Benefits.map((benefit, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <benefit.icon className="w-8 h-8 mb-4 text-[#00695C] group-hover:scale-110 transition-transform" />
                        <h4 className="mb-2 text-xl font-bold text-slate-800">{benefit.title}</h4>
                        <p className="text-base text-slate-600 leading-relaxed">{benefit.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CSR1StatusFeesContent = () => {
    const filingFees = [
        { title: "Nominal Filing Fee", detail: "The amount may change, so check the MCA portal for the latest fee structure.", icon: DollarSign },
        { title: "Payment Mode", detail: "Fees are paid online when submitting the form on the MCA portal.", icon: DollarSign },
    ];
    return (
        <section id="csr1-status-fees-content" className="py-12 md:py-16 scroll-mt-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4">
                <SectionHeading
                    subtitle="Status"
                    title="Status & Fees"
                    description="How to check your application status and understand filing fees."
                />

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-12">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Status Check Procedure</h4>
                    <ol className="space-y-8">
                        {[
                            "Visit the MCA Portal and Log in using your credentials.",
                            "Navigate to 'Check Annual Filing Status' option under 'MCA Services.'",
                            "Select Form CSR-1 and enter the **CIN** or **SRN**.",
                            "The system will show the current status of the registration application."
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-5 p-4 bg-slate-50 rounded-lg">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00695C] text-white flex items-center justify-center text-sm font-bold mt-0.5">{i + 1}</span>
                                <span className="text-slate-700 text-base font-medium">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="grid gap-10 md:grid-cols-2">
                    {filingFees.map((fee, i) => (
                        <div key={i} className="flex items-center gap-5 p-8 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0">
                                <fee.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-800">{fee.title}</h4>
                                <p className="text-base text-slate-600">{fee.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CSR1FAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="csr1-faqs-content" className="max-w-7xl mx-auto py-12 md:py-16 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Find answers to common queries about CSR-1 registration."
        />

        <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((f, i) => (
                <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${faqOpen === i ? 'border-[#00695C] shadow-lg' : 'border-slate-200 hover:border-[#00695C]/50'}`}>
                    <button
                        className={`w-full flex justify-between items-center p-5 text-left transition-colors ${faqOpen === i ? 'bg-[#00695C] text-white' : 'bg-white text-slate-800'}`}
                        onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    >
                        <span className="text-sm md:text-base font-bold pr-8">{f.q}</span>
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
export default function CSR1RegistrationPage() {
    const [activeTab, setActiveTab] = useState(csr1Tabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = csr1Tabs.map(tab => tab.id);

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
            <section className="relative w-full min-h-[auto] lg:min-h-[70vh] flex items-center pt-32 pb-12 lg:pt-36 lg:pb-12 md:pb-16">
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
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-10">

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
                                <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                                    CSR-1 <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Filing</span>
                                </h1>

                                <p className="text-sm md:text-base text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Align with your CSR goals through **expert-assisted CSR-1 registration**. Get seamless support for **documentation, filing, and full CSR compliance**.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Eligibility Verification for CSR Funding</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Digital Signature Certificate (DSC) for Authorized Person</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Filing Form CSR-1 on MCA V3 Portal</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Generation of Unique CSR Registration Number</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Filing Compliance</span>
                                </div>
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
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
                                        <p className="text-slate-500 text-sm md:text-sm px-2 leading-relaxed">
                                            Register for CSR-1 with expert guidance.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="CSR-1 Filing" btnText="Register Now" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* === Main Content Tabs Navigation (Sticky) === */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-10 md:gap-10 overflow-x-auto no-scrollbar py-0 list-none">
                        {csr1Tabs.map((tab) => (
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
            <CSR1OverviewContent />
            <CSR1EligibilityContent />
            <CSR1DocumentsContent />
            <CSR1ProcessContent />
            <CSR1LawPurposeContent />
            <CSR1StatusFeesContent />
            <CSR1FAQsContent faqs={csr1FAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}