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
  Check
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

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
  <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="inline-block py-1 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-[10px] uppercase tracking-widest mb-2 border border-[#B2DFDB]">
      {subtitle}
    </span>
    <h3 className="mb-2 text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-xs md:text-sm max-w-2xl leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-2
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30'}
  `}>
    <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
      <h3 className={`text-xs font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
      <p className={`px-4 pb-4 text-[11px] leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sections ---

const OverviewContent = () => (
  <section id="overview-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Overview" title="Netherlands Registration" description="Setting up a company in the Netherlands offers a gateway to Europe's largest economies. Known for its pro-business climate and strategic location." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100">
        <p className="text-slate-600 leading-relaxed text-sm">
          The process is streamlined and can be done remotely, making it highly accessible for founders from India and around the world. Bizzfiling simplifies this journey, ensuring a compliant and efficient setup.
        </p>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Benefits" title="Strategic Advantages" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nlAdvantages.map((adv, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm transition-all group">
            <div className="w-10 h-10 bg-[#F0FDFA] rounded-lg flex items-center justify-center mb-4 text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-all">
              <adv.icon size={20} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">{adv.title}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">{adv.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TypesContent = () => (
  <section id="types-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Structures" title="Entity Comparison" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityTypesDataNL.map((type, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border-t-2 border-t-[#C59B4E]">
            <h4 className="text-lg font-bold text-[#0F2D30] mb-2">{type.type}</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed mb-4">{type.description}</p>
            <div className="space-y-2">
              {type.key_points.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] font-semibold text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={10} /></div>
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
      <SectionHeading subtitle="Process" title="6-Step Guide" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {nlProcessSteps.map((step, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
            <div className="inline-block px-2 py-1 bg-[#0F2D30] text-[#C59B4E] rounded-md font-bold text-[10px] mb-2">Step {i + 1}</div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">{step.title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed">{step.desc}</p>
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
          <SectionHeading subtitle="Documents" title="Required Files" align="left" />
          <div className="space-y-2">
            {requiredDocumentsNL.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <FileText size={14} className="text-[#C59B4E]" />
                <p className="text-slate-700 font-medium text-[11px]">{doc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#0F2D30] p-8 rounded-3xl text-white relative">
          <Award className="w-10 h-10 text-[#C59B4E] mb-4" />
          <h3 className="text-xl font-bold mb-2">Expert Assistance</h3>
          <p className="text-slate-300 mb-6 text-xs leading-relaxed">Our legal team specializes in international business law. We handle pre-incorporation checks and notary coordination.</p>
          <button className="bg-[#C59B4E] text-[#0F2D30] px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all">Get Free Consultation</button>
        </div>
      </div>
    </div>
  </section>
);

const TaxContent = () => (
  <section id="tax-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Compliance" title="Tax Obligations" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nlTaxCompliance.map((item, i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-28 lg:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Netherlands" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 lg:via-[#0F2D30]/90 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.1em]">Netherlands Company Formation</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight">
                Business Setup in <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Netherlands</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Launch in Europe's connected economy. 100% remote registration, business-friendly taxes, and EU market entry.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> 100% Remote
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> Expert Advisor
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-[#0F2D30] py-4 px-6 text-center border-b border-white/10">
                  <h2 className="text-lg font-bold text-white leading-none">Book Consultation</h2>
                </div>
                <div className="p-6">
                  <LeadForm serviceName="Company Registration in Netherlands" btnText="Talk to Expert" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation - Compact */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-0">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  className={`py-4 text-[10px] font-bold tracking-widest uppercase border-b-2 transition-all ${activeTab === tab.id ? 'text-[#0F2D30] border-[#0F2D30]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
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
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24 border-t border-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="Common Questions" />
            <div className="mt-8">
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