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
  Check,
  ScrollText
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
        subtitle="Global Gateway"
        title="US Company Formation"
        description="Establish your business in the world's most innovative market. US incorporation provides global prestige and access to top-tier investors."
      />
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-8">
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-600 leading-relaxed text-lg">
              Through our streamlined platform, you can register your company in states like <span className="text-[#1A7F7D] font-bold">Delaware, Wyoming, or Nevada</span> fully remotely. We bridge the gap between Indian entrepreneurs and the US business ecosystem.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { text: "100% Online Process", icon: Rocket },
              { text: "Registered Agent Included", icon: Shield },
              { text: "IRS EIN Support", icon: FileText },
              { text: "Bylaws & Agreements", icon: ScrollText }
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
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#1A7F7D]/10 to-[#C59B4E]/10 rounded-[2rem] blur-2xl"></div>
          <div className="relative grid grid-cols-2 gap-10">
            <div className="space-y-8 pt-12">
              <div className="p-8 bg-[#0F2D30] rounded-2xl text-white shadow-2xl transform hover:-translate-y-2 transition-transform">
                <h5 className="text-[#C59B4E] font-bold text-2xl mb-2">Delaware</h5>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">The gold standard for VCs and tech startups globally.</p>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 transform hover:-translate-y-2 transition-transform">
                <h5 className="text-[#1A7F7D] font-bold text-2xl mb-2">Nevada</h5>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Top-tier asset protection and business privacy.</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 transform hover:-translate-y-2 transition-transform">
                <h5 className="text-[#1A7F7D] font-bold text-2xl mb-2">Wyoming</h5>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">The most cost-effective choice for LLC formation.</p>
              </div>
              <div className="p-8 bg-[#1A7F7D] rounded-2xl text-white shadow-2xl transform hover:-translate-y-2 transition-transform">
                <Globe className="w-8 h-8 text-[#C59B4E] mb-4" />
                <h5 className="font-bold text-xl leading-tight">Global Compliance</h5>
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
      <SectionHeading subtitle="Advantages" title="Strength of the US Market" description="Why global entrepreneurs choose the United States as their business headquarters." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {usaAdvantages.map((item, i) => (
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
        subtitle="Structures"
        title="Choose Your Entity"
        description="We help you choose the best structure for your scaling needs, whether you're a bootstrapper or raising capital."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {entityTypesData.map((item, i) => (
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
            <button className={`mt-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
              ${i === 0
                ? 'bg-[#C59B4E] text-[#0F2D30] hover:bg-[#B38A3E]'
                : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              Select {item.type.split(' ')[0]}
            </button>
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
        subtitle="Step-by-Step"
        title="Incorporation Process"
        description="Our simplified four-phase journey to your US market entry."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative">
        {/* Connection Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-[120px] z-0"></div>

        {usaProcessSteps.slice(0, 4).map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-black text-[#0F2D30] shadow-xl border-4 border-slate-50 group-hover:border-[#C59B4E] transition-all duration-500 mb-8 z-10">
              {i + 1}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
            <p className="text-slate-500 text-[15px] leading-relaxed px-4">{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-20 p-10 bg-[#0F2D30] rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-8 text-center lg:text-left">
          <h3 className="text-3xl font-extrabold text-white">Ready to Go Global?</h3>
          <p className="text-slate-300 text-lg">Our experts are standing by to handle your US formation today.</p>
        </div>
        <button className="px-10 py-5 bg-[#C59B4E] text-[#0F2D30] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#0F2D30]/50 hover:scale-105 active:scale-95 transition-all">
          Launch in 48 Hours
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
          <SectionHeading subtitle="Checklist" title="IP Requirements" align="left" />
          <div className="grid sm:grid-cols-1 gap-10 mt-10">
            {usaDocuments.map((doc, i) => (
              <div key={i} className="group flex items-center gap-10 p-8 bg-white rounded-2xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#1A7F7D] transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-slate-900">{doc}</h5>
                  <p className="text-sm text-slate-500 font-medium">Original scanned copies required</p>
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
            <h3 className="text-3xl font-extrabold mb-6">Premium Support</h3>
            <p className="text-slate-300 mb-10 text-lg font-medium leading-relaxed">
              Register with complete peace of mind. Our local US attorneys review every application for accuracy and compliance.
            </p>
            <div className="w-full space-y-8">
              <button className="w-full bg-[#C59B4E] text-[#0F2D30] px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20">
                Book Fast-Track
              </button>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Available 24/7</p>
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
        title="Ongoing Obligations"
        description="Stay compliant with IRS and State regulators without the headache."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {usaTaxCompliance.map((item, i) => (
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="US Company Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Global Business Support</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                USA Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Connect your business to the global market. Remote setup in Delaware & Wyoming. Access funding, prestige, and the US business ecosystem. Connect with specialists for reliable US formation.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> VC Support
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
                  <LeadForm serviceName="Company Registration in USA" btnText="Start Registration" />
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
        <section id="faqs-content" className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading subtitle="FAQ" title="Your USA Questions" description="Answers to common questions about US incorporation and operations." />
            <div className="space-y-8">
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