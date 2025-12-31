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
  Check,
  Building,
  Scale
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- UK REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Advantages' },
  { id: 'types-content', label: 'Entity Types' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'tax-content', label: 'Tax & Compliance' },
  { id: 'faqs-content', label: 'FAQs' },
];

const ukAdvantages = [
  { title: "Quick Incorporation", description: "The UK is one of the fastest places in the world to register a business, often within 24 hours.", icon: Zap },
  { title: "Low Capital", description: "No minimum share capital requirement for a Private Limited Company (LTD).", icon: DollarSign },
  { title: "Global Network", description: "Access to a vast network of double taxation treaties and trade agreements globally.", icon: Globe },
  { title: "Credibility", description: "A UK 'Limited' suffix provides instant reputation and trust for clients and suppliers.", icon: Award },
  { title: "Simple Setup", description: "100% online registration without the need for physically visiting the UK.", icon: CheckCircle }
];

const entityTypesDataUK = [
  {
    type: "Private Limited Company (LTD)",
    description: "The most common and popular structure for startups. Limited liability and relatively simple compliance.",
    key_points: ["No minimum capital", "Separate legal entity", "100% Foreign Owned"],
  },
  {
    type: "Public Limited Company (PLC)",
    description: "For large companies that wish to offer shares to the public. Requires minimum £50,000 share capital.",
    key_points: ["Public stock listing", "Higher capital", "Strict regulation"],
  },
  {
    type: "Limited Liability Partnership (LLP)",
    description: "Ideal for professional firms like lawyers or accountants. Combines partnership flexibility with Ltd liability.",
    key_points: ["Partnership taxes", "Limited liability", "Expert firms"],
  },
];

const ukProcessSteps = [
  { title: "Company Name", desc: "Choose a unique name and check availability with Companies House registration." },
  { title: "Appointment", desc: "Appointing directors and a company secretary (optional for LTD) and stating shareholders." },
  { title: "Address Setup", desc: "Every UK company needs a registered office address in the UK. We provide this service." },
  { title: "SIC Codes", desc: "Selecting the standard industrial classification code to define your business activities." },
  { title: "Submission", desc: "Filing the Memorandum and Articles of Association with Companies House digitally." },
  { title: "Registration", desc: "Receiving the Certificate of Incorporation and starting business operations (VAT setup)." },
];

const ukDocuments = [
  "Valid Passport for all Directors and Shareholders.",
  "Proof of Residential Address (Recent utility bill or Bank statement).",
  "Memorandum and Articles of Association (Drafted by Bizzfiling).",
  "Standard Industrial Classification (SIC) Code.",
  "Company Registered Office Address (Provided by Bizzfiling).",
];

const ukTaxCompliance = [
  { title: "Corporation Tax", details: "Currently 19% to 25% depending on profit levels. Filed annually with HMRC.", icon: DollarSign },
  { title: "VAT Registration", details: "Mandatory if taxable turnover exceeds £90,000. Voluntary registration for global trade.", icon: Scale },
  { title: "Confirmation Statement", details: "Annual filing with Companies House to confirm the company's current structure.", icon: FileText }
];

const ukFAQs = [
  { q: "Can an Indian citizen register a UK company?", a: "Yes, anyone can register a UK company regardless of nationality, fully remotely." },
  { q: "What is Companies House?", a: "The official registrar of companies in the UK, responsible for all incorporations and filings." },
  { q: "Do I need a UK bank account?", a: "It's highly recommended for business. We help with digital banking partners like Tide, Revolut, or Wise." },
  { q: "What is the minimum share capital?", a: "There is no statutory minimum for an LTD. You can start with just £1 share capital." },
  { q: "Can I use my Indian address for the company?", a: "You need a registered office address in the UK. Bizzfiling provides a professional UK address for you." },
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
      <SectionHeading subtitle="Overview" title="UK Company Formation" description="Register your business in the United Kingdom, one of the world's most business-friendly jurisdictions." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            The UK offers a quick, transparent, and low-cost gateway to European and global markets. Companies House is highly digitalized, allowing Bizzfiling to incorporate your 'Limited' company in as little as 24 hours.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100"><CheckCircle size={12} /> No UK Visit</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"><Building size={12} /> Registered Address</div>
          </div>
        </div>
        <div className="p-6 bg-[#0F2D30] rounded-2xl text-center text-white border-t-2 border-[#C59B4E]">
          <h5 className="text-2xl font-bold mb-1">24 HR</h5>
          <p className="text-[10px] text-[#C59B4E] uppercase tracking-widest font-bold">Fastest Setup</p>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Success" title="Benefits of UK Registration" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {ukAdvantages.map((adv, i) => (
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
      <SectionHeading subtitle="Structures" title="UK Business Entities" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityTypesDataUK.map((type, i) => (
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
      <SectionHeading subtitle="Timeline" title="Quick UK Setup" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {ukProcessSteps.map((step, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-8 h-8 flex-shrink-0 bg-[#0F2D30] text-[#C59B4E] rounded-full flex items-center justify-center font-bold text-xs shadow-md">
              {i + 1}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h4>
              <p className="text-slate-500 text-[10px] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TaxContent = () => (
  <section id="tax-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Compliance" title="UK Tax & Filing" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ukTaxCompliance.map((item, i) => (
          <div key={i} className="p-6 bg-slate-50/50 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-12 h-12 bg-[#F0FDFA] rounded-full flex items-center justify-center text-[#1A7F7D] mb-4 mx-auto border border-slate-100 shadow-inner">
              <item.icon size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">{item.title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed">{item.details}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function UKPage() {
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
          <img src={BackgroundImageSrc} alt="UK Incorporation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">UK Companies House Approved</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                United Kingdom <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Launch your UK business in 24 hours. No minimum capital, remote setup, and global credibility for your startup. Join the London financial ecosystem.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> 19% Corp Tax
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> Companies House Partner
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Register in UK</h3>
                  <LeadForm serviceName="Company Registration in UK" btnText="Start UK Startup" />
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
                  className={`py-4 text-[9px] font-extrabold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'text-[#0F2D30] border-[#0F2D30]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
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
        <TaxContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="UK Business Registry" />
            <div className="mt-8">
              {ukFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}