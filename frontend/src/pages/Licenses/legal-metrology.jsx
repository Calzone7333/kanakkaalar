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
  Lightbulb,
  Users,
  DollarSign,
  Clock,
  Landmark,
  AlertTriangle,
  MapPin,
  BookOpen,
  Award,
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck,
  ShieldCheck,
  Banknote,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- LEGAL METROLOGY STATIC DATA DEFINITIONS ---

const tabs = [
  { id: 'lm-overview-content', label: 'Overview' },
  { id: 'lm-rules-provisions', label: 'Rules' },
  { id: 'lm-benefits-content', label: 'Benefits' },
  { id: 'lm-eligibility-content', label: 'Eligibility' },
  { id: 'lm-documents-content', label: 'Documents' },
  { id: 'lm-procedure-content', label: 'Procedure' },
  { id: 'lm-why-Bizzfiling', label: 'Why Us' },
  { id: 'lm-faqs-content', label: 'FAQs' },
];

const lmIntroBullets = [
  "Complete your Legal Metrology (LMPC) registration to ensure product compliance.",
  "Fast, error-free, and secure registration process handled 100% online.",
  "Complete guidance for smooth compliance with Legal Metrology regulations Pan India.",
];

const legalMetrologyRules = [
  { title: "General Rules, 2011", detail: "Covers weighing devices like weighbridges, fuel pumps, and meters.", icon: FileText },
  { title: "Packaged Commodities", detail: "Mandates LMPC labelling (MRP, net quantity, manufacturer details).", icon: Briefcase },
  { title: "Approval of Models", detail: "Defines standard counts and how packaged goods bear affirmations.", icon: Scale },
  { title: "National Standards", detail: "Specifies base units of measure and verification timelines.", icon: Landmark },
];

const lmpcBenefits = [
  { title: "Reduced Legal Costs", icon: DollarSign, detail: "Eliminates lengthy court disputes caused by poor measurement proofs." },
  { title: "Global Trade Support", icon: Handshake, detail: "Controls unfair trade policies and aligns devices with world standards." },
  { title: "Revenue Integrity", icon: TrendingUp, detail: "Fair excise and tax collection on manufactured or imported goods." },
  { title: "Technical Confidence", icon: Zap, detail: "Encourages participation in global trading systems for economic growth." },
];

const lmpcEligibility = [
  "Product compliance with Package Commodities rules.",
  "Submission of all required identity and business papers.",
  "Possession of necessary operational business licenses.",
  "Fully completed display window info for portal application.",
  "Payment of statutory registration and documentation costs.",
];

const lmpcDocuments = [
  { title: "Renewal Form", detail: "Form mandatory if renewing within 30 days of expiry.", icon: FileText },
  { title: "Fee Receipt", detail: "Statutory fee payment record for consumer affairs.", icon: Banknote },
  { title: "Entity Proof", detail: "Business legal status and address identification.", icon: Users },
  { title: "Validity Nexus", detail: "Certificate granted for fixed 5-year block periods.", icon: ShieldCheck },
];

const metrologyProcedure = [
  "Data Gathering: We compile your application dataset per state LM norms.",
  "Zonal Review: Officer checks for objections or technical insights.",
  "Premises Inspection: Physical verification of weights and measurements.",
  "Inspector Recommendation: Final suggestion based on premise compliance.",
  "Final Acceptance: Assistant Controller signs off for LMPC issuance.",
];

const lmProhibitions = [
  "Must possess current LMPC Certificate to repair or sell weights.",
  "Section 19: Importing measure-related items without registration is void.",
  "Section 38: Non-registration results in fines up to ₹25,000 & 6mo detention.",
];

const lmpcExemptions = [
  "Net weight/measure less than 10g or 10ml.",
  "Agri-produce in packages over 50kg.",
  "Fast food items packed by hotel/restaurant counters.",
  "Drugs covered under Price Control Order 1995.",
  "Industrial commodities meant for institutional use.",
];

const lmWhyBizzfiling = [
  { title: "Online Expertise", detail: "Well-versed in web portals and offline LM department nexus.", icon: UserCheck },
  { title: "Objection Support", detail: "We handle Zonal Officer queries and premise inspections.", icon: Scale },
  { title: "End-to-End Filing", detail: "From sample gathering to final Assistant Controller sign-off.", icon: Clock },
  { title: "Full Transparency", detail: "Regular status notifications on incorporate and review stages.", icon: Zap },
];

const metrologyFAQs = [
  { q: "Is registration mandatory?", a: "Yes, for importers, manufacturers, and packers of pre-packaged goods under the 2009 Act." },
  { q: "What is an LMPC Certificate?", a: "Legal Metrology Packaged Commodities registration confirming labelling compliance." },
  { q: "How long is the validity?", a: "LMPC certificates are typically valid for a block of five years." },
  { q: "What is the department's role?", a: "Consumer Affairs wings that establish and uphold weight standards in trade." },
  { q: "Can the license be transferred?", a: "No, it is specific to the legal entity and the registered premises." },
];

// --- Design Components ---

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
      <p className={`px-4 pb-4 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
        {faq.a}
      </p>
    </div>
  </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
  <section id="lm-overview-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Standards" title="Legal Metrology Authority" description="The statutory governance for weights, measures, and packaged goods in India." />
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 text-slate-600 leading-relaxed italic">
          <p>
            The <strong>Legal Metrology Act, 2009</strong> establishes and upholds standards for measurements in India. It mandates registration for packers, dealers, and importers dealing with packaged commodities.
          </p>
          <p>
            Administered by the Department of Consumer Affairs, it ensures moral corporate practices and sets rules for product packaging and mandatory disclosures.
          </p>
          <div className="flex flex-wrap gap-5 pt-2">
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">2009 Act Nexus</span>
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">LMPC Compliance</span>
          </div>
        </div>
        <div className="bg-[#103B3E] p-8 rounded-[40px] text-white relative group overflow-hidden">
          <ShieldCheck className="absolute -top-4 -right-4 w-24 h-24 text-[#C59B4E]/5 group-hover:scale-110 transition-all" />
          <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Mandatory Labeling</h4>
          <ul className="space-y-8 text-sm uppercase font-bold tracking-widest list-none">
            <li className="flex items-center gap-5"><CheckCircle size={14} className="text-[#C59B4E]" /> Net Quantity & MRP</li>
            <li className="flex items-center gap-5"><CheckCircle size={14} className="text-[#C59B4E]" /> MFG & Best Before Date</li>
            <li className="flex items-center gap-5"><CheckCircle size={14} className="text-[#C59B4E]" /> Importer/Packer Details</li>
            <li className="flex items-center gap-5"><CheckCircle size={14} className="text-[#C59B4E]" /> Consumer Care Helpline</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const RulesProvisions = () => (
  <section id="lm-rules-provisions" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Legal Frame" title="Rules & Prohibitions" description="Regulating everything from weighing devices to standard measures and mass." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {legalMetrologyRules.map((rule, i) => (
          <div key={i} className="flex flex-col p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all h-full">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0"><rule.icon size={24} /></div>
            <h6 className="font-bold text-slate-800 text-lg mb-2 italic uppercase tracking-tighter">{rule.title}</h6>
            <p className="text-sm text-slate-500 italic leading-relaxed">{rule.detail}</p>
          </div>
        ))}
      </div>
      <div className="p-8 bg-red-900 rounded-[32px] text-white flex flex-col md:flex-row gap-10 items-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
        <AlertTriangle size={48} className="text-[#C59B4E] shrink-0" />
        <div>
          <h5 className="font-bold text-[#C59B4E] text-sm uppercase italic tracking-widest mb-2 underline decoration-[#C59B4E] underline-offset-8">Penalty Section 38</h5>
          <p className="text-sm text-slate-300 leading-relaxed italic">Importing measure-related items without registration can result in fines up to <strong>₹25,000</strong> and a maximum <strong>six-month prison sentence</strong> for subsequent offenses.</p>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="lm-benefits-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Value" title="LMPC Advantage" description="Ensuring ethical marketing and protecting consumer rights while scaling trade." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {lmpcBenefits.map((item, i) => (
          <div key={i} className="group p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#1A7F7D]/30 transition-all shadow-sm">
            <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:rotate-12 transition-transform" />
            <h6 className="font-bold text-slate-800 text-lg mb-3 uppercase tracking-tighter italic">{item.title}</h6>
            <p className="text-sm text-slate-500 leading-relaxed italic">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const EligibilityContent = () => (
  <section id="lm-eligibility-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Checklist" title="Eligibility & Exemptions" description="Adherence to Package Commodities rules and institutional consumer criteria." />
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h4 className="text-sm font-bold text-slate-800 uppercase italic mb-6">Requirements:</h4>
          {lmpcEligibility.map((item, i) => (
            <div key={i} className="flex gap-5 items-center p-4 bg-slate-50 rounded-xl border-l-4 border-l-[#1A7F7D]">
              <CheckCircle size={16} className="text-[#1A7F7D]" />
              <span className="text-sm font-bold text-slate-700 italic uppercase">{item}</span>
            </div>
          ))}
        </div>
        <div className="p-8 bg-slate-100 rounded-[40px] border border-slate-200">
          <h4 className="text-sm font-bold text-slate-800 uppercase italic mb-6">Exempt Packages:</h4>
          <div className="space-y-8">
            {lmpcExemptions.map((item, i) => (
              <div key={i} className="flex gap-5 items-start bg-white p-4 rounded-[24px]">
                <AlertTriangle size={16} className="text-[#C19A5B] shrink-0" />
                <span className="text-sm text-slate-500 italic leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="lm-documents-content" className="py-20 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Archive" title="Documents & Validity" description="Identity proofs and fee records needed for the 5-year block certificate." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {lmpcDocuments.map((doc, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-3xl flex flex-col items-center shadow-sm">
            <div className="w-12 h-12 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-6 shrink-0"><doc.icon size={24} /></div>
            <h6 className="font-bold text-slate-800 text-lg mb-2 uppercase italic tracking-tighter">{doc.title}</h6>
            <p className="text-sm text-slate-400 italic font-bold">{doc.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProcedureContent = () => (
  <section id="lm-procedure-content" className="py-24 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <SectionHeading subtitle="Submission" title="Step-by-Step Approval" description="A structured journey from zonal review to physical premise verification." />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 relative">
        {metrologyProcedure.map((step, idx) => (
          <div key={idx} className="space-y-8">
            <div className="w-14 h-14 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative transition-transform hover:-skew-y-3">
              <span className="text-lg font-bold text-[#1A7F7D]">{idx + 1}</span>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">✓</div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold italic">{step}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyBizzfiling = () => (
  <section id="lm-why-Bizzfiling" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading subtitle="Confidence" title="LMPC Assisted Experts" description="Seamlessly managing offline inspections and portal technicalities." align="left" />
          <div className="grid sm:grid-cols-2 gap-10 pt-4">
            {lmWhyBizzfiling.map((s, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center mb-4"><s.icon size={20} /></div>
                <h6 className="font-bold text-slate-800 text-lg mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                <p className="text-sm text-slate-500 italic">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
          <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
          <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter">Metrology Nexus</h4>
          <p className="text-slate-400 text-sm italic mb-8">"Providing world-class measurement compliance for India's leading manufacturers."</p>
          <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-sm hover:bg-[#a37d35] transition-all">Connect with expert</button>
        </div>
      </div>
    </div>
  </section>
);

// --- Main Component ---

export default function LegalMetrologyPage() {
  const [activeTab, setActiveTab] = useState('lm-overview-content');
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

      {/* Hero Section - Premium Style */}
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Legal Metrology Registration" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Award size={14} className="text-[#C59B4E]" />
                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Official LMPC Weight & Measure Compliance</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Legal <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Metrology (LMPC)</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                Ensure your packaged commodities meet official measurement standards. Professional LMPC registration for importers, manufacturers, and packers.
              </p>
              <div className="flex gap-10 pt-2">
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> Statutory Compliance
                </div>
                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                  <ShieldCheck size={18} className="text-[#C59B4E]" /> 100% Secure
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-8 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Now</h3>
                  <LeadForm serviceName="Legal Metrology Registration (LMPC)" btnText="Apply Now" />
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

      <OverviewContent />
      <RulesProvisions />
      <BenefitsContent />
      <EligibilityContent />
      <DocumentsContent />
      <ProcedureContent />
      <WhyBizzfiling />

      <section id="lm-faqs-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading subtitle="FAQ" title="Metrology Intelligence" description="Clearing compliance and registry protocols for weights, measures and packaging." />
          <div className="space-y-8 pt-10">
            {metrologyFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
          </div>
        </div>
      </section>
    </div>
  );
}