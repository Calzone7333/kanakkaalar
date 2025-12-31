import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
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
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck,
  Activity
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
    class: "Class 1 DSC",
    uses: "Personal use, email validation, low-risk transactions, basic document signing.",
    verification: "Verified against basic consumer databases.",
    security: "Basic Security",
  },
  {
    class: "Class 2 DSC",
    uses: "Organizational use, e-filing (ITR/ROC), company registration, audit reports, business operations.",
    verification: "Verified against trusted, pre-verified databases (moderate security).",
    security: "Medium Security",
  },
  {
    class: "Class 3 DSC",
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

const dscFeesData = [
  { class: "Class 1 DSC", usage: "Personal use, email validation, low-risk transactions", cost: "₹500 to ₹1,500", validity: "1 year" },
  { class: "Class 2 DSC", usage: "Business use, e-filing, company registration, ITR filing", cost: "₹1,000 to ₹2,000", validity: "1 to 2 years" },
  { class: "Class 3 DSC", usage: "High-security transactions (e-tendering, e-procurement, GST)", cost: "₹1,350 to ₹3,000", validity: "1 to 3 years" },
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
  <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="inline-block py-1.5 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-semibold text-[11px] uppercase tracking-widest mb-3 border border-[#B2DFDB]">
      {subtitle}
    </span>
    <h3 className="mb-3 text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
    ${isHighlighted
      ? 'bg-gradient-to-br from-[#E8DCC2] to-[#D4B982] border-transparent shadow-lg transform -translate-y-1'
      : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
       ${isHighlighted ? 'bg-white/30 text-[#8C6B28]' : 'bg-slate-50 text-[#1A7F7D]'}
    `}>
      {Icon ? <Icon className="w-5 h-5" /> : (isHighlighted ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />)}
    </div>
    <h3 className={`text-base font-bold mb-2 ${isHighlighted ? 'text-[#5C4518]' : 'text-slate-800'}`}>
      {title}
    </h3>
    <p className={`text-xs leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
      {description}
    </p>
    <div className={`flex items-center text-xs font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-2 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
      <span>Learn More</span>
      <ArrowRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
    <button
      className="flex items-center justify-between w-full p-4 text-left"
      onClick={onClick}
    >
      <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
        {faq.q}
      </h3>
      <div className="flex-shrink-0">
        {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
      </div>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
        {faq.a}
      </p>
    </div>
  </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
  <section id="dsc-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Overview"
        title="Electronic Infrastructure for Digital Trust"
        description="Legally recognized under the Information Technology Act 2000, DSC ensures security and data integrity."
      />
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <p className="text-slate-600 leading-relaxed">
            A <strong>Digital Signature Certificate (DSC)</strong> is an electronic equivalent of a physical signature. Issued by a <strong>Certifying Authority (CA)</strong>, it allows you to securely authenticate your identity while signing electronic documents.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#1A7F7D]/30 transition-all">
              <Shield className="w-6 h-6 text-[#1A7F7D] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Legally Valid</h4>
                <p className="text-xs text-slate-500">Under IT Act 2000</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-[#1A7F7D]/30 transition-all">
              <Zap className="w-6 h-6 text-[#1A7F7D] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Instant Signing</h4>
                <p className="text-xs text-slate-500">Fast & Paperless</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dscBenefitsList.slice(1, 5).map((item, i) => (
            <ServiceCard key={i} title={item.title} description={item.details} icon={item.icon} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="dsc-benefits-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading
        subtitle="Benefits"
        title="Why You Need a DSC"
        description="Experience the power of secure digital transactions."
      />
      <div className="grid md:grid-cols-3 gap-8">
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
  <section id="dsc-eligibility-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Eligibility"
        title="Who Can Benefit?"
        description="Available for individuals, organizations, and foreign applicants."
      />
      <div className="grid md:grid-cols-3 gap-8">
        {dscEligibilitySections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-[#F0FDFA] text-[#1A7F7D] rounded-xl flex items-center justify-center mb-6">
              <section.icon className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-3">{section.title}</h4>
            <p className="text-sm text-slate-500 mb-6 flex-grow">{section.content}</p>
            <div className="space-y-2">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Common Uses</h5>
              {section.useCases.map((use, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
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
  <section id="dsc-documents-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Documents"
        title="Quick Checklist"
        description="Collate these digital versions for a smooth registration."
      />
      <div className="grid md:grid-cols-3 gap-8">
        {dscDocumentsList.map((category, i) => (
          <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col transition-all hover:scale-[1.02]">
            <h4 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#1A7F7D] text-white flex items-center justify-center text-xs">{i + 1}</span>
              {category.title}
            </h4>
            <ul className="space-y-4">
              {category.docs.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
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
        <span className="text-[#C59B4E] font-bold text-xs uppercase tracking-widest mb-3 block">Roadmap</span>
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
          <div key={idx} className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1A7F7D]/20 border border-[#1A7F7D]/30 flex items-center justify-center font-bold text-[#C59B4E]">{idx + 5}</div>
            <p className="text-sm text-slate-300 italic">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
        <h4 className="text-xl font-bold text-white mb-4">Renewal Is Easy Too!</h4>
        <div className="grid md:grid-cols-3 gap-6">
          {dscRenewalProcess.slice(0, 3).map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-left">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#C59B4E]/20 text-[#C59B4E] flex items-center justify-center font-bold text-xs">{i + 1}</div>
              <p className="text-xs text-slate-400">{r}</p>
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
      <div className="grid md:grid-cols-3 gap-8">
        {dscFeesData.map((plan, i) => (
          <div key={i} className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full
            ${i === 2 ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}
          `}>
            {i === 2 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Recommended</span>}
            <h4 className="text-xl font-bold text-slate-800 mb-2">{plan.class}</h4>
            <p className="text-xs text-slate-500 mb-6">{plan.usage}</p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-slate-900">{plan.cost}</span>
              <span className="text-slate-400 text-sm ml-2">/ {plan.validity}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                <span>Verified Identity Verification</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                <span>USB Token Compatibility</span>
              </li>
              <li className="flex items-start gap-3 text-xs text-slate-600">
                <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                <span>Legally Binding Digital Proof</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-[#1A7F7D] hover:bg-[#146361] text-white rounded-xl font-bold text-xs uppercase transition-all shadow-md">Get Started</button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-slate-400 italic italic">Note: Additional costs include USB Token (₹500–₹1,000) and 18% GST.</p>
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
            <p className="text-xs italic text-slate-500">"The private key is kept secret with the certificate holder, while the public key is used for verification."</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"><Lock className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Advanced Encryption</h5>
              <p className="text-xs text-slate-500">Readable data is transformed into ciphertext, accessible only to corresponding key holders.</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Hardware Security (HSM)</h5>
              <p className="text-xs text-slate-500">Sensitive keys are stored in tamper-resistant physical modules for maximum protection.</p>
            </div>
          </div>
          <div className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1A7F7D]/30 transition-all flex gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0"><Activity className="w-6 h-6" /></div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">Revocation Control (CRL)</h5>
              <p className="text-xs text-slate-500">Compromised certificates are instantly added to global databases (CRL) to prevent misuse.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Lock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)

const ShieldCheck = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
)

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
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 z-0 h-full w-full">
          <img src={BackgroundImageSrc} alt="DSC Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex flex-col items-center justify-center border-2 border-[#C59B4E] shadow-2xl">
                  <Star size={12} className="fill-[#C59B4E] text-[#C59B4E] mb-1" />
                  <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase">Digital<br />Signature</span>
                  <div className="w-8 h-[1px] bg-[#C59B4E]/30 my-1"></div>
                  <span className="text-white text-[8px] uppercase tracking-wider opacity-70">Verified CA</span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-serif italic">
                  Register Your <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic">Digital Signature (DSC)</span>
                </h1>
                <div className="space-y-3 pt-2">
                  {dscIntroBullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                      <p className="text-sm font-light leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-white/90 text-[11px] font-bold uppercase tracking-widest pt-4">
                <div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#C59B4E]" /> Paperless & Fast</div>
                <div className="h-4 w-[1px] bg-white/20"></div>
                <div className="flex items-center gap-2"><Scale className="w-4 h-4 text-[#C59B4E]" /> IT Act Verified</div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="w-full max-w-md lg:w-[400px] relative z-30">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-white/10 group hover:border-[#1A7F7D]/20 transition-all duration-500">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Class 3 DSC Registration</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Starting at Just ₹1,350*</p>
                </div>
                <LeadForm serviceName="DSC Registration" btnText="Apply Now" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === Sticky Navigation === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 md:gap-16 py-0 min-w-max list-none">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-4 text-xs md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-wider
                     ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}
                   `}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
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
          <div className="space-y-4">
            {dscFAQs.map((f, i) => (
              <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}