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
  Handshake,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Landmark,
  Globe,
  Calculator,
  RefreshCw,
  Shield,
  Smartphone,
  Award,
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- UDYAM REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
  { id: 'udyam-overview-content', label: 'Overview' },
  { id: 'udyam-benefits-content', label: 'Benefits' },
  { id: 'udyam-eligibility-content', label: 'Who Can Apply' },
  { id: 'udyam-criteria-content', label: 'Criteria' },
  { id: 'udyam-documents-content', label: 'Documents' },
  { id: 'udyam-process-content', label: 'Process' },
  { id: 'udyam-process-content', label: 'Process' },
  { id: 'udyam-pricing-content', label: 'Pricing' },
  { id: 'udyam-schemes-renewal', label: 'Renewal' },
  { id: 'udyam-why-Bizzfiling', label: 'Why Us' },
  { id: 'udyam-faqs-content', label: 'FAQs' },
];

const udyamPlans = [
  {
    title: "Standard",
    price: "₹1,999",
    description: "Professional Filing Assistance.",
    features: [
      "MSME Udyam",
      "GST Registration",
      "GSTR-1 & 3B for 12 months (Upto 300 transactions)"
    ],
    isRecommended: false,
  },
  {
    title: "Premium",
    price: "₹16,399",
    description: "Registration + GST Compliance.",
    features: [
      "MSME Udyam",
      "GST Registration",
      "GST Registration",
      "GSTR-1 & 3B for 12 months (Upto 300 transactions)",
      "ITR Filings for one financial year (upto 40 lakhs) - Rs. 2500"
    ],
    isRecommended: true,
  },
  {
    title: "Elite",
    price: "₹18,899",
    description: "Complete Business Compliance.",
    features: [
      "Dedicated Account Manager",
      "MSME Udyam Registration"
    ],
    isRecommended: false,
    isPremium: true,
  },
];

const udyamIntroBullets = [
  "Online Udyam registration done by experts with timely delivery of your Udyog Aadhar. T&C*",
  "100% online process with quick filing and processing—save time and avoid hassles.",
  "Get expert support at every step to ensure smooth and compliant registration.",
];

const udyamBenefits = [
  { title: "Access to Government Schemes", icon: Landmark, detail: "Essential to access schemes like Credit Linked Capital Subsidy, Credit Guarantee, and Public Procurement Policy." },
  { title: "Cheaper Loans & Subsidies", icon: DollarSign, detail: "Access loans at a lower interest rate, collateral-free loans under CGTMSE, and subsidies on electricity bills." },
  { title: "Seamless Integration", icon: Zap, detail: "Integrates smoothly with the income tax portal, GST systems, and Government e-Marketplace." },
  { title: "Protection Against Delayed Payments", icon: Shield, detail: "Seek redressal for delayed payments, ensuring timely payments from buyers." },
  { title: "Priority Sector Lending", icon: TrendingUp, detail: "Recognized under priority sector lending by banks, offering favourable terms for credit facilities." },
  { title: "Free ISO Certification", icon: CheckCircle, detail: "Eligible for free ISO certification, enhancing credibility and competitiveness in the market." },
  { title: "Extended MAT Credit", icon: Clock, detail: "Can carry forward the Minimum Alternate Tax (MAT) credit for 15 years, instead of the usual 10 years." },
  { title: "Global Exposure & Licensing", icon: Globe, detail: "Participate in international fairs/trade shows and benefit from a simplified licensing process." },
];

const eligibleEntities = [
  "Proprietorships",
  "Hindu Undivided Family (HUF)",
  "Partnership Firms",
  "One-Person Companies (OPCs)",
  "Private Limited Companies",
  "Limited Companies",
  "Limited Liability Partnerships (LLPs)",
  "Cooperative Societies",
  "Producer Companies",
];

const eligibilityCriteriaManufacturing = [
  "Micro: Investment ≤ ₹1 crore AND turnover ≤ ₹5 crore.",
  "Small: Investment ≤ ₹10 crore AND turnover ≤ ₹50 crore.",
  "Medium: Investment ≤ ₹50 crore AND turnover ≤ ₹250 crore.",
];

const eligibilityCriteriaServices = [
  "Micro: Investment ≤ ₹1 crore AND turnover ≤ ₹5 crore.",
  "Small: Investment ≤ ₹10 crore AND turnover ≤ ₹50 crore.",
  "Medium: Investment ≤ ₹50 crore AND turnover ≤ ₹250 crore.",
];

const udyamDocuments = [
  { title: "Aadhaar Number", detail: "Aadhaar card number of the Proprietor, Managing Partner, Karta, or Authorized Signatory.", icon: Users },
  { title: "PAN Card", detail: "Mandatory for the enterprise from 1 April 2021 onwards.", icon: FileText },
  { title: "GST Number (GSTIN)", detail: "Mandatory only for businesses previously registered under GST Law.", icon: DollarSign },
];

const udyamRegistrationProcess = [
  "Login to Udyam Registration Portal and click 'For New Entrepreneurs...' to begin.",
  "Provide 'Aadhaar Number' & 'Name of Entrepreneur' to validate and generate OTP.",
  "Validate the Aadhaar OTP, then proceed to the PAN validation page. Enter 'Type of Organisation' and PAN number.",
  "Indicate ITR and GSTIN status, then fill all mandatory details (mobile number, enterprise name, address, bank details, activity, NIC code, employment).",
  "Enter details for Plant and Machinery/Equipment and Annual Turnover.",
  "Select Declaration, click Submit to get the Final OTP, enter it, and submit the form.",
  "Receive the Udyam Registration Number (URN) and the Certificate via email."
];

const governmentSchemes = [
  { title: "CGTMSE", detail: "Offers collateral-free loans up to ₹5 Crore with an 85% loan guarantee to support technology upgradation.", icon: DollarSign },
  { title: "PMEGP", detail: "Provides loans and working capital (₹25 Lakh for manufacturing) to foster entrepreneurship and employment generation.", icon: Users },
  { title: "RAMP", detail: "Aims to improve MSME access to global markets and credit, enhancing the effectiveness of existing government initiatives.", icon: Globe },
];

const udyamRenewalSteps = [
  "Visit the official MSME or Udyam portal and select the 'Update Details' option.",
  "Choose 'Update/Cancel Registration,' enter URN and registered mobile number, and complete OTP verification.",
  "Click the Edit button, update active fields, and enter the ITR details for the previous year.",
  "Click submit to upgrade/renew the registration and update the certificate."
];

const udyamFAQs = [
  { q: "How to Register for Udyam Registration Online?", a: "The process involves logging into the official Udyam portal using your Aadhaar number for validation, followed by entering PAN, GSTIN, investment, and turnover details. It is a self-declaration, paperless process." },
  { q: "What is the Udyam Registration Number?", a: "The Udyam Registration Number (URN) is a unique 19-digit identifier assigned to MSMEs upon successful registration. It is the crucial reference number used to access all government benefits." },
  { q: "What is the Difference Between Udyam and Udyog Aadhaar?", a: "Udyam is the new simplified, permanent, and paperless registration system (from July 2020), replacing the older Udyog Aadhaar Memorandum (UAM). All existing UAM holders must re-register under Udyam." },
  { q: "What is the Fee for MSME Registration?", a: "Udyam registration is free on the official government portal. Professional service providers may charge a fee for expert assistance to ensure accuracy and smooth filing." },
  { q: "How a Trading Company Can Get Registered for MSME?", a: "Trading activities are now allowed under Udyam registration. A trading company can register by following the standard process and classifying their activity using the appropriate NIC code." },
];

// --- Design Components ---

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
  <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
    <button
      className="flex items-center justify-between w-full p-4 text-left"
      onClick={onClick}
    >
      <h3 className={`text-sm md:text-base font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
        {faq.q}
      </h3>
      <div className="flex-shrink-0">
        {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
      </div>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <p className={`px-4 pb-4 text-sm md:text-base leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
        {faq.a}
      </p>
    </div>
  </div>
);

// --- Content Sections ---

const OverviewContent = () => (
  <section id="udyam-overview-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Scale" title="What is Udyam Registration?" description="Legally recognized identification for Micro, Small, and Medium Enterprises in India." />
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-8">
          <p className="text-slate-600 leading-relaxed">
            <strong>Udyam Registration</strong> is a free and paperless process for officially registering MSMEs in India through the official Udyam portal. It is mandatory for all MSMEs as of 1 July 2020.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Upon successful registration, businesses receive a permanent identification number, called the <strong>Udyam Registration Number (URN)</strong>, and the certificate is sent directly to the registered email ID.
          </p>
          <div className="flex flex-wrap gap-5">
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Free & Paperless</span>
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Fully Online</span>
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Instant URN</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <CheckCircle className="w-8 h-8 text-[#1A7F7D] mb-3" />
            <span className="text-sm font-bold text-slate-800">Self Declaration</span>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <Calculator className="w-8 h-8 text-[#1A7F7D] mb-3" />
            <span className="text-sm font-bold text-slate-800">Income Tax Linked</span>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <Smartphone className="w-8 h-8 text-[#1A7F7D] mb-3" />
            <span className="text-sm font-bold text-slate-800">Aadhaar Based</span>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <Globe className="w-8 h-8 text-[#1A7F7D] mb-3" />
            <span className="text-sm font-bold text-slate-800">One Registration</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="udyam-benefits-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Advantages" title="Top MSME Benefits" description="Unlock government support and financial incentives for your business." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {udyamBenefits.map((item, i) => (
          <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-8 hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shadow-sm"><item.icon className="w-6 h-6" /></div>
            <h5 className="font-bold text-slate-800 text-lg">{item.title}</h5>
            <p className="text-sm text-slate-500 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EligibilityContent = () => (
  <section id="udyam-eligibility-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Eligibility" title="Who Can Apply?" description="Open to Micro, Small, and Medium Enterprises engaged in manufacturing or services." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {eligibleEntities.map((entity, i) => (
          <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-5 hover:border-[#1A7F7D]/50 transition-all">
            <Users className="w-4 h-4 text-[#1A7F7D]" />
            <span className="text-sm font-semibold text-slate-700">{entity}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CriteriaContent = () => (
  <section id="udyam-criteria-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Criteria" title="Classification Limits" description="Based on Investment and Annual Turnover composite criteria." />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
          <h4 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-5"><Briefcase className="w-5 h-5 text-[#1A7F7D]" /> Manufacturing & Services</h4>
          <ul className="space-y-8">
            {eligibilityCriteriaManufacturing.map((item, i) => (
              <li key={i} className="flex items-start gap-5 text-sm text-slate-600 italic">
                <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-8">
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-[#1A7F7D]">
            <h6 className="font-bold text-slate-800 mb-2">Operating in India</h6>
            <p className="text-sm text-slate-500">Business must be registered and operating within Indian borders.</p>
          </div>
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-[#1A7F7D]">
            <h6 className="font-bold text-slate-800 mb-2">GST Provisions</h6>
            <p className="text-sm text-slate-500">Subject to standard GST registration thresholds and exemptions for small suppliers.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="udyam-documents-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Paperwork" title="Required Documents & Fee" description="Udyam registration is free of cost on the official portal." />
      <div className="grid md:grid-cols-3 gap-10">
        {udyamDocuments.map((doc, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 bg-slate-50 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-6"><doc.icon className="w-6 h-6" /></div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">{doc.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">{doc.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 p-8 bg-[#103B3E] rounded-3xl text-white flex flex-col items-center text-center">
        <DollarSign className="w-12 h-12 text-[#C59B4E] mb-4" />
        <h4 className="text-xl font-bold mb-2 uppercase tracking-wide">Registration is FREE</h4>
        <p className="text-slate-400 text-sm max-w-2xl">The government does not charge a fee for Udyam registration. Professional assistance ensures error-free filing for a small service fee.</p>
      </div>
    </div>
  </section>
);

const ProcessContent = () => (
  <section id="udyam-process-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <SectionHeading subtitle="Journey" title="Step-by-Step Registration" description="Get your Udyam Registration Number (URN) entirely online." />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-5 relative">
        {udyamRegistrationProcess.map((step, idx) => (
          <div key={idx} className="space-y-8">
            <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:skew-x-3">
              <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">✓</div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed px-2 line-clamp-3">{step}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);



const UdyamPricingContent = () => (
  <section id="udyam-pricing-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Investments" title="Registration Packages" description="Choose the plan that suits your business compliance needs." />
      <PricingCards plans={udyamPlans} serviceName="Udyam Registration" />
    </div>
  </section>
);

const SchemesRenewal = () => (
  <section id="udyam-schemes-renewal" className="py-12 md:py-16 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading subtitle="Growth" title="Schemes & Renewal" description="Access critical MSME support systems post-registration." />
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <h4 className="text-xl font-bold text-slate-800">Key Government Schemes</h4>
          <div className="space-y-8">
            {governmentSchemes.map((scheme, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex gap-5">
                <div className="w-10 h-10 bg-[#F0FDFA] text-[#1A7F7D] rounded-lg flex items-center justify-center flex-shrink-0"><scheme.icon size={20} /></div>
                <div>
                  <h5 className="font-bold text-slate-800 text-base">{scheme.title}</h5>
                  <p className="text-sm text-slate-500">{scheme.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#103B3E] p-10 rounded-3xl text-white">
          <h4 className="text-xl font-bold mb-6 text-[#C59B4E]">Renewal Process</h4>
          <ul className="space-y-8">
            {udyamRenewalSteps.map((step, i) => (
              <li key={i} className="flex gap-5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-[#C59B4E] flex-shrink-0">{i + 1}</div>
                <p className="text-sm text-slate-400 italic leading-relaxed">{step}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const WhyUsContent = () => (
  <section id="udyam-why-Bizzfiling" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading subtitle="Expertise" title="Get Registered with Bizzfiling" description="Avoid filing errors and secure your certificate faster with our assisted services." align="left" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle className="w-6 h-6 text-[#1A7F7D] mb-3" />
              <h6 className="font-bold text-lg mb-1">Eligibility Check</h6>
              <p className="text-sm text-slate-500">We verify your classification criteria before filing.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <Smartphone className="w-6 h-6 text-[#1A7F7D] mb-3" />
              <h6 className="font-bold text-lg mb-1">100% Online</h6>
              <p className="text-sm text-slate-500">Zero physical visits or manual paperwork required.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <Handshake className="w-6 h-6 text-[#1A7F7D] mb-3" />
              <h6 className="font-bold text-lg mb-1">Expert Support</h6>
              <p className="text-sm text-slate-500">Guidance on documentation and NIC code selection.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <Zap className="w-6 h-6 text-[#1A7F7D] mb-3" />
              <h6 className="font-bold text-lg mb-1">Full Transparency</h6>
              <p className="text-sm text-slate-500">Real-time status updates and upfront communication.</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 bg-slate-900 rounded-3xl p-10 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B4E]/10 rounded-full blur-2xl"></div>
          <Star className="w-16 h-16 text-[#C59B4E] mb-6 animate-pulse" />
          <h4 className="text-2xl font-bold text-white mb-4 italic font-serif">India's Trusted Partner for MSMEs</h4>
          <p className="text-slate-400 text-sm mb-8 italic">"Helping thousands of entrepreneurs scale with legal clarity."</p>
          <button className="px-8 py-3 bg-[#C59B4E] text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#a37d35] transition-all">Learn More</button>
        </div>
      </div>
    </div>
  </section>
);

// --- Main Component ---

export default function UdyamRegistrationPage() {
  const [activeTab, setActiveTab] = useState('udyam-overview-content');
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

      {/* Hero Section - Compact Style */}
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Udyam Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Star size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">India's #1 Udyam Facilitation Portal</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                Udyam Registration <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">(Udyog Aadhaar)</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Step into the formal economy with a permanent MSME identification. Unlock subsidies, tax exemptions, and government tender priority with our expert-led paperless filing.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> Fast 24h Processing
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <Smartphone size={18} className="text-[#C59B4E]" /> OTP Based Filing
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-base md:text-xl font-bold text-slate-800 text-center mb-6">Register Udyam</h3>
                  <LeadForm serviceName="Udyam Registration" btnText="Apply for Udyam" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
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

      <OverviewContent />
      <BenefitsContent />
      <EligibilityContent />
      <CriteriaContent />
      <DocumentsContent />
      <ProcessContent />
      <UdyamPricingContent />
      <SchemesRenewal />
      <WhyUsContent />

      <div id="udyam-faqs-content" className="pt-12 md:pt-16 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading subtitle="FAQ" title="Udyam Guide" description="Everything you need to know about MSME registration." />
          <div className="space-y-8">
            {udyamFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
          </div>
        </div>
      </div>
    </div>
  );
}