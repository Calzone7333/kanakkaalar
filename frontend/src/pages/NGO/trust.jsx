import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
    ChevronDown,
    Zap, // For Credibility/Fast Service
    Briefcase, // For Legal/Professional Filings
    ArrowRight,
    Star,
    CheckCircle,
    FileText, // For document/Trust Deed
    Scale, // For Legal Protection/Compliance
    Handshake, // For Settlor/Trustees/Fiduciary Relationship
    TrendingUp, // For Growth/Tax Benefits
    Lightbulb, // For Expert Consultation/Avoiding Mistakes
    Users, // For Trustees/Beneficiaries/Members
    DollarSign, // For Cost/Fees/Financial Advantages
    Clock, // For Fast Service/Time
    Landmark, // For Acts Governing/Legal Recognition
    MapPin,
    Globe // For Address Proof/Location
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/trust_hero_bg.png"; // Specific background

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

// --- TRUST REGISTRATION STATIC DATA DEFINITIONS ---

const trustTabs = [
    { id: 'trust-overview-content', label: 'Overview' },
    { id: 'trust-types-benefits-content', label: 'Types & Benefits' },
    { id: 'trust-who-register-content', label: 'Who Should Register' },
    { id: 'trust-documents-content', label: 'Trust Deed & Docs' },
    { id: 'trust-process-content', label: 'Step-by-Step Process' },
    { id: 'trust-mistakes-content', label: 'Common Mistakes' },
    { id: 'trust-why-Bizzfiling', label: 'How Bizzfiling' },
    { id: 'trust-faqs-content', label: "FAQ's" },
];

const trustTypes = [
    { title: "Charitable Trusts", detail: "Established for the benefit of the public (education, healthcare). Qualify for tax exemptions.", icon: TrendingUp },
    { title: "Private Trusts", detail: "Created for specific individuals or family members (estate/wealth planning). Do not qualify for public tax exemptions.", icon: Users },
    { title: "Public Trusts", detail: "Created for the welfare of the general public. Operate on donations and monitored by the charity commissioner.", icon: Globe },
    { title: "Religious Trusts", detail: "Formed for promoting religious beliefs or managing temples and spiritual establishments.", icon: Landmark },
    { title: "Revocable & Irrevocable", detail: "Revocable trusts can be modified/cancelled by the settlor; irrevocable cannot be altered once established.", icon: Clock },
    { title: "Testamentary Trusts", detail: "Created through a will and only come into effect after the settlor's death.", icon: FileText },
];

const trustBenefits = [
    { title: "Legal Protection", icon: Scale, detail: "Ensures legal rights over trust property and helps avoid future disputes." },
    { title: "Tax Benefits (80G & 12A)", icon: DollarSign, detail: "Registered charitable trusts are eligible for 80G and 12A exemptions under the Income Tax Act." },
    { title: "Public Credibility", icon: Zap, detail: "Registration increases donor confidence and transparency, enhancing trust." },
    { title: "Access Government Benefits", icon: CheckCircle, detail: "State and central schemes often require a registered legal status." },
    { title: "Proper Administration", icon: Briefcase, detail: "Clear roles and responsibilities are defined in the legally registered trust deed." },
    { title: "Financial Advantages", icon: TrendingUp, detail: "Easier to open a bank account, receive donations, and manage funds." },
];

const trustWhoShouldRegister = [
    "NGO Founders: Looking for NGO registration to run public welfare projects.",
    "Individuals & Families: Managing ancestral wealth or property through a private trust.",
    "Religious Groups: Establishing religious trusts to manage temples or spiritual activities.",
    "Philanthropists: Setting up charitable trusts for education, health, or public service.",
    "Settlor/Trustees: Anyone wanting to legally establish a structured legal arrangement to transfer assets.",
];

const trustDeedKeyClauses = [
    "Name Clause: Legal name under which the trust operates.",
    "Objective Clause: Specifies the main charitable or private purpose of the trust.",
    "Trustees Clause: Responsibilities and powers of the trustees.",
    "Beneficiaries Clause: Rights of those benefiting from the trust.",
    "Property Clause: Description of the movable or immovable property of the trust.",
    "Dissolution Clause: Terms under which the trust may be dissolved.",
];

const trustDocuments = [
    { title: "Trust Deed", icon: FileText, detail: "Must be drafted on non-judicial stamp paper." },
    { title: "ID Proofs", icon: Users, detail: "Aadhar/PAN/Passport of Settlor and all Trustees." },
    { title: "Address Proofs", icon: MapPin, detail: "Address proof of Settlor and Trustees." },
    { title: "Trust PAN Card", icon: DollarSign, detail: "Required for tax compliance." },
    { title: "NOC & Utility Bill", icon: MapPin, detail: "No-objection certificate and utility bill (of the office/trust property)." },
];

const trustKeyParties = [
    { title: "Settlor", detail: "The person who forms the trust by transferring property.", icon: Handshake },
    { title: "Trustee(s)", detail: "Manage the trust per the trust deed. Minimum of two required.", icon: Users },
    { title: "Beneficiaries", detail: "Individuals or entities receiving the trust’s benefits.", icon: CheckCircle },
    { title: "Registrar / Charity Commissioner", detail: "Approves registration and oversees public trusts.", icon: Landmark },
];

const trustRegistrationProcess = [
    "Choose Name: Must be distinct and comply with the Emblems and Names Act.",
    "Select Settlor and Trustees: Must be Indian residents; minimum two trustees.",
    "Draft Trust Deed: Prepare on non-judicial stamp paper with all necessary clauses.",
    "Submit to Registrar: Along with PAN, address proof, ID proof, etc., to the relevant Registrar/Charity Commissioner.",
    "Obtain Trust Registration Certificate: Once approved, the formal legal certificate is issued.",
    "Open Bank Account: In the name of the registered trust for financial management.",
];

const trustCommonMistakes = [
    "Invalid Trust Deed: Missing or vague clauses. Ensure professional drafting for a compliant format.",
    "Incomplete Documents: Missing PAN or address proof. We provide a full checklist to avoid delays.",
    "Wrong Trust Type: Choosing a private trust when a public/charitable structure is needed. Our advisors guide you.",
    "Improper Trustee Roles: Vaguely defined or conflicting responsibilities. We help establish clear governance.",
    "Not Registering the Deed: Without registration, the trust lacks the essential legal validity and official status.",
];

const trustBizzfilingServices = [
    { step: "Legal Consultation", detail: "Expert advice on choosing the appropriate trust type and structuring the trust deed for maximum compliance and benefit.", icon: Lightbulb },
    { step: "Document Preparation", detail: "Professional drafting of the trust deed, MOA, and accurate preparation of all application forms and necessary affidavits.", icon: FileText },
    { step: "Filing & Submission", detail: "Complete end-to-end registration support, submitting all documents to the Registrar/Charity Commissioner.", icon: Briefcase },
    { step: "Certificate Issuance", detail: "Fast and reliable service to obtain your official trust registration certificate and open the trust's bank account.", icon: Zap },
];

const trustBizzfilingPackages = [
    { name: "Basic Plan", cost: "₹4,999 + GST", detail: "Includes expert consultation and documentation drafting (excluding government fees)." },
    { name: "Premium Plan", cost: "₹9,999 + GST", detail: "Includes complete filing, legal support, and assistance with 80G/12A applications (excluding government fees)." },
];

const trustFAQs = [
    { q: "How can a trust be registered?", a: "A trust is registered by preparing a Trust Deed on non-judicial stamp paper and submitting it along with necessary identity and address proofs of the Settlor and Trustees to the local Registrar or Charity Commissioner." },
    { q: "Is trust registration mandatory?", a: "No, trust registration is technically not mandatory under the Indian Trusts Act, but it is **highly recommended** as it is required to obtain tax exemptions (12A/80G), receive grants, and establish legal recognition." },
    { q: "Can a trust be registered online?", a: "The entire process cannot be fully online as the trust deed must be physically signed and notarized/registered. However, the initial consultation, document drafting, and filing preparation are managed **100% online** with Bizzfiling." },
    { q: "How many members are required for trust registration?", a: "A trust requires a minimum of **two trustees** (and one Settlor) to be legally registered and functional." },
    { q: "What are the benefits of trust registration?", a: "Benefits include **legal protection** of property, eligibility for **tax exemptions** (12A & 80G), access to **government grants**, and enhanced **public credibility** for fundraising." },
    { q: "How long does it take to register a trust in India?", a: "The time taken depends on the state and registrar's workload, but typically ranges from **7 to 14 working days** after the submission of the notarized/registered trust deed." },
];

// --- REUSABLE COMPONENTS ---



// --- TAB CONTENT COMPONENTS (Trust Registration Content) ---

const TrustOverviewContent = () => (
    <section id="trust-overview-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Overview"
                title="Trust Registration India"
                description="Legally establishing a trust for charitable or private purposes."
            />
            <div className="max-w-4xl mx-auto space-y-8">
                <p className="text-lg text-slate-600 leading-relaxed text-center">
                    Trust registration refers to the formal process of legally establishing a trust under the Indian Trusts Act. A trust is a legal arrangement where a person (settlor) transfers property to trustees, who manage it for the benefit of designated beneficiaries.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed text-center">
                    While not strictly mandatory, **registering a trust provides legal recognition**, enhances public credibility, and is essential for eligibility for **tax exemptions (12A & 80G)** and government grants under the Income Tax Act.
                </p>

                <div className="bg-[#F8FDFC] border border-[#E0F2F1] rounded-2xl p-8">
                    <h4 className="text-xl font-bold text-slate-800 mb-6 text-center">Governing Acts</h4>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <Landmark className="w-8 h-8 text-[#00695C] mb-3" />
                            <h5 className="font-bold text-slate-800 text-sm mb-2">Indian Trusts Act, 1882</h5>
                            <p className="text-xs text-slate-500">Applicable mainly to private trusts.</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <FileText className="w-8 h-8 text-[#00695C] mb-3" />
                            <h5 className="font-bold text-slate-800 text-sm mb-2">Charitable & Religious Trusts Act, 1920</h5>
                            <p className="text-xs text-slate-500">Pertains to public charitable and religious trusts.</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <TrendingUp className="w-8 h-8 text-[#00695C] mb-3" />
                            <h5 className="font-bold text-slate-800 text-sm mb-2">Income Tax Act, 1961</h5>
                            <p className="text-xs text-slate-500">Governs tax exemptions (12A & 80G).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TrustTypesBenefitsContent = () => (
    <section id="trust-types-benefits-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Types & Benefits"
                title="Trust Classification"
                description="Understanding different trust structures and their advantages."
            />

            <div className="space-y-16">
                <div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-8 text-center">Types of Trusts</h4>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {trustTypes.map((item, i) => (
                            <div key={i} className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-[#00695C] mb-4 group-hover:bg-[#00695C] group-hover:text-white transition-colors">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-8 text-center">Why Register a Trust?</h4>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {trustBenefits.map((benefit, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
                                <div className="flex-shrink-0">
                                    <benefit.icon className="w-6 h-6 text-[#00695C]" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm mb-1">{benefit.title}</h5>
                                    <p className="text-xs text-slate-500 leading-relaxed">{benefit.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TrustWhoShouldRegisterContent = () => (
    <section id="trust-who-register-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Eligibility"
                title="Who Should Register"
                description="Suitable applicants for Trust Registration."
            />

            <div className="max-w-4xl mx-auto bg-[#F8FAFC] rounded-2xl p-8 border border-slate-100">
                <p className="text-center text-slate-600 mb-8 text-lg">
                    Registration is suitable for a wide range of individuals and groups aiming to manage assets or run public welfare projects under a legally structured fiduciary relationship.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    {trustWhoShouldRegister.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#00695C] transition-colors">
                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 text-[#00695C]">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const TrustDocumentsContent = () => (
    <section id="trust-documents-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Documentation"
                title="Trust Deed & Requirements"
                description="Essential documents for registration."
            />

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Trust Deed & Clauses */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="text-[#00695C]" /> The Trust Deed
                    </h4>
                    <p className="text-slate-600 mb-6 text-sm">
                        The trust deed is the legal backbone, outlining the terms, structure, objectives, and responsibilities. It must be prepared on non-judicial stamp paper.
                    </p>
                    <ul className="space-y-3">
                        {trustDeedKeyClauses.map((clause, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span><strong className="text-slate-900">{clause.split(':')[0]}:</strong> {clause.split(':')[1]}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-8">
                    {/* Key Parties */}
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-4">Key Parties</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {trustKeyParties.map((party, i) => (
                                <div key={i} className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2">
                                        <party.icon className="w-5 h-5 text-[#00695C]" />
                                        <h5 className="font-bold text-slate-800 text-sm">{party.title}</h5>
                                    </div>
                                    <p className="text-xs text-slate-500">{party.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Required Docs */}
                    <div>
                        <h4 className="text-xl font-bold text-slate-800 mb-4">Required Documents</h4>
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-100">
                            {trustDocuments.map((doc, i) => (
                                <div key={i} className="p-4 flex items-center gap-4">
                                    <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                                        <doc.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{doc.title}</p>
                                        <p className="text-xs text-slate-500">{doc.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const TrustProcessContent = () => (
    <section id="trust-process-content" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Process"
                title="Registration Steps"
                description="Step-by-step guide to registering your trust."
            />

            <div className="max-w-4xl mx-auto">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {trustRegistrationProcess.map((step, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-[#00695C] text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10 transition-colors">
                                {i + 1}
                            </div>

                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-slate-100 bg-white shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-1">{step.split(':')[0]}</h4>
                                <p className="text-sm text-slate-500">{step.split(':')[1] || step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const TrustMistakesContent = () => (
    <section id="trust-mistakes-content" className="py-20 scroll-mt-24 bg-[#FFF8E1]/30">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Caution"
                title="Common Mistakes"
                description="Pitfalls to avoid during registration."
            />
            <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
                {trustCommonMistakes.map((mistake, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 bg-white border border-yellow-200 shadow-sm rounded-xl">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 flex-shrink-0">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="mb-1 text-lg font-bold text-slate-800">{mistake.split(':')[0]}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{mistake.split(':')[1] ? mistake.split(':')[1].trim() : ""}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TrustWhyBizzfiling = () => (
    <section id="trust-why-Bizzfiling" className="py-20 scroll-mt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Bizzfiling Advantage"
                description="Simplifying your Trust journey."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
                {trustBizzfilingServices.map((item, i) => (
                    <div key={i} className="p-6 bg-[#F8FAFC] border border-slate-100 rounded-xl text-center group hover:shadow-lg transition-all">
                        <div className="w-12 h-12 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center text-[#00695C] mb-4 group-hover:scale-110 transition-transform">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2">{item.step}</h4>
                        <p className="text-sm text-slate-500">{item.detail}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#F0F4F8] rounded-2xl p-8 max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold text-slate-800 mb-8 text-center">Registration Packages</h4>
                <div className="grid md:grid-cols-2 gap-8">
                    {trustBizzfilingPackages.map((pkg, i) => (
                        <div key={i} className={`p-6 rounded-xl border-2 ${i === 1 ? 'bg-white border-[#00695C] shadow-lg relative' : 'bg-slate-50 border-slate-200'}`}>
                            {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00695C] text-white px-3 py-1 text-xs font-bold rounded-full">Recommended</span>}
                            <h5 className="text-lg font-bold text-slate-900 mb-2">{pkg.name}</h5>
                            <div className="text-3xl font-extrabold text-[#00695C] mb-4">{pkg.cost}</div>
                            <p className="text-sm text-slate-600 leading-relaxed">{pkg.detail}</p>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-400 mt-6">*Stamp duty and state-specific fees extra.</p>
            </div>
        </div>
    </section>
);

const TrustFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="trust-faqs-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="FAQ"
                title="Frequently Asked Questions"
                description="Expert answers to common queries."
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
        </div>
    </section>
);


// --- MAIN COMPONENT ---
export default function TrustRegistrationPage() {
    const [activeTab, setActiveTab] = useState(trustTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = trustTabs.map(tab => tab.id);

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
                                    Trust Registration <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Online India</span>
                                </h1>

                                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert-assisted **100% online** trust registration preparation process. All paperwork and filings handled by **legal professionals**.
                                </p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Professional Drafting of Trust Deed by Legal Experts</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Registration with Local Sub-Registrar</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Assistance with PAN Card Application for Trust</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Guidance on 12A & 80G Tax Exemption</span>
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
                                            Start your Trust Registration today.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Trust Registration" btnText="Register Now" />
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
                        {trustTabs.map((tab) => (
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
            <div className="bg-slate-50">
                <TrustOverviewContent />
                <TrustTypesBenefitsContent />
                <TrustWhoShouldRegisterContent />
                <TrustDocumentsContent />
                <TrustProcessContent />
                <TrustMistakesContent />
                <TrustWhyBizzfiling />
                <TrustFAQsContent faqs={trustFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
            </div>

        </div>
    );
}