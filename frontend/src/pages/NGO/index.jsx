import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// axios is kept for convention, though not used in frontend logic
import axios from "axios";
import {
  ChevronDown,
  Zap, // For compelling/Credibility
  Briefcase, // For Section 8/Company Act
  ArrowRight,
  Star,
  CheckCircle,
  FileText, // For document/MOA/AOA
  Scale, // For Compliance/Regulation
  Smartphone,
  Handshake, // For Donations/Partnerships
  TrendingUp, // For Grants/Growth
  Lightbulb, // For Expert Guidance/Choosing Structure
  Users, // For Team/Members/Governing Body
  DollarSign, // For Financials/Funding/Fees
  Download,
  Globe, // For Level of Operation
  Calculator, // For Fees/Budgeting
  Landmark, // For Society/Trust/Acts
  Clock, // For Time/Process
  Heart, // For Social Cause/Role
  BookOpen, // For Acts Governing
  MapPin,
  CheckCircle2 // For Address Proof
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from "../../assets/ngo_hero_bg.png"; // Specific background

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

// --- NGO REGISTRATION STATIC DATA DEFINITIONS ---

const ngoTabs = [
  { id: 'ngo-overview-content', label: 'Overview' },
  { id: 'ngo-role-eligibility-content', label: 'Role & Eligibility' },
  { id: 'ngo-acts-classification-content', label: 'Acts & Types' },
  { id: 'ngo-documents-process-content', label: 'Process & Docs' },
  { id: 'ngo-benefits-funding-content', label: 'Benefits & Funding' },
  { id: 'ngo-why-Bizzfiling', label: 'Why Bizzfiling?' },
  { id: 'ngo-faqs-content', label: "FAQ's" },
];

const ngoRoles = [
  { title: "Advocacy", icon: Zap, detail: "NGOs advocate for policy changes and raise awareness about critical social issues." },
  { title: "Service Delivery", icon: Heart, detail: "They provide essential services like healthcare, education, and disaster relief." },
  { title: "Community Development", icon: Users, detail: "NGOs work on grassroots levels to empower local communities and improve their quality of life." },
  { title: "Research and Innovation", icon: Lightbulb, detail: "They conduct research to develop innovative solutions for social problems." },
];

const ngoEligibility = [
  "Minimum Members: A minimum of three members is required to start an NGO.",
  "Age: All founding members must be at least 18 years old.",
  "Purpose: The NGO must have a clear and specific purpose, focusing on social, environmental, or economic issues.",
  "Documentation: Founders must provide valid identification documents, including PAN cards and address proofs.",
  "Compliance: Must comply with the Societies, Trusts, or Companies Act, depending on the registration chosen.",
];

const ngoActs = [
  { title: "Societies Registration Act, 1860", icon: Landmark, detail: "Governs the registration and functioning of societies engaged in charitable activities." },
  { title: "Indian Trusts Act, 1882", icon: Landmark, detail: "Applicable to NGOs formed as public charitable trusts, outlining their registration and management." },
  { title: "Companies Act, 2013 (Section 8)", icon: Briefcase, detail: "Governs NGOs registered as Section 8 companies, focusing on promoting charitable objectives." },
];

const ngoClassification = [
  { type: "Human Rights NGOs", detail: "Focus on advocating for and protecting human rights and freedoms." },
  { type: "Environmental NGOs", detail: "Work towards environmental conservation, sustainability, and combating climate change." },
  { type: "Health NGOs", detail: "Dedicated to improving healthcare access, services, and public health initiatives." },
  { type: "Education NGOs", detail: "Promote education, literacy, and skills development among disadvantaged communities." },
  { type: "Women's Rights NGOs", detail: "Advocate for gender equality, women's empowerment, and addressing issues like violence and discrimination." },
];

const ngoDocuments = [
  { title: "Memorandum of Association (MOA)", icon: FileText, details: "Outlines the NGO's objectives and governing structure." },
  { title: "Articles of Association (AOA)", icon: FileText, details: "Defines the rules and regulations for the NGO's internal management." },
  { title: "Identity Proofs", icon: Users, details: "Valid identification documents of all founding members (PAN, Aadhar, Voter ID)." },
  { title: "Address Proof", icon: MapPin, details: "Proof of the registered office address (utility bill or rental agreement)." },
  { title: "Registration Fee", icon: DollarSign, details: "Fees applicable for registration under the chosen Act." },
];

const ngoProcessSteps = [
  "Choose the Type: Decide on the legal structure (society, trust, or Section 8 company) based on the NGO's objectives.",
  "Prepare Documents: Gather necessary documents, including the MOA, AOA, identity proofs, and address proof.",
  "Apply for Registration: Submit the application along with the required documents to the respective registrar under the chosen Act.",
  "Verification and Approval: The registrar verifies documents and conducts checks. Upon satisfaction, the NGO is registered with a certificate.",
  "Compliance: Fulfill ongoing compliance requirements, such as annual filings, maintaining proper accounts, and adhering to regulatory norms.",
];

const ngoBenefits = [
  { title: "Legal Recognition", icon: Scale, detail: "Gain legal status and recognition for fundraising, receiving grants, and entering into contracts." },
  { title: "Tax Benefits (12A & 80G)", icon: TrendingUp, detail: "Avail tax exemptions on income generated and donations received under sections 12A and 80G of the Income Tax Act." },
  { title: "Credibility & Trust", icon: Zap, detail: "Enhance credibility and trust among donors, beneficiaries, and stakeholders." },
  { title: "Access to Grants", icon: DollarSign, detail: "Qualify for government and private sector grants, funding opportunities, and partnerships." },
  { title: "Operational Sustainability", icon: Clock, detail: "Ensure long-term sustainability through structured governance, transparency, and accountability." },
];

const fundRaisingWays = [
  "Donations: Solicit donations from individuals, businesses, and philanthropic organisations.",
  "Fundraising Events: Organise events such as charity galas, marathons, and concerts to raise funds and awareness.",
  "Corporate Partnerships (CSR): Collaborate with corporate entities through CSR initiatives and sponsorships.",
  "Online Campaigns: Use crowdfunding platforms and social media to reach a broader audience and collect donations.",
];

const ngoBizzfilingSteps = [
  { step: "Expert Guidance", detail: "Avail expert advice on choosing the appropriate legal structure for your NGO, whether it's a society, trust, or Section 8 company registration." },
  { step: "Document Preparation", detail: "Get expert assistance in preparing and filing necessary documents such as the Memorandum of Association (MOA) and Articles of Association (AOA)." },
  { step: "Application Submission", detail: "Our team will handle the entire registration process, including submitting applications to the relevant authorities and following up on approvals." },
  { step: "Compliance Support", detail: "Get ongoing compliance support, ensuring your NGO adheres to regulatory requirements and maintains legal status." },
  { step: "Online Platform", detail: "Use our online platform for easy document submission, tracking application status, and accessing legal resources." },
];

const ngoFAQs = [
  { q: "What is the main purpose of an NGO?", a: "The main purpose is to promote non-profit goals, focusing on areas like social welfare, education, public health, or environmental conservation, serving the community rather than shareholders." },
  { q: "Is GST applicable for NGOs?", a: "GST is generally applicable only if the NGO's activities fall under 'supply' and its annual turnover exceeds the threshold limit for taxable supplies (currently ₹20/40 lakhs)." },
  { q: "What are the tax benefits for NGOs in India?", a: "NGOs can avail two main benefits: **Section 12A** grants tax exemption on their income, and **Section 80G** allows donors to claim a deduction on their taxable income for donations made to the NGO." },
  { q: "Who regulates NGOs in India?", a: "NGOs are regulated by different authorities depending on their structure: Registrar of Societies (for Societies), Charity Commissioner (for Trusts), and Ministry of Corporate Affairs (for Section 8 Companies)." },
  { q: "Can an NGO work in multiple states or districts after registration?", a: "Yes, once legally registered, an NGO is generally allowed to operate across multiple states and districts, provided its MOA/Trust Deed permits it and it complies with local regulations." },
  { q: "What is the process to apply for FCRA registration for an NGO?", a: "FCRA (Foreign Contribution Regulation Act) registration is applied for online via the Ministry of Home Affairs portal after the NGO is 3+ years old and has spent a minimum of ₹15 lakhs on its objectives in the last 3 financial years." },
];


// --- REUSABLE COMPONENTS ---



// --- TAB CONTENT COMPONENTS (NGO Registration Content) ---

const NGOOverviewContent = () => (
  <section id="ngo-overview-content" className="py-20 scroll-mt-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Overview"
        title="NGO Registration Online"
        description="Understanding the legal structures for non-profits in India."
      />
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <p className="text-lg text-slate-600 leading-relaxed">
          Non-Governmental Organisation (<strong>NGO</strong>) registration in India involves various legal structures:{" "}
          <strong>Society</strong> (Societies Registration Act, 1860, min 7 members),{" "}
          <strong>Trust</strong> (Indian Trusts Act, 1882), or{" "}
          <strong>Section 8 Company</strong> (Companies Act, 2013). The choice depends on the organisation's nature, objectives, and scale.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed">
          NGOs aiming for national recognition, government grants, and foreign contributions should register with the{" "}
          <strong>NGO-Darpan Portal</strong> (managed by NITI Aayog) and secure a <strong>DARPAN ID</strong>.
          This is crucial for legitimacy and accessing resources.
        </p>
      </div>
    </div>
  </section>
);

const NGORoleEligibilityContent = () => (
  <section id="ngo-role-eligibility-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Roles & Eligibility"
        title="Service Role & Criteria"
        description="Understanding the impact and requirements of NGOs."
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-12">
        <h4 className="text-xl font-bold text-slate-800 mb-6">Primary Roles of NGOs</h4>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {ngoRoles.map((item, i) => (
            <div key={i} className="p-5 bg-[#F8FDFC] border border-[#E0F2F1] rounded-xl hover:shadow-md transition-all">
              <item.icon className="w-6 h-6 text-[#00695C] mb-3" />
              <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#fff] rounded-2xl border border-slate-100 shadow-sm p-8">
        <h4 className="text-xl font-bold text-slate-800 mb-6">Eligibility Criteria</h4>
        <div className="grid md:grid-cols-2 gap-10">
          {ngoEligibility.map((item, i) => (
            <div key={i} className="flex items-start gap-5 p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <CheckCircle className="flex-shrink-0 w-5 h-5 mt-1 text-[#00695C]" />
              <span className="text-sm text-slate-700 leading-relaxed font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const NGOActsClassificationContent = () => (
  <section id="ngo-acts-classification-content" className="py-20 scroll-mt-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Legal Framework"
        title="Acts & Classification"
        description="Governing laws and operational types of NGOs."
      />

      <div className="grid gap-10 md:grid-cols-3 mb-16">
        {ngoActs.map((item, i) => (
          <div key={i} className="p-8 bg-[#F8FAFC] border border-slate-200 rounded-xl relative overflow-hidden group hover:border-[#00695C] transition-all">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <item.icon className="w-24 h-24 text-[#00695C]" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-[#00695C] mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-600">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h4 className="text-2xl font-bold text-slate-800 mb-8 text-center">NGO Classification</h4>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {ngoClassification.map((item, i) => (
          <div key={i} className="p-5 bg-white border border-slate-100 shadow-sm rounded-xl hover:shadow-md transition-all flex items-start gap-5 group">
            <div className="mt-1 p-1 bg-amber-50 rounded text-amber-600 group-hover:bg-amber-100 transition-colors">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800 text-base mb-1">{item.type}</h5>
              <p className="text-sm text-slate-500 leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NGODocumentsProcessContent = () => (
  <section id="ngo-documents-process-content" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Process & Docs"
        title="Registration Requirements"
        description="Step-by-step guide and necessary documentation."
      />

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h4 className="text-xl font-bold text-slate-800">Required Documents</h4>
          <div className="grid gap-5">
            {ngoDocuments.map((doc, i) => (
              <div key={i} className="flex items-start gap-5 p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                  <doc.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{doc.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{doc.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-xl font-bold text-slate-800">Registration Process</h4>
          <ol className="relative border-l border-slate-200 ml-3 space-y-8">
            {ngoProcessSteps.map((step, i) => (
              <li key={i} className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-[#00695C] rounded-full -left-4 ring-4 ring-white text-white font-bold text-sm">
                  {i + 1}
                </span>
                <h5 className="font-bold text-slate-800 text-lg mb-2">Step {i + 1}</h5>
                <p className="text-slate-600 text-sm leading-relaxed bg-white p-4 rounded-lg border border-slate-100 shadow-sm">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  </section>
);

const NGOBenefitsFundingContent = () => (
  <section id="ngo-benefits-funding-content" className="py-20 scroll-mt-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Advantage"
        title="Benefits & Funding"
        description="Why register and how to sustain your NGO."
      />

      <div className="grid gap-10 md:grid-cols-3 mb-16">
        {ngoBenefits.map((benefit, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all text-center group">
            <div className="w-12 h-12 bg-[#F8FDFC] rounded-full flex items-center justify-center text-[#00695C] mx-auto mb-4 group-hover:scale-110 transition-transform">
              <benefit.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">{benefit.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{benefit.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-8 max-w-4xl mx-auto">
        <h4 className="text-center text-xl font-bold text-amber-900 mb-6 flex items-center justify-center gap-5">
          <Handshake className="w-6 h-6" /> Ways to Raise Funds
        </h4>
        <div className="grid sm:grid-cols-2 gap-5">
          {fundRaisingWays.map((way, i) => (
            <div key={i} className="flex items-center gap-5 bg-white/60 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span className="text-sm font-medium text-amber-900">{way.split(':')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const NGOWhyBizzfiling = () => (
  <section id="ngo-why-Bizzfiling" className="py-20 scroll-mt-24 bg-[#F8FAFC]">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="Why Choose Us"
        title="Bizzfiling Advantage"
        description="Simplifying your NGO journey from registration to compliance."
      />

      <div className="grid gap-10 md:grid-cols-3 mb-12">
        {ngoBizzfilingSteps.map((item, i) => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg mb-4">
              {i + 1}
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{item.step}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
        <p className="text-slate-500 text-sm mb-2 uppercase tracking-widest font-bold">Estimated Cost</p>
        <h4 className="text-3xl font-bold text-[#00695C] mb-2">Starts from ₹ 7,499 + Service Tax</h4>
        <p className="text-sm text-slate-400">*Excluding government fees</p>
      </div>
    </div>
  </section>
);

const NGOFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
  <section id="ngo-faqs-content" className="py-20 scroll-mt-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading
        subtitle="FAQ"
        title="Frequently Asked Questions"
        description="Expert answers to common queries."
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {faqs.map((f, i) => (
          <div key={i} className={`border rounded-xl overflow-hidden transition-all duration-300 ${faqOpen === i ? 'border-[#00695C] shadow-lg' : 'border-slate-200 hover:border-[#00695C]/50'}`}>
            <button
              className={`w-full flex justify-between items-center p-5 text-left transition-colors ${faqOpen === i ? 'bg-[#00695C] text-white' : 'bg-white text-slate-800'}`}
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <span className="text-base md:text-lg font-bold pr-8">{f.q}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform ${faqOpen === i ? "rotate-180 text-white" : "text-slate-400"}`}
              />
            </button>
            <motion.div
              initial={false}
              animate={{ height: faqOpen === i ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-5 py-5 text-slate-600 bg-white text-sm leading-relaxed border-t border-slate-100">
                {f.a}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  </section>
);


// --- MAIN COMPONENT ---
export default function NGORegistrationPage() {
  const [activeTab, setActiveTab] = useState(ngoTabs[0].id);
  const [faqOpen, setFaqOpen] = useState(null);

  const SCROLL_OFFSET = 120;

  // --- SCROLLSPY IMPLEMENTATION ---
  useEffect(() => {
    const sectionIds = ngoTabs.map(tab => tab.id);

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
    <div className="bg-white min-h-screen font-sans">
      {/* === HERO SECTION (UPDATED PREMIUM DESIGN) === */}
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={BackgroundImageSrc}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-left space-y-8 flex flex-col items-start">
              {/* Gold Seal Badge */}
              <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#C59B4E] shadow-xl">
                  <div className="absolute inset-1 rounded-full border border-[#C59B4E]/30"></div>
                  <div className="text-center px-1">
                    <div className="flex justify-center gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="fill-[#C59B4E] text-[#C59B4E]" />)}
                    </div>
                    <span className="block text-[#C59B4E] font-serif font-bold text-[9px] lg:text-sm leading-tight uppercase tracking-wider mb-1">
                      Legal<br />Services<br />In India
                    </span>
                    <div className="w-12 lg:w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[8px] lg:text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  NGO Registration <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Online India</span>
                </h1>

                <p className="text-sm md:text-lg text-slate-300 max-w-xl font-light leading-relaxed mb-8">
                  Register your NGO as a **Society, Trust, or Section 8 Company** with expert assistance. Get **NGO-Darpan ID**, **FCRA Eligibility**, and full compliance support.
                </p>

                <div className="space-y-8 mb-8">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                      <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                    </div>
                    <span className="text-slate-200 text-sm md:text-base">Complete MOA, Bylaws & Trust Deed Drafting by Experts</span>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                      <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                    </div>
                    <span className="text-slate-200 text-sm md:text-base">Application Filing with ROC / Charity Commissioner</span>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                      <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                    </div>
                    <span className="text-slate-200 text-sm md:text-base">Assistance with PAN, TAN & Bank Account Opening</span>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="mt-1 p-1 rounded-full bg-[#C59B4E]/20">
                      <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                    </div>
                    <span className="text-slate-200 text-sm md:text-base">Guidance on 12A & 80G Tax Exemption Registration</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                  <span>Fast Approval</span>
                </div>
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-[#C59B4E]" />
                  <span>Tax Exemptions</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Get Started</h2>
                    <p className="text-slate-500 text-sm md:text-sm px-2 leading-relaxed">
                      Start your NGO journey today.
                    </p>
                  </div>
                  <LeadForm serviceName="NGO Registration" btnText="Register Now" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === Main Content Tabs Navigation (Sticky) === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white shadow-sm border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-0">
            {ngoTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                                    whitespace-nowrap py-5 text-sm md:text-base font-bold transition-all duration-200 relative px-4
                                    ${activeTab === tab.id ? 'text-[#00695C]' : 'text-slate-500 hover:text-slate-800'}
                                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#00695C]"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* === All Tab Content Sections Rendered Sequentially === */}
      <div className="bg-slate-50">
        <NGOOverviewContent />
        <NGORoleEligibilityContent />
        <NGOActsClassificationContent />
        <NGODocumentsProcessContent />
        <NGOBenefitsFundingContent />
        <NGOWhyBizzfiling />
        <NGOFAQsContent faqs={ngoFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
      </div>

    </div>
  );
}