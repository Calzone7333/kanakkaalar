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
  Scale,
  Rocket,
  Users
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

// --- Sections ---

const OverviewContent = () => (
  <section id="overview-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Financial Gateway"
        title="Hong Kong Company Setup"
        description="Hong Kong is the premier gateway to the Asia-Pacific region and mainland China, offering world-class infrastructure and a simple tax system."
      />
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-600 leading-relaxed text-lg">
              With its world-class financial infrastructure and territorial tax system, Hong Kong remains a top choice for international trade and holding companies. <span className="text-[#1A7F7D] font-bold">Bizzfiling</span> provides end-to-end support including licensed Company Secretarial services required by HK law.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { text: "Offshore Tax-Free", icon: Rocket },
              { text: "No Residency Required", icon: Users },
              { text: "Licensed Sec. Service", icon: Shield },
              { text: "China Market Access", icon: Globe }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#1A7F7D]/30 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A7F7D] shadow-sm">
                  {item.icon ? <item.icon size={20} /> : <CheckCircle size={20} />}
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
              <Star className="w-10 h-10 text-[#C59B4E]" />
            </div>
            <h5 className="text-5xl font-black mb-2 tracking-tight">ASIA #1</h5>
            <p className="text-sm text-[#C59B4E] uppercase tracking-[0.3em] font-black">Capital Hub</p>
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-5">
              <div className="text-left">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Tax System</p>
                <p className="text-lg font-bold">Territorial</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Company Sec</p>
                <p className="text-lg font-bold">Mandatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Advantages" title="Strength of the HK Market" description="Why global entrepreneurs choose Hong Kong as their business headquarters in Asia." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {hkAdvantages.map((item, i) => (
          <div
            key={i}
            className={`group relative rounded-2xl border p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center
              ${i === 1
                ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10'
                : 'bg-white border-slate-100 text-slate-800 hover:border-[#1A7F7D]/30'
              }`}
          >

            {/* Hover Top Border */}
            {i !== 1 && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#1A7F7D] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            )}

            {/* Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner group-hover:shadow-lg mt-2
              ${i === 1
                ? 'bg-white text-[#0F2D30]'
                : 'bg-[#F0FDFA] text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white'
              }
            `}>
              {item.icon ? <item.icon size={36} strokeWidth={1.5} /> : <FileText size={36} strokeWidth={1.5} />}
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold mb-4 transition-colors ${i === 1 ? 'text-white' : 'text-slate-800 group-hover:text-[#1A7F7D]'}`}>
              {item.title}
            </h3>

            {/* Description */}
            <p className={`text-[15px] leading-relaxed mb-6 min-h-[80px] ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
              {item.description}
            </p>

            {/* Read More Button */}
            <div className="mt-auto">
              <button className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300
                ${i === 1
                  ? 'bg-[#1A7F7D] text-white hover:bg-[#156664] hover:shadow-lg'
                  : 'bg-[#F0FDFA] text-[#1A7F7D] hover:bg-[#1A7F7D] hover:text-white'
                }
              `}>
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TypesContent = () => (
  <section id="types-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Structures"
        title="HK Business Entities"
        description="Select the legal form that best suits your trading, investment, or liaison objectives in Hong Kong."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {entityTypesDataHK.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
              ${i === 0
                ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10 shadow-xl'
                : 'bg-white border-slate-100 text-slate-800'
              }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner
              ${i === 0 ? 'bg-white/10 text-[#C59B4E]' : 'bg-[#F0FDFA] text-[#1A7F7D]'}`}
            >
              <Briefcase size={28} />
            </div>
            <h4 className={`text-2xl font-bold mb-4 ${i === 0 ? 'text-white' : 'text-slate-900'}`}>{item.type}</h4>
            <p className={`text-sm leading-relaxed mb-8 flex-grow ${i === 0 ? 'text-slate-300' : 'text-slate-500'}`}>{item.description}</p>
            <div className="space-y-8 pt-6 border-t border-white/10">
              {item.key_points.map((point, idx) => (
                <div key={idx} className="flex items-center gap-5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 
                    ${i === 0 ? 'bg-[#1A7F7D]/40 text-white' : 'bg-green-100 text-green-600'}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-bold ${i === 0 ? 'text-white/90' : 'text-slate-700'}`}>{point}</span>
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
  <section id="process-content" className="py-24 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Roadmap"
        title="6-Step HK Incorporation"
        description="A clear and managed path to your Hong Kong business registration."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16 relative">
        {hkProcessSteps.map((step, i) => (
          <div key={i} className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="w-16 h-16 bg-[#0F2D30] text-[#C59B4E] rounded-2xl flex items-center justify-center font-black text-xl mb-6 shadow-xl transform group-hover:rotate-6 transition-transform">
              {i + 1}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
            <p className="text-slate-500 text-[15px] leading-relaxed px-4">{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 p-10 bg-[#0F2D30] rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-8 text-center lg:text-left">
          <h3 className="text-3xl font-extrabold text-white">Need a Licensed Secretary?</h3>
          <p className="text-slate-300 text-lg">Every HK company must appoint a local secretary. We provide licensed TCSP support.</p>
        </div>
        <button className="px-10 py-5 bg-[#C59B4E] text-[#0F2D30] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#0F2D30]/50 hover:scale-105 active:scale-95 transition-all">
          Appoint Now
        </button>
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="documents-content" className="py-24 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-20 items-stretch">
        <div className="w-full lg:w-3/5">
          <SectionHeading subtitle="Checklist" title="Registry Requirements" align="left" />
          <div className="grid sm:grid-cols-1 gap-10 mt-10">
            {hkDocuments.map((doc, i) => (
              <div key={i} className="group flex items-center gap-10 p-8 bg-white rounded-2xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#1A7F7D] transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-slate-900">{doc}</h5>
                  <p className="text-sm text-slate-500 font-medium">Registry compliant copies</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col">
          <div className="flex-grow bg-[#0F2D30] p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl flex flex-col items-center text-center justify-center">
            <div className="absolute top-0 right-0 p-8">
              <Shield size={120} className="text-white/5 rotate-12" />
            </div>
            <div className="w-24 h-24 bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center mb-10 shadow-inner">
              <Star size={48} className="text-[#C59B4E]" />
            </div>
            <h3 className="text-3xl font-extrabold mb-6">Premium Secretariat</h3>
            <p className="text-slate-300 mb-10 text-lg font-medium leading-relaxed">
              We provide licensed TCSP services, handling your NAR1 filings and registry compliance with 100% accuracy.
            </p>
            <div className="w-full space-y-8">
              <button className="w-full bg-[#C59B4E] text-[#0F2D30] px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20">
                Request Services
              </button>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Global Standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TaxContent = () => (
  <section id="tax-content" className="py-24 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Compliance"
        title="Tax & CPA Audit Obligations"
        description="Stay compliant with Hong Kong's Inland Revenue Department through expert audit coordination."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {hkTaxCompliance.map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group text-center">
            <div className="w-20 h-20 bg-[#F0FDFA] rounded-full flex items-center justify-center text-[#1A7F7D] mb-8 mx-auto border border-slate-50 group-hover:bg-[#1A7F7D] group-hover:text-white transition-all duration-500">
              {item.icon ? <item.icon size={36} /> : <DollarSign size={36} />}
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h4>
            <p className="text-slate-500 text-base font-medium leading-relaxed">{item.details}</p>
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Hong Kong Company Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Asia Business Support</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Hong Kong Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                One of the world's most competitive tax systems. 100% remote formation, excellent banking infrastructure, and direct proximity to China. Connect with specialists for reliable HK formation.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> 8.25% Profits Tax
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> Licensed TCSP Provider
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Launch Now</h3>
                  <LeadForm serviceName="Company Registration in Hong Kong" btnText="Start Registration" />
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

      <div className="max-w-7xl mx-auto">
        <OverviewContent />
        <AdvantagesContent />
        <TypesContent />
        <ProcessContent />
        <DocumentsContent />
        <TaxContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading subtitle="FAQ" title="HK Business Registry" description="Answers to common questions about Hong Kong company formation and operations." />
            <div className="space-y-8">
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