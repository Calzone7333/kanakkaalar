import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import {
  ChevronDown,
  Zap,
  Briefcase,
  ArrowRight,
  Star,
  CheckCircle,
  FileText,
  Scale,
  Handshake,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Landmark,
  Shield,
  Award,
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck,
  Globe,
  Activity,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- IRDAI REGISTRATION STATIC DATA DEFINITIONS ---

const tabs = [
  { id: 'irdai-overview-content', label: 'Overview' },
  { id: 'irdai-benefits-content', label: 'Benefits' },
  { id: 'irdai-eligibility-content', label: 'Eligibility' },
  { id: 'irdai-documents-content', label: 'Documents' },
  { id: 'irdai-renewal-content', label: 'Validity' },
  { id: 'irdai-why-Bizzfiling', label: 'Why Us' },
  { id: 'irdai-faqs-content', label: 'FAQs' },
];

const irdaiIntroBullets = [
  "Start your insurance company with expert legal support for IRDAI registration.",
  "Complete Form IRDA/R1 & R2 filing, documentation, and license procurement.",
  "Ensure 100% regulatory compliance for a smooth, error-free licensing lifecycle.",
];

const irdaiBenefits = [
  { title: "Statutory Trust", icon: Handshake, detail: "Builds immense customer confidence by proving adherence to national insurance norms." },
  { title: "Capital Access", icon: DollarSign, detail: "Necessary for banking partners to provide funding or capital for insurance ventures." },
  { title: "Market Entry", icon: TrendingUp, detail: "Allows selling products in regulated sectors like government tenders and health schemes." },
  { title: "Legal Protection", icon: Scale, detail: "Ensures compliance with the Insurance Act 1938 to avoid massive regulatory fines." },
  { title: "Operational Flow", icon: Briefcase, detail: "Framework for managing large-scale insurance distributions and advisory networks." },
  { title: "Global Scaling", icon: Globe, detail: "Enables recognition for reinsurance and international insurance partnerships." },
];

const entityTypes = [
  "Life & General Insurance",
  "Insurance Intermediaries",
  "Brokers & Agents",
  "Marketing Firms",
  "Pension Fund Managers",
  "Health Insurance Hubs",
  "Reinsurance Companies",
  "Surveyors & Loss Assessors",
];

const irdaiEligibility = [
  { title: "Net Worth Tier", detail: "Prescribed minimum capital requirement based on the specific entity type.", icon: DollarSign },
  { title: "Sector Experience", detail: "Demonstrable expertise in insurance products and risk management domain.", icon: Activity },
  { title: "IT Infrastructure", detail: "Proof of adequate systems and personnel to support policy operations.", icon: Zap },
  { title: "Statutory Record", detail: "Commitment to follow the Insurance Act 1938 and IRDAI regulations.", icon: Landmark },
];

const irdaiDocs = [
  { title: "R1 & R2 Forms", detail: "Mandatory statutory registration forms for the IRDAI portal.", icon: FileText },
  { title: "MOA & AOA", detail: "Corporate bylaws defining the insurance business scope.", icon: FileText },
  { title: "Audited Financials", detail: "Net worth certificate verified by a chartered accountant.", icon: DollarSign },
  { title: "Legal Identity", detail: "Certificate of Incorporation and PAN for the corporate entity.", icon: Landmark },
  { title: "Work Profiling", detail: "Experience certificates and infrastructure blueprint details.", icon: Briefcase },
  { title: "Statutory Dec", detail: "Compliance certificates and director declarations of clean record.", icon: CheckCircle },
];

const validProcess = [
  { title: "3-Year validity", detail: "Insurance licenses are initially granted for a block of three years.", icon: Clock },
  { title: "Renewal Ledger", detail: "Periodic review of operational data by the IRDAI before license extension.", icon: Timer },
  { title: "Duplicate Filing", icon: FilePenLine, detail: "Strict procedure for lost license replacement with prescribed gov fees." },
];

const whyBizzfiling = [
  { title: "Insurance Law Experts", detail: "Veteran legal team specializing in IRDAI 2016 norms and regulatory hurdles.", icon: UserCheck },
  { title: "R1 & R2 Specialists", detail: "Precision in filing complex statutory forms to avoid multi-month rejections.", icon: Zap },
  { title: "Audit Preparedness", detail: "Assistance in aligning your IT and financial records for departmental review.", icon: Search },
  { title: "One-Stop Registry", detail: "From net worth validation to final infrastructure clearance and renewal.", icon: Landmark },
];

const irdaiFAQs = [
  { q: "What is the fee structure?", a: "Varies significantly by the type (Insurer, Broker, or Surveyor) and entity size." },
  { q: "How long is it valid?", a: "Standard 3-year block, renewable before the expiry date." },
  { q: "What is an Intermediary?", a: "Entities like brokers or agents who bridge the gap between insurers and consumers." },
  { q: "Is it mandatory to have Net Worth?", a: "Yes, IRDAI has strict capital adequacy norms to ensure public money safety." },
  { q: "What happens if I operate without it?", a: "Operating without a license is a serious offense leading to heavy fines and prosecution." },
];

// --- Design Components ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
  <div className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="inline-block py-1.5 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-semibold text-[11px] uppercase tracking-widest mb-3 border border-[#B2DFDB]">
      {subtitle}
    </span>
    <h3 className="mb-3 text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mx-auto">
      {description}
    </p>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
    <button
      className="flex items-center justify-between w-full p-4 text-left"
      onClick={onClick}
    >
      <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>
        {faq.q}
      </h3>
      <div className="flex-shrink-0">
        {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
      </div>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
        {faq.a}
      </p>
    </div>
  </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
  <section id="irdai-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Authority" title="IRDAI Regulatory Nexus" description="The Insurance Regulatory and Development Authority is the sole custodian of the Indian insurance sector." />
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-slate-600 leading-relaxed italic">
          <p>
            Responsible for issuing licenses and registering entities, the <strong>IRDAI</strong> ensures that every player in the sector is financially sound and has the necessary expertise.
          </p>
          <p>
            A valid license is required for any entity intending to <strong>sell, distribute, or advise</strong> on insurance products, maintaining public interest as the core objective.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">INSURANCE ACT 1938</span>
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">SOLVENCY MARGIN HUB</span>
          </div>
        </div>
        <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl">
          <Shield className="absolute -top-6 -right-6 w-32 h-32 text-[#C59B4E]/10 group-hover:rotate-12 transition-all" />
          <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Entities Covered</h4>
          <div className="grid grid-cols-2 gap-3">
            {entityTypes.map((e, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-xl">
                <CheckCircle size={10} className="text-[#C59B4E]" />
                <span className="text-[9px] font-bold uppercase tracking-tight">{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="irdai-benefits-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Advantage" title="Benefits of Registration" description="Foundation for trust and financial stability in the regulated Indian market." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {irdaiBenefits.map((item, i) => (
          <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col items-center hover:bg-white hover:shadow-xl transition-all h-full">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0"><item.icon size={32} /></div>
            <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic tracking-tighter">{item.title}</h6>
            <p className="text-[11px] text-slate-500 italic leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EligibilityContent = () => (
  <section id="irdai-eligibility-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Tiers" title="Eligibility Criteria" description="Stringent prerequisites varying by entity type and business model." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {irdaiEligibility.map((item, i) => (
          <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
            <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
            <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
            <p className="text-xs text-slate-500 leading-relaxed italic">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="irdai-documents-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Archive" title="Registry Documentation" description="Mandatory IRDA/R1 and R2 forms required for corporate verification." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {irdaiDocs.map((doc, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4 items-center shadow-sm text-left">
            <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
            <div>
              <h6 className="font-bold text-slate-800 text-xs italic uppercase mb-1 tracking-tight">{doc.title}</h6>
              <p className="text-[10px] text-slate-400 italic font-medium">{doc.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const RenewalContent = () => (
  <section id="irdai-renewal-content" className="py-24 bg-slate-900 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading subtitle="Integrity" title="Validity & Renewal lifecycle" description="Maintaining active registration through periodic solvency reviews." />
      <div className="grid md:grid-cols-3 gap-8">
        {validProcess.map((item, i) => (
          <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col items-center text-center space-y-4 group hover:bg-[#C59B4E] transition-all">
            <div className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-amber-900 transition-colors"><item.icon size={24} /></div>
            <h6 className="font-bold text-white text-xs italic uppercase tracking-widest group-hover:text-amber-900">{item.title}</h6>
            <p className="text-[10px] text-slate-400 italic leading-relaxed font-bold group-hover:text-amber-900">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyBizzfiling = () => (
  <section id="irdai-why-Bizzfiling" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading subtitle="Trust" title="IRDAI Strategic Partner" description="Simplifying complex filing and operational preparedness for insurers." align="left" />
          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            {whyBizzfiling.map((s, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-start gap-4">
                <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                <div>
                  <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed font-bold">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center relative overflow-hidden group">
          <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
          <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Risk Management Nexus</h4>
          <p className="text-slate-400 text-xs italic mb-8 px-10">"Facilitating Insurance Authority compliance for leading brokers and insurance providers."</p>
          <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
        </div>
      </div>
    </div>
  </section>
);

// --- Main Component ---

export default function IRDAIRegistrationPage() {
  const [activeTab, setActiveTab] = useState('irdai-overview-content');
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
      window.scrollTo({
        top: element.offsetTop - SCROLL_OFFSET + 20,
        behavior: 'smooth'
      });
      setActiveTab(id);
    }
  };

  return (
    <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 selection:bg-[#1A7F7D] selection:text-white">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      {/* Hero */}
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="IRDAI Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2 text-center">
                  <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                  <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">IRDAI <br /> Register</span>
                  <span className="text-white text-[8px] uppercase mt-1 opacity-70 italic tracking-widest leading-tight">Insurance Authority</span>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                  Insurance <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl text-white font-sans">Solvency Hub</span>
                </h1>
                <div className="space-y-3 pt-2">
                  {irdaiIntroBullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                      <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                <div className="flex flex-col shrink-0">
                  <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">R1/R2</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Portal Registry</span>
                </div>
                <div className="h-10 w-[1px] bg-white/20"></div>
                <div className="flex flex-col shrink-0">
                  <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">3-Yr</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Block validity</span>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm lg:w-[400px]">
              <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">License Now</h2>
                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Official IRDAI Portal Hub</p>
                <LeadForm serviceName="IRDAI Registration" btnText="Apply Now" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 md:gap-12 py-0 min-w-max list-none">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-5 text-[11px] md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-widest ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  onClick={() => handleTabClick(tab.id)}
                >{tab.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <OverviewContent />
      <BenefitsContent />
      <EligibilityContent />
      <DocumentsContent />
      <RenewalContent />
      <WhyBizzfiling />

      <section id="irdai-faqs-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading subtitle="FAQ" title="Insurance Law Intelligence" description="Clearing compliance and registry protocols for insurers and intermediaries." />
          <div className="space-y-4 pt-10">
            {irdaiFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
          </div>
        </div>
      </section>
    </div>
  );
}