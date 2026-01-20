import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Credibility/Trust
    Briefcase, // For Compliance/Governance
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Benefits
    FileText, // For document/Form FC-3A/Annual Return FC-4
    Scale, // For Legal Compliance/Regulation
    Handshake, // For Donations/Foreign Contributions
    TrendingUp, // For Funding/Support
    Lightbulb, // For Expert Guidance/Clarity
    Users, // For Associations/Organizations
    DollarSign, // For Fees/Penalties
    Clock, // For Validity/Renewal/Timely Filing
    Landmark, // For MHA/Central Government
    Banknote, // For Foreign Contributions/Bank Account
    Shield, // For Legal Protection/National Interest
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/fcra_hero_bg.png"; // Specific background

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

// --- FCRA REGISTRATION STATIC DATA DEFINITIONS ---

const fcraTabs = [
    { id: 'fcra-overview-content', label: 'Overview' },
    { id: 'fcra-purpose-benefits', label: 'Purpose & Benefits' },
    { id: 'fcra-eligibility-content', label: 'Eligibility & Checklist' },
    { id: 'fcra-types-content', label: 'Types & Documents' },
    { id: 'fcra-process-content', label: 'Process & Bank A/C' },
    { id: 'fcra-renewal-compliance', label: 'Renewal & Annual Return' },
    { id: 'fcra-prohibitions-penalties', label: 'Prohibitions & Penalties' },
    { id: 'fcra-faqs-content', label: 'FAQs' },
];

const fcraPurposes = [
    { title: "Regulating Acceptance and Utilization", icon: Scale, detail: "The FCRA regulates the acceptance and utilisation of foreign contributions and hospitality to promote national interest and security." },
    { title: "Preventing Misuse", icon: Shield, detail: "Aims to prevent the misuse of foreign donations, ensuring they are not used for activities detrimental to national interest or security." },
    { title: "Enhancing Transparency and Accountability", icon: Zap, detail: "Requires organizations to maintain detailed records and reports of foreign funds, subject to government oversight." },
    { title: "Building Credibility and Trust", icon: Handshake, detail: "Organizations build credibility and trust among donors by adhering to FCRA regulations, ensuring the integrity of foreign fund utilization." },
];

const fcraEligibility = [
    "Must be a registered society, trust, or Section 8 Company.",
    "Must have been in existence for at least **three years** before applying for FCRA registration.",
    "Must have spent at least **₹10,00,000/-** over the last three years on its aims and objectives (excluding administrative expenditure).",
    "Must provide audited statements of income and expenditure for the past three years.",
    "Activities and objectives must align with permissible purposes for receiving foreign contributions.",
];

const fcraBenefits = [
    { title: "Access to Foreign Funding", icon: TrendingUp, detail: "The FCRA certificate is crucial to receive foreign contributions to support projects and initiatives." },
    { title: "Increased Credibility", icon: Zap, detail: "Enhances the organisation's reputation and trustworthiness among international donors." },
    { title: "Support for Development Projects", icon: DollarSign, detail: "Enables funding for cultural, social, economic, educational, or religious programs." },
    { title: "Compliance with Legal Requirements", icon: Briefcase, detail: "Ensures that organisations operate within the legal framework, avoiding legal issues and penalties." },
];

const fcraChecklist = [
    "Ensure your organization is a trust, society, or a Section 8 Company and has been operational for a minimum of three years.",
    "Ready to file Form FC-3A to apply for FCRA registration.",
    "Registration certificate/Trust deed/Memorandum of Association/Article of Association ready.",
    "Activity report and audited financial statements for the last 3 years.",
];

const fcraTypes = [
    { title: "Prior Permission Certificate (PPC)", validity: "Granted for **one year**.", detail: "Apt for newly established NGOs or those seeking specific foreign contributions for particular projects. Requires commitment letter from foreign donor.", icon: Clock },
    { title: "Permanent Registration Certificate (PRC)", validity: "Valid for **5 years**.", detail: "For established organisations under Section 12(1) of the FCRA, 2010. Requires a track record of at least 3 years in utilizing foreign contributions.", icon: Scale },
];

const fcraDocuments = [
    { title: "Registration Certificate of Association", size: "1 MB (PDF)", icon: FileText },
    { title: "Memorandum of Association/Trust deed", size: "5 MB (PDF)", icon: FileText },
    { title: "Activity Report for the last 3 years", size: "3 MB (PDF)", icon: Briefcase },
    { title: "Audited Statement of accounts for the last 3 years", size: "5 MB (PDF)", icon: DollarSign },
    { title: "Affidavit of each key functionary", size: "1 MB (PDF)", icon: Users },
    { title: "Chief Functionary signature & Seal of the Association", size: "50 KB / 100 KB (Pixel)", icon: Zap },
];

const fcraProcessSteps = [
    "Apply online: Go to the official FCRA website (MHA portal) and set up an account.",
    "Fill out Form FC-3A: Complete the online application form with your organisation's details and upload all required documents.",
    "Pay the Fee: Pay the registration fee online (₹5,000 for PP, ₹10,000 for PR).",
    "Await Review & Follow-Up: The FCRA department reviews the application. Provide any additional information if requested.",
    "Receive Certificate: Upon approval, receive your FCRA registration certificate electronically, valid for five years.",
];

const fcraProhibitions = [
    "Representing fictitious entities.",
    "Involvement in religious conversion activities, directly or indirectly.",
    "Having a history of prosecutions related to communal tension, disharmony, or sedition.",
    "Being candidates, journalists, media companies, judges, government servants, politicians, or political organizations receiving foreign funds.",
];

const fcraPenalties = [
    { title: "Financial Penalty", detail: "Government may impose penalties up to **three times the amount** of foreign contributions received in violation of the Act.", icon: DollarSign },
    { title: "Suspension/Cancellation", detail: "Providing incorrect or false information, or concealment of facts, can lead to **suspension or cancellation** of registration.", icon: Scale },
    { title: "Imprisonment & Seizure", detail: "Misrepresentation or fraudulent means can result in imprisonment, fines, or **seizure of contributions**.", icon: Shield },
];

const fcraRenewalCompliance = [
    { title: "Validity & Renewal (FC-3C)", detail: "Registration is valid for **five years**. Must apply for renewal (FC-3C) six months before the expiration date to avoid suspension or cancellation.", icon: Clock },
    { title: "FCRA Annual Return (FC-4)", detail: "Must file an FCRA annual return with the MHA by **December 31st** (within nine months after the fiscal year ends).", icon: FileText },
    { title: "Reporting Receipts (Quarterly)", detail: "If total receipts exceed **Rs. 1 crore** in a financial year, a quarterly summary of total receipts must be filed.", icon: DollarSign },
    { title: "Designated Bank Account (SBI)", detail: "Mandatory to open an FCRA Bank Account **only in State Bank of India (SBI), Main Branch, 11, Sansad Marg, New Delhi-110001** for accepting foreign contributions.", icon: Banknote },
];

const fcraFAQs = [
    { q: "What is FCRA full form?", a: "FCRA stands for the **Foreign Contribution Regulation Act**." },
    { q: "Can an organisation receive foreign contributions without FCRA registration?", a: "No, generally it is illegal. All organizations engaged in cultural, economic, educational, religious, or social activities must obtain **FCRA registration** or **Prior Permission** to legally accept foreign contributions." },
    { q: "How long does it take to obtain FCRA registration?", a: "The official processing time can vary, but with proper expert assistance ensuring compliance, the process typically takes several months, depending on the MHA's scrutiny level." },
    { q: "What are the penalties for late filing of annual returns under FCRA?", a: "Late filing can lead to severe penalties, including fines, suspension, or cancellation of the FCRA registration, and confiscation of contributions." },
    { q: "Is it mandatory to have a designated FCRA bank account?", a: "Yes, according to the FCRA Amendment Act, 2020, it is mandatory to open an FCRA Bank Account *only* in the **State Bank of India (SBI), Main Branch, New Delhi** for the acceptance of foreign contributions." },
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

// --- TAB CONTENT COMPONENTS (FCRA Registration Content) ---

const FCRAOverviewContent = () => (
    <section id="fcra-overview-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="What is FCRA Registration?"
                description="Legally enabling NGOs to accept foreign contributions in India."
            />

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-slate-600 text-lg md:text-xl leading-relaxed">
                    <p>
                        The **Foreign Contribution Regulation Act (FCRA) Registration** allows organizations engaged in cultural, economic, educational, religious, or social activities to **legally accept foreign contributions**.
                    </p>
                    <p>
                        Issued by the Central Government and managed by the **Ministry of Home Affairs (MHA)**, this certification ensures compliance and proper utilization of foreign funds.
                    </p>
                </div>
                <div className="bg-[#F8FDFC] p-8 rounded-2xl border border-[#E0F2F1]">
                    <h4 className="text-xl font-bold text-slate-800 mb-4">Governing Act</h4>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        The **Foreign Contribution (Regulation) Act, 2010** is the consolidating act that strictly governs the acceptance and utilization of foreign contributions or foreign hospitality for activities connected therewith or incidental thereto.
                    </p>
                    <div className="flex items-center gap-5 p-4 bg-white rounded-lg border border-slate-100">
                        <Scale className="w-6 h-6 text-[#00695C]" />
                        <span className="text-sm font-bold text-slate-700">Strict Compliance Required</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FCRAPurposeBenefits = () => (
    <section id="fcra-purpose-benefits" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Purpose & Benefits"
                title="Why Register?"
                description="Understanding the core objectives and advantages of FCRA registration."
            />

            <h4 className="text-xl font-bold text-slate-800 mb-6">Key Purposes</h4>
            <div className="grid gap-10 mb-16 md:grid-cols-2">
                {fcraPurposes.map((item, i) => (
                    <div key={i} className="flex items-start gap-5 p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <div className="p-3 bg-[#E0F2F1] rounded-lg text-[#00695C] shadow-sm">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h4>
                            <p className="text-base text-slate-600 leading-relaxed">{item.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-6">Registration Benefits</h4>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                {fcraBenefits.map((benefit, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#00695C] transition-all group">
                        <benefit.icon className="w-8 h-8 mb-4 text-[#00695C] group-hover:scale-110 transition-transform" />
                        <h4 className="mb-2 text-xl font-bold text-slate-800">{benefit.title}</h4>
                        <p className="text-base text-slate-600 leading-relaxed">{benefit.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FCRAEligibilityContent = () => (
    <section id="fcra-eligibility-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Eligibility"
                title="Criteria & Checklist"
                description="Requirements to apply for permanent FCRA registration."
            />

            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Eligibility Criteria</h4>
                    <div className="space-y-8">
                        {fcraEligibility.map((item, i) => (
                            <div key={i} className="flex items-start gap-5 p-4 border border-slate-100 rounded-xl bg-slate-50">
                                <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-[#00695C]" />
                                <span className="text-base font-medium text-slate-700 leading-relaxed">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Checklist (FC-3A)</h4>
                    <div className="p-8 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                        <ul className="space-y-8">
                            {fcraChecklist.map((item, i) => (
                                <li key={i} className="flex items-start gap-5">
                                    <div className="w-6 h-6 rounded-full bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                    <span className="text-base text-slate-600 leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FCRATypesContent = () => (
    <section id="fcra-types-content" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Types"
                title="Registration Types & Documents"
                description="Choose the right registration type and prepare necessary documents."
            />

            <div className="grid md:grid-cols-2 gap-10 mb-16">
                {fcraTypes.map((type, i) => (
                    <div key={i} className="flex flex-col p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00695C] text-sm font-bold mb-3">
                                {type.validity}
                            </span>
                            <h4 className="text-xl font-bold text-slate-800 flex items-center gap-5">
                                {type.title}
                            </h4>
                        </div>
                        <p className="text-slate-600 text-base leading-relaxed mb-6 flex-grow">{type.detail}</p>
                        <div className="mt-auto pt-6 border-t border-slate-100">
                            <type.icon className="w-6 h-6 text-[#00695C]" />
                        </div>
                    </div>
                ))}
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-6">Required Documents (FC-3A)</h4>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {fcraDocuments.map((doc, i) => (
                    <div key={i} className="flex items-start gap-5 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#00695C] transition-colors group">
                        <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-[#00695C] rounded-lg transition-colors">
                            <doc.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-base mb-1">{doc.title}</p>
                            <p className="text-sm text-slate-500">Max Size: {doc.size}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FCRAPlProcessContent = () => (
    <section id="fcra-process-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Registration Process"
                description="Step-by-step guide and bank account requirements."
            />

            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-8">Process Steps (Form FC-3A)</h4>
                    <ol className="relative border-l border-slate-200 space-y-8 ml-3">
                        {fcraProcessSteps.map((step, i) => (
                            <li key={i} className="ml-6">
                                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-[#00695C] rounded-full ring-4 ring-white">
                                    <span className="text-white text-sm font-bold">{i + 1}</span>
                                </span>
                                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 text-base">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Mandatory Bank Account</h4>
                    <div className="p-8 bg-[#F0FDF4] border border-green-200 rounded-2xl">
                        <div className="flex items-center gap-5 mb-4 text-green-800">
                            <Banknote className="w-8 h-8" />
                            <h5 className="text-lg font-bold">Designated Account</h5>
                        </div>
                        <p className="text-green-900 leading-relaxed mb-4">
                            According to the FCRA Amendment Act, 2020, you must open an FCRA Bank Account **only in State Bank of India (SBI), Main Branch, 11, Sansad Marg, New Delhi-110001**.
                        </p>
                        <p className="text-base text-green-700 font-medium bg-white/50 p-3 rounded-lg">
                            This specific account is mandatory for the acceptance of all foreign contributions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FCRARenewalCompliance = () => (
    <section id="fcra-renewal-compliance" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Compliance"
                title="Renewal & Compliance"
                description="Staying compliant: Validity, Renewal and Annual Returns."
            />

            <div className="grid gap-10 mb-12 md:grid-cols-2">
                <div className="p-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-800">
                        <Clock className="w-6 h-6 text-[#00695C]" />
                        Validity & Renewal
                    </h4>
                    <p className="mb-6 text-slate-600 leading-relaxed text-sm">
                        Registration valid for **five years**. Must apply for **FCRA renewal (FC-3C)** six months before expiration.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl text-base font-medium text-slate-700">
                        Status Track: Visit FCRA portal & enter application ID.
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-100 shadow-sm rounded-2xl">
                    <h4 className="flex items-center gap-5 mb-4 text-xl font-bold text-slate-800">
                        <FileText className="w-6 h-6 text-[#00695C]" />
                        Annual Return (FC-4)
                    </h4>
                    <p className="mb-6 text-slate-600 leading-relaxed text-sm">
                        Registered NGOs must file annual returns with MHA.
                    </p>
                    <ul className="space-y-8 text-base text-slate-600">
                        <li className="flex items-center gap-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00695C]"></span>
                            Deadline: **December 31st**.
                        </li>
                        <li className="flex items-center gap-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00695C]"></span>
                            Requirement: Audited by CA, filed on FCRA portal.
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-4xl mx-auto text-center p-8 bg-blue-50 text-blue-900 rounded-xl font-medium">
                **Quarterly Reporting:** If total receipts from foreign sources exceed **Rs. 1 crore** in a financial year, a quarterly summary of total receipts must be filed.
            </div>
        </div>
    </section>
);

const FCRAPRoPenalties = () => (
    <section id="fcra-prohibitions-penalties" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Caution"
                title="Prohibitions & Penalties"
                description="Strict guidelines and consequences for FCRA violations."
            />

            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Prohibited Activities</h4>
                    <ul className="space-y-8">
                        {fcraProhibitions.map((item, i) => (
                            <li key={i} className="flex items-start gap-5 p-4 bg-red-50 rounded-lg text-red-900 border border-red-100">
                                <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="text-base font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Violation Penalties</h4>
                    <div className="space-y-8">
                        {fcraPenalties.map((item, i) => (
                            <div key={i} className="flex items-start gap-5 p-4 border border-slate-100 rounded-xl shadow-sm bg-white">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800 mb-1 text-lg">{item.title}</h5>
                                    <p className="text-base text-slate-600 leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const FCRAWhyBizzfiling = () => (
    <section id="fcra-why-Bizzfiling" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Bizzfiling Advantage"
                description="Simplifying your FCRA registration journey."
            />

            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-12">
                <FeatureBox title="Expert Guidance" detail="Precise advice on eligibility and documentation." icon={Lightbulb} />
                <FeatureBox title="Document Prep" detail="Meticulous preparation to avoid delays." icon={FileText} />
                <FeatureBox title="Application Filing" detail="Full handling of FC-3A online submission." icon={Briefcase} />
                <FeatureBox title="Follow-Up" detail="Continuous MHA follow-up and query handling." icon={Handshake} />
            </div>

            <div className="max-w-4xl mx-auto p-8 bg-[#FFF8E1] rounded-2xl border border-[#FFE082] text-center">
                <h4 className="flex items-center justify-center gap-5 mb-4 text-xl font-bold text-amber-900">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                    Govt. Registration Fees
                </h4>
                <p className="text-amber-800 text-lg">
                    Permission: **₹5,000/-** | Permanent Registration: **₹10,000/-**
                </p>
                <p className="text-sm text-amber-700 mt-2">*Fees are subject to change by the government.</p>
            </div>
        </div>
    </section>
);

const FCRAFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="fcra-faqs-content" className="max-w-7xl mx-auto py-20 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Common queries regarding FCRA registration and compliance."
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
export default function FCRARegistrationPage() {
    const [activeTab, setActiveTab] = useState(fcraTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = fcraTabs.map(tab => tab.id);

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
                                    FCRA <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>

                                <p className="text-lg md:text-xl text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert assisted **FC-3A filing** and full guidance on the **FCRA registration in India**. Understand **eligibility, benefits, checklist**, and types of FCRA registration.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Analysis of Foreign Contribution Eligibility</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Opening of FCRA Bank Account (SBI New Delhi)</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Filing of Form FC-3A/FC-3B online</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-base md:text-lg">Reply to Ministry of Home Affairs (MHA) Queries</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Expert Filing</span>
                                </div>
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Renewal Support</span>
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
                                            Register for FCRA with expert guidance.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="FCRA Registration" btnText="Register Now" />
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
                        {fcraTabs.map((tab) => (
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
            <FCRAOverviewContent />
            <FCRAPurposeBenefits />
            <FCRAEligibilityContent />
            <FCRATypesContent />
            <FCRAPlProcessContent />
            <FCRARenewalCompliance />
            <FCRAPRoPenalties />
            <FCRAWhyBizzfiling />
            <FCRAFAQsContent faqs={fcraFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />

        </div>
    );
}