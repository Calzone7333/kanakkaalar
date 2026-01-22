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
import StartNowButton from "../../components/StartNowButton";

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
        subtitle="Global Hub"
        title="Dubai Business Setup"
        description="Dubai is the ultimate destination for global entrepreneurs seeking a tax-efficient lifestyle and unmatched growth in the Middle East."
      />
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-8">
          <div className="prose prose-slate prose-lg">
            <p className="text-slate-600 leading-relaxed text-lg">
              With its 'pro-entrepreneur' policies and world-class infrastructure, Dubai serves as the ideal base for international trade, consulting, and tech ventures. <span className="text-[#1A7F7D] font-bold">Bizzfiling</span> helps you choose the right jurisdiction to maximize tax benefits.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { text: "0% Income Tax", icon: DollarSign },
              { text: "100% Repatriation", icon: Zap },
              { text: "Golden Visa Support", icon: Award },
              { text: "Global Banking", icon: Landmark }
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
            <h5 className="text-3xl font-black mb-2 tracking-tight">UAE #1</h5>
            <p className="text-sm text-[#C59B4E] uppercase tracking-[0.3em] font-black">Capital of the Future</p>
            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-5">
              <div className="text-left">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Corp Tax</p>
                <p className="text-lg font-bold">9% (Above 375k)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-bold uppercase mb-1">Licensing</p>
                <p className="text-lg font-bold">DET Approved</p>
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
      <SectionHeading subtitle="Advantages" title="Strength of the Dubai Market" description="Why global entrepreneurs choose Dubai as their business headquarters in the Middle East." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dubaiAdvantages.map((item, i) => (
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

const JurisdictionsContent = () => (
  <section id="jurisdictions-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading
        subtitle="Ecosystems"
        title="Where to Incorporate?"
        description="Choose the right jurisdiction based on your target market, ownership needs, and physical presence requirements."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {jurisdictionsData.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
              ${i === 1
                ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10 shadow-xl'
                : 'bg-white border-slate-100 text-slate-800'
              }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner
              ${i === 1 ? 'bg-white/10 text-[#C59B4E]' : 'bg-[#F0FDFA] text-[#1A7F7D]'}`}
            >
              <Briefcase size={28} />
            </div>
            <h4 className={`text-2xl font-bold mb-4 ${i === 1 ? 'text-white' : 'text-slate-900'}`}>{item.type}</h4>
            <p className={`text-sm leading-relaxed mb-8 flex-grow ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>{item.description}</p>
            <div className="space-y-8 pt-6 border-t border-white/10">
              {item.key_points.map((point, idx) => (
                <div key={idx} className="flex items-center gap-5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 
                    ${i === 1 ? 'bg-[#1A7F7D]/40 text-white' : 'bg-green-100 text-green-600'}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-bold ${i === 1 ? 'text-white/90' : 'text-slate-700'}`}>{point}</span>
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
        subtitle="Timeline"
        title="6-Step UAE Process"
        description="A streamlined journey to receiving your Dubai commercial trade license."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 relative">
        {dubaiProcessSteps.map((step, i) => (
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
          <h3 className="text-3xl font-extrabold text-white">Need an Office (Ejari)?</h3>
          <p className="text-slate-300 text-lg">We assist with physical office spaces and flexi-desk solutions in prime locations.</p>
<StartNowButton />
        </div>
        <button className="px-10 py-5 bg-[#C59B4E] text-[#0F2D30] rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#0F2D30]/50 hover:scale-105 active:scale-95 transition-all">
          Contact Advisor
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
          <SectionHeading subtitle="Checklist" title="Dubai Documents" align="left" />
          <div className="grid sm:grid-cols-1 gap-10 mt-10">
            {dubaiDocuments.map((doc, i) => (
              <div key={i} className="group flex items-center gap-10 p-8 bg-white rounded-2xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#F0FDFA] rounded-xl flex items-center justify-center text-[#1A7F7D] transition-colors">
                  <FileText size={28} />
                </div>
                <div>
                  <h5 className="text-lg font-bold text-slate-900">{doc}</h5>
                  <p className="text-sm text-slate-500 font-medium">Original scanned copies</p>
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
            <h3 className="text-3xl font-extrabold mb-6">Golden Visa</h3>
            <p className="text-slate-300 mb-10 text-lg font-medium leading-relaxed">
              Plan your long-term future in Dubai. We assist eligible entrepreneurs in qualifying for the 10-year residency Golden Visa.
            </p>
            <div className="w-full space-y-8">
              <button className="w-full bg-[#C59B4E] text-[#0F2D30] px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20">
                Check Eligibility
              </button>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Global EU Standards</p>
            </div>
          </div>
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Dubai Company Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Globe size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified Dubai Business Support</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                Dubai Company <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Registration</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Experience zero income tax and 100% capital repatriation. Launch in Dubai Mainland or a Free Zone. Our experts guide you through the entire UAE business licensing process. Connect with specialists for reliable Dubai formation.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> 0% Income Tax
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> DET Authorized
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Launch Now</h3>
                  <LeadForm serviceName="Company Registration in Dubai" btnText="Start Registration" />
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
        <JurisdictionsContent />
        <ProcessContent />
        <DocumentsContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <SectionHeading subtitle="FAQ" title="Your Dubai Questions" description="Answers to common questions about UAE business incorporation and operations." />
            <div className="space-y-8">
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