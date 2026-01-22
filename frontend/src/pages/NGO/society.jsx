import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
import {
    ChevronDown,
    Zap, // For Credibility/Fast Service
    Briefcase, // For Legal/Professional Filings/Governance
    ArrowRight,
    Star,
    CheckCircle, // For Checklist/Compliance/Legal Identity
    FileText, // For document/MOA/Bylaws
    Scale, // For Legal Status/Compliance
    Handshake, // For Consultation/Voluntary Association
    TrendingUp, // For Tax Benefits/Grants
    Lightbulb, // For Expert Guidance/Updates
    Users, // For Members/Governing Body
    DollarSign, // For Cost/Fees
    Clock, // For Fast Service/Timeline
    Landmark, // For Societies Registration Act/Registrar
    MapPin, // For Address Proof/Office
    BookOpen, // For Acts/Rules and Regulations
    RefreshCw,
    Calculator,
    Globe // For Renewal
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from '../../assets/society_hero_bg.png'; // Specific background

// --- SOCIETY REGISTRATION STATIC DATA DEFINITIONS ---

const societyTabs = [
    { id: 'society-overview-content', label: 'Overview' },
    { id: 'society-benefits-content', label: 'Benefits' },
    { id: 'society-eligibility-content', label: 'Eligibility' },
    { id: 'society-documents-process-content', label: 'Process & Docs' },
    { id: 'society-pricing-content', label: 'Pricing' },
    { id: 'society-compliance-renewal-content', label: 'Compliance & Renewal' },
    { id: 'society-why-Bizzfiling', label: 'Why Bizzfiling?' },
    { id: 'society-faqs-content', label: "FAQ's" },
];

const societyEligibility = [
    "Who Can Register: Indian citizens, foreign nationals (with prior approval), companies, and other registered bodies.",
    "Minimum Members: At least seven members are required to register a society in most Indian states.",
    "Types of Societies: Societies formed for charitable activities, education, religion, culture, arts, sports, or public welfare.",
    "Non-Profit Intent: All eligible forms must function with a clear non-profit intent.",
];

const societyBenefits = [
    { title: "Legal Recognition for NGO", icon: CheckCircle, detail: "Gains separate legal identity, allowing it to enter contracts, sue/be sued, and hold property in its own name." },
    { title: "Tax Exemption for Societies", icon: TrendingUp, detail: "Eligible for income tax exemptions under Sections 12A and 80G of the Income Tax Act." },
    { title: "Enhanced NGO Credibility", icon: Zap, detail: "Registration builds public trust, making it easier to attract volunteers, donors, and government support." },
    { title: "Access to Funding and Grants", icon: DollarSign, detail: "Qualifies for government schemes, international aid programs, and private grants." },
    { title: "Structured Management", icon: Briefcase, detail: "Operates under a Memorandum of Association and rules, ensuring transparency and democratic functioning." },
    { title: "Eligibility for FCRA", icon: Scale, detail: "Prerequisite for applying under the Foreign Contribution Regulation Act (FCRA) for foreign funding." },
    { title: "Operational Continuity", icon: Clock, detail: "Enjoys perpetual succession, ensuring continued existence despite changes in membership." },
];

const societyRequiredDocuments = [
    { title: "MOA & Rules", icon: FileText, detail: "Memorandum of Association (MOA) and Rules & Regulations/Bylaws signed by all founding members." },
    { title: "Member IDs & Address Proof", icon: Users, detail: "PAN Card or Aadhaar Card of all founding members, plus passport for foreign nationals." },
    { title: "Office Address Proof", icon: MapPin, detail: "Rent Agreement or Property Ownership Document, NOC from the owner, and a recent Utility Bill of the registered office." },
    { title: "Affidavit & Cover Letter", icon: FileText, detail: "Affidavit declaring the society’s name is unique, along with a covering letter requesting registration." },
];

const societyRegistrationProcess = [
    "Choose and Reserve a Unique Name: Ensure the name is not identical to any existing registered society.",
    "Prepare the Memorandum of Association (MOA): Draft the objectives, member details, and office address.",
    "Draft Rules and Regulations: Create the bylaws defining membership, meeting procedures, and governance structure.",
    "Collect and Verify Required Documents: Gather ID/address proofs, MOA/Rules, NOC, and affidavits.",
    "Apply on the State Portal/Registrar: Fill and upload documents online via the state's official society registration portal (or physical submission in some states).",
    "Pay the Registration Fee: Submit the prescribed fee through the portal or offline.",
    "Verification and Issuance of Certificate: The Registrar reviews and issues the Certificate of Registration, granting legal status.",
];

const societyPostRegistrationCompliance = [
    { title: "Maintain Proper Accounts", icon: Calculator, detail: "Maintain accurate financial records and supporting documents for all transactions." },
    { title: "Conduct Annual Audits", icon: Briefcase, detail: "Financial statements must be audited annually by a certified Chartered Accountant." },
    { title: "File Annual Returns", icon: Landmark, detail: "Submit an annual report, audited financials, and member list to the Registrar of Societies." },
    { title: "Income Tax Compliance (12A & 80G)", icon: TrendingUp, detail: "File Form 10A for 12A exemption and apply for 80G for donor tax benefits." },
    { title: "FCRA Compliance", icon: Globe, detail: "Obtain and maintain FCRA registration and file annual returns if receiving foreign donations." },
    { title: "Update Changes", icon: RefreshCw, detail: "Report any change in governing body, registered address, or bylaws to the Registrar." },
];

const societyRenewalProcess = [
    "Check Renewal Deadline: Most societies are required to renew their registration annually or bi-annually (varies by state).",
    "Gather Documents: Collect the original registration certificate, bylaws, minutes of the annual general meeting, and list of current office bearers.",
    "Online Submission: Log in to the online registration portal using society's credentials.",
    "Update Details: Provide and update all required details, including name, registration number, and office details.",
    "Submit Documents & Fee: Submit all documents and pay the renewal fee online.",
];

const societyWhyBizzfiling = [
    "Thorough Consultation: Fully grasp all your needs and walk you through the entire process of Online Society Registration Certificate.",
    "Complete Paperwork: We will provide you with all the papers required to be submitted for society registration online, and keep you updated on its development.",
    "Expert-Guided Process: We assist you with all Society registration-related steps and procedures, guiding your every step of the way.",
    "Hassle-Free Filing: Attorneys fill out all the paperwork and submit the online application of Society Registration on your behalf, so you don't need to be present.",
    "Data Security: Your work is secure with us, and so are your data. Any questions you may have can be answered by our support staff.",
];

const societyPlans = [
    {
        title: "Drafting Only",
        price: "₹4,999",
        originalPrice: "₹7,999",
        description: "Professional drafting of Society MoA & Bylaws.",
        features: [
            "MoA Drafting",
            "Bylaws & Rules Drafting",
            "Affidavit Preparation",
            "Document Verification",
            "Registration Guidance"
        ],
        isRecommended: false,
    },
    {
        title: "Standard Registration",
        price: "₹11,999",
        originalPrice: "₹14,999",
        description: "Complete Society Registration Service.",
        features: [
            "Name Reservation Assistance",
            "MoA & Bylaws Drafting",
            "Filing with Registrar",
            "Follow-up with Officials",
            "Registration Certificate",
            "PAN Card Assistance"
        ],
        isRecommended: true,
    },
    {
        title: "Compliance Pro",
        price: "₹19,999",
        originalPrice: "₹24,999",
        description: "Registration + Annual Compliance Support.",
        features: [
            "Includes Standard Registration",
            "12A & 80G Registration Support",
            "Annual List of Members Filing",
            "Documentation for Bank Account",
            "Priority Support",
            "Legal Consultation"
        ],
        isRecommended: false,
        isPremium: true,
    },
];

const societyFAQs = [
    { q: "What is the Society Registration Act?", a: "The **Societies Registration Act, 1860**, is the central law that governs the formation, operation, and regulation of societies established for charitable, literary, scientific, or social welfare purposes in India." },
    { q: "What is the minimum number of members for society registration?", a: "A minimum of **seven members** is generally required to register a society in most Indian states." },
    { q: "How much does it cost to register a society in India?", a: "The cost involves a **Government Registration Fee (₹500 to ₹1,500)** plus professional charges (if using an expert). The total time estimate is typically **2 to 4 weeks**." },
    { q: "What are the main components of a memorandum of association of a society?", a: "The MOA contains the society’s **name, objectives**, and the **names, addresses, and occupations** of all the founding members and the Governing Body." },
    { q: "Can members of society receive profits?", a: "No, a registered society operates on a **non-profit basis**. Any income or surplus must be reinvested back into the society to promote its declared social objectives and cannot be distributed to members." },
    { q: "Is society or trust preferable?", a: "Societies are generally preferred for **larger membership groups** and operational bodies like schools or cultural associations, while Trusts are simpler and often used for **wealth management/smaller charitable endowments**." },
    { q: "Does society have legal status?", a: "Yes, once registered under the Act, a society gains a **separate legal identity** (like a company), allowing it to own property, enter contracts, and sue in its own name." },
];

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

const FeatureBox = ({ title, detail, icon: Icon }) => (
    <div className="flex items-start gap-5 p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-[#E0F2F1] text-[#00695C] flex items-center justify-center flex-shrink-0 group-hover:bg-[#00695C] group-hover:text-white transition-colors duration-300">
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{title}</h4>
            <p className="text-base text-slate-600 leading-relaxed">{detail}</p>
        </div>
    </div>
);

// --- TAB CONTENT COMPONENTS (Society Registration Content) ---

const SocietyOverviewContent = () => (
    <section id="society-overview-content" className="py-12 md:py-16 scroll-mt-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:items-center">
                <div>
                    <div className="inline-flex items-center gap-5 px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00695C] text-sm font-bold uppercase tracking-wider mb-6">
                        <Users className="w-4 h-4" /> Overview
                    </div>
                    <h2 className="text-3xl md:text-3xl font-extrabold text-[#0D1B2A] mb-6 leading-tight">
                        Online Society <span className="text-[#00695C]">Registration in India</span>
                    </h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                        **Society registration** is a legal process providing formal recognition to organisations formed for **charitable, literary, scientific, religious, or social welfare purposes**. It is ideal for voluntary organisations, cultural groups, or educational institutions.
                    </p>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        The process is governed by the **Societies Registration Act, 1860**. Registration grants a **separate legal identity**, increases reliability, and ensures qualification for state schemes, foreign donations, and tax exemptions.
                    </p>

                    <div className="grid sm:grid-cols-2 gap-10">
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#00695C]/30 transition-colors">
                            <h4 className="flex items-center gap-5 mb-3 text-xl font-bold text-slate-800">
                                <Users className="w-5 h-5 text-[#00695C]" /> What is Society?
                            </h4>
                            <p className="text-base text-slate-600 leading-relaxed">
                                A society is a group of individuals who come together voluntarily to promote common interests such as charity, education, art, literature, or public welfare on a non-profit basis.
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#00695C]/30 transition-colors">
                            <h4 className="flex items-center gap-5 mb-3 text-xl font-bold text-slate-800">
                                <Landmark className="w-5 h-5 text-[#00695C]" /> Registration
                            </h4>
                            <p className="text-base text-slate-600 leading-relaxed">
                                The formal process of legally registering such a group under the **Societies Registration Act, 1860**, giving it a separate legal identity to own property, enter contracts, and access funding.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative lg:h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#00695C]/20 to-transparent rounded-2xl transform rotate-3"></div>
                    <img
                        src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Start Ngo"
                        className="relative rounded-2xl shadow-2xl w-full h-full object-cover transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                    />
                </div>
            </div>
        </div>
    </section>
);

const SocietyBenefitsContent = () => (
    <section id="society-benefits-content" className="max-w-7xl mx-auto py-12 md:py-16 scroll-mt-24 px-4 bg-[#F8FDFC]">
        <SectionHeading
            subtitle="Advantages"
            title="Benefits of Registering a Society"
            description="Registering a Society in India offers crucial legal, financial, and operational advantages, especially for non-profit organisations like NGOs."
        />

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {societyBenefits.map((item, i) => (
                <FeatureBox key={i} title={item.title} detail={item.detail} icon={item.icon} />
            ))}
        </div>
    </section>
);

const SocietyEligibilityContent = () => (
    <section id="society-eligibility-content" className="py-12 md:py-16 scroll-mt-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
            <SectionHeading
                subtitle="Requirements"
                title="Eligibility Criteria"
                description="These criteria ensure that only genuine and organized groups receive legal recognition for their charitable or non-profit objectives under the Societies Registration Act, 1860."
            />

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 relative">
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#C59B4E]/10 rounded-full blur-3xl"></div>
                    <div className="grid gap-5">
                        {societyEligibility.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-5 p-5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-[#00695C]/30 transition-all"
                            >
                                <div className="mt-1 p-1 rounded-full bg-emerald-50">
                                    <CheckCircle className="w-5 h-5 text-[#00695C]" />
                                </div>
                                <span className="text-lg text-slate-700 leading-relaxed font-medium">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                        <h4 className="text-2xl font-bold text-[#0D1B2A] mb-6">Common Reasons for Society Registration</h4>
                        <div className="grid gap-5">
                            {[
                                "To support arts, literature and science promotion.",
                                "Political education dissemination.",
                                "Establishing funds for military orphans.",
                                "Building public museums and galleries.",
                                "Promotion of useful knowledge and construction of public libraries.",
                                "Assemblages of mechanical and philosophical designs."
                            ].map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-5">
                                    <div className="w-2 h-2 rounded-full bg-[#C59B4E]"></div>
                                    <span className="text-slate-600 text-sm md:text-base">{reason}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SocietyDocumentsProcessContent = () => (
    <section id="society-documents-process-content" className="py-12 md:py-16 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
            <SectionHeading
                subtitle="Workflow"
                title="Documents & Process"
                description="A complete checklist and step-by-step guide to Society Registration."
            />

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Documents Column */}
                <div>
                    <h3 className="text-2xl font-bold text-[#0D1B2A] mb-8 flex items-center gap-5">
                        <div className="p-2 bg-[#E0F2F1] rounded-lg">
                            <FileText className="w-6 h-6 text-[#00695C]" />
                        </div>
                        Required Documents
                    </h3>
                    <div className="space-y-8">
                        {societyRequiredDocuments.map((doc, i) => (
                            <div key={i} className="flex items-start gap-5 p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                                <div className="p-2 bg-slate-50 rounded-lg text-[#00695C]">
                                    <doc.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-800 mb-1">{doc.title}</h4>
                                    <p className="text-base text-slate-600 leading-relaxed">{doc.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Process Column */}
                <div>
                    <h3 className="text-2xl font-bold text-[#0D1B2A] mb-8 flex items-center gap-5">
                        <div className="p-2 bg-[#FFF3E0] rounded-lg">
                            <Zap className="w-6 h-6 text-amber-600" />
                        </div>
                        Registration Process
                    </h3>
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-4">
                        {societyRegistrationProcess.map((step, i) => (
                            <div key={i} className="relative pl-8 group">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-300 group-hover:border-[#00695C] transition-colors"></div>
                                <h5 className="text-xl font-bold text-slate-800 mb-1">Step {i + 1}</h5>
                                <p className="text-slate-600 leading-relaxed text-base lg:text-lg">{step}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-8 bg-[#FFF8E1] rounded-2xl border border-[#FFE082] text-center">
                        <h4 className="flex items-center justify-center gap-5 mb-4 text-xl font-bold text-amber-900">
                            <DollarSign className="w-6 h-6 text-amber-600" />
                            Fees & Timeline
                        </h4>
                        <div className="space-y-8 text-amber-800">
                            <p className="text-lg">Govt Fee: **₹500 - ₹1,500**</p>
                            <p className="text-lg">Professional Fee: **Optional**</p>
                            <p className="text-xl font-bold mt-2">Time: 2 to 4 Weeks</p>
                        </div>
                        <p className="text-sm text-amber-700 mt-4">*Government fees vary by state and state norms.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SocietyComplianceRenewalContent = () => (
    <section id="society-compliance-renewal-content" className="py-12 md:py-16 scroll-mt-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
            <SectionHeading
                subtitle="Maintenance"
                title="Compliance & Renewal"
                description="Crucial post-registration obligations to keep your Society legal and active."
            />

            <div className="grid lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-[#0D1B2A] mb-6">Annual Compliance</h3>
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                        <div className="space-y-8">
                            {societyPostRegistrationCompliance.map((item, i) => (
                                <div key={i} className="flex items-start gap-5 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <item.icon className="w-5 h-5 text-[#C59B4E] mt-1 flex-shrink-0" />
                                    <div>
                                        <h5 className="font-bold text-slate-800 mb-1 text-lg">{item.title}</h5>
                                        <p className="text-base text-slate-600 leading-relaxed">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-[#0D1B2A] mb-6">Renewal Process</h3>
                    <div className="bg-[#E0F2F1] rounded-2xl p-8 border border-[#B2DFDB]">
                        <h4 className="flex items-center gap-5 mb-6 text-xl font-bold text-[#00695C]">
                            <RefreshCw className="w-6 h-6" /> Online Renewal Steps
                        </h4>
                        <ul className="space-y-8">
                            {societyRenewalProcess.map((step, i) => (
                                <li key={i} className="flex items-start gap-5">
                                    <div className="w-6 h-6 rounded-full bg-white text-[#00695C] border border-[#00695C] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </div>
                                    <span className="text-slate-700 font-medium text-lg">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SocietyPricingContent = () => (
    <section id="society-pricing-content" className="py-12 md:py-16 scroll-mt-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Pricing"
                title="Society Registration Packages"
                description="Choose the right plan for your community."
            />
            <PricingCards plans={societyPlans} serviceName="Society Registration" />
        </div>
    </section>
);

const SocietyWhyBizzfiling = () => (
    <section id="society-why-Bizzfiling" className="py-12 md:py-16 scroll-mt-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading
                subtitle="Why Choose Us"
                title="Bizzfiling Advantage"
                description="We provide comprehensive support, ensuring your society is registered quickly and legally."
            />

            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {societyWhyBizzfiling.map((service, i) => {
                    const [title, detail] = service.split(':').map(s => s.trim());
                    const Icon = i % 5 === 0 ? Handshake : i % 5 === 1 ? FileText : i % 5 === 2 ? Lightbulb : i % 5 === 3 ? Briefcase : Zap;
                    return (
                        <FeatureBox key={i} title={title} detail={detail} icon={Icon} />
                    );
                })}
            </div>

            <div className="bg-[#E0F7FA] p-8 rounded-xl border-l-[6px] border-[#006064] shadow-md max-w-4xl mx-auto">
                <div className="flex items-start gap-5">
                    <Lightbulb className="w-8 h-8 text-[#006064] flex-shrink-0" />
                    <div>
                        <h4 className="text-xl font-bold text-[#006064] mb-2">Recent Legal Update (2021 Amendment)</h4>
                        <p className="text-slate-700 leading-relaxed font-medium text-lg">
                            With the implementation of the **Societies Registration (Amendment) Act, 2021** (e.g., in some states like UP), anyone sentenced to two years or more is no longer eligible to serve as a member or office holder of a registered society.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const SocietyFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
    <section id="society-faqs-content" className="max-w-7xl mx-auto py-12 md:py-16 scroll-mt-24 px-4 bg-[#F8FAFC]">
        <SectionHeading
            subtitle="FAQ"
            title="Frequently Asked Questions"
            description="Find answers to common queries about Society Registration."
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
export default function SocietyRegistrationPage() {
    const [activeTab, setActiveTab] = useState(societyTabs[0].id);
    const [faqOpen, setFaqOpen] = useState(null);

    const SCROLL_OFFSET = 120;

    // --- SCROLLSPY IMPLEMENTATION ---
    useEffect(() => {
        const sectionIds = societyTabs.map(tab => tab.id);

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
                                    Society <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>

                                <p className="text-sm md:text-base text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                                    Expert-assisted **100% online** Society registration. Draft your Memorandum & Bylaws with **legal experts** for seamless approval.
                                </p>

                                <div className="space-y-8 mb-8">
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Drafting of Memorandum & Bylaws by Experts</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Registration with Registrar of Societies</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Affidavit & NOC Preparation Assistance</span>
                                    </div>
                                    <div className="flex items-start gap-5">
                                        <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                                            <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                        </div>
                                        <span className="text-slate-200 text-sm md:text-base">Support for Election & Managing Committee</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Legal Drafting</span>
                                </div>
                                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Zap className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Quick Renewal</span>
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
                                            Register your Society hassle-free.
                                        </p>
                                    </div>
                                    <LeadForm serviceName="Society Registration" btnText="Register Now" />
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
                        {societyTabs.map((tab) => (
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
                <SocietyOverviewContent />
                <SocietyBenefitsContent />
                <SocietyEligibilityContent />
                <SocietyDocumentsProcessContent />
                <SocietyPricingContent />
                <SocietyComplianceRenewalContent />
                <SocietyWhyBizzfiling />
                <SocietyFAQsContent faqs={societyFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
            </div>

        </div>
    );
}