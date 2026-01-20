import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
import {
  ChevronDown,
  Zap,
  Briefcase,
  ArrowRight,
  Star,
  CheckCircle,
  FileText,
  Scale,
  DollarSign,
  Landmark,
  Clock,
  Key,
  FileSignature,
  Users,
  Globe,
  Shield,
  FileCheck,
  Award,
  Lock,
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck,
  Activity,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- DSC REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
  { id: 'dsc-overview-content', label: 'Overview' },
  { id: 'dsc-benefits-content', label: 'Benefits' },
  { id: 'dsc-eligibility-content', label: 'Eligibility' },
  { id: 'dsc-documents-content', label: 'Documents' },
  { id: 'dsc-procedure-content', label: 'Procedure' },
  { id: 'dsc-fees-content', label: 'Fees' },
  { id: 'dsc-role-content', label: 'Security' },
  { id: 'dsc-faqs-content', label: 'FAQs' },
];

const dscIntroBullets = [
  "Register your Class 3 Digital Signature Certificate online—fast and secure.",
  "Simple 3-step process with expert consultation and full registration support.",
  "Affordable, hassle-free, and fully online with complete documentation assistance.",
];

const dscBenefitsList = [
  { title: "Streamlining Processes", details: "Eliminates the need for physical signatures, speeding up workflows, approvals, and productivity.", icon: Zap },
  { title: "Enhancing Security", details: "Ensures signed documents cannot be altered, reducing the risk of fraud or tampering in business transactions.", icon: Key },
  { title: "Cost Savings", details: "Reduces printing, courier, and storage costs through the paperless nature of digital signatures.", icon: DollarSign },
  { title: "Legal Compliance", details: "Legally recognized under the IT Act 2000 for signing contracts, filing taxes (ITR, GST, ROC), and other regulatory needs.", icon: Scale },
  { title: "E-governance Applications", details: "Speeds up government services like tax returns, tender applications, and form signing, enhancing transparency.", icon: Landmark },
  { title: "Time Savings", details: "Allows for instant online transactions without the need to print, physically sign, and scan documents.", icon: Clock },
];

const dscClassesData = [
  {
    class: "Individual DSC",
    uses: "Personal use, email validation, low-risk transactions, basic document signing.",
    verification: "Verified against basic consumer databases.",
    security: "Basic Security",
  },
  {
    class: "Organization DSC",
    uses: "Organizational use, e-filing (ITR/ROC), company registration, audit reports, business operations.",
    verification: "Verified against trusted, pre-verified databases (moderate security).",
    security: "Medium Security",
  },
  {
    class: "DGFT / Combo DSC",
    uses: "High-security transactions: e-tendering, e-procurement, high-value transactions, GST filings, physical verification.",
    verification: "Requires in-person/video identity verification with Registration Authority (RA).",
    security: "High Security",
  },
];

const dscEligibilitySections = [
  {
    title: "Eligibility Criteria for Individuals",
    content: "Individuals can apply for personal use or to fulfill legal/regulatory requirements like e-verification of returns. Professionals (doctors, lawyers, accountants) can use DSCs for compliance.",
    useCases: ["Personal digital transactions", "Signing e-forms", "Tax return filings"],
    icon: Users
  },
  {
    title: "Eligibility Criteria for Organizations",
    content: "Organizations (companies, firms, LLPs, NGOs, proprietorships) apply for DSCs. Directors, managers, secretaries, and authorized signatories must obtain one for official signing.",
    useCases: ["E-filing of ITR", "Regulatory compliance with SEBI", "ROC filings"],
    icon: Briefcase
  },
  {
    title: "Eligibility Criteria for Foreign Applicants",
    content: "Foreign nationals and entities conducting business in India can apply but must follow additional documentation requirements (passport, residency details) for verification.",
    useCases: ["Business transactions", "Compliance filings within Indian jurisdictions"],
    icon: Globe
  },
];

const dscDocumentsList = [
  {
    title: "1. Government-Issued ID (Identity Proof)",
    docs: ["Aadhaar Card (eKYC Service)", "Passport", "PAN Card", "Driving Licence"]
  },
  {
    title: "2. Address Proof",
    docs: ["Aadhaar Card", "Voter ID Card", "Driving Licence", "Telephone Bill", "Bank Account Passbook/Statement"]
  },
  {
    title: "3. Photograph & Other Docs",
    docs: ["Recent Passport-Sized Photograph", "Organization Registration Documents (for entities)", "Authorisation Letter (for signatories)"]
  },
];

const dscProcedureSteps = [
  "Step 1: Visit the Certifying Authority’s Website (CA) and select the appropriate DSC class (Class 1, 2, or 3).",
  "Step 2: Fill Out the Application Form, choosing the class and validity period (1 to 3 years), and enter personal/business details.",
  "Step 3: Upload Required Documents (ID proof, address proof, photo, and organizational docs if applicable).",
  "Step 4: Make Payment for the applicable fee based on the class and validity.",
  "Step 5: Identity Verification via physical or video-based verification process, depending on the CA's policy and DSC class.",
  "Step 6: Issuance of DSC by the Certifying Authority, delivered as a file or on a USB token.",
  "Step 7: Download and Install DSC onto your computer or the supplied USB token.",
];

const dscRenewalProcess = [
  "Step 1: Select the Type of DSC (Class and Validity) you require for renewal.",
  "Step 2: Pay for the renewal of the DSC.",
  "Step 3: Documentation Fillup and submit required identity proofs.",
  "Step 4: Mobile and Video Verification (mandatory for identity authentication).",
  "Step 5: Buy a New USB Token and attach it to your computer.",
  "Step 6: Installation and Download of the Renewed DSC onto the new USB token.",
];

const plans = [
    {
        "title": "Individual DSC",
        "price": "₹2,000",
        "description": "Low security, email signing, personal use. - Valid for 2 Years",
        "features": [
            "Email Signing",
            "Personal Identification",
            "Basic Assurance"
        ],
        "isRecommended": false
    },
    {
        "title": "Organization DSC",
        "price": "₹3,000",
        "description": "Income Tax, ROC, GST, Employee PF. - Valid for 2 Years",
        "features": [
            "Tax Filing",
            "Company Registration",
            "Director Authentication"
        ],
        "isRecommended": true
    },
    {
        "title": "DGFT / Combo DSC",
        "price": "₹5,000",
        "description": "E-tenders, E-procurement, Import/Export (DGFT). - Valid for 2 Years",
        "features": [
            "Tender Bidding",
            "DGFT Portal",
            "High Assurance Vetted"
        ],
        "isRecommended": false
    }
];

const dscFAQs = [
  { q: "What is a Digital Signature Certificate (DSC)?", a: "A DSC is the electronic equivalent of a physical signature, legally recognized under the IT Act 2000 to authenticate identity and ensure data integrity in electronic documents." },
  { q: "Who needs a Digital Signature Certificate?", a: "Directors, managers, and secretaries of companies, authorized signatories for e-filing (GST, ITR, ROC), and individuals for secure online transactions and tax filing." },
  { q: "How is the authenticity of a DSC ensured?", a: "It is ensured through Public Key Infrastructure (PKI), encryption, and the use of Certificate Revocation Lists (CRLs) maintained by Certifying Authorities (CAs)." },
  { q: "What types of documents can be signed using a DSC?", a: "Legal contracts, tax returns (ITR/GST), MCA forms (ROC filings), e-tendering bids, e-prescriptions, and general digital agreements." },
  { q: "How long does it take to obtain a DSC?", a: "The process can take anywhere from a few hours to a few days, depending on the DSC class and the speed of the identity verification process (eKYC vs. physical/video verification)." },
  { q: "Can a DSC be used for Income Tax e-filing?", a: "Yes, DSCs are widely used for Income Tax e-filing, enabling individuals and businesses to securely authenticate their tax returns electronically." },
];

// --- Premium Design Components ---

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

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
  <div className={`p-8 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
    ${isHighlighted
      ? 'bg-gradient-to-br from-[#E8DCC2] to-[#D4B982] border-transparent shadow-lg transform -translate-y-1'
      : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
       ${isHighlighted ? 'bg-white/30 text-[#8C6B28]' : 'bg-slate-50 text-[#1A7F7D]'}
    `}>
      {Icon ? <Icon className="w-5 h-5" /> : (isHighlighted ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />)}
    </div>
    <h3 className={`text-xl font-bold mb-2 ${isHighlighted ? 'text-[#5C4518]' : 'text-slate-800'}`}>
      {title}
    </h3>
    <p className={`text-sm leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
      {description}
    </p>
    <div className={`flex items-center text-sm font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-5 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
      <span>Learn More</span>
      <ArrowRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-4
       ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg scale-[1.01]' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
    `}>
    <button className="flex items-center justify-between w-full p-8 text-left" onClick={onClick}>
      <h3 className={`text-lg md:text-xl font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <p className={`px-6 pb-6 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
  <section id="dsc-overview-content" className="py-24 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Overview"
        title="Electronic Infrastructure for Digital Trust"
        description="Legally recognized under the Information Technology Act 2000, DSC ensures end-to-end security and data integrity."
      />
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
        <div className="space-y-8">
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-600 leading-relaxed text-lg">
              A <span className="text-[#1A7F7D] font-bold">Digital Signature Certificate (DSC)</span> is the electronic equivalent of a physical signature, issued by licensed Certifying Authorities. It provides the highest level of trust and security for digital workflows.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { text: "Legally Valid (IT Act 2000)", icon: Shield },
              { text: "Tamper-Proof Signing", icon: Lock },
              { text: "Instant Multi-party Execution", icon: Zap },
              { text: "Paperless & Eco-friendly", icon: Globe }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#1A7F7D]/30 transition-colors shadow-sm">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A7F7D] shadow-inner">
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-bold text-slate-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#1A7F7D]/10 to-[#C59B4E]/10 rounded-[2.5rem] blur-2xl"></div>
          <div className="relative p-10 bg-[#0F2D30] rounded-[2.5rem] text-center text-white border-b-8 border-[#C59B4E] shadow-2xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6 backdrop-blur-sm border border-white/20">
              <FileSignature className="w-10 h-10 text-[#C59B4E]" />
            </div>
            <h5 className="text-5xl font-black mb-2 tracking-tight">100%</h5>
            <p className="text-sm text-[#C59B4E] uppercase tracking-[0.3em] font-black">Digital Workflow</p>
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-5">
              <div className="text-left">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Standard</p>
                <p className="text-lg font-bold italic font-serif leading-none">Class 3</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Status</p>
                <p className="text-lg font-bold leading-none">Govt Approved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="dsc-benefits-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading
        subtitle="Benefits"
        title="Why You Need a DSC"
        description="Experience the power of secure digital transactions."
      />
      <div className="grid md:grid-cols-3 gap-10">
        {dscBenefitsList.map((item, i) => (
          <div key={i} className="flex flex-col items-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-all h-full group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#1A7F7D] group-hover:text-white transition-all duration-300">
              <item.icon className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EligibilityContent = () => (
  <section id="dsc-eligibility-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Eligibility"
        title="Who Can Benefit?"
        description="Available for individuals, organizations, and foreign applicants."
      />
      <div className="grid md:grid-cols-3 gap-10">
        {dscEligibilitySections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#F0FDFA] text-[#1A7F7D] rounded-xl flex items-center justify-center mb-6">
              <section.icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">{section.title}</h4>
            <p className="text-sm text-slate-500 mb-6 flex-grow">{section.content}</p>
            <div className="space-y-8">
              <h5 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Common Uses</h5>
              {section.useCases.map((use, idx) => (
                <div key={idx} className="flex items-center gap-5 text-sm text-slate-600">
                  <CheckCircle className="w-3 h-3 text-[#1A7F7D]" />
                  <span>{use}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="dsc-documents-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Documents"
        title="Quick Checklist"
        description="Collate these digital versions for a smooth registration."
      />
      <div className="grid md:grid-cols-3 gap-10">
        {dscDocumentsList.map((category, i) => (
          <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col transition-all hover:scale-[1.02]">
            <h4 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-5">
              <span className="w-8 h-8 rounded-full bg-[#1A7F7D] text-white flex items-center justify-center text-sm">{i + 1}</span>
              {category.title}
            </h4>
            <ul className="space-y-8">
              {category.docs.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-5 text-slate-600 text-sm">
                  <FileCheck className="w-4 h-4 text-[#C59B4E] flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcedureContent = () => (
  <section id="dsc-procedure-content" className="py-20 bg-slate-900 text-white overflow-hidden relative scroll-mt-24">
    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-16">
        <span className="text-[#C59B4E] font-bold text-sm uppercase tracking-widest mb-3 block">Roadmap</span>
        <h3 className="text-3xl font-bold mb-4">Registration Procedure</h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto italic">Step-by-step guidance to secure your digital identity.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {dscProcedureSteps.slice(0, 4).map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center">
            {/* Connector */}
            {idx < 3 && <div className="hidden lg:block absolute top-10 left-full w-full h-[1px] bg-white/10 -z-0"></div>}
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-2xl relative z-10 transition-transform hover:scale-110">
              <span className="text-3xl font-bold text-[#C59B4E]">{idx + 1}</span>
            </div>
            <p className="text-sm text-center text-slate-300 leading-relaxed px-4">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-16 pt-16 border-t border-white/5 grid md:grid-cols-3 gap-12 sm:px-12">
        {dscProcedureSteps.slice(4).map((step, idx) => (
          <div key={idx} className="flex gap-5 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A7F7D]/20 border border-[#1A7F7D]/30 flex items-center justify-center font-bold text-[#C59B4E]">{idx + 5}</div>
            <p className="text-sm text-slate-300 italic">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
        <h4 className="text-xl font-bold text-white mb-4">Renewal Is Easy Too!</h4>
        <div className="grid md:grid-cols-3 gap-10">
          {dscRenewalProcess.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-5 text-left">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C59B4E]/20 text-[#C59B4E] flex items-center justify-center font-bold text-sm">{i + 1}</div>
              <p className="text-sm text-slate-400">{r}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const FeesContent = () => (
  <section id="dsc-fees-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Fees"
        title="Simple & Transparent Pricing"
        description="Choose the right class for your needs."
      />
      <div className="grid md:grid-cols-3 gap-10">
        <PricingCards plans={plans} serviceName="DSC Registration" />
      </div>
      <p className="mt-8 text-center text-sm text-slate-400 italic italic">Note: Additional costs include USB Token (₹500–₹1,000) and 18% GST.</p>
    </div>
  </section>
);

const RoleContent = () => (
  <section id="dsc-role-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Security"
        title="Security Aspects of DSC"
        description="Systems and protocols that ensure your digital signature is unforgeable."
      />
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-slate-900 p-10 rounded-3xl text-white relative overflow-hidden group">
          <Key className="absolute top-10 right-10 w-20 h-20 text-white/5 group-hover:text-[#C59B4E]/10 transition-colors" />
          <h4 className="text-2xl font-bold mb-6 text-[#C59B4E]">PKI Infrastructure</h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">Public Key Infrastructure (PKI) provides the foundation for digital signatures, enabling secure data exchange through asymmetric encryption (Public & Private Keys).</p>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-sm italic text-slate-500">"The private key is kept secret with the certificate holder, while the public key is used for verification."</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-5">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"><Lock className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Advanced Encryption</h5>
              <p className="text-sm text-slate-500">Readable data is transformed into ciphertext, accessible only to corresponding key holders.</p>
            </div>
          </div>
          <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-5">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Hardware Security (HSM)</h5>
              <p className="text-sm text-slate-500">Sensitive keys are stored in tamper-resistant physical modules for maximum protection.</p>
            </div>
          </div>
          <div className="p-8 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-5">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0"><Activity className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Revocation Control (CRL)</h5>
              <p className="text-sm text-slate-500">Compromised certificates are instantly added to global databases (CRL) to prevent misuse.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);



// --- Main Component ---

export default function DSCRegistration() {
  const [activeTab, setActiveTab] = useState('dsc-overview-content');
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

      {/* === Hero === */}
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="DSC Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <FileSignature size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Govt Licensed Certifying Authority Partner</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Digital Signature <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Certificate (DSC)</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                Obtain Class 3 DSC for ITR, GST, ROC filings, and e-tendering. Fully paperless process with instant video verification. Secure your digital identity today.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> Class 3 Support
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> 100% Tax Compliant
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Launch Now</h3>
                  <LeadForm serviceName="Digital Signature Certificate" btnText="Apply for DSC" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Sticky Navigation === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-10 overflow-x-auto no-scrollbar py-0">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-5 text-sm md:text-sm font-bold uppercase tracking-widest border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#0F2D30] border-[#C59B4E]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
                  onClick={() => handleTabClick(tab.id)}
                >{tab.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Tab Content Sections === */}
      <OverviewContent />
      <BenefitsContent />
      <EligibilityContent />
      <DocumentsContent />
      <ProcedureContent />
      <FeesContent />
      <RoleContent />

      {/* FAQs Section */}
      <section id="dsc-faqs-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading
            subtitle="FAQ"
            title="Common Questions"
            description="Expert answers to your Digital Signature queries."
          />
          <div className="space-y-8">
            {dscFAQs.map((f, i) => (
              <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}