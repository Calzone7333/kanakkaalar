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
  Timer,
  FilePenLine,
  Rocket,
  Users,
  Layers,
  Globe,
  DollarSign,
  Briefcase,
  Activity,
  Zap,
  Scale,
  Check
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- USA REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Advantages' },
  { id: 'types-content', label: 'Entity Types' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'tax-content', label: 'Tax & Compliance' },
  { id: 'faqs-content', label: 'FAQs' },
];

const usaAdvantages = [
  { title: "World's Largest Economy", description: "Access to the most robust market with unparalleled growth opportunities and consumer reach.", icon: Globe },
  { title: "Venture Capital Access", description: "Silicon Valley and Wall Street provide the highest concentration of startup funding globally.", icon: DollarSign },
  { title: "IP Protection", description: "Strongest legal framework for protecting trademarks, patents, and technical innovations.", icon: Shield },
  { title: "Global Credibility", description: "A US-based headquarter instantly boosts trust among international clients and partners.", icon: Award },
  { title: "Business Privacy", description: "States like Wyoming and Nevada offer excellent privacy and asset protection laws.", icon: Zap }
];

const entityTypesData = [
  {
    type: "Limited Liability Company (LLC)",
    description: "The most popular choice for small businesses and non-residents. Combines limited liability with flexible taxation.",
    key_points: ["No double taxation", "Flexible management", "Asset protection"],
  },
  {
    type: "C-Corporation",
    description: "Preferred by startups planning to raise VC funding. Standard corporate structure with unlimited stock issuance.",
    key_points: ["Best for fundraising", "Limited liability", "Unlimited owners"],
  },
  {
    type: "S-Corporation",
    description: "A tax designation for corporations that meet specific IRS requirements. Only available to US citizens/residents.",
    key_points: ["Tax savings", "Limited liability", "Strict ownership rules"],
  },
];

const usaProcessSteps = [
  { title: "Select Structure & State", desc: "Choose between LLC or C-Corp and select your state (Delaware, Wyoming, or Nevada)." },
  { title: "Verify Company Name", desc: "Check for name availability in the selected state's Secretary of State database." },
  { title: "File Articles of Formation", desc: "Submit the necessary legal documents with the State authorities to officially incorporate." },
  { title: "Obtain EIN (Tax ID)", desc: "Apply for an Employer Identification Number from the IRS (remote application for non-residents)." },
  { title: "Operating Agreement", desc: "Drafting the internal bylaws or operating agreement to define ownership and management." },
  { title: "Bank Account Setup", desc: "Guidance on opening a US-based corporate bank account for business transactions." },
];

const usaDocuments = [
  "Valid Passport of all Owners/Directors (Photo & Address pages).",
  "Proposed Company Name (Minimum 3 options).",
  "Proof of Address (Utility bill or Bank statement not older than 2 months).",
  "Brief business description and website (if any).",
  "Registered Agent details (Provided by Bizzfiling).",
];

const usaTaxCompliance = [
  { title: "Federal Income Tax", details: "C-Corps pay 21% flat tax. LLCs are pass-through entities where owners report income on personal returns.", icon: DollarSign },
  { title: "State Franchise Tax", details: "Annual fees paid to the state to keep the business in good standing. Varies by state (Delaware: ~$300).", icon: Scale },
  { title: "Annual Reporting", details: "Most states require an annual report filing to update officer information and business status.", icon: FileText }
];

const usaFAQs = [
  { q: "Can a non-US resident own an LLC?", a: "Yes, anyone from any country can own 100% of a US LLC or C-Corp fully remotely without visiting the US." },
  { q: "Which state is best for my startup?", a: "Delaware is best for fundraising (VCs), while Wyoming is often preferred for low-cost LLCs and privacy." },
  { q: "Do I need a US address?", a: "You need a 'Registered Agent' in the state of incorporation. Bizzfiling provides this service for you." },
  { q: "How long does the process take?", a: "Typically 5-10 business days for formation, plus 2-4 weeks for EIN processing for non-residents." },
  { q: "Do I need to file taxes if I have no US income?", a: "Yes, all US entities must file annual informational returns (like 5472) regardless of profit or US-nexus." },
  { q: "Can I open a US bank account remotely?", a: "Yes, we work with fintech partners like Mercury and Relay to help you open accounts online." },
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
    <p className="text-slate-500 text-[11px] md:text-xs max-w-2xl leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-2
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-50 bg-white text-slate-800 hover:border-[#1A7F7D]/30'}
  `}>
    <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
      <h3 className={`text-xs font-semibold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <p className={`px-4 pb-4 text-[10px] leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sections ---

const OverviewContent = () => (
  <section id="overview-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Overview" title="US Company Formation" description="Establish your business in the world's most innovative market. US incorporation provides global prestige and access to top-tier investors." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            With Bizzfiling, you can register your company in states like **Delaware, Wyoming, or Nevada** without leaving your home in India. We handle everything from the Secretary of State filings to IRS Tax IDs (EIN).
          </p>
          <ul className="space-y-2">
            {["100% Online Process", "Registered Agent Included", "IRS EIN Support", "Bylaws & Operating Agreements"].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                <CheckCircle size={14} className="text-green-500" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
            <h5 className="text-[#1A7F7D] font-bold text-lg leading-none">Delaware</h5>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">VC Choice 1</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
            <h5 className="text-[#C59B4E] font-bold text-lg leading-none">Wyoming</h5>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Privacy Hub</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Advantages" title="Strength of the US Market" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {usaAdvantages.map((adv, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all group hover:-translate-y-1">
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
      <SectionHeading subtitle="Structures" title="LLC vs C-Corp" description="We help you choose the best structure for your scaling needs." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {entityTypesData.map((type, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border-t-2 border-t-[#C59B4E]">
            <h4 className="text-lg font-bold text-[#0F2D30] mb-2">{type.type}</h4>
            <p className="text-slate-600 text-[10px] leading-relaxed mb-4">{type.description}</p>
            <div className="space-y-2">
              {type.key_points.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
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
      <SectionHeading subtitle="Timeline" title="Incorporation Process" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {usaProcessSteps.map((step, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all flex items-start gap-4">
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

const DocumentsContent = () => (
  <section id="documents-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/2">
          <SectionHeading subtitle="Checklist" title="Document Requirements" align="left" />
          <div className="grid sm:grid-cols-2 gap-3">
            {usaDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <FileText size={12} className="text-[#C59B4E] flex-shrink-0" />
                <p className="text-slate-700 font-bold text-[10px]">{doc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#0F2D30] p-8 rounded-3xl text-white relative overflow-hidden">
          <Shield className="w-10 h-10 text-[#C59B4E] mb-4 opacity-50 absolute -right-2 top-2 rotate-12" />
          <h3 className="text-xl font-bold mb-2">Secure Registration</h3>
          <p className="text-slate-300 mb-6 text-xs leading-relaxed">Your intellectual property is the heart of your US venture. We ensure all filings are done with bank-grade security and professional oversight.</p>
          <button className="bg-[#C59B4E] text-[#0F2D30] px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/20">Ask an Expert</button>
        </div>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function USPage() {
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
          <img src={BackgroundImageSrc} alt="USA Incorporation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Global Growth Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                USA Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Connect your business to the global market. Remote setup in Delaware & Wyoming. Access funding, prestige, and the US business ecosystem.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Award size={14} className="text-[#C59B4E]" /> 5k+ US Formations
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <DollarSign size={14} className="text-[#C59B4E]" /> VC Support
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Launch in USA</h3>
                  <LeadForm serviceName="Company Registration in USA" btnText="Start My US Venture" />
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
            <SectionHeading subtitle="FAQ" title="Your USA Questions" />
            <div className="mt-8">
              {usaFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}