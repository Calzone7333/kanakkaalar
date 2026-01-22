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
  Gavel,
  Calculator,
  Target, // Added
  Users   // Added (assuming valid, if not I'll fallback to UserCheck in my head) 
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- CS CONSULTATION FULL DATA ---

const tabs = [
  { id: 'expertise-content', label: 'Expertise' },
  { id: 'services-content', label: 'Services' }, // Added Services tab
  { id: 'steps-content', label: 'Process' },      // Added Process tab
  { id: 'updates-content', label: 'Due Dates' },
  { id: 'benefits-content', label: 'Benefits' },
  { id: 'faqs-content', label: 'FAQs' },
];

const csExpertiseList = [
  { title: "Legal Compliances", desc: "Expert guidance on adhering to the Companies Act and other corporate laws.", icon: Gavel, active: false },
  { title: "Annual Compliances", desc: "Timely filing of annual returns and financial statements to maintain good standing.", icon: FileText, active: true },
  { title: "Board Advisory", desc: "Professional support for board meetings, minutes, and corporate decision-making.", icon: Users, active: false },
  { title: "Corporate Funding", desc: "Assistance with private placements, rights issues, and other capital raising methods.", icon: DollarSign, active: false },
  { title: "FEMA Advisory", desc: "Compliance with foreign exchange regulations for cross-border transactions.", icon: Globe, active: false },
  { title: "Secretarial Audit", desc: "Comprehensive review of company records to ensure total regulatory compliance.", icon: Shield, active: false },
  { title: "Company Formation", desc: "End-to-end support for incorporating new entities, LLPs, and Section 8 companies.", icon: Building, active: false },
  { title: "Corporate Restructuring", desc: "Strategic help with mergers, acquisitions, and streamlining corporate structures.", icon: Briefcase, active: false },
];

const csServices = [
  { title: "Company Incorporation", description: "Seamless registration of Pvt Ltd, LLP, OPC, and Section 8 companies with complete documentation.", icon: Building },
  { title: "ROC & MCA Filings", description: "Timely filing of annual returns (MGT-7, AOC-4) and event-based compliances to avoid penalties.", icon: FileText },
  { title: "Corporate Governance", description: "Advisory on board meetings, shareholder meetings, and maintaining statutory registers as per law.", icon: Gavel },
  { title: "FEMA & RBI Compliance", description: "Expert guidance on Foreign Direct Investment (FDI), ODI, and other cross-border regulatory requirements.", icon: Globe },
  { title: "Secretarial Audit", description: "Comprehensive audit of your company's records to ensure strict adherence to the Companies Act, 2013.", icon: Shield },
  { title: "Business Restructuring", description: "Strategic legal support for mergers, amalgamations, demergers, and buyback of shares.", icon: Briefcase },
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
  { q: "Do I need a CS for my startup?", a: "While not mandatory for small startups, a CS helps in structuring equity, ESOPs, and ensuring due diligence for investors." },
];

// --- Reusable Components ---

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
    <button className="flex items-center justify-between w-full p-6 text-left" onClick={onClick}>
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

const ExpertiseContent = () => (
  <section id="expertise-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Expertise" title="Secretarial & Legal Services" description="Ensuring corporate excellence and regulatory compliance for your board." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {csExpertiseList.map((item, i) => (
          <div
            key={i}
            className={`group relative rounded-2xl border p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center
              ${item.active
                ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10'
                : 'bg-white border-slate-100 text-slate-800 hover:border-[#1A7F7D]/30'
              }`}
          >

            {/* Hover Top Border (only for non-active cards to avoid clashing) */}
            {!item.active && (
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#1A7F7D] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
            )}

            {/* Icon */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner group-hover:shadow-lg mt-2
              ${item.active
                ? 'bg-white text-[#0F2D30]'
                : 'bg-[#F0FDFA] text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white'
              }
            `}>
              <item.icon size={36} strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className={`text-xl font-bold mb-4 transition-colors ${item.active ? 'text-white' : 'text-slate-800 group-hover:text-[#1A7F7D]'}`}>
              {item.title}
            </h3>

            {/* Description */}
            <p className={`text-[15px] leading-relaxed mb-6 min-h-[80px] ${item.active ? 'text-slate-300' : 'text-slate-500'}`}>
              {item.desc}
            </p>

            {/* Read More Button */}
            <div className="mt-auto">
              <button className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300
                ${item.active
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

const ServicesContent = () => (
  <section id="services-content" className="py-12 md:py-16 bg-[#F8FAFC] scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Services" title="Corporate Compliance Solutions" description="Tailored secretarial services for every stage of your business lifecycle." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {csServices.map((service, i) => (
          <div key={i} className="group p-8 md:p-10 bg-white rounded-3xl border border-slate-100 hover:border-[#1A7F7D]/30 hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-[#F0FDFA] rounded-2xl flex items-center justify-center mb-8 text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-colors shadow-sm">
              <service.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-[#1A7F7D] transition-colors">{service.title}</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">{service.description}</p>
            <div className="flex items-center text-[#1A7F7D] font-bold text-base uppercase tracking-wider">
              <span>Get Started</span> <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StepsContent = () => (
  <section id="steps-content" className="py-12 md:py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Workflow" title="Our Process" description="Streamlined corporate secretarial services." />

      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

        {[
          { step: 1, title: "Consultation", desc: "Discuss your company's compliance needs." },
          { step: 2, title: "Audit/Check", desc: "We review your current status & records." },
          { step: 3, title: "Drafting", desc: "Preparation of resolutions, minutes, and forms." },
          { step: 4, title: "Filing", desc: "Submission to MCA/ROC with proof of filing." }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center mb-6 group-hover:border-[#1A7F7D]/20 transition-all">
              <div className="w-16 h-16 bg-[#1F4B4E] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                {item.step}
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{item.title}</h4>
            <p className="text-slate-500 text-sm md:text-base max-w-[240px] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UpdatesContent = () => (
  <section id="updates-content" className="py-16 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Deadlines" title="Statutory Due Dates" description="Never miss a mandatory ROC filing with our expert tracking." />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#0F2D30] text-white">
            <tr>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Activity</th>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Form</th>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {csUpdates.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-5 text-base font-bold text-slate-800">{row.activity}</td>
                <td className="p-5 text-base text-[#1A7F7D] font-bold">{row.form}</td>
                <td className="p-5 text-base text-red-600 font-bold">{row.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const BenefitsContent = () => (
  <section id="benefits-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Governance" title="Benefits of Professional CS" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {csBenefits.map((benefit, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all text-center group">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1A7F7D] mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform"><benefit.icon size={28} /></div>
            <h4 className="text-sm md:text-base font-bold text-[#0F2D30] mb-4">{benefit.title}</h4>
            <p className="text-slate-500 text-base leading-relaxed">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyBizzfilingContent = () => (
  <section id="why-content" className="py-16 bg-[#0F2D30] text-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Selection" title="Why Choose Bizzfiling?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <UserCheck className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">ICSI Certified</h4>
          <p className="text-slate-300 text-base leading-relaxed">Direct access to experienced and licensed Company Secretaries.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <Shield className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">Zero Penalties</h4>
          <p className="text-slate-300 text-base leading-relaxed">We take full responsibility for timely filings to avoid MCA fines.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <Zap className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">Modern Platform</h4>
          <p className="text-slate-300 text-base leading-relaxed">Digital document storage and automated compliance tracking.</p>
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="CS Consultation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C59B4E]/10 backdrop-blur rounded-full border border-white/20">
                <Star size={14} className="text-[#C59B4E]" />
                <span className="text-white text-[10px] md:text-xs uppercase font-bold tracking-[0.2em]">Verified ICSI Professionals</span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                Company Secretary <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Consultation</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                Ensure perfect corporate governance. From ROC filings to board meetings, our expert CSs help your company stay legally compliant and investor-ready.
              </p>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-3 text-white/90 text-xs md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> MCA/ROC Compliance
                </div>
                <div className="flex items-center gap-3 text-white/90 text-xs md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> ICSI Certified
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Book CS Session</h3>
                  <LeadForm serviceName="Talk to a Company Secretary" btnText="Schedule Consultation" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-8 overflow-x-auto no-scrollbar py-0">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-5 text-xs md:text-sm font-bold uppercase tracking-widest border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#0F2D30] border-[#C59B4E]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
                  onClick={() => handleTabClick(tab.id)}
                >{tab.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <ExpertiseContent />
        <ServicesContent />
        <StepsContent />
        <UpdatesContent />
        <BenefitsContent />
        <WhyBizzfilingContent />

        {/* FAQ - Large */}
        <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4">
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