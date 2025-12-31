import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import {
  ChevronDown,
  MapPin,
  Briefcase,
  ArrowRight,
  UserCheck,
  CheckCircle,
  FileText,
  Scale,
  Calculator,
  Download,
  Zap,
  Star,
  Shield,
  Activity,
  Award,
  Timer,
  FilePenLine,
  Rocket,
  Search
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";


const tabs = [
  { id: 'expertise-content', label: 'Areas Of Expertise' },
  { id: 'services-content', label: 'Services' },
  { id: 'process-content', label: 'Process' },
  { id: 'benefits-content', label: 'Benefits' },
  { id: 'faqs-content', label: 'FAQs' },
];

const faqs = [
  { q: "What is online lawyer consultation?", a: "It is a convenient way to connect with qualified lawyers via video or phone call, without visiting in person." },
  { q: "Do I need to visit the lawyer in person for consultation?", a: "No. All consultations happen 100% online at your convenience." },
  { q: "Are Bizzfiling lawyers qualified?", a: "Yes, all our lawyers are verified, licensed, and experts in their fields." },
  { q: "Can I get help with property law issues through an online consultation?", a: "Yes, we have senior lawyers specializing in property succession, registration, and disputes." },
  { q: "How are fees structured for online lawyer consultations?", a: "Fees are structured affordably, typically ₹399 for a 30-minute consultation, with transparent, budget-friendly pricing." },
  { q: "Can I resolve business disputes through online lawyer consultations?", a: "Yes, our experts provide strategic advice on corporate, business law, and dispute resolution." },
  { q: "What are the benefits of choosing Bizzfiling for legal advice?", a: "Benefits include trusted legal advice, strong advocacy, risk reduction, cost savings, and access to a broad legal network." },
  { q: "How can I book a lawyer consultation with Bizzfiling?", a: "The process involves 8 quick steps: visiting the site, entering details, selecting language/problem, consulting, OTP verification, picking a slot, and payment." },
  { q: "Is online lawyer consultation safe & secure on Bizzfiling?", a: "Yes, your information stays private with end-to-end encryption and secure digital processes." },
  { q: "If I call again, can I consult with the same lawyer?", a: "We strive to maintain continuity; you can often request to consult with the same lawyer based on availability." },
  { q: "Is a video call available for lawyer consultations?", a: "Yes, our lawyers will contact you through your chosen mode of communication, either video or audio call, at your selected time." },
  { q: "What if I missed my booked consultation slot?", a: "We provide support for rescheduling or assisting clients who missed their booked time slots. Please contact customer support." },
  { q: "Can I consult with a lawyer in my native language?", a: "Yes, you can choose your preferred language during the booking process." },
];
// --- Reusable Components (Enhanced Design) ---

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

const ServiceItem = ({ title, description }) => (
  <div className="group p-6 bg-white rounded-xl border border-slate-100 hover:border-[#1A7F7D] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(26,127,125,0.15)] transition-all duration-300 h-full flex flex-col items-start">
    <div className="w-10 h-10 bg-[#F0FDFA] rounded-lg flex items-center justify-center mb-4 text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-colors duration-300">
      <Scale className="w-5 h-5" />
    </div>
    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#1A7F7D] transition-colors">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed flex-grow">{description}</p>
    <div className="mt-4 flex items-center text-[#1A7F7D] font-medium text-xs uppercase tracking-wide opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
      <span>Learn More</span>
      <ArrowRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

const ProcessStep = ({ stepNumber, step, isLast }) => (
  <div className="relative flex flex-col items-center group w-full text-center">
    {/* Connector Line (Desktop) */}
    {!isLast && (
      <div className="hidden md:block absolute top-[1.25rem] left-1/2 w-full h-[1px] bg-slate-200 group-hover:bg-[#1A7F7D]/40 transition-colors duration-500 -z-10"></div>
    )}

    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4 group-hover:border-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-all duration-300 z-10">
      <span className="text-sm font-bold text-slate-600 group-hover:text-white transition-colors">{stepNumber}</span>
    </div>

    <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-[#1A7F7D] transition-colors">Step {stepNumber}</h4>
    <p className="text-xs text-slate-500 max-w-[150px] mx-auto leading-relaxed">
      {step}
    </p>
  </div>
);

const BenefitItem = ({ title, description, icon: Icon }) => (
  <div className="flex gap-4 p-5 rounded-xl bg-white border border-slate-100 hover:border-[#1A7F7D]/20 hover:shadow-lg transition-all duration-300">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-[#F0FDFA] rounded-full flex items-center justify-center text-[#1A7F7D] border border-[#E0F2F1]">
        {Icon ? <Icon className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      </div>
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

const ExpertiseCard = ({ title }) => (
  <div className="group px-4 py-3 bg-white rounded-lg border border-slate-100 hover:border-[#1A7F7D] hover:shadow-md transition-all duration-300 flex items-center justify-between cursor-pointer">
    <h3 className="text-xs font-semibold text-slate-700 group-hover:text-[#1A7F7D] transition-colors uppercase tracking-wide">{title}</h3>
    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#1A7F7D] transition-colors">
      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-white" />
    </div>
  </div>
);

// --- Tab Content Components ---

const ExpertiseContent = () => (
  <section id="expertise-content" className="py-12 scroll-mt-24 bg-slate-50/50">
    <div className="w-full px-4 mx-auto">
      <SectionHeading
        subtitle="Platform Overview"
        title="India's Most Trusted Legal Platform"
        description="Bridging the gap between complex legal requirements and simple, actionable solutions."
      />

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: FilePenLine, title: "Expert Drafting", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.", color: "text-[#C59B4E]", bg: "bg-[#103B3E]" },
          { icon: Timer, title: "Lightning Fast", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.", color: "text-[#C59B4E]", bg: "bg-[#103B3E]" },
          { icon: Award, title: "Top-Tier Quality", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.", color: "text-[#C59B4E]", bg: "bg-[#103B3E]" }
        ].map((card, i) => (
          <div key={i} className={`rounded-xl p-8 text-center transition-all hover:-translate-y-1 shadow-md ${card.bg}`}>
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full border-2 border-[#C59B4E] flex items-center justify-center mb-6`}>
                <card.icon className={`w-8 h-8 ${card.color} stroke-[1.5]`} />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{card.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">{card.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WalletIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 7h-3a2 2 0 0 1-2-2V3" /><path d="M9 9a2 2 0 0 1 2-2h1" /><path d="M12 12v3" /><path d="M8 12h8" /><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /></svg>
)

// Helper for Services Grid
const ServiceCard = ({ title, description, isHighlighted }) => (
  <div className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
    ${isHighlighted
      ? 'bg-gradient-to-br from-[#E8DCC2] to-[#D4B982] border-transparent shadow-lg transform -translate-y-1'
      : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
       ${isHighlighted ? 'bg-white/30 text-[#8C6B28]' : 'bg-slate-50 text-[#1A7F7D]'}
    `}>
      {isHighlighted ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
    </div>

    <h3 className={`text-base font-bold mb-2 ${isHighlighted ? 'text-[#5C4518]' : 'text-slate-800'}`}>
      {title}
    </h3>

    <p className={`text-xs leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
      {description}
    </p>

    <div className={`flex items-center text-xs font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-2 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
      <span>Learn More</span>
      <ArrowRight className="w-3 h-3 ml-1" />
    </div>
  </div>
);

const ServicesContent = () => (
  <section id="services-content" className="py-16 scroll-mt-24 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Services"
        title="Our Experts Service"
        description="Choose from our wide range of professional legal services designed for you."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard title="Strategic Legal Counsel" description="In-depth analysis of your legal standing with actionable roadmaps for complex personal or business disputes." />
        <ServiceCard title="Premium Consultation" description="Priority access to top-tier senior counsel for high-stakes matters requiring immediate and expert attention." isHighlighted={true} />
        <ServiceCard title="Contract Drafting" description="Meticulous drafting and review of contracts, agreements, and legal deeds to safeguard your interests." />
        <ServiceCard title="Corporate Compliance" description="End-to-end support for company registration, annual filings, and regulatory adherence for businesses." />
        <ServiceCard title="Property Title Verification" description="Comprehensive due diligence for property transactions to ensure clear titles and prevent future litigation." />
        <ServiceCard title="Litigation Support" description="Robust representation and strategic guidance for civil, criminal, and consumer court proceedings." />
      </div>
    </div>
  </section>
);


const ProcessContent = () => {
  return (
    <section id="process-content" className="py-20 scroll-mt-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <SectionHeading
          subtitle="Process"
          title="How It Works"
          description="Simple steps to get your legal solution"
        />

        <div className="relative max-w-6xl mx-auto mt-16 mb-20">
          {/* Background Wave Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-1/2 z-0">
            <svg viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none" className="w-full h-32 opacity-20">
              <path d="M0,10 C150,10 150,110 300,110 S450,10 600,10 S750,110 900,110 S1050,10 1200,10" stroke="#1A7F7D" strokeWidth="4" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {/* Step 1: Top */}
            <div className="flex flex-col items-center group">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-[280px] hover:border-[#1A7F7D]/30 transition-all duration-300 relative z-20">
                <div className="w-14 h-14 mx-auto mb-4 text-[#C59B4E]">
                  <FilePenLine className="w-full h-full" strokeWidth={1.2} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Fill Details</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Submit your case details and documents securely.</p>
              </div>
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-full bg-[#1F4B4E] text-white flex items-center justify-center font-bold text-sm shadow-md mt-6 md:mt-12 relative z-20 ring-4 ring-white">
                1
              </div>
            </div>

            {/* Step 2: Bottom */}
            <div className="flex flex-col-reverse md:flex-col items-center group md:mt-32">
              {/* Number Badge (Top for bottom card) */}
              <div className="w-10 h-10 rounded-full bg-[#1F4B4E] text-white flex items-center justify-center font-bold text-sm shadow-md mb-6 md:mb-12 relative z-20 ring-4 ring-white">
                2
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-[280px] hover:border-[#1A7F7D]/30 transition-all duration-300 relative z-20">
                <div className="w-14 h-14 mx-auto mb-4 text-[#C59B4E]">
                  <Rocket className="w-full h-full" strokeWidth={1.2} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Analysis</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Our experts review your case for the best approach.</p>
              </div>
            </div>

            {/* Step 3: Top */}
            <div className="flex flex-col items-center group">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-[280px] hover:border-[#1A7F7D]/30 transition-all duration-300 relative z-20">
                <div className="w-14 h-14 mx-auto mb-4 text-[#C59B4E]">
                  <FileText className="w-full h-full" strokeWidth={1.2} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Consultation</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Connect with a lawyer via video or audio call.</p>
              </div>
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-full bg-[#1F4B4E] text-white flex items-center justify-center font-bold text-sm shadow-md mt-6 md:mt-12 relative z-20 ring-4 ring-white">
                3
              </div>
            </div>

            {/* Step 4: Bottom */}
            <div className="flex flex-col-reverse md:flex-col items-center group md:mt-32">
              {/* Number Badge */}
              <div className="w-10 h-10 rounded-full bg-[#1F4B4E] text-white flex items-center justify-center font-bold text-sm shadow-md mb-6 md:mb-12 relative z-20 ring-4 ring-white">
                4
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 w-full max-w-[280px] hover:border-[#1A7F7D]/30 transition-all duration-300 relative z-20">
                <div className="w-14 h-14 mx-auto mb-4 text-[#C59B4E]">
                  <UserCheck className="w-full h-full" strokeWidth={1.2} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Resolution</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Get specific advice and documents to resolve your issue.</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8">
          <button className="bg-[#1F4B4E] text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-[#16383A] transition-all shadow-xl shadow-[#1F4B4E]/10 uppercase tracking-widest">
            Start Your Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
)

const BenefitsContent = () => (
  <section id="benefits-content" className="py-20 scroll-mt-24 bg-[#F8FDFC]">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Why Choose Us"
        title="Benefits of Bizzfiling"
        description="Experience the difference with our client-centric legal solutions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "100% Confidential", desc: "Your consultation is private & secure. We adhere to strict attorney-client privilege standards.", icon: Shield },
          { title: "Verified Experts", desc: "Consult with bar-council registered lawyers with 10+ years of average experience.", icon: Award },
          { title: "Transparent Pricing", desc: "Fixed and affordable consultation fees. No hidden charges or surprise costs.", icon: Calculator },
          { title: "Instant Availability", desc: "Connect with a lawyer in minutes. No need to travel or wait in long queues.", icon: Zap },
          { title: "Secure Platform", desc: "Our platform typically uses bank-grade encryption to keep your data safe.", icon: CheckCircle },
          { title: "Dedicated Support", desc: "Get a dedicated case manager to assist you with document handling and follow-ups.", icon: UserCheck },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="mx-auto w-12 h-12 mb-4 text-[#1A7F7D] group-hover:scale-110 transition-transform">
              <item.icon className="w-10 h-10 mx-auto" strokeWidth={1.2} />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-2">{item.title}</h4>
            <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQsContent = ({ faqs, faqOpen, setFaqOpen }) => {
  const midPoint = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, midPoint);
  const rightFaqs = faqs.slice(midPoint);

  return (
    <section id="faqs-content" className="py-20 scroll-mt-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading
          subtitle="FAQ"
          title="Common Questions"
          description="Find answers to frequently asked questions about our online consultation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {leftFaqs.map((f, i) => (
              <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
            ))}
          </div>
          <div className="space-y-4">
            {rightFaqs.map((f, i) => {
              const actualIndex = midPoint + i;
              return (
                <FaqItem key={actualIndex} faq={f} isOpen={faqOpen === actualIndex} onClick={() => setFaqOpen(faqOpen === actualIndex ? null : actualIndex)} />
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12">
          <h4 className="text-xl font-bold text-slate-800 mb-2">Still have questions?</h4>
          <p className="text-sm text-slate-500 mb-6">Can't find the answer you're looking for? Please contact us.</p>
          <button className="text-[#1A7F7D] font-bold text-sm border-b-2 border-[#1A7F7D] pb-0.5 hover:text-[#146664] transition-colors">
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
};

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

// --- Main Component ---
export default function TalkToLawyer() {
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
          if (rect.top <= SCROLL_OFFSET + 50) { // Added buffer
            currentActiveTab = sectionId;
          }
        }
      }
      setActiveTab(prev => (prev !== currentActiveTab ? currentActiveTab : prev));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tabs]);

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
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* === HERO SECTION (UPDATED PREMIUM DESIGN) === */}
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={BackgroundImageSrc}
            alt="Lawyer Consultation Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Teal Gradient Overlay - Polished for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-left space-y-8 flex flex-col items-start">
              {/* Gold Seal Badge - Neatly Aligned */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Visual Glow */}
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>

                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#C59B4E] shadow-xl">
                  {/* Inner Ring */}
                  <div className="absolute inset-1 rounded-full border border-[#C59B4E]/30"></div>

                  <div className="text-center px-1">
                    <div className="flex justify-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-[#C59B4E] text-[#C59B4E]" />)}
                    </div>
                    <span className="block text-[#C59B4E] font-serif font-bold text-[10px] leading-tight uppercase tracking-wider mb-1">
                      Legal<br />Services<br />In India
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  Online Lawyer <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Consultation</span>
                </h1>

                <p className="text-sm md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Get your legal queries resolved with expert lawyers via call or video. Fast, secure, and confidential consultation starting at just <span className="text-[#C59B4E] font-semibold">₹399</span>.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                  <span>Verified Experts</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-[#C59B4E]" />
                  <span>100% Confidential</span>
                </div>
              </div>
            </div>

            {/* Right Form Card - Neatly Aligned & Defined */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Talk to a Lawyer</h2>
                    <p className="text-slate-500 text-[10px] md:text-xs px-2 leading-relaxed">
                      Call us or Fill the form below with your new lead form!
                    </p>
                  </div>
                  <LeadForm serviceName="Talk to a Lawyer" btnText="Talk to Lawyer Now" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === Sticky Navigation === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
            {tabs.map((tab) => (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  className={`
                    relative py-4 text-sm font-bold tracking-wide transition-all duration-200 border-b-[3px]
                    ${activeTab === tab.id
                      ? 'text-[#0F4C49] border-[#0F4C49]'
                      : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}
                  `}
                  onClick={(e) => { e.preventDefault(); handleTabClick(tab.id); }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* === Main Content === */}
      <div className="w-full px-4 space-y-4">
        <ExpertiseContent />
        <ServicesContent />
      </div>

      {/* Full width Process Section */}
      <div className="w-full">
        <ProcessContent />
      </div>

      <div className="w-full px-4">
        <BenefitsContent />
        <FAQsContent faqs={faqs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
      </div>


    </div>
  );
}