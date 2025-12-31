import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
  ChevronDown,
  Zap, // For captivating/compelling
  Briefcase, // For Business Plan (used for DPR title/general business)
  ArrowRight,
  Star,
  CheckCircle, // For Benefits/Compliance
  FileText, // For document/content/DPR itself
  Scale, // For Compliance/Risk Analysis
  Smartphone,
  Handshake, // For Consult an Expert
  TrendingUp, // For Higher Loan Approval Chances
  Lightbulb, // For Project Concept/Expertise
  Users, // For Team/Expert Guidance
  DollarSign, // For Financials/Funding
  Download,
  Globe, // For Market Research
  Calculator, // For Financial Projections
  Banknote, // For Loan
  Target,
  RefreshCw,
  Shield,
  Clock, // For Time and Cost Savings
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from '../../assets/lawyer_office_bg.png'; // Reusing a general business image

// --- DPR SERVICE STATIC DATA DEFINITIONS ---

const dprTabs = [
  { id: 'dpr-overview-content', label: 'Overview' },
  { id: 'dpr-benefits-content', label: 'Benefits' },
  { id: 'dpr-documents-content', label: 'Documents' },
  { id: 'dpr-services-include-content', label: 'Our DPR Services' },
  { id: 'dpr-why-Bizzfiling', label: 'Why Bizzfiling?' },
  { id: 'dpr-faqs-content', label: "FAQ's" },
];

const dprBenefits = [
  "Higher Loan Approval Chances: Our comprehensive and compliant DPRs increase your chances of securing the funding you need.",
  "Time and Cost Savings: Our experienced team streamlines the DPR process, saving you time and money.",
  "Professionalism: A well-prepared DPR demonstrates your professionalism and commitment to your project.",
  "Customised Solutions: We tailor our services to meet the specific needs of your project.",
  "Expert Guidance: Benefit from the insights and recommendations of our experts throughout the DPR process.",
];

const dprDocuments = [
  "Project concept note",
  "Feasibility study",
  "Market research report",
  "Technical specifications",
  "Financial projections",
  "Risk assessment",
  "Legal and regulatory compliance assessment",
  "Executive summary",
  "Business plan",
  "Environmental impact assessment",
  "Social impact assessment",
  "Land acquisition documents",
  "Construction permits",
  "Letters of intent from customers or suppliers",
];

const dprServicesIncluded = [
  { title: "Project Assessment", icon: Briefcase, detail: "We begin by thoroughly assessing your project and understanding its scope, objectives, and financial requirements. This assessment sets the foundation for the rest of the process." },
  { title: "Market Research", icon: Globe, detail: "A crucial component of any DPR is in-depth market research. We analyze market trends, competition, and potential risks to comprehensively understand the project's viability." },
  { title: "Financial Projections", icon: DollarSign, detail: "We provide detailed financial projections to give lenders a clear outlook on the project's profitability and return on investment." },
  { title: "Technical Details", icon: Lightbulb, detail: "For projects with a technical or engineering aspect, we provide detailed technical descriptions and plans to ensure lenders have a complete understanding of your project's technical feasibility." },
  { title: "Risk Analysis", icon: Scale, detail: "We conduct a comprehensive risk analysis, identifying potential challenges and presenting mitigation strategies to instil confidence in lenders regarding your project's success." },
  { title: "Executive Summary", icon: Zap, detail: "A well-crafted executive summary highlights the key points of your DPR, making it easy for lenders to quickly grasp the project's potential." },
  { title: "Legal and Regulatory Compliance", icon: CheckCircle, detail: "We ensure that your DPR complies with all legal and regulatory requirements, reducing the chances of delays or complications during the loan approval process." },
  { title: "Presentation Support", icon: Handshake, detail: "We offer presentation support if needed, helping you effectively communicate your project's strengths to the lending institution." },
];

const whyBizzfilingDPR = [
  "Expertise and Experience: With a rich history of providing legal and business services, our team is well-versed in crafting comprehensive DPRs for various industries and project types, ensuring meticulous preparation.",
  "Tailored Solutions: We thoroughly understand your business and project objectives, tailoring our DPR service to suit your specific needs and goals, reflecting the true essence of your project.",
  "Compliance and Accuracy: Our experts ensure that your DPR is comprehensive and fully compliant with the strict guidelines of banks and financial institutions, increasing your chances of loan approval.",
];

const dprFAQs = [
  { q: "What is a DPR report?", a: "DPR stands for **Detailed Project Report**. It is a comprehensive document that outlines all aspects of a proposed project, from conception to completion. It's used by stakeholders like investors and lenders to assess feasibility and viability." },
  { q: "Why is DPR prepared?", a: "DPR is prepared to secure financial assistance, particularly bank loans. It proves the **feasibility and viability** of the project to lenders, mitigating their risk and establishing the project's creditworthiness." },
  { q: "What is included in a project report for a bank loan?", a: "A bank loan DPR typically includes a Project Concept Note, Market Research, Technical Specifications, **Detailed Financial Projections**, Risk Assessment, and Legal/Regulatory Compliance Assessment." },
  { q: "Why do banks require a DPR for granting loans?", a: "Banks require a DPR to perform **due diligence**. It provides a detailed, structured overview of the project's technical, financial, and operational aspects, allowing the bank to accurately gauge the risk and potential return." },
  { q: "Who typically prepares a DPR?", a: "A DPR is typically prepared by **qualified experts or consultants** with expertise in finance, engineering, and market analysis, such as the team at Bizzfiling, to ensure compliance and professionalism." },
  { q: "What is the significance of DPR in terms of construction projects seeking bank loans?", a: "For construction, the DPR is crucial as it details land acquisition, construction permits, environmental impact, and technical plans, proving the project is structurally, legally, and environmentally sound." },
];

// --- REUSABLE COMPONENTS (Adapted) ---

const ReviewBox = ({ score, reviews, source }) => (
  <div className="flex flex-col items-center justify-center w-full p-3 border shadow-lg bg-white/10 rounded-xl border-white/20">
    <div className="flex items-center mb-1 text-yellow-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
    </div>
    <p className="text-xs font-semibold text-white/80">{source}</p>
    <p className="mt-1 text-xl font-bold text-white">{score}</p>
    <p className="text-xs text-white/90">{reviews}</p>
  </div>
);

const DetailItem = ({ title, description, icon: Icon }) => (
  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
    <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const ServiceIncludeBox = ({ title, detail, icon: Icon }) => (
  <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
    <Icon className="w-6 h-6 mb-2 text-amber-500" />
    <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-600">{detail}</p>
  </div>
);

// --- TAB CONTENT COMPONENTS (DPR Content) ---

const DPROverviewContent = () => (
  <section id="dpr-overview-content" className="py-12 scroll-mt-24">
    <h2 className="mb-6 text-3xl font-bold text-gray-800">DPR (Detailed Project Report) - An Overview</h2>
    <p className="max-w-4xl mb-4 text-lg text-gray-700">
      **DPR stands for Detailed Project Report**. It is a comprehensive document that outlines all aspects of a proposed project, from conception to completion. It is used by various stakeholders, including investors, lenders, and government agencies, to assess the **feasibility and viability** of a project.
    </p>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      At Bizzfiling, we understand that a DPR is **essential for any business seeking financial assistance**, especially when applying for a bank loan. A well-prepared DPR significantly impacts your chances of securing the necessary funds to make your project a reality.
    </p>
  </section>
);

const DPRBenefitsContent = () => (
  <section id="dpr-benefits-content" className="py-12 scroll-mt-24">
    <h3 className="mb-8 text-3xl font-bold text-gray-800">Benefits of Choosing Bizzfiling for Your DPR</h3>

    <div className="space-y-4">
      {dprBenefits.map((benefit, i) => {
        const [title, description] = benefit.split(':').map(s => s.trim());
        const Icon = i === 0 ? TrendingUp : i === 1 ? Clock : i === 2 ? FileText : i === 3 ? Target : Users;
        return (
          <div key={i} className="flex items-start gap-3 p-5 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
            <Icon className="w-6 h-6 text-[#022B50] mt-1 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-xl font-bold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const DPRDocumentsContent = () => (
  <section id="dpr-documents-content" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Documents Required</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      The documents required for a DPR vary, but the following are typically essential for any lender or investor to assess the project's scope and viability.
    </p>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {dprDocuments.map((doc, i) => (
        <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <FileText className="flex-shrink-0 w-5 h-5 mt-1 text-red-500" />
          <p className="font-medium text-gray-700">{doc}</p>
        </div>
      ))}
    </div>
  </section>
);

const DPRServicesIncludeContent = () => (
  <section id="dpr-services-include-content" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Our DPR Service Includes</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      We provide a holistic service, covering every crucial aspect that banks and lending institutions evaluate, ensuring a comprehensive and robust project presentation.
    </p>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {dprServicesIncluded.map((item, i) => (
        <ServiceIncludeBox
          key={i}
          title={item.title}
          detail={item.detail}
          icon={item.icon}
        />))}
    </div>
  </section>
);

const DPRWhyBizzfiling = () => (
  <section id="dpr-why-Bizzfiling" className="py-12 scroll-mt-24">
    <h3 className="mb-6 text-3xl font-bold text-gray-800">Why Bizzfiling?</h3>
    <p className="max-w-4xl mb-8 text-lg text-gray-700">
      Our commitment goes beyond document preparation. We ensure your DPR is **strategically sound, compliant, and tailored** for maximum funding appeal.
    </p>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {whyBizzfilingDPR.map((reason, i) => {
        const [title, description] = reason.split(':').map(s => s.trim());
        const Icon = i === 0 ? Lightbulb : i === 1 ? Target : Scale;
        return (
          <div key={i} className="flex items-start gap-3 p-5 border border-indigo-200 shadow-sm bg-indigo-50 rounded-xl">
            <Icon className="w-6 h-6 text-[#022B50] mt-1 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-12 p-6 bg-[#E6F0F6] rounded-xl border-l-4 border-amber-500 shadow-md">
      <h4 className="flex items-center gap-2 mb-2 text-xl font-bold text-gray-800"><Handshake className="w-5 h-5 text-amber-500" /> Consult an Expert</h4>
      <ul className="space-y-2 text-gray-700 list-none">
        <li className="flex items-start gap-2"><ArrowRight className="flex-shrink-0 w-4 h-4 mt-1" /> All queries are clarified in **30 minutes**.</li>
        <li className="flex items-start gap-2"><ArrowRight className="flex-shrink-0 w-4 h-4 mt-1" /> Provide ongoing support and guidance during the project implementation phase.</li>
      </ul>
    </div>
  </section>
);

const DPRFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
  <section id="dpr-faqs-content" className="max-w-5xl py-12 mx-auto scroll-mt-24">
    <h3 className="mb-8 text-3xl font-bold text-center text-gray-800">FAQs on DPR (Detailed Project Report) Service</h3>

    <div className="space-y-4">
      {faqs.map((f, i) => (
        <div key={i} className="overflow-hidden border border-gray-200 shadow-sm rounded-xl">
          <button
            className={`w-full flex justify-between items-center p-5 text-left transition ${faqOpen === i ? 'bg-[#E6F0F6] text-[#022B50]' : 'bg-white hover:bg-gray-50'}`}
            onClick={() => setFaqOpen(faqOpen === i ? null : i)}
          >
            <span className="text-lg font-semibold">{f.q}</span>
            <ChevronDown
              className={`w-6 h-6 transition-transform ${faqOpen === i ? "rotate-180 text-[#022B50]" : "text-gray-500"}`}
            />
          </button>
          <motion.div
            initial={false}
            animate={{ height: faqOpen === i ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <p className="px-5 py-4 text-gray-700 bg-white">{f.a}</p>
          </motion.div>
        </div>
      ))}
    </div>
  </section>
);


// --- MAIN COMPONENT ---
export default function DPRServicePage() {
  const [activeTab, setActiveTab] = useState(dprTabs[0].id);
  const [faqOpen, setFaqOpen] = useState(null);

  const SCROLL_OFFSET = 120;

  // --- SCROLLSPY IMPLEMENTATION ---
  useEffect(() => {
    const sectionIds = dprTabs.map(tab => tab.id);

    const handleScroll = () => {
      let currentActiveTab = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i];
        const section = document.getElementById(sectionId);

        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= SCROLL_OFFSET) {
            currentActiveTab = sectionId;
          }
        }
      }

      const isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5;
      if (isScrolledToBottom) {
        currentActiveTab = sectionIds[sectionIds.length - 1];
      }

      setActiveTab(prevActiveTab => {
        if (prevActiveTab !== currentActiveTab) {
          return currentActiveTab;
        }
        return prevActiveTab;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle smooth scrolling when a tab is clicked
  const handleTabClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - SCROLL_OFFSET,
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
            alt="DPR Service Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Teal Gradient Overlay */}
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
                      DPR<br />Project<br />Report
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  DETAILED PROJECT <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">REPORT (DPR)</span>
                </h1>

                <p className="text-sm md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Professionally crafted DPRs to enhance project credibility, ensuring compliance, risk analysis & maximum funding appeal.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                  <span>Bank Approved Format</span>
                </div>
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-[#C59B4E]" />
                  <span>Expert Financials</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Get Your DPR</h2>
                    <p className="text-slate-500 text-[10px] md:text-xs px-2 leading-relaxed">
                      Start your project loan journey!
                    </p>
                  </div>
                  <LeadForm serviceName="Detailed Project Report" btnText="Get Started" />
                </div>
              </div>
            </div>

          </div>
        </div >
      </section >

      {/* === Sticky Navigation === */}
      < div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100" >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
            {dprTabs.map((tab) => (
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
      </div >

      {/* === All Tab Content Sections === */}
      < div className="w-full px-4 py-12 md:py-20" >
        <div className="mx-auto max-w-7xl space-y-16">
          <DPROverviewContent />
          <DPRBenefitsContent />
          <DPRDocumentsContent />
          <DPRServicesIncludeContent />
          <DPRWhyBizzfiling />
          <DPRFAQsContent faqs={dprFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
        </div>
      </div >
    </div >
  );
}