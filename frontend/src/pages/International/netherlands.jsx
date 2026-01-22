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
  Scale,
  Users,
  Check,
  Rocket
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";
import StartNowButton from "../../components/StartNowButton";

// --- NETHERLANDS REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Why Netherlands?' },
  { id: 'types-content', label: 'Entity Types' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'tax-content', label: 'Tax & Compliance' },
  { id: 'faqs-content', label: 'FAQs' },
];

const nlAdvantages = [
  { title: "Strategic European Hub", description: "Access to 500 million consumers within 24 hours. The Port of Rotterdam and Schiphol Airport provide unmatched logistics.", icon: Globe },
  { title: "Favorable Tax Climate", description: "Competitive corporate income tax rates, R&D incentives (WBSO), and an extensive network of tax treaties.", icon: DollarSign },
  { title: "Highly Educated Workforce", description: "Access a multilingual, tech-savvy, and highly skilled talent pool. English is widely spoken in business.", icon: Users },
  { title: "Innovation Ecosystem", description: "A world-class environment for tech startups and scale-ups, with strong government support for innovation.", icon: Zap },
  { title: "Simple Incorporation", description: "The Dutch BV can be set up remotely through a civil-law notary, making the process efficient.", icon: CheckCircle }
];

const entityTypesDataNL = [
  {
    type: "Private Limited Company (BV)",
    description: "The most common legal form for foreign investors. It offers limited liability, flexibility, and can be set up with a minimum share capital of just €0.01.",
    key_points: ["Limited liability", "Flexible structure", "Ideal for most businesses"],
  },
  {
    type: "Public Limited Company (NV)",
    description: "Suitable for large corporations that wish to raise capital on the stock exchange. Requires a minimum share capital of €45,000.",
    key_points: ["Can be publicly traded", "Higher capital requirement", "Stricter regulations"],
  },
  {
    type: "Branch Office",
    description: "An extension of a foreign parent company, not a separate legal entity. The parent company remains fully liable for the branch's activities.",
    key_points: ["No separate legal entity", "Parent company is liable", "Simpler setup"],
  },
];

const nlProcessSteps = [
  { title: "Choose Structure", desc: "Decide between a BV, NV, or other forms. Our experts help you choose the best fit." },
  { title: "Verify Name", desc: "We check if your desired company name is available and complies with Dutch regulations." },
  { title: "Prepare Documents", desc: "This includes the deed of incorporation and articles of association, prepared by a civil-law notary." },
  { title: "KVK Registration", desc: "The notary files the deed, officially registering your company in the Dutch Commercial Register." },
  { title: "Tax Registration", desc: "Your company is automatically registered with the Dutch Tax and Customs Administration for VAT and corporate tax." },
  { title: "Bank Setup", desc: "A corporate bank account is essential for business operations. We provide guidance on this step." },
];

const requiredDocumentsNL = [
  "Valid Passport or National ID of all founders/directors.",
  "Proof of Residential Address (e.g., recent utility bill).",
  "A detailed business plan may be required.",
  "The company's proposed name and business activities.",
  "For corporate shareholders, legalized corporate documents are needed.",
];

const nlTaxCompliance = [
  { title: "Corporate Income Tax (CIT)", details: "A progressive rate applies. The first bracket has a lower rate. As of 2024, the standard rate is 25.8%.", icon: DollarSign },
  { title: "Value Added Tax (VAT/BTW)", details: "The standard VAT rate is 21%. Companies must file periodic VAT returns. Lower rate for specific goods.", icon: Scale },
  { title: "Annual Accounts Filing", details: "All BVs must prepare and file annual financial statements with the Chamber of Commerce (KVK).", icon: FileText }
];

const nlFAQs = [
  { q: "Can a foreigner start a business in the Netherlands?", a: "Yes, foreigners can easily set up a business in the Netherlands. The Dutch BV is a popular choice and allows for 100% foreign ownership." },
  { q: "Do I need to be in the Netherlands to register a company?", a: "No, the entire process of setting up a Dutch BV can be handled remotely with the help of a civil-law notary and a service provider like Bizzfiling." },
  { q: "What is a Dutch BV?", a: "A 'Besloten Vennootschap' (BV) is a private limited liability company. It's the most common business structure for entrepreneurs in the Netherlands due to its flexibility and liability protection." },
  { q: "How long does it take to set up a company in the Netherlands?", a: "With all documents in order, the incorporation process typically takes 1-2 weeks." },
  { q: "What is the minimum share capital for a Dutch BV?", a: "The minimum share capital required is only €0.01, making it very accessible for startups." },
  { q: "Do I need a local director?", a: "While not a strict legal requirement for incorporation, having a director resident in the EU/EEA is often necessary for tax substance and practical reasons, like opening a bank account." },
  { q: "What are the main taxes for a company in the Netherlands?", a: "The main taxes are Corporate Income Tax (CIT) on profits and Value Added Tax (VAT/BTW) on goods and services." },
];

// --- Reusable Components (Compact & Premium) ---

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

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-4
       ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg scale-[1.01]' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
    `}>
    <button className="flex items-center justify-between w-full p-8 text-left" onClick={onClick}>
      <h3 className={`text-sm md:text-base font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <p className={`px-6 pb-6 text-sm md:text-base leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sections ---

const OverviewContent = () => (
  <section id="overview-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Innovation Gateway"
        title="Dutch Business Setup"
        description="Setting up a company in the Netherlands offers a gateway to Europe's largest economies through a pro-business climate and strategic location."
      />
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-8">
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-600 leading-relaxed text-lg">
              The process is streamlined and can be done fully remotely. <span className="text-[#1A7F7D] font-bold">Bizzfiling</span> simplifies this journey, coordinating with Dutch civil-law notaries to ensure a compliant and efficient setup for global founders.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { text: "100% Remote Setup", icon: Rocket },
              { text: "EU Market Access", icon: Globe },
              { text: "Notary Coordination", icon: Shield },
              { text: "Tax Treaty Network", icon: Scale }
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
              <Briefcase className="w-10 h-10 text-[#C59B4E]" />
            </div>
            <h5 className="text-3xl font-black mb-2 tracking-tight">€0.01</h5>
            <p className="text-sm text-[#C59B4E] uppercase tracking-[0.3em] font-black">Min Share Capital</p>
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-5">
              <div className="text-left">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">VAT Rating</p>
                <p className="text-lg font-bold">Standard 21%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Economy</p>
                <p className="text-lg font-bold">AAA Rated</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Success" title="Strategic Advantages" description="Why global entrepreneurs choose the Netherlands as their gateway to Europe." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {nlAdvantages.map((item, i) => (
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
  <section id="types-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Legal Forms"
        title="Choose Your Dutch Entity"
        description="Select the structure that aligns with your European growth objectives and liability needs."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {entityTypesDataNL.map((item, i) => (
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
  <section id="process-content" className="py-16 md:py-20 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Steps"
        title="6-Phase Incorporation"
        description="Our simplified roadmap to launching your Dutch venture."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 relative">
        {nlProcessSteps.map((step, i) => (
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
          <h3 className="text-3xl font-extrabold text-white">EU Banking Partner?</h3>
          <p className="text-slate-300 text-lg">We assist with opening accounts with leading Dutch and neo-banks.</p>
<StartNowButton />
        </div>
        <button className="px-10 py-5 bg-[#C59B4E] text-[#0F2D30] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#0F2D30]/50 hover:scale-105 active:scale-95 transition-all">
          Get Started
        </button>
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="documents-content" className="py-16 md:py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-12 items-stretch">
        <div className="w-full lg:w-3/5">
          <SectionHeading subtitle="Checklist" title="Dutch Requirements" align="left" />
          <div className="grid sm:grid-cols-1 gap-10 mt-10">
            {requiredDocumentsNL.map((doc, i) => (
              <div key={i} className="group flex items-center gap-10 p-8 bg-white rounded-2xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#1A7F7D] transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-slate-900">{doc}</h5>
                  <p className="text-sm text-slate-500 font-medium">Legally verified copies</p>
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
            <h3 className="text-3xl font-extrabold mb-6">Premium Advisory</h3>
            <p className="text-slate-300 mb-10 text-lg font-medium leading-relaxed">
              Every Dutch BV requires a civil-law notary. We handle all coordination and legalization of your international documents.
            </p>
            <div className="w-full space-y-8">
              <button className="w-full bg-[#C59B4E] text-[#0F2D30] px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20">
                Talk to Dutch Expert
              </button>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Global EU Standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TaxContent = () => (
  <section id="tax-content" className="py-16 md:py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Compliance"
        title="Tax Obligations"
        description="Understanding your ongoing tax responsibilities within the Dutch fiscal framework."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {nlTaxCompliance.map((item, i) => (
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

export default function NetherlandsPage() {
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Netherlands Company Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified EU Business Support</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                Business Setup in <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Netherlands</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Launch in Europe's connected economy. 100% remote registration, business-friendly taxes, and EU market entry. Connect with specialists for reliable Dutch formation.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> 100% Remote
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> Expert Advisor
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Launch Now</h3>
                  <LeadForm serviceName="Company Registration in Netherlands" btnText="Start Registration" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation - Compact */}
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

        {/* FAQ Section - Compact */}
        <section id="faqs-content" className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading subtitle="FAQ" title="Your Netherlands Questions" description="Answers to common questions about Dutch incorporation and operations." />
            <div className="space-y-8">
              {nlFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}