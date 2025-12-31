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

// --- HONG KONG REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Advantages' },
  { id: 'types-content', label: 'Entity Types' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'tax-content', label: 'Tax & Compliance' },
  { id: 'faqs-content', label: 'FAQs' },
];

const hkAdvantages = [
  { title: "Gateway to China", description: "Strategic location for businesses looking to enter the mainland China market while enjoying a separate legal system.", icon: Globe },
  { title: "Low Tax Regime", description: "One of the world's lowest tax systems. Profits tax is generally around 8.25% to 16.5%.", icon: DollarSign },
  { title: "Financial Freedom", description: "No foreign exchange controls. Free movement of capital and a highly developed banking sector.", icon: Zap },
  { title: "Common Law System", description: "A stable legal framework based on British Common Law, providing high protection for businesses.", icon: Shield },
  { title: "Business Efficiency", description: "Incorporation is fast and efficient, usually completed within a few business days.", icon: Award }
];

const entityTypesDataHK = [
  {
    type: "Company Limited by Shares",
    description: "The most common form for trading and investment. Limited liability for shareholders based on their share contribution.",
    key_points: ["100% Foreign Owned", "No residency requirement", "Limited liability"],
  },
  {
    type: "Branch Office",
    description: "An extension of a foreign parent company registration. Not a separate legal entity in Hong Kong.",
    key_points: ["Parent liability", "Simple registration", "Foreign parent control"],
  },
  {
    type: "Representative Office",
    description: "Used only for non-profit generating activities like market research or liaison work. Cannot sign contracts.",
    key_points: ["No profit generation", "No legal entity", "Liaison focus"],
  },
];

const hkProcessSteps = [
  { title: "Name Search", desc: "Verifying the proposed company name with the Registrar of Companies in Hong Kong." },
  { title: "Documentation", desc: "Preparing the Articles of Association and appointment forms for directors/shareholders." },
  { title: "Registration", desc: "Submitting application and fees to the Companies Registry for the Certificate of Incorporation." },
  { title: "Business Register", desc: "Registering with the Inland Revenue Department for the Business Registration Certificate (BRC)." },
  { title: "Bank Opening", desc: "Assistance with opening a corporate bank account with HK-based banks like HSBC or BOC." },
  { title: "Company Sec.", desc: "Appointing a local Hong Kong Company Secretary (Licensed) as required by law." },
];

const hkDocuments = [
  "Valid Passport of all Directors and Shareholders.",
  "Proof of Overseas Residential Address (Recent Utility Bill).",
  "Articles of Association (Drafted by Bizzfiling).",
  "Incorporation Form (NNC1).",
  "KYC documentation for beneficial owners.",
];

const hkTaxCompliance = [
  { title: "Profits Tax", details: "Two-tiered system: 8.25% on first HKD 2 million, 16.5% thereafter. No tax on offshore profits.", icon: DollarSign },
  { title: "Audit Requirement", details: "All HK companies must have their annual accounts audited by a HK-certified public accountant (CPA).", icon: Building },
  { title: "Annual Return", details: "Filing an Annual Return (NAR1) with the Companies Registry every year.", icon: FileText }
];

const hkFAQs = [
  { q: "Can a foreigner own 100% of a Hong Kong company?", a: "Yes, 100% foreign ownership is allowed with no restrictions on the nationality of directors/shareholders." },
  { q: "Is a local director required?", a: "No, directors can be of any nationality and do not need to reside in Hong Kong." },
  { q: "What is a Company Secretary?", a: "Every HK company must appoint a local Company Secretary who is either a resident individual or a licensed trust/company service provider." },
  { q: "Does HK tax income earned outside Hong Kong?", a: "Hong Kong follows a territorial basis of taxation. Profits earned outside HK are generally non-taxable (subject to IRD approval)." },
  { q: "How long does it take to open a bank account?", a: "Due to strict KYC, it typically takes 4-8 weeks. Bizzfiling assists with preparation and introductions." },
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
      <SectionHeading subtitle="Overview" title="Hong Kong Company Setup" description="Hong Kong is the premier gateway to the Asia-Pacific region and mainland China." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            With its world-class financial infrastructure and territorial tax system, Hong Kong remains a top choice for international trade and holding companies. Bizzfiling provides end-to-end support including licensed Company Secretarial services.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100"><CheckCircle size={12} /> Offshore Tax-Free</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"><Building size={12} /> Licensed Sec.</div>
          </div>
        </div>
        <div className="p-6 bg-[#0F2D30] rounded-2xl text-center text-white border-t-2 border-[#C59B4E]">
          <h5 className="text-2xl font-bold mb-1">ASIA #1</h5>
          <p className="text-[10px] text-[#C59B4E] uppercase tracking-widest font-bold">Capital Hub</p>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Success" title="Hong Kong Advantages" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {hkAdvantages.map((adv, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all group hover:border-[#1A7F7D]">
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
      <SectionHeading subtitle="Structures" title="HK Entity Comparison" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityTypesDataHK.map((type, i) => (
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
      <SectionHeading subtitle="Timeline" title="6-Step HK Process" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
        {hkProcessSteps.map((step, i) => (
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

const TaxContent = () => (
  <section id="tax-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Compliance" title="Tax & CPA Audit" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hkTaxCompliance.map((item, i) => (
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
export default function HongKongPage() {
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
          <img src={BackgroundImageSrc} alt="Hong Kong Incorporation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Asia-Pacific Trade Gate</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Hong Kong Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                One of the world's most competitive tax systems. 100% remote formation, excellent banking infrastructure, and direct proximity to China.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> 8.25% Profits Tax
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> Licensed TCSP Provider
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Launch in HK</h3>
                  <LeadForm serviceName="Company Registration in Hong Kong" btnText="Talk to HK Expert" />
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
        <TaxContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="HK Business Registry" />
            <div className="mt-8">
              {hkFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}