import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Credibility/High Trust
    Briefcase, // For Section 8/Companies Act
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Compliance
    FileText, // For document/Forms
    Scale, // For Compliance/Regulation/Limited Liability
    Smartphone,
    Handshake, // For Partners/Donors
    TrendingUp, // For Growth/Tax Benefits
    Lightbulb, // For Expert Guidance/Objective
    Users, // For Members/Directors/Governing Body
    DollarSign, // For Financials/Funding/Fees
    Download,
    Globe, // For Global Operations/Reach
    Calculator, // For Fees/Budgeting
    Landmark, // For ROC/MCA/Legal Recognition
    Clock, // For Quick Turnaround Time/Perpetual Existence
    Banknote, // For Capital/Funds
    Shield, // For Limited Liability
    Gavel,
    MapPin // For Legal Compliance
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/section8_hero_bg.png"; // Specific background

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

// --- SECTION 8 COMPANY STATIC DATA DEFINITIONS ---

const section8Tabs = [
    { id: 'sec8-overview-content', label: 'Overview' },
    { id: 'sec8-benefits-content', label: 'Benefits' },
    { id: 'sec8-eligibility-content', label: 'Eligibility' },
    { id: 'sec8-documents-content', label: 'Documents' },
    { id: 'sec8-process-content', label: 'Process' },
    { id: 'sec8-compliance-law-content', label: 'Compliance & Law' },
    { id: 'sec8-why-Bizzfiling', label: 'Why Bizzfiling?' },
    { id: 'sec8-faqs-content', label: "FAQ's" },
];

const section8Overview = [
    { title: "Charity", icon: Handshake, detail: "Promoting social welfare and philanthropic activities." },
    { title: "Education", icon: Users, detail: "Advancing knowledge, literacy, and skills development." },
    { title: "Science & Arts", icon: Lightbulb, detail: "Supporting research, innovation, and cultural development." },
    { title: "Environmental Protection", icon: Globe, detail: "Working towards conservation and sustainability." },
];

const section8Benefits = [
    { title: "Legal Recognition", icon: Landmark, detail: "Formal recognition under the Companies Act, enhancing credibility for grants and partnerships." },
    { title: "Tax Benefits", icon: TrendingUp, detail: "Exemptions under Sections 12A and 80G, making donations more appealing." },
    { title: "Limited Liability", icon: Shield, detail: "Protects directors' personal assets from organisational debts." },
    { title: "No Minimum Capital", icon: Banknote, detail: "Allows founders to start operations with minimal financial burden." },
    { title: "Distinct Legal Entity", icon: Gavel, detail: "Can own property, open a bank account, and enter contracts independently." },
    { title: "No Stamp Duty", icon: DollarSign, detail: "Exempted from stamp duty on incorporation, simplifying registration." },
    { title: "High Credibility", icon: Zap, detail: "Strict regulation by the government fosters maximum trust among stakeholders." },
    { title: "Perpetual Existence", icon: Clock, detail: "Continues to exist regardless of changes in membership or directors." },
];

const section8Eligibility = [
    { title: "Purpose/Objective", detail: "Must be formed to promote charitable objectives; profits must be reinvested, not distributed." },
    { title: "Minimum Members/Directors", detail: "Minimum two members and two directors for a private company (three for public)." },
    { title: "Directors' DIN", detail: "All directors must hold a Director Identification Number (DIN)." },
    { title: "Capital Requirement", detail: "No minimum capital requirement, but sufficient capital must be declared to achieve objectives." },
    { title: "ROC Approval", detail: "Requires a license from the Registrar of Companies (ROC) for charitable status." },
    { title: "No Profit Distribution", detail: "Income cannot be distributed as dividends to members." },
];

const section8RequiredForms = [
    { form: "RUN (Reserve Unique Name)", purpose: "Reserve the company’s name, ensuring alignment with non-profit objectives.", icon: Zap },
    { form: "Form INC-12", purpose: "Application for obtaining the crucial Section 8 license from the ROC.", icon: FileText },
    { form: "Form SPICe+", purpose: "Incorporation of the company, combining applications for PAN, TAN, GST, EPFO, and ESIC.", icon: Briefcase },
    { form: "Form DIR-2/INC-9", purpose: "Consent and declaration by directors affirming compliance and non-disqualification.", icon: Users },
    { form: "Draft MOA & AOA", purpose: "Outlines objectives, governance structure, and non-profit commitment.", icon: Gavel },
];

const section8RegistrationProcess = [
    "Obtain Digital Signature Certificates (DSC) for all proposed directors.",
    "Acquire Director Identification Numbers (DIN) for all directors.",
    "Reserve the company name by filing Form RUN with MCA.",
    "Draft legal documents: Memorandum of Association (MoA) and Articles of Association (AoA).",
    "Submit license application (Form INC-12) and incorporation forms (SPICe+) with all required attachments.",
    "Receive Certificate of Incorporation: ROC issues the Section 8 license and Certificate of Incorporation upon approval.",
];

const section8LawAndCompliance = [
    { title: "Companies Act, 2013", details: "The primary law governing formation, ensuring profits are reinvested, and requiring ROC license.", icon: Landmark },
    { title: "Income Tax Act (12A & 80G)", details: "Grants tax exemption on income (12A) and tax deduction to donors (80G).", icon: TrendingUp },
    { title: "MCA Monitoring", details: "Ministry of Corporate Affairs enforces annual filings, audits, and has the authority to revoke the license for non-compliance.", icon: Scale },
    { title: "Annual Compliance Filings", details: "Mandatory filing of Form AOC-4 (financial statements) and Form MGT-7 (annual return) with the ROC.", icon: FileText },
];

const section8WhyBizzfiling = [
    "Expert Assistance: CA/CS/Legal experts guide you through the entire process, ensuring compliance.",
    "Simplified Processes: Digital, step-by-step assistance reduces paperwork and saves time.",
    "Quick Turnaround: Fastest possible name approval, DSC, DIN, and incorporation completion.",
    "Comprehensive Services: Includes 12A, 80G, CSR compliance, auditing, and tax advisory.",
    "Affordable Plans: Flexible pricing with discounts and EMI options to make registration affordable.",
    "Value-Added Benefits: Free DARPAN registration and zero-balance current account with up to 7% interest.",
];

const section8FAQs = [
    { q: "What is the difference between Section 8 Company registration and registering a Trust or Society?", a: "Section 8 Companies are governed by the **MCA (Companies Act, 2013)**, offering high credibility and limited liability. Trusts and Societies are governed by the Indian Trusts Act and Societies Registration Act, respectively, and generally have less stringent compliance requirements and lower public trust." },
    { q: "How long does it take to complete Section 8 Company registration online?", a: "With expert assistance, the process (from DIN/DSC to incorporation) typically takes **7 to 14 working days**, provided all documents are in order and the name is approved quickly." },
    { q: "How many directors are required for a Section 8 Company?", a: "A minimum of **two directors** is required for a private Section 8 Company and three for a public Section 8 Company. All directors must hold a valid DIN." },
    { q: "What are the conditions for obtaining tax exemptions for a Section 8 Company?", a: "To get tax exemptions, the company must register under **Section 12A** (for income exemption) and subsequently under **Section 80G** (to offer tax deduction benefits to donors)." },
    { q: "What happens if a Section 8 Company fails to comply with annual filing requirements?", a: "Failure to file Forms AOC-4 or MGT-7 results in **penalties (₹100 per day)**, additional fines, and the potential for the **ROC to revoke the license** and disqualify directors." },
];

// --- REUSABLE COMPONENTS ---

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

// --- TAB CONTENT COMPONENTS (Section 8 Content) ---

const Section8OverviewContent = () => (
    <section id="sec8-overview-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="What is a Section 8 Company?"
                description="Incorporating for a charitable purpose under the Companies Act, 2013."
            />

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                    <p>
                        A **Section 8 Company** is a non-profit organization incorporated under the **Companies Act, 2013** in India. It is established to promote charitable objectives like education, science, arts, or social welfare.
                    </p>
                    <p>
                        Crucially, a Section 8 Company does not distribute dividends to its members. Instead, all profits or surpluses are **reinvested** into the organization to help achieve its foundational social goals.
                    </p>
                </div>
                <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200">
                    <h4 className="text-xl font-bold text-slate-800 mb-6">Primary Objectives</h4>
                    <ul className="space-y-4">
                        {section8Overview.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#00695C] border border-slate-100">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-800 text-sm">{item.title}</span>
                                    <span className="block text-xs text-slate-500">{item.detail}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </section>
);

const Section8BenefitsContent = () => (
    <section id="sec8-benefits-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Benefits"
                title="Why Register Under Section 8?"
                description="Combining the credibility of a company with non-profit advantages."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {section8Benefits.map((item, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#00695C] transition-all group h-full">
                        <item.icon className="w-8 h-8 mb-4 text-[#00695C] group-hover:scale-110 transition-transform" />
                        <h4 className="mb-2 text-lg font-bold text-slate-800">{item.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Section8EligibilityContent = () => (
    <section id="sec8-eligibility-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Eligibility"
                title="Who Can Register?"
                description="Mandatory criteria to form a Section 8 Company."
            />

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-[#F8FDFC] p-8 rounded-2xl border border-[#E0F2F1]">
                    <h4 className="text-lg font-bold text-slate-800 mb-6">Core Requirements</h4>
                    <div className="space-y-6">
                        {section8Eligibility.slice(0, 3).map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00695C] text-white flex items-center justify-center text-xs font-bold mt-1">{i + 1}</span>
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h5>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#fff] p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-800 mb-6">Additional Conditions</h4>
                    <div className="space-y-6">
                        {section8Eligibility.slice(3).map((item, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00695C] text-white flex items-center justify-center text-xs font-bold mt-1">{i + 4}</span>
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h5>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Section8DocumentsContent = () => (
    <section id="sec8-documents-content" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Documents"
                title="Required Documentation"
                description="Statutory forms and papers required for the SPICe+ process."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {section8RequiredForms.map((item, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                        <item.icon className="w-8 h-8 mb-4 text-[#00695C]" />
                        <h4 className="mb-2 text-lg font-bold text-slate-800">{item.form}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{item.purpose}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h4 className="text-xl font-bold text-slate-800 mb-8 text-center">Additional Requirements</h4>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4"><Users className="w-6 h-6" /></div>
                        <h5 className="font-bold text-slate-800 mb-2">Directors & Members</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">PAN (Mandatory), Aadhaar, Voter ID/Passport, Latest Residential Proof (Bill/Statement &lt; 2 months), DSC, DIN.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4"><MapPin className="w-6 h-6" /></div>
                        <h5 className="font-bold text-slate-800 mb-2">Registered Office</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">Proof of Address (Sale Deed/Rent Agreement), NOC from owner, Latest Utility Bill (&lt; 2 months).</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4"><DollarSign className="w-6 h-6" /></div>
                        <h5 className="font-bold text-slate-800 mb-2">Financials</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">Proposed financial statements or projected income & expenditure for next 3 years.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Section8ProcessContent = () => (
    <section id="sec8-process-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Registration Process"
                description="Streamlined SPICe+ incorporation with expert guidance."
            />

            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-1/2">
                    <ol className="relative border-l border-slate-200">
                        {section8RegistrationProcess.map((step, i) => (
                            <li key={i} className="mb-10 ml-6">
                                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#00695C] rounded-full -left-4 ring-4 ring-white text-white font-bold text-sm">
                                    {i + 1}
                                </span>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Step {i + 1}</h3>
                                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="w-full md:w-1/2 space-y-8">
                    <div className="bg-[#F8FDFC] border border-[#E0F2F1] rounded-2xl p-8">
                        <h4 className="text-xl font-bold text-slate-800 mb-6">Types of Section 8 Companies</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <Briefcase className="w-5 h-5 text-[#00695C] mt-1" />
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm">Limited by Shares</h5>
                                    <p className="text-xs text-slate-500 mt-1">Liability limited to unpaid share capital.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                <Shield className="w-5 h-5 text-[#00695C] mt-1" />
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm">Limited by Guarantee</h5>
                                    <p className="text-xs text-slate-500 mt-1">Liability limited to guaranteed amount.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Section8ComplianceLawContent = () => (
    <section id="sec8-compliance-law-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Compliance"
                title="Law & Annual Compliance"
                description="Statutory obligations to maintain non-profit status."
            />

            <div className="grid gap-8 lg:grid-cols-2 mb-12">
                <div className="space-y-6">
                    <h4 className="text-xl font-bold text-slate-800">Governing Laws</h4>
                    {section8LawAndCompliance.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="p-3 bg-[#E0F2F1] rounded-lg text-[#00695C]">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h5 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.details}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <h4 className="text-xl font-bold text-slate-800">Key Annual Compliances</h4>
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm h-full">
                        <ul className="space-y-6">
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <span className="block font-bold text-slate-800 text-sm">Annual Returns</span>
                                    <span className="text-xs text-slate-500">Form AOC-4 (Financials) & MGT-7 (Annual Return) with ROC.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <span className="block font-bold text-slate-800 text-sm">Audit & Tax</span>
                                    <span className="text-xs text-slate-500">Statutory Audit by CA & ITR Filing (ITR-7).</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <span className="block font-bold text-slate-800 text-sm">Board Meetings</span>
                                    <span className="text-xs text-slate-500">Minimum two board meetings per year.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Banknote className="w-5 h-5 text-amber-500 mt-1" />
                                <div>
                                    <span className="block font-bold text-slate-800 text-sm">Funding Usage</span>
                                    <span className="text-xs text-slate-500">Strict reinvestment of funds into objectives.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                <h4 className="flex items-center justify-center gap-2 mb-2 text-lg font-bold text-red-700">
                    <Zap className="w-5 h-5" /> Non-Compliance Penalty
                </h4>
                <p className="text-sm text-red-600">
                    Violation of objectives or profit distribution can result in fines of **₹10 Lakh to ₹1 Crore**, license revocation, and penalties for directors.
                </p>
            </div>
        </div>
    </section>
);

const Section8WhyBizzfiling = () => (
    <section id="sec8-why-Bizzfiling" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Bizzfiling Advantage"
                description="Your trusted partner for effortless Section 8 incorporation."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
                {section8WhyBizzfiling.map((service, i) => {
                    const [title, detail] = service.split(':').map(s => s.trim());
                    const Icon = i % 6 === 0 ? Users : i % 6 === 1 ? Smartphone : i % 6 === 2 ? Clock : i % 6 === 3 ? CheckCircle : i % 6 === 4 ? DollarSign : Landmark;
                    return (
                        <div key={i} className="flex flex-col p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                            <div className="p-3 bg-indigo-50 rounded-lg w-fit text-indigo-600 mb-4">
                                <Icon className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed flex-grow">{detail}</p>
                        </div>
                    );
                })}
            </div>

            <div className="max-w-4xl mx-auto p-8 bg-[#FFF8E1] rounded-2xl border border-[#FFE082] text-center">
                <h4 className="flex items-center justify-center gap-2 mb-4 text-xl font-bold text-amber-900">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                    Registration Fees
                </h4>
                <p className="text-amber-800 text-lg">
                    Approx. **₹15,000 - ₹25,000** (Total Cost). Our plans start from **₹999 + Govt. Fee**.
                </p>
                <p className="text-xs text-amber-700 mt-2">*Government fees vary by state and authorized capital.</p>
            </div>
        </div>
    </section>
);

const Section8FAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="sec8-faqs-content" className="max-w-7xl mx-auto py-20 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Got questions? We have answers."
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
export default function Section8RegistrationPage() {
    const [activeTab, setActiveTab] = useState(section8Tabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = section8Tabs.map(tab => tab.id);

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
                                    Section 8 <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>

                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert-assisted Section 8 registration with **fast turnaround time**. **12A, 80G, FCRA** and compliance support included.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Name Approval & License under Section 8</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Drafting of MOA & AOA as per Companies Act</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">DIN & DSC for Directors</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Incorporation Certificate & PAN/TAN</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Fast Approval</span>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Tax Exemptions</span>
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
                                            Start your Non-Profit journey today.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Section 8 Registration" btnText="Register Now" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>



            {/* === Main Content Tabs Navigation (Sticky) === */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-0">
                        {section8Tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabClick(tab.id)}
                                className={`
                                    whitespace-nowrap py-5 text-sm md:text-base font-bold transition-all duration-200 relative px-4
                                    ${activeTab === tab.id ? 'text-[#00695C]' : 'text-slate-500 hover:text-slate-800'}
                                `}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00695C]"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* === All Tab Content Sections Rendered Sequentially === */}
            <div className="px-4 py-2 md:py-4 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <Section8OverviewContent />
                    <Section8BenefitsContent />
                    <Section8EligibilityContent />
                    <Section8DocumentsContent />
                    <Section8ProcessContent />
                    <Section8ComplianceLawContent />
                    <Section8WhyBizzfiling />
                    <Section8FAQsContent faqs={section8FAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
                </div>
            </div>

        </div>
    );
}