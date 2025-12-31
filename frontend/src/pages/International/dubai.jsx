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
  Landmark
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- DUBAI REGISTRATION FULL DATA ---

const tabs = [
  { id: 'overview-content', label: 'Overview' },
  { id: 'advantages-content', label: 'Advantages' },
  { id: 'jurisdictions-content', label: 'Jurisdictions' },
  { id: 'process-content', label: 'Process' },
  { id: 'documents-content', label: 'Documents' },
  { id: 'faqs-content', label: 'FAQs' },
];

const dubaiAdvantages = [
  { title: "Zero Income Tax", description: "Enjoy 0% personal and corporate income tax (for profits under specific thresholds) and no capital gains tax.", icon: DollarSign },
  { title: "Strategic Location", description: "Optimal time zone connecting East and West. Premier logistics via Dubai Port and International Airport.", icon: Globe },
  { title: "100% Repatriation", description: "Full repatriation of capital and profits is allowed, providing complete financial control.", icon: Zap },
  { title: "World-Class Infra", description: "Access to state-of-the-art office spaces, telecommunications, and business parks.", icon: Building },
  { title: "Golden Visa", description: "Business owners can qualify for long-term residency (Golden Visa) for themselves and their families.", icon: Award }
];

const jurisdictionsData = [
  {
    type: "Mainland Company",
    description: "Allows trading anywhere in the UAE and internationally. Requires a UAE national as an agent or partner for certain activities.",
    key_points: ["Trade within UAE", "No geographic limits", "Government projects"],
  },
  {
    type: "Free Zone Company",
    description: "Located in special economic zones like IFZA, DMCC, or DAFZA. Offers 100% foreign ownership and zero customs duties.",
    key_points: ["100% Foreign Owned", "Specialized clusters", "No customs duties"],
  },
  {
    type: "Offshore (IBC)",
    description: "Non-resident company used for asset protection, holding property, and international trade outside the UAE.",
    key_points: ["Asset Protection", "High Privacy", "No local office"],
  },
];

const dubaiProcessSteps = [
  { title: "Activity Choice", desc: "Selecting the precise business activities as per the Department of Economy and Tourism (DET)." },
  { title: "Jurisdiction", desc: "Choosing between Mainland, Free Zone, or Offshore based on your business model." },
  { title: "Legal Name", desc: "Reserving a unique trade name that complies with UAE naming conventions." },
  { title: "Approvals", desc: "Obtaining Initial Approval and external approvals if the activity requires it." },
  { title: "MoA Drafting", desc: "Preparing the Memorandum of Association and signing with the notary public." },
  { title: "License Issue", desc: "Paying the fees and receiving the Trade License, followed by establishment card and visa processing." },
];

const dubaiDocuments = [
  "Passport Copy of all Shareholders/Directors.",
  "Passport size photographs (White background).",
  "Proof of Residence (Outside UAE).",
  "Proposed Trade Names (At least 3 options).",
  "Entry Stamp or Visa copy (If already visited UAE).",
];

const dubaiFAQs = [
  { q: "Is 100% foreign ownership allowed in Dubai?", a: "Yes, 100% foreign ownership is now allowed for both Free Zone and many Mainland business activities." },
  { q: "Do I need an office space?", a: "Mainland companies require a physical office (Ejari). Many Free Zones offer 'Flexi-Desk' options for startups." },
  { q: "What is the cost of a Dubai Trade License?", a: "Costs vary significantly by jurisdiction and activity, starting from approximately AED 12,000 for certain Free Zones." },
  { q: "Can I get a residency visa?", a: "Yes, a Dubai business license entitles the owner and employees to apply for UAE residency visas." },
  { q: "What is Corporate Tax in UAE?", a: "A 9% Corporate Tax was introduced in June 2023 for taxable profits exceeding AED 375,000." },
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
      <SectionHeading subtitle="Overview" title="Dubai Business Setup" description="Dubai is the ultimate destination for global entrepreneurs seeking a tax-efficient lifestyle and growth." />
      <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            With its 'pro-entrepreneur' policies and world-class infrastructure, Dubai serves as the ideal base for international trade, consulting, and tech ventures. Bizzfiling helps you choose the right jurisdiction to maximize tax benefits and operational efficiency.
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100"><CheckCircle size={12} /> Tax Benefits</div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"><Landmark size={12} /> Global Banking</div>
          </div>
        </div>
        <div className="p-6 bg-[#0F2D30] rounded-2xl text-center text-white border-t-2 border-[#C59B4E]">
          <h5 className="text-2xl font-bold mb-1">UAE #1</h5>
          <p className="text-[10px] text-[#C59B4E] uppercase tracking-widest font-bold">Growth Market</p>
        </div>
      </div>
    </div>
  </section>
);

const AdvantagesContent = () => (
  <section id="advantages-content" className="py-12 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Success" title="Why Dubai?" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {dubaiAdvantages.map((adv, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all group hover:border-[#C59B4E]">
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

const JurisdictionsContent = () => (
  <section id="jurisdictions-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Jurisdictions" title="Where to Incorporate?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {jurisdictionsData.map((type, i) => (
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
      <SectionHeading subtitle="Timeline" title="6-Step UAE Process" />
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
        {dubaiProcessSteps.map((step, i) => (
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
          <SectionHeading subtitle="Checklist" title="Dubai Documents" align="left" />
          <div className="grid sm:grid-cols-1 gap-2">
            {dubaiDocuments.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <FileText size={12} className="text-[#1A7F7D] flex-shrink-0" />
                <p className="text-slate-700 font-bold text-[10px]">{doc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-[#000] p-8 rounded-3xl text-white relative flex flex-col items-center text-center">
          <Star className="w-12 h-12 text-[#C59B4E] mb-4" />
          <h3 className="text-xl font-bold mb-2">Golden Visa Assistance</h3>
          <p className="text-slate-300 mb-6 text-xs leading-relaxed max-w-sm">Planning a long-term future in Dubai? We assist entrepreneurs in qualifying for the UAE Golden Visa, providing 10-year residency for you and your family.</p>
          <button className="w-full max-w-xs bg-[#C59B4E] text-[#0F2D30] px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">Check Eligibility</button>
        </div>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function DubaiPage() {
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
          <img src={BackgroundImageSrc} alt="Dubai Incorporation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Middle East Growth Hub</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Dubai Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Experience zero income tax and 100% capital repatriation. Launch in Dubai Mainland or a Free Zone. Our experts guide you through the entire UAE business licensing process.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> 0% Income Tax
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> DET Authorized
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Start Dubai Venture</h3>
                  <LeadForm serviceName="Company Registration in Dubai" btnText="Talk to Dubai Expert" />
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
        <JurisdictionsContent />
        <ProcessContent />
        <DocumentsContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="Your Dubai Questions" />
            <div className="mt-8">
              {dubaiFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}