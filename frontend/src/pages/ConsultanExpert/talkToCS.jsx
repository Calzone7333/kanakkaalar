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
  UserCheck,
  Gavel
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- CS CONSULTATION FULL DATA ---

const tabs = [
  { id: 'expertise-content', label: 'Expertise' },
  { id: 'updates-content', label: 'Due Dates' },
  { id: 'benefits-content', label: 'Benefits' },
  { id: 'why-content', label: 'Why Bizzfiling' },
  { id: 'faqs-content', label: 'FAQs' },
];

const csExpertiseList = [
  "Legal Compliances", "Annual Compliances", "Expert Board Advisors",
  "Corporate Governance", "Corporate Restructuring", "Corporate Funding",
  "FEMA Advisory", "RBI Compliance", "SEBI Registration",
  "NCLT Dispute", "Arbitration & ADR", "Secretarial Audit",
  "Cost Audit", "Company Formation", "Raising Capital",
  "Overseas Investment", "Company Strike-off"
];

const csBenefits = [
  { title: "Ensuring Compliance", description: "Stay meeting legal and regulatory obligations, avoiding heavy ROC fines and penalties.", icon: Shield },
  { title: "Good Governance", description: "Establish and maintain effective corporate governance practices to build stakeholder confidence.", icon: UserCheck },
  { title: "Objective Advice", description: "Provide professional advice to the board to balance the interests of different stakeholders.", icon: Gavel },
  { title: "Expert Legal Advice", description: "Receive valuable insights on legal and financial matters for informed decision making.", icon: Award },
  { title: "Risk Management", description: "Identify and manage legal and regulatory risks that the company may face early.", icon: Zap },
];

const csUpdates = [
  { activity: "Annual Return (LLP)", form: "Form 11", dueDate: "30th May", period: "Annual" },
  { activity: "Director KYC", form: "DIR-3 KYC", dueDate: "30th September", period: "Annual" },
  { activity: "Return of Deposits", form: "DPT-3", dueDate: "30th June", period: "Annual" },
  { activity: "Financial Statements", form: "AOC-4", dueDate: "30th October", period: "Annual" },
  { activity: "ROC Annual Return", form: "MGT-7", dueDate: "29th November", period: "Annual" },
  { activity: "MSME Return", form: "MSME-1", dueDate: "30th Apr / 31st Oct", period: "Half-Yearly" },
];

const csFAQs = [
  { q: "What is the role of a CS in a private company?", a: "A CS ensures that the company complies with the Companies Act, maintains corporate records, and advises directors on their legal responsibilities." },
  { q: "Is secretarial audit mandatory for all companies?", a: "No, it's mandatory for listed companies and certain unlisted public companies based on turnover or paid-up capital thresholds." },
  { q: "How can a CS help with fundraising?", a: "A CS manages the issuance of shares, ensures compliance with SEBI/RBI regulations, and drafts shareholders' agreements." },
  { q: "What is the difference between a CA and a CS?", a: "A CA primarily handles finances, audits, and taxes; a CS focuses on corporate law, governance, and mandatory ROC/MCA filings." },
  { q: "Can a CS help in closing a company?", a: "Yes, a CS manages the entire strike-off process or voluntary liquidation under the Insolvency and Bankruptcy Code." },
];

// --- Reusable Components ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
  <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
    <span className="inline-block py-1 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-[10px] uppercase tracking-widest mb-2 border border-[#B2DFDB]">
      {subtitle}
    </span>
    <h3 className="mb-1 text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 text-[11px] max-w-2xl leading-relaxed mx-auto uppercase tracking-wide">
      {description}
    </p>
  </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-2
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
    <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
      <h3 className={`text-xs font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
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

const ExpertiseContent = () => (
  <section id="expertise-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Expertise" title="Secretarial & Legal Services" description="Ensuring corporate excellence and regulatory compliance for your board." />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {csExpertiseList.map((item, i) => (
          <div key={i} className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group hover:border-[#1A7F7D] transition-all">
            <Briefcase className="w-5 h-5 text-[#C59B4E] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-extrabold text-slate-700 uppercase leading-tight tracking-wider">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UpdatesContent = () => (
  <section id="updates-content" className="py-12 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Deadlines" title="ROC Filing Calendar" description="Never miss a mandatory ROC filing with our expert tracking." />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-[#0F2D30] text-white">
            <tr>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Activity</th>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Form</th>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {csUpdates.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 text-xs font-bold text-slate-800">{row.activity}</td>
                <td className="p-4 text-xs text-[#1A7F7D] font-bold">{row.form}</td>
                <td className="p-4 text-xs text-red-600 font-bold">{row.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="benefits-content" className="py-12 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Governance" title="Benefits of Professional CS" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {csBenefits.map((benefit, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all text-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1A7F7D] mb-4 mx-auto shadow-sm group-hover:bg-[#1A7F7D]"><benefit.icon size={16} /></div>
            <h4 className="text-xs font-bold text-[#0F2D30] mb-2">{benefit.title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyBizzfilingContent = () => (
  <section id="why-content" className="py-12 bg-[#0F2D30] text-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Selection" title="Why CS at Bizzfiling?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <UserCheck className="text-[#C59B4E] mx-auto mb-4" size={28} />
          <h4 className="text-lg font-bold mb-2">ICSI Certified</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">Direct access to experienced and licensed Company Secretaries.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Shield className="text-[#C59B4E] mx-auto mb-4" size={28} />
          <h4 className="text-lg font-bold mb-2">Zero Penalties</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">We take full responsibility for timely filings to avoid MCA fines.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Zap className="text-[#C59B4E] mx-auto mb-4" size={28} />
          <h4 className="text-lg font-bold mb-2">Modern Platform</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">Digital document storage and automated compliance tracking.</p>
        </div>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function TalkToCS() {
  const [activeTab, setActiveTab] = useState('expertise-content');
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
          <img src={BackgroundImageSrc} alt="CS Consultation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C59B4E]/10 backdrop-blur rounded-full border border-white/20">
                <Star size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Verified ICSI Professionals</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight">
                Company Secretary <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Consultation</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Ensure perfect corporate governance. From ROC filings to board meetings, our expert CSs help your company stay legally compliant and investor-ready.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> MCA/ROC Compliance
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> ICSI Certified
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Book CS Session</h3>
                  <LeadForm serviceName="Talk to a Company Secretary" btnText="Consult Now" />
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
        <ExpertiseContent />
        <UpdatesContent />
        <BenefitsContent />
        <WhyBizzfilingContent />

        {/* FAQ - Compact */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-2xl mx-auto px-4">
            <SectionHeading subtitle="FAQ" title="Governance Queries" />
            <div className="mt-8">
              {csFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}