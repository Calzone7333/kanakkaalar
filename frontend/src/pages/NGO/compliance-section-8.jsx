import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Expert Support/Trust
    Briefcase, // For Compliance/Annual Filings/Corporate Structure
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Benefits/Audit Readiness
    FileText, // For document/Forms MGT-7, AOC-4, ITR-7
    Scale, // For Regulatory Compliance/Limited Liability
    Handshake, // For Consultation/Social Impact
    TrendingUp, // For Tax Exemptions/Funding
    Lightbulb, // For Guidance/Expertise
    Users, // For Members/Directors
    DollarSign, // For Fees/Penalties
    Clock, // For Timely Filing/Perpetual Succession
    Landmark, // For MCA/ROC
    AlertTriangle,
    MapPin,
    Globe // For Penalties/Non-Compliance
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

// --- SECTION 8 COMPANY COMPLIANCE STATIC DATA DEFINITIONS ---

const complianceTabs = [
    { id: 'sec8-compliance-overview', label: 'Overview' },
    { id: 'sec8-compliance-benefits', label: 'Benefits' },
    { id: 'sec8-compliance-documents', label: 'Documents & Timelines' },
    { id: 'sec8-compliance-mandatory', label: 'Mandatory Checklist' },
    { id: 'sec8-compliance-event', label: 'Event-Based Compliances' },
    { id: 'sec8-compliance-penalties', label: 'Penalties & Due Dates' },
    { id: 'sec8-compliance-why', label: 'Why Bizzfiling' },
    { id: 'sec8-compliance-faqs', label: 'FAQs' },
];

const complianceBenefits = [
    { title: "Limited Liability", icon: Scale, detail: "Personal assets of members are protected from organizational debts or legal issues." },
    { title: "Tax Exemptions", icon: TrendingUp, detail: "Can receive tax exemptions under Sections 12A and 80G, encouraging philanthropic donations." },
    { title: "Perpetual Succession", icon: Clock, detail: "Existence is not affected by changes in membership, ensuring continuity of charitable goals." },
    { title: "Corporate Structure", icon: Briefcase, detail: "Benefits from efficient management, decision-making, and stricter regulatory adherence." },
    { title: "Ease of Funding", icon: DollarSign, detail: "Can easily access grants, subsidies, and funding from government and non-governmental organizations." },
    { title: "Recognition and Trust", icon: Zap, detail: "High credibility due to monitoring by the MCA, which reinforces the organization's non-profit intent." },
];

const coreDocuments = [
    "Memorandum of Association (MoA) & Articles of Association (AoA)",
    "Certificate of Incorporation",
    "Digital Signature Certificate (DSC)",
    "Auditor's Report & Financial Statements (Balance Sheet, P&L)",
    "Income Tax Return (ITR-7)",
];

const complianceTimelines = [
    { title: "Annual Return (Form MGT-7)", document: "Form MGT-7", deadline: "Within 60 days of the Annual General Meeting (AGM)" },
    { title: "Financial Statements (Form AOC-4)", document: "Form AOC-4", deadline: "Within 30 days of the AGM" },
    { title: "Income Tax Return (ITR-7)", document: "Form ITR-7", deadline: "On or before 30th September of the following financial year" },
    { title: "Auditor Appointment (Form ADT-1)", document: "Form ADT-1", deadline: "Within 15 days of the appointment" },
];

const mandatoryChecklist = [
    "Holding Annual General Meeting (AGM) within six months of the financial year-end.",
    "Filing of Financial Statements (balance sheet, P&L) with RoC.",
    "Filing of Annual Return (Form MGT-7) with the Registrar of Companies (RoC).",
    "Filing of Income Tax Return (Form ITR-7) with the IT department.",
    "Maintenance of books of accounts and statutory records.",
    "Regular audits by a qualified Chartered Accountant (CA).",
    "Complying with restrictions on utilization of funds for charitable purposes.",
    "Keeping register of members, directors, and minutes of meetings.",
];

const eventBasedCompliances = [
    { title: "Board Meetings", detail: "Hold at least four board meetings in a calendar year, with a maximum gap of 120 days between two consecutive meetings.", icon: Users },
    { title: "Change in Directors", detail: "Intimate the RoC through appropriate forms within the specified time frame (appointment, resignation, or removal).", icon: Users },
    { title: "Change in Registered Office", detail: "Inform the RoC through the relevant forms within the prescribed time.", icon: MapPin },
    { title: "Foreign Contributions (FCRA)", detail: "If registered under FCRA, submit an annual report detailing the receipts and utilisation of foreign funds.", icon: Globe },
    { title: "GST Compliance", detail: "If annual turnover exceeds the threshold limit, must comply with GST regulations and file regular returns.", icon: DollarSign },
];

const penaltyDetails = [
    { form: "Violation of Objectives (Sec 8)", penalty: "Fine of ₹10 lakh to ₹1 crore, directors face fine and imprisonment. License revoked.", date: "N/A" },
    { form: "Failure to File Annual Returns", penalty: "₹100 per day of default. Additional fines for directors.", date: "Form AOC-4 / MGT-7" },
    { form: "Failure to File ITR (Late Filing)", penalty: "Loss of tax benefits (12A/80G). Interest and fines under Income Tax Act.", date: "ITR-7" },
    { form: "Non-Maintenance of Books", penalty: "Fine of ₹50,000 to ₹5 lakh. Directors face prosecution.", date: "N/A" },
];

const whyBizzfiling = [
    "Expertise and Specialization: Team of experienced CAs, CSs, and legal experts specializing in Section 8 compliance.",
    "End-to-End Support: Assistance from drafting and filing documents (MGT-7, AOC-4) to obtaining all tax exemptions (12A/80G).",
    "Timely Updates and Transparency: Ensures full regulatory compliance with timely updates and proactive handling of statutory deadlines.",
    "Audit Readiness: Services designed to keep your records accurate, compliant, and always ready for statutory audits.",
];

const complianceFAQs = [
    { q: "What are the annual compliance requirements?", a: "The core annual requirements include holding an AGM, filing Forms MGT-7 (Annual Return) and AOC-4 (Financial Statements) with the ROC, and filing Form ITR-7 with the Income Tax Department." },
    { q: "What is the annual compliance charge for a Section 8 company?", a: "The compliance charge varies based on the company's activity and size, but professional packages generally range from affordable entry-level fees for basic filings to comprehensive fees for full tax/audit support." },
    { q: "What happens if I don’t file my annual returns?", a: "The RoC imposes a late fee of ₹100 per day of delay. Prolonged non-filing leads to director disqualification, loss of tax benefits, and potential license revocation under Section 8(11)." },
    { q: "Can Section 8 companies claim full tax exemption?", a: "Yes, provided they have obtained **Section 12A** registration and strictly utilize all income and funds solely for their charitable objectives, as per the MoA." },
    { q: "Is GST applicable to a Section 8 company?", a: "GST compliance is required only if the Section 8 company’s annual turnover exceeds the threshold limit prescribed by the GST Act (which is subject to change based on the nature of their supply)." },
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

// --- TAB CONTENT COMPONENTS (Section 8 Compliance Content) ---

const ComplianceOverviewContent = () => (
    <section id="sec8-compliance-overview" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="Compliance Fundamentals"
                description="Crucial requirements for transparency, accountability, and license maintenance."
            />

            <div className="grid gap-10 md:grid-cols-2">
                <div className="p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-800">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg text-[#00695C]"><Briefcase className="w-6 h-6" /></div>
                        Corporate Structure
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-base">
                        Governed by the Companies Act, ensuring a rigorous legal framework, unlike trusts or societies. Cannot use 'Limited' or 'Private Limited' in their name.
                    </p>
                </div>
                <div className="p-8 bg-slate-50 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-800">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg text-[#00695C]"><TrendingUp className="w-6 h-6" /></div>
                        Tax Exemptions
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-base">
                        Eligible for Section 12A and 80G benefits, which must be maintained through timely filing and adherence to fund utilization rules.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const ComplianceBenefitsContent = () => (
    <section id="sec8-compliance-benefits" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Benefits"
                title="Why Maintain Compliance?"
                description="Unlock significant advantages including limited liability and tax benefits."
            />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {complianceBenefits.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="w-12 h-12 rounded-lg bg-[#E0F2F1] flex items-center justify-center mb-6 group-hover:bg-[#B2DFDB] transition-colors">
                            <item.icon className="w-6 h-6 text-[#00695C]" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                        <p className="text-slate-500 text-base leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceDocumentsContent = () => (
    <section id="sec8-compliance-documents" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Documents"
                title="Requirements & Timelines"
                description="Essential documents and statutory deadlines for annual filing."
            />

            <h4 className="mb-6 text-xl font-bold text-slate-800">Core Compliance Documents</h4>
            <div className="grid gap-5 mb-12 md:grid-cols-3">
                {coreDocuments.map((doc, i) => (
                    <div key={i} className="flex items-start gap-5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#00695C] transition-colors">
                        <FileText className="flex-shrink-0 w-5 h-5 mt-0.5 text-[#00695C]" />
                        <span className="text-base font-medium text-slate-700">{doc}</span>
                    </div>
                ))}
            </div>

            <h4 className="mb-6 text-xl font-bold text-slate-800">Annual Filing Timelines</h4>
            <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-left text-slate-500 uppercase tracking-wider">Compliance Form</th>
                            <th className="px-6 py-4 text-sm font-bold text-left text-slate-500 uppercase tracking-wider">Document/Act</th>
                            <th className="px-6 py-4 text-sm font-bold text-left text-slate-500 uppercase tracking-wider">Statutory Deadline</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {complianceTimelines.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                <td className="px-6 py-4 text-base font-semibold text-slate-800">{row.title}</td>
                                <td className="px-6 py-4 text-base text-slate-600">{row.document}</td>
                                <td className="px-6 py-4 text-base font-medium text-[#00695C]">{row.deadline}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </section>
);

const ComplianceMandatoryContent = () => (
    <section id="sec8-compliance-mandatory" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Checklist"
                title="Mandatory Checklist"
                description="Non-negotiable compliances to ensure accountability and avoid penalties."
            />

            <div className="grid gap-10 md:grid-cols-2">
                {mandatoryChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <span className="text-base font-medium text-slate-700 leading-relaxed">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ComplianceEventContent = () => (
    <section id="sec8-compliance-event" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Event-Based"
                title="Event Based Compliances"
                description="Requirements triggered by specific changes or financial activities."
            />

            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16">
                {eventBasedCompliances.map((item, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00695C] mb-4">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h4 className="mb-2 text-xl font-bold text-slate-800">{item.title}</h4>
                        <p className="text-base text-slate-600 leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-6 border-l-4 border-[#00695C] pl-4">Post-Incorporation Essentials</h4>
            <div className="grid md:grid-cols-3 gap-10">
                {[
                    "Obtain Section 12AA and Section 80G registration from the Income Tax Department.",
                    "Ensure strict compliance with the MoA regarding the reinvestment of funds.",
                    "File Form FC-4 annually if the company receives foreign contributions."
                ].map((text, i) => (
                    <div key={i} className="p-5 bg-[#F8FDFC] border border-[#E0F2F1] rounded-xl text-center">
                        <CheckCircle className="w-6 h-6 text-[#00695C] mx-auto mb-3" />
                        <p className="text-base text-slate-700">{text}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CompliancePenaltiesContent = () => (
    <section id="sec8-compliance-penalties" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Risks"
                title="Penalties & Fines"
                description="Consequences of non-compliance for the company and its directors."
            />

            <div className="grid gap-10 mb-12 md:grid-cols-2">
                {penaltyDetails.map((item, i) => (
                    <div key={i} className="p-8 bg-white rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-all group">
                        <div className="flex items-start gap-5">
                            <div className="p-2 bg-red-50 rounded-lg text-red-500 group-hover:bg-red-100 transition-colors">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="mb-2 text-xl font-bold text-slate-800">{item.form}</h4>
                                <p className="text-base font-medium text-slate-600 mb-2">{item.penalty}</p>
                                {item.date !== "N/A" && <span className="inline-block py-1 px-2 rounded-md bg-slate-100 text-slate-500 text-sm font-semibold">{item.date}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-6">Statutory Due Dates</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-4 py-3 text-sm font-bold text-left text-slate-500 uppercase">Form No</th>
                                <th className="px-4 py-3 text-sm font-bold text-left text-slate-500 uppercase">Compliance</th>
                                <th className="px-4 py-3 text-sm font-bold text-left text-slate-500 uppercase">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr>
                                <td className="px-4 py-3 text-base font-bold text-slate-800">AOC-4</td>
                                <td className="px-4 py-3 text-base text-slate-600">Financial Statements</td>
                                <td className="px-4 py-3 text-base font-bold text-red-600">30 Days after AGM</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-base font-bold text-slate-800">MGT-7</td>
                                <td className="px-4 py-3 text-base text-slate-600">Annual Return</td>
                                <td className="px-4 py-3 text-base font-bold text-red-600">60 Days after AGM</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 text-base font-bold text-slate-800">ITR-7</td>
                                <td className="px-4 py-3 text-base text-slate-600">Income Tax</td>
                                <td className="px-4 py-3 text-base font-bold text-red-600">30 September</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
);

const ComplianceWhyBizzfiling = () => (
    <section id="sec8-compliance-why" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Why Bizzfiling?"
                description="Specialized support to ensure smooth functioning and legal adherence."
            />

            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {whyBizzfiling.map((service, i) => {
                    const [title, detail] = service.includes(':') ? service.split(':').map(s => s.trim()) : [service.split('.')[0].trim(), service.split('.').slice(1).join('.').trim()];
                    const Icon = i % 4 === 0 ? Lightbulb : i % 4 === 1 ? Briefcase : i % 4 === 2 ? Clock : Zap;
                    return (
                        <div key={i} className="flex items-start gap-5 p-8 bg-slate-50 border border-slate-100 shadow-sm rounded-xl hover:-translate-y-1 transition-transform">
                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#00695C] flex-shrink-0">
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
    <section id="sec8-compliance-faqs" className="max-w-7xl mx-auto py-20 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Find answers to common queries about Section 8 compliance."
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
export default function Section8CompliancePage() {
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
                                    Section 8 <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Compliance</span>
                                </h1>

                                <p className="text-lg md:text-xl text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert support to manage all **legal and compliance** needs for your Section 8 company. End-to-end help with timely filings.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Filing of AOC-4 (Financials) & MGT-7 (Annual Return)</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Appointment of Auditor (ADT-1)</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Director KYC & Report Preparation</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Holding Requirement for AGM & Board Meetings</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Audit Ready</span>
                                </div>
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Fast Filings</span>
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
                                            Stay compliant with our expert help.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Section 8 Compliance" btnText="Check Compliance" />
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
            <ComplianceBenefitsContent />
            <ComplianceDocumentsContent />
            <ComplianceMandatoryContent />
            <ComplianceEventContent />
            <CompliancePenaltiesContent />
            <ComplianceWhyBizzfiling />
            <ComplianceFAQsContent faqs={complianceFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}