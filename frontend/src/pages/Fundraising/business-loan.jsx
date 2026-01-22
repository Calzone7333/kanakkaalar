import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
  ChevronDown,
  Zap, // For captivating/compelling
  Briefcase, // For Business Plan
  ArrowRight,
  Star,
  CheckCircle,
  FileText, // For document/content
  Scale,
  Smartphone,
  Handshake, // New icon for partnership/connect
  TrendingUp, // New icon for growth/traction
  Lightbulb, // New icon for idea/strategy/solution
  Users, // For Team
  DollarSign, // For Financials/Funding
  Download, // For process/delivery
  Globe, // For Market Analysis
  Calculator, // For Financials/Cost
  Banknote, // For Loan
  Target, // For Eligibility
  RefreshCw, // For Process/Hasslefree
  Shield, // For Trust/No Collateral
  Clock, // For Quick Turnaround Time
  CreditCard, // For EMI
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from '../../assets/lawyer_office_bg.png'; // Reusing the same image for the background

// --- BUSINESS LOAN STATIC DATA DEFINITIONS ---

const loanTabs = [
  { id: 'loan-overview-content', label: 'Overview' },
  { id: 'loan-features-content', label: 'Features' },
  { id: 'loan-benefits-content', label: 'Benefits' },
  { id: 'loan-documents-content', label: 'Documents' },
  { id: 'loan-eligibility-content', label: 'Eligibility' },
  { id: 'loan-why-Bizzfiling', label: 'Why Bizzfiling?' },
  { id: 'loan-faqs-content', label: "FAQ's" },
];

const loanTypes = [
  { title: "Bank Overdraft/Credit Line", icon: CreditCard, description: "Withdraw funds up to a predetermined limit. The excess amount withdrawn is treated as a form of credit, not a traditional loan." },
  { title: "Equity Funding", icon: Users, description: "Instead of a loan, investors receive ownership stakes in the company. Does not require repayment but involves stake dilution." },
  { title: "Short-term Loans", icon: Clock, description: "Shorter repayment period, provided as working capital and limited capital investment. Convenient for small and medium enterprises." },
  { title: "Equipment Finance", icon: Briefcase, description: "Funding for the purchase of instruments, secured by the equipment itself as collateral. The lender can procure the instrument in case of default." },
  { title: "Loan on Accounts Receivables", icon: DollarSign, description: "Short-term credit in exchange for account receivables. Loan tenure aligns with the invoice due date." },
  { title: "Factoring/Advances", icon: Handshake, description: "A factoring company pays the business in advance for accounts receivable. A percentage of the invoice is paid first, with the remainder withheld." },
];

const loanFeatures = [
  { title: "Loan Amount From ₹2 lakhs - ₹50 Lakhs", icon: Banknote, detail: "Bizzfiling offers business loans up to ₹2 - ₹75 lakhs for eligible SMEs. The processing is quite easy and can be completed within a short time span." },
  { title: "Superfast Processing", icon: RefreshCw, detail: "Our team of business experts will cross-verify your documents and complete the processing quickly. There are no bank visits required." },
  { title: "Quick Turnaround Time", icon: Clock, detail: "Most of the loan documents are processed and provided in just **72 hours**." },
  { title: "No Collateral Required", icon: Shield, detail: "Our unsecured business loans do not require any collateral. It helps you to upscale your business without putting your assets at risk." },
  { title: "Extended Loan Tenure", icon: ArrowRight, detail: "We provide loan tenures from **12 months to 36 months**, offering significant credit relief." },
  { title: "Transparent Costs", icon: Scale, detail: "We maintain transparency by ensuring **zero hidden costs and charges**. A one-time processing fee is charged." },
  { title: "Flexible Repayment", icon: CreditCard, detail: "Bizzfiling provides monthly EMI allowing you to easily repay the business loan. You can also opt for much more flexible repayments." },
];

const loanBenefits = [
  "Faster Processing: Bizzfiling processes business loans in just 72 hours and provides funding on time. This provides you greater leverage in taking time-sensitive business decisions.",
  "Preserving Your Ownership: Collateral-free business loans are provided quickly. You need not worry about liquidating your company ownership or losing your assets.",
  "Streamlining Your Cash Flow: A business loan assures both capital and time. This will help you to enhance your cash flow and achieve profitability.",
  "Boost Your Credit Score: Repaying a business loan on time is a definite way to boost your CIBIL score and business credit score. We make sure to report all the loan accounts to all the credit bureaus.",
];

const requiredDocuments = [
  "Bank statement (12 months)",
  "Business registration proof (GST filing, Gumastadhara, Trade License, Drug License, TIN, VAT registration)",
  "PAN Card Copy (Personal and Company)",
  "Aadhar Card Copy",
  "Partnership Deed Copy (if applicable)",
];

const eligibilityCriteria = [
  { title: "Established Business", icon: CheckCircle, detail: "Your business should have been in operation for at least 6 months." },
  { title: "Minimum Turnover", icon: DollarSign, detail: "Your business should have a minimum turnover of ₹5 lakhs or more than 6 months preceding your loan application." },
  { title: "Exclusion Criteria", icon: Target, detail: "Your business should not be on the blacklisted or excluded list for SBA finance." },
  { title: "Location Eligibility", icon: Globe, detail: "We provide business loans pan India." },
];

const whyBizzfiling = [
  "5,00,000+ Businesses trust us with their business compliance and tax needs.",
  "Completely Online Process: Avoid lengthy bank visits and complete your application from anywhere.",
  "Minimum Documentation: Just submit the required documents & leave the rest to us.",
  "Loan Approval in 72hrs: Our quick turnaround time ensures you get funding when you need it most.",
  "Low Service Fee: We maintain transparency with low, single-time processing fees.",
  "Flexible Loan amount & Tenure: Tailored options to suit the unique needs of small and medium businesses.",
];

const loanFAQs = [
  { q: "What Is Business Loan?", a: "Business loans are lending agreements between business owners and financial institutions. They provide funding for investment or working capital purposes, aiding in the expansion and facilitation of various business activities." },
  { q: "How can I get a business loan quickly?", a: "The fastest way is through online platforms like Bizzfiling, which offer simplified digital interfaces, minimal documentation, and loan processing within **72 hours**." },
  { q: "What is the business loan interest rate?", a: "Interest rates are determined by your eligibility, CIBIL score, and business turnover. You must apply now to know your personalized, exact rate." },
  { q: "What is the maximum amount of a business loan?", a: "Bizzfiling offers business loans up to **₹50 Lakhs** for eligible SMEs, with a tailored range starting from ₹2 lakhs." },
  { q: "What is the minimum ITR required for a business loan?", a: "While not explicitly stated, ITR is a key document. Generally, a track record of filed ITRs is required to demonstrate the business's financial health and minimum turnover criteria." },
  { q: "What is the minimum CIBIL score needed for a business loan?", a: "While lenders' minimums vary, a score of **750 or higher** is generally recommended for a high chance of approval and a favorable interest rate. Get in touch with our experts for an assessment." },
];

// --- REUSABLE COMPONENTS ---

const ReviewBox = ({ score, reviews, source }) => (
  <div className="flex flex-col items-center justify-center w-full p-3 border shadow-lg bg-white/10 rounded-xl border-white/20">
    <div className="flex items-center mb-1 text-yellow-400">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
    </div>
    <p className="text-sm font-semibold text-white/80">{source}</p>
    <p className="mt-1 text-xl font-bold text-white">{score}</p>
    <p className="text-sm text-white/90">{reviews}</p>
  </div>
);

const DetailItem = ({ title, description, icon: Icon }) => (
  <div className="flex items-start gap-5 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#022B50]">
    <Icon className="w-5 h-5 text-[#022B50] mt-1 flex-shrink-0" />
    <div>
      <h4 className="mb-1 text-lg font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

const FeatureBox = ({ title, description, icon: Icon }) => (
  <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
    <Icon className="w-6 h-6 mb-2 text-amber-500" />
    <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

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


// --- TAB CONTENT COMPONENTS (Business Loan Content) ---

const LoanOverviewContent = () => (
  <section id="loan-overview-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Overview" title="What Is Business Loan?" description="Funding for expansion and facilitation of various business activities." />
    <p className="max-w-4xl mx-auto mb-4 text-lg text-gray-700 text-center">
      **Business loans** are lending agreements established between business owners and financial institutions or private lenders. These loans provide funding to entrepreneurs and business owners to be used for **investment or working capital purposes**, aiding in the expansion and facilitation of various business activities.
    </p>
    <p className="max-w-4xl mx-auto mb-8 text-lg text-gray-700 text-center">
      Unlike regular loans, business loans have specific formalities and terms. Bizzfiling partners with India's top lenders to provide the **best unsecured business loans** for SMEs.
    </p>

    <h3 className="mb-6 text-2xl font-bold text-gray-800">Types of Business Loans</h3>
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {loanTypes.map((item, i) => (
        <FeatureBox key={i} title={item.title} description={item.description} icon={item.icon} />
      ))}
    </div>
  </section>
);

const LoanFeaturesContent = () => (
  <section id="loan-features-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Highlights" title="Features of Business Loan" description="Tailor-made loans with user-friendly digital interface and superfast processing." />

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {loanFeatures.map((item, i) => (
        <DetailItem
          key={i}
          title={item.title.split(':').map(s => s.trim())[0]}
          description={item.detail}
          icon={item.icon}
        />
      ))}
    </div>
  </section>
);

const LoanBenefitsContent = () => (
  <section id="loan-benefits-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Advantages" title="Benefits of Business Loan" description="Key advantages for rapid business growth and financial stability." />

    <div className="space-y-8">
      {loanBenefits.map((benefit, i) => {
        const [title, description] = benefit.split(':').map(s => s.trim());
        const Icon = i === 0 ? Clock : i === 1 ? Shield : i === 2 ? DollarSign : TrendingUp;
        return (
          <div key={i} className="flex items-start gap-5 p-5 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
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

const LoanDocumentsContent = () => (
  <section id="loan-documents-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Checklist" title="Documents Required" description="We aim for minimal documentation to ensure superfast processing." />

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {requiredDocuments.map((doc, i) => (
        <div key={i} className="flex items-start gap-5 p-4 bg-white border-l-4 border-red-500 rounded-lg shadow-md">
          <FileText className="flex-shrink-0 w-5 h-5 mt-1 text-red-500" />
          <p className="font-medium text-gray-700">{doc}</p>
        </div>
      ))}
    </div>
  </section>
);

const LoanEligibilityContent = () => (
  <section id="loan-eligibility-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Requirements" title="Eligibility Criteria" description="General requirements to be eligible for an unsecured business loan." />

    <ol className="space-y-5 list-none border-l-2 border-[#022B50] pl-4">
      {eligibilityCriteria.map((item, i) => (
        <li key={i} className="flex items-start gap-5">
          <div className="bg-[#022B50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="block mb-1 text-lg font-bold text-gray-800">{item.title}</span>
            <span className="text-gray-700 text-md">{item.detail}</span>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

const LoanWhyBizzfiling = () => (
  <section id="loan-why-Bizzfiling" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Trust" title="Why Choose Bizzfiling?" description="Quickest, most transparent, and most flexible loan options in India." />

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {whyBizzfiling.map((reason, i) => {
        const [title, description] = reason.includes(':') ? reason.split(':').map(s => s.trim()) : [reason.split('.')[0].trim(), reason.split('.').slice(1).join('.').trim()];
        const Icon = i % 6 === 0 ? Users : i % 6 === 1 ? Smartphone : i % 6 === 2 ? FileText : i % 6 === 3 ? Clock : i % 6 === 4 ? DollarSign : TrendingUp;
        return (
          <div key={i} className="flex items-start gap-5 p-5 border border-indigo-200 shadow-sm bg-indigo-50 rounded-xl">
            <Icon className="w-6 h-6 text-[#022B50] mt-1 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const LoanFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
  <section id="loan-faqs-content" className="max-w-5xl py-12 mx-auto scroll-mt-24">
    <SectionHeading subtitle="FAQ" title="Business Loan Guide" description="Frequently Asked Questions about Business Loans." />

    <div className="space-y-8">
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
export default function BusinessLoanPage() {
  const [activeTab, setActiveTab] = useState(loanTabs[0].id);
  const [faqOpen, setFaqOpen] = useState(null);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(16); // Annual percentage
  const [loanTenure, setLoanTenure] = useState(12); // Months

  // EMI Calculation Logic
  const calculateEMI = (P, R_annual, N) => {
    if (R_annual === 0) return P / N; // Simple calculation for 0%
    const R = (R_annual / 12) / 100; // Monthly interest rate
    // E = P x R x (1+R)^N / ((1+R)^N - 1)
    const numerator = P * R * Math.pow(1 + R, N);
    const denominator = Math.pow(1 + R, N) - 1;
    return Math.round(numerator / denominator);
  };

  const emi = calculateEMI(loanAmount, interestRate, loanTenure);
  const totalPayable = emi * loanTenure;
  const totalInterest = totalPayable - loanAmount;


  const SCROLL_OFFSET = 120;

  // --- SCROLLSPY IMPLEMENTATION ---
  useEffect(() => {
    const sectionIds = loanTabs.map(tab => tab.id);

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
      <section className="relative w-full min-h-[auto] lg:min-h-[70vh] flex items-center pt-32 pb-12 lg:pt-36 lg:pb-12 md:pb-16">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={BackgroundImageSrc}
            alt="Business Loans Background"
            className="w-full h-full object-cover"
          />
          {/* Dark Teal Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-10">

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
                    <span className="block text-[#C59B4E] font-serif font-bold text-sm leading-tight uppercase tracking-wider mb-1">
                      Business<br />Loan<br />Service
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  Business Loans for <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Your Growth</span>
                </h1>

                <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Get up to ₹50 Lakhs collateral-free with 72-hour approval. Transparent process and flexible tenures.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-[#C59B4E]" />
                  <span>72 Hr Approval</span>
                </div>
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-[#C59B4E]" />
                  <span>No Collateral</span>
                </div>
              </div>
            </div>
            {/* Right Form Card */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Apply for Loan</h2>
                    <p className="text-slate-500 text-sm md:text-sm px-2 leading-relaxed">
                      Check your eligibility in minutes!
                    </p>
                  </div>
                  <LeadForm serviceName="Business Loans" btnText="Check Eligibility" />
                </div>
              </div>
            </div>

          </div >
        </div >
      </section >

      {/* === Sticky Navigation === */}
      < div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100" >
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-10 md:gap-10 overflow-x-auto no-scrollbar py-0 list-none">
            {loanTabs.map((tab) => (
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
      < div className="w-full px-4 py-12 md:py-12 md:py-16" >
        <div className="mx-auto max-w-7xl space-y-16">
          <LoanOverviewContent />
          <LoanFeaturesContent />
          <LoanBenefitsContent />
          <LoanDocumentsContent />
          <LoanEligibilityContent />
          <LoanWhyBizzfiling />
          <LoanFAQsContent faqs={loanFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
        </div>
      </div >
    </div >
  );
}