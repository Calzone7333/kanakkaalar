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
  Calculator,
  UserCheck
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- CA CONSULTATION FULL DATA ---

const tabs = [
  { id: 'expertise-content', label: 'Expertise' },
  { id: 'updates-content', label: 'Due Dates' },
  { id: 'benefits-content', label: 'Benefits' },
  { id: 'why-content', label: 'Why Bizzfiling' },
  { id: 'faqs-content', label: 'FAQs' },
];

const caExpertiseList = [
  "Tax Planning & Filing", "GST Advisory & Filing", "Income Tax (ITR)",
  "Auditing & Assurance", "Corporate Finance", "Wealth Management",
  "TDS/TCS Compliance", "MCA Filings (ROC)", "Start-up Valuation",
  "Accounts Outsourcing", "Financial Planning", "Direct & Indirect Tax",
  "FEMA Compliance", "Project Reports", "CMA Data Preparation"
];

const caBenefits = [
  { title: "Financial Accuracy", description: "Prevent errors in your financial records that could lead to heavy penalties or legal issues.", icon: Target },
  { title: "Tax Optimization", description: "Our CAs help you identify all legal tax-saving opportunities to maximize your post-tax profits.", icon: DollarSign },
  { title: "Compliance Peace", description: "Stay ahead of regulatory changes from CBDT, CBIC, and MCA without any manual tracking.", icon: Shield },
  { title: "Business Insights", description: "Get professional analysis of your cash flow and balance sheet to make informed decisions.", icon: Zap },
  { title: "Investor Readiness", description: "Properly audited and managed accounts make your business attractive to banks and VCs.", icon: Award }
];

const caUpdates = [
  { activity: "GSTR-1 (Monthly)", dueDate: "11th of every month", period: "Monthly Sales" },
  { activity: "GSTR-3B (Monthly)", dueDate: "20th of every month", period: "Monthly Summary" },
  { activity: "Income Tax Audit", dueDate: "30th September", period: "Annual" },
  { activity: "ITR Filing (Non-Audit)", dueDate: "31st July", period: "Annual" },
  { activity: "TDS Payment", dueDate: "7th of every month", period: "Monthly" },
  { activity: "Advanced Tax (Q1)", dueDate: "15th June", period: "Quarterly" },
];

const caFAQs = [
  { q: "What documents do I need for ITR filing?", a: "Minimum documents include PAN, Aadhaar, Form 16, bank statements, and investment proofs (80C, 80D etc.)." },
  { q: "Is GST registration mandatory for my small business?", a: "Mandatory if turnover exceeds ₹40L (Goods) or ₹20L (Services), or for any inter-state supply." },
  { q: "How can I save tax legally?", a: "Through sections like 80C, 80D, 80G, and professional expenses if you are a consultant or business owner." },
  { q: "What is the role of a CA in a startup?", a: "A CA handles setup, compliance, capitalization table, and ensures the financial model is sustainable for funding." },
  { q: "Can I consult a CA online?", a: "Yes, Bizzfiling provides 100% digital consultation via secure video calls and document sharing." },
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
      <SectionHeading subtitle="Expertise" title="Chartered Accountancy Services" description="Managing the numbers so you can focus on building your empire." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {caExpertiseList.map((item, i) => (
          <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#C59B4E] transition-all">
            <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-[#1A7F7D] shadow-sm group-hover:bg-[#1A7F7D] group-hover:text-white transition-all"><Check size={12} /></div>
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UpdatesContent = () => (
  <section id="updates-content" className="py-12 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Deadlines" title="Statutory Due Dates" description="Avoid late fees with our integrated tax calendar." />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-[#0F2D30] text-white">
            <tr>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Activity</th>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Typical Due Date</th>
              <th className="p-4 text-[10px] uppercase font-bold tracking-widest">Filing Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {caUpdates.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 text-xs font-bold text-slate-800">{row.activity}</td>
                <td className="p-4 text-xs text-red-600 font-bold">{row.dueDate}</td>
                <td className="p-4 text-[10px] text-slate-500 font-semibold">{row.period}</td>
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
      <SectionHeading subtitle="Impact" title="Benefits of Consulting CA" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {caBenefits.map((benefit, i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1A7F7D] mb-4 mx-auto shadow-sm"><CheckCircle size={18} /></div>
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
      <SectionHeading subtitle="Selection" title="Why Choose Bizzfiling?" description="Experienced professionals, transparent pricing, and 100% digital delivery." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Award className="text-[#C59B4E] mx-auto mb-4" size={32} />
          <h4 className="text-lg font-bold mb-2">15+ Years</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">A decade of trust in helping businesses manage their taxes and audits across India.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <UserCheck className="text-[#C59B4E] mx-auto mb-4" size={32} />
          <h4 className="text-lg font-bold mb-2">Expert Team</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">Access to hundreds of qualified Chartered Accountants and tax consultants instantly.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <Zap className="text-[#C59B4E] mx-auto mb-4" size={32} />
          <h4 className="text-lg font-bold mb-2">Fast Turnaround</h4>
          <p className="text-slate-400 text-[11px] leading-relaxed">Same-day response for critical tax queries and compliance filings.</p>
        </div>
      </div>
    </div>
  </section>
);

// --- MAIN COMPONENT ---
export default function TalkToCA() {
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
          <img src={BackgroundImageSrc} alt="CA Consultation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-3/5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Calculator size={12} className="text-[#C59B4E]" />
                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Verified ICAI Professionals</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Talk to a <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Chartered Accountant</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                Expert tax planning, GST filing, and business audit services at your fingertips. Connect with India's top CAs for reliable financial guidance.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <CheckCircle size={14} className="text-[#C59B4E]" /> GST & Tax Experts
                </div>
                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                  <Shield size={14} className="text-[#C59B4E]" /> 100% Privacy
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Book a Session</h3>
                  <LeadForm serviceName="Talk to a Chartered Accountant" btnText="Schedule Consultation" />
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
            <SectionHeading subtitle="FAQ" title="Your Tax Queries" />
            <div className="mt-8">
              {caFAQs.map((f, i) => (
                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Icon fallbacks if Target not found
const Target = ({ size }) => <div className="w-4 h-4 bg-slate-300 rounded-full" style={{ width: size, height: size }} />;
