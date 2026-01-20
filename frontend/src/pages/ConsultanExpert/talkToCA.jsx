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
  UserCheck,
  Target
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- CA CONSULTATION FULL DATA ---

// --- REFINED DATA & COMPONENTS ---

const tabs = [
  { id: 'expertise-content', label: 'Expertise' },
  { id: 'services-content', label: 'Services' }, // Added Services tab
  { id: 'steps-content', label: 'Process' },      // Added Process tab
  { id: 'updates-content', label: 'Due Dates' },
  { id: 'benefits-content', label: 'Benefits' },
  { id: 'faqs-content', label: 'FAQs' },
];

const caExpertiseList = [
  { title: "Tax Planning & Filing", desc: "Strategic tax planning to minimize liability and detailed filing for peace of mind.", icon: FileText, active: false },
  { title: "GST Advisory", desc: "Comprehensive GST solutions including registration, compliance, and advisory services.", icon: Globe, active: true },
  { title: "Income Tax (ITR)", desc: "Expert preparation and filing of ITR for individuals and businesses with maximum savings.", icon: DollarSign, active: false },
  { title: "Auditing & Assurance", desc: "Statutory, internal, and tax audits performed to ensure financial accuracy and compliance.", icon: Shield, active: false },
  { title: "Corporate Finance", desc: "Optimizing capital structure and managing financial risks for sustainable growth.", icon: Building, active: false },
  { title: "Wealth Management", desc: "Personalized investment strategies to grow and protect your wealth over the long term.", icon: Briefcase, active: false },
  { title: "TDS/TCS Compliance", desc: "Timely deduction and filing of TDS/TCS returns to avoid interest and penalties.", icon: Calculator, active: false },
  { title: "MCA Filings (ROC)", desc: "Handling all Registrar of Companies filings throughout the business lifecycle.", icon: CheckCircle, active: false },
];

const caServices = [
  { title: "GST Filing & Compliance", description: "End-to-end GST registration, monthly/quarterly return filings, and advisory to ensure 100% tax compliance.", icon: FileText },
  { title: "Income Tax Returns", description: "Expert preparation and filing of ITR for individuals, businesses, and corporates with maximum tax savings.", icon: DollarSign },
  { title: "Virtual CFO Services", description: "Get a dedicated Chartered Accountant to manage your entire financial strategy, budgeting, and cash flow.", icon: Briefcase },
  { title: "Company Audits", description: "Statutory audits, internal audits, and tax audits performed by certified professionals to ensure financial accuracy.", icon: Shield },
  { title: "TDS & TCS Returns", description: "Timely calculation, deduction, and filing of TDS/TCS returns to avoid interest and heavy penalties.", icon: Calculator },
  { title: "Business Valuation", description: "Professional valuation services for startups and established firms for fundraising, mergers, or acquisitions.", icon: Target },
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

// --- Reusable Components (Enhanced) ---

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
  <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-4
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg scale-[1.01]' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
    <button className="flex items-center justify-between w-full p-6 text-left" onClick={onClick}>
      <h3 className={`text-lg md:text-xl font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
      <div className="flex-shrink-0">
        <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
      </div>
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
      <p className={`px-6 pb-6 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
    </div>
  </div>
);

// --- Sections ---

const ExpertiseContent = () => (
  <section id="expertise-content" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Expertise" title="Chartered Accountancy Services" description="Managing the numbers so you can focus on building your empire. Our experts cover every financial aspect." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {caExpertiseList.map((item, i) => (
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
  <section id="services-content" className="py-16 bg-[#F8FAFC] scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Services" title="Comprehensive Financial Solutions" description="From routine filings to complex audits, we handle it all." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {caServices.map((service, i) => (
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
  <section id="steps-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Workflow" title="How It Works" description="Simple steps to get your accounts & taxes sorted." />

      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>

        {[
          { step: 1, title: "Book Session", desc: "Select your service and schedule a call." },
          { step: 2, title: "Share Data", desc: "Upload necessary financial documents securely." },
          { step: 3, title: "Expert Analysis", desc: "Our CA reviews and prepares your reports." },
          { step: 4, title: "Filing & Advice", desc: "Final filing done with confirmation & advice." }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center mb-6 group-hover:border-[#1A7F7D]/20 transition-all">
              <div className="w-16 h-16 bg-[#1F4B4E] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                {item.step}
              </div>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">{item.title}</h4>
            <p className="text-slate-500 text-base md:text-lg max-w-[240px] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const UpdatesContent = () => (
  <section id="updates-content" className="py-16 bg-slate-50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Deadlines" title="Statutory Due Dates" description="Avoid late fees with our integrated tax calendar." />
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#0F2D30] text-white">
            <tr>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Activity</th>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Typical Due Date</th>
              <th className="p-5 text-sm uppercase font-bold tracking-widest">Filing Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {caUpdates.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="p-5 text-base font-bold text-slate-800">{row.activity}</td>
                <td className="p-5 text-base text-red-600 font-bold">{row.dueDate}</td>
                <td className="p-5 text-sm text-slate-500 font-semibold uppercase tracking-wide">{row.period}</td>
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
      <SectionHeading subtitle="Impact" title="Benefits of Consulting CA" />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {caBenefits.map((benefit, i) => (
          <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all text-center group">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#1A7F7D] mb-6 mx-auto shadow-sm group-hover:scale-110 transition-transform"><benefit.icon size={28} /></div>
            <h4 className="text-lg md:text-xl font-bold text-[#0F2D30] mb-4">{benefit.title}</h4>
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
      <SectionHeading subtitle="Selection" title="Why Choose Bizzfiling?" description="Experienced professionals, transparent pricing, and 100% digital delivery." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <Award className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">15+ Years</h4>
          <p className="text-slate-300 text-base leading-relaxed">A decade of trust in helping businesses manage their taxes and audits across India.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <UserCheck className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">Expert Team</h4>
          <p className="text-slate-300 text-base leading-relaxed">Access to hundreds of qualified Chartered Accountants and tax consultants instantly.</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
          <Zap className="text-[#C59B4E] mx-auto mb-6" size={40} />
          <h4 className="text-2xl font-bold mb-3">Fast Turnaround</h4>
          <p className="text-slate-300 text-base leading-relaxed">Same-day response for critical tax queries and compliance filings.</p>
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
      <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="CA Consultation" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-3/5 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                <Calculator size={14} className="text-[#C59B4E]" />
                <span className="text-white text-[10px] md:text-xs uppercase font-bold tracking-[0.2em]">Verified ICAI Professionals</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Talk to a <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Chartered Accountant</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                Expert tax planning, GST filing, and business audit services at your fingertips. Connect with India's top CAs for reliable financial guidance.
              </p>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-3 text-white/90 text-xs md:text-sm font-bold">
                  <CheckCircle size={18} className="text-[#C59B4E]" /> GST & Tax Experts
                </div>
                <div className="flex items-center gap-3 text-white/90 text-xs md:text-sm font-bold">
                  <Shield size={18} className="text-[#C59B4E]" /> 100% Privacy
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Book a Session</h3>
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


