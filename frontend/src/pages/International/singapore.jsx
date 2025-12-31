import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import {
  ChevronDown,
  ArrowRight,
  CheckCircle,
  FileText,
  Star,
  Shield,
  Award,
  Globe,
  DollarSign,
  Briefcase,
  Zap,
  Check
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- SINGAPORE REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Advantages' },
  { id: 'types-content', label: 'Entity Types' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'faqs-content', label: 'FAQs' },
];

const singaporeAdvantages = [
  { title: "Top Logistics Hub", description: "Voted the easiest place to do business globally. Strategically located as a gateway to Asia.", icon: Globe },
  { title: "Tax Incentives", description: "One of the most attractive tax regimes. Corporate tax starts at 17%, with many tax exemptions.", icon: DollarSign },
  { title: "Legal Safety", description: "A very transparent and stable legal system with zero tolerance for corruption.", icon: Shield },
  { title: "Foreign Ownership", description: "100% foreign ownership is allowed for most business activities in Singapore.", icon: Award },
  { title: "Startup Support", description: "Extensive government grants and venture capital ecosystem for tech-driven startups.", icon: Zap }
];

const entityTypesDataSG = [
  {
    type: "Private Limited Company",
    description: "The most robust structure. Limited liability and separate legal personality. Ideal for scaling.",
    key_points: ["100% Foreign Owned", "Limited Liability", "Tax Incentives"],
  },
  {
    type: "Sole Proprietorship",
    description: "A business owned by a single person. Simple to set up but has unlimited personal liability.",
    key_points: ["Easiest Setup", "Low Compliance", "Unlimited Liability"],
  },
  {
    type: "Branch Office",
    description: "An extension of a foreign company. Not a separate legal entity from its parent organization.",
    key_points: ["Parent Company Liability", "Simpler Compliance", "Foreign Parent"],
  },
];

const sgProcessSteps = [
  { title: "Approve Name", desc: "Select and register your company name with ACRA (Accounting and Corporate Regulatory Authority)." },
  { title: "Prepare Docs", desc: "Drafting the Constitution and appointment letters for directors and secretaries." },
  { title: "Registration", desc: "Official incorporation process with ACRA. Usually takes less than 24 hours." },
  { title: "Local Director", desc: "Appointing a resident director (as per ACRA requirements). Bizzfiling helps find nominee directors." },
  { title: "Bank Account", desc: "Opening a corporate bank account with leading banks like DBS or OCBC." },
  { title: "License/Permits", desc: "Applying for necessary business licenses based on your specific industry activity." },
];

const sgDocuments = [
  "Valid Passport of all Directors/Shareholders.",
  "Proof of Overseas Residential Address.",
  "Company Constitution (Memorandum & Articles).",
  "Brief business profile and signed Consent letters.",
  "KYC documents for all beneficial owners.",
];

const sgFAQs = [
  { q: "Can a foreigner start a company in Singapore?", a: "Yes, 100% foreign ownership is allowed. However, you must appoint at least one local resident director." },
  { q: "What is the minimum capital required?", a: "The minimum paid-up capital for a Singapore company is just S$1." },
  { q: "How long does incorporation take?", a: "With all documents in order, the registration with ACRA often happens within 1-2 working days." },
  { q: "What are the common taxes?", a: "Corporate tax is a flat 17%. New startups enjoy significant exemptions for the first 3 years." },
  { q: "Is a local company secretary required?", a: "Yes, every company must appoint a qualified resident company secretary within 6 months of incorporation." },
];

// --- Reusable Components (Compact & Premium) ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
  <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="inline-block py-1 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-[10px] uppercase tracking-widest mb-2 border border-[#B2DFDB]">
      {subtitle}
    </span>
    <h3 className="mb-2 text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-[11px] max-w-2xl leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-2
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30'}
  `}>
    <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
      <h3 className={`text-xs font-semibold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
      <p className={`px-4 pb-4 text-[10px] leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sections ---

const OverviewContent = () => (
  <section id="overview-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Overview" title="Singapore Company Setup" description="Consistently ranked as the world's best place to do business. Singapore is the financial heart of Southeast Asia." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            Singapore offers a world-class business environment, political stability, and an exceptionally efficient incorporation system. With Bizzfiling, we help global entrepreneurs navigate ACRA regulations and appoint local company secretaries/directors.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Low Corporate Tax", "Zero Corruption", "Global Banking", "Easy Scaling"].map((item, idx) => (
              <div key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-bold text-[#1A7F7D]">#{item}</div>
            ))}
          </div>
        </div>
        <div className="p-6 bg-[#0F2D30] rounded-2xl text-center text-white border-t-4 border-[#C59B4E]">
          <h5 className="text-2xl font-bold mb-1">Ranked #1</h5>
          <p className="text-[10px] text-[#C59B4E] uppercase tracking-widest font-bold">Ease of Doing Business</p>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Success" title="Why Founders Choose SG" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {singaporeAdvantages.map((adv, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all group">
            <div className="w-10 h-10 bg-[#F0FDFA] rounded-full flex items-center justify-center mb-4 text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-all shadow-inner">
              <adv.icon size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-2">{adv.title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed">{adv.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TypesContent = () => (
  <section id="types-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Structures" title="SG Entity Comparison" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityTypesDataSG.map((type, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border-t-2 border-t-[#C59B4E]">
            <h4 className="text-lg font-bold text-[#0F2D30] mb-2">{type.type}</h4>
            <p className="text-slate-600 text-[10px] leading-relaxed mb-4">{type.description}</p>
            <div className="space-y-2">
              {type.key_points.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                  <CheckCircle size={12} className="text-green-500" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcessContent = () => (
  <section id="process-content" className="py-12 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Timeline" title="6-Step Incorporation" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
        {sgProcessSteps.map((step, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all flex flex-col items-center text-center">
            <div className="w-8 h-8 mb-3 bg-[#0F2D30] text-[#C59B4E] rounded-full flex items-center justify-center font-bold text-xs shadow-md">
              {i + 1}
            </div>
            <h4 className="text-[11px] font-bold text-slate-800 mb-1 leading-tight">{step.title}</h4>
            <p className="text-slate-500 text-[9px] leading-tight">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="documents-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/2">
          <SectionHeading subtitle="Checklist" title="ACRA Documents" align="left" />
          <div className="grid sm:grid-cols-1 gap-2">
            {sgDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <FileText size={12} className="text-[#1A7F7D] flex-shrink-0" />
                <p className="text-slate-700 font-bold text-[10px]">{doc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#0F2D30] p-8 rounded-3xl text-white relative flex flex-col items-center text-center">
          <Shield className="w-12 h-12 text-[#C59B4E] mb-4" />
          <h3 className="text-xl font-bold mb-2">Resident Director Requirement?</h3>
          <p className="text-slate-300 mb-6 text-xs leading-relaxed max-w-sm">Every Singapore company needs a resident director. We provide nominee director services and local company secretaries to ensure full compliance.</p>
          <button className="w-full max-w-xs bg-[#C59B4E] text-[#0F2D30] px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">Request Nominee Service</button>
        </div>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function SingaporePage() {
  const [activeTab, setActiveTab] = useState('overview-content');
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
      window.scrollTo({ top: element.offsetTop - SCROLL_OFFSET + 20, behavior: 'smooth' });
      setActiveTab(id);
    }
  };

  return (
    <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 bg-white selection:bg-[#1A7F7D] selection:text-white">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* Hero Section - Compact */}
      <section className="relative w-full min-h-[450px] flex items-center pt-24 pb-12 lg:pt-28 lg:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Singapore Incorporation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C59B4E]/20 backdrop-blur rounded-full border border-[#C59B4E]/30">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-[#C59B4E] text-[9px] uppercase font-bold tracking-[0.2em]">Asia's Financial Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Singapore Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Unlock the Asian market. 100% foreign ownership, robust legal system, and world-class tax incentives. We help India's startups scale via Singapore.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> 17% Corporate Tax
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> ACRA Compliant
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Start SG Venture</h3>
                  <LeadForm serviceName="Company Registration in Singapore" btnText="Talk to SG Consultant" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-0">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-4 text-[9px] font-extrabold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'text-[#0F2D30] border-[#C59B4E]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
                  onClick={() => handleTabClick(tab.id)}
                >{tab.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <OverviewContent />
        <AdvantagesContent />
        <TypesContent />
        <ProcessContent />
        <DocumentsContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="Your SG Questions" />
            <div className="mt-8">
              {sgFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}