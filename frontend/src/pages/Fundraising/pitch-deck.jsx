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
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundImageSrc from '../../assets/lawyer_office_bg.png';
import StartNowButton from "../../components/StartNowButton"; // Reusing the same image for the background

// --- PITCH DECK STATIC DATA DEFINITIONS ---

const pitchDeckTabs = [
  { id: 'pitch-overview-content', label: 'Overview' },
  { id: 'pitch-advantages-content', label: 'Advantages' },
  { id: 'pitch-contain-content', label: 'Plan Contain' },
  { id: 'pitch-process-content', label: 'Process' },
  { id: 'pitch-services-content', label: 'Our Services' },
  { id: 'pitch-why-kanakkaalar', label: 'Why Kanakkaalar' },
  { id: 'pitch-faqs-content', label: 'FAQs' },
];

const pitchDeckContent = [
  { title: "Elevator Pitch", icon: Zap, description: "A quick and crisp synopsize of your startup - the problem it is solving." },
  { title: "Solution", icon: Lightbulb, description: "Your solution to the massive problem you have identified." },
  { title: "Market Analysis", icon: Globe, description: "Insights into the market and the opportunity it presents." },
  { title: "USP", icon: Scale, description: "Evidence that your business differs from other businesses and why it will succeed." },
  { title: "Business Model", icon: DollarSign, description: "How will you generate revenue and grow the same." },
  { title: "Go-To-Market Strategy", icon: ArrowRight, description: "What’s your strategy to acquire customers and attain massive growth." },
  { title: "Current Traction", icon: TrendingUp, description: "What’s your current traction and key business metrics." },
  { title: "Founding Team", icon: Users, description: "An overview of the domain expertise and the background of the founding team and other key advisors, partners, or investors." },
];

const deckCreationSteps = [
  "Define Your Company's Purpose and Business Model: Clearly articulate your company's purpose, addressing the problem you solve and the solution your product or service provides. Outline your business model, detailing how you generate revenue and create value for customers.",
  "Identify Your Target Market and Market Size: Define your target market, specifying the customer segments you aim to serve. Quantify the market size, illustrating the potential reach and revenue opportunities.",
  "Present Your Team's Expertise and Experience: Showcase your team's credentials, emphasizing their relevant experience and expertise. Highlight your team's capability to execute the business plan and achieve success.",
  "Highlight Your Traction and Accomplishments: Demonstrate your company's progress by showcasing milestones, partnerships, or customer acquisitions. Provide tangible evidence of your team's ability to deliver results.",
  "Project Your Financial Performance and Funding Needs: Present realistic financial projections, including revenue forecasts, expense breakdowns, and profitability targets. Clearly articulate your funding requirements and how the funds will be utilized.",
  "Craft a Compelling Narrative and Design: Structure your pitch deck as a narrative, guiding investors through your problem, solution, and market opportunity. Utilize visuals effectively, incorporating charts, graphs, and images to enhance understanding and engagement.",
  "Seek Expert Guidance and Feedback: Engage with our experienced pitch deck designers for valuable insights and refinement. Receive feedback from our team to identify areas for improvement and strengthen your presentation.",
];

const pitchDocuments = [
  "Enterprise Plan – A business pitch is a written document that outlines the objectives and tactics for the company's future.",
  "Technical Documents – An investor may request the relevant documentation from a business owner who is launching a technology-based venture or a medical venture.",
  "Documents Concerning Financial Issues – Detailed financial projections for the upcoming years will be needed by the potential investor who is interested in the company.",
  "Various Documents – Investors want to see the plans and pertinent documents related to hiring new employees and the costs associated with payroll, R&D, manufacturing, and marketing.",
  "Information Regarding the Market – Information about the target market helps the entrepreneur solve problems by giving pertinent data.",
];

const serviceProcessSteps = [
  { days: "5 Working Days", detail: "We will ask startups to share data of their business in a proprietary format, using which we perform an in-depth analysis of the business and competitors. The data requested from startups will be broad-ranging right from the vision for the company to the finer details such as business model, customer acquisition costs, breakdown of revenues, etc." },
  { days: "10 Working Days", detail: "We share a rough draft of the investment pitch deck in text format. Upon confirmation from the startup, within 10 working days, we will be able to deliver an end-to-end business plan that will visually impress a potential investor or partner." },
  { days: "4 Working Days", detail: "We encourage iterations requested by the startups on the business pitch up to 4 working days after delivering the first draft of the investment pitch deck." },
];

const KanakkaalarServices = [
  "Pitch Deck Creation – A well-crafted pitch deck is essential for any entrepreneur seeking funding or partners. Our professional pitch deck creation services will help you create a compelling presentation.",
  "Investor Pitch Coaching – Even with a great pitch deck, it is important to be able to deliver your pitch effectively. Our coaching services will help you hone your presentation skills and develop the confidence you need.",
  "Investor Connect – We offer investor connect services that will help you connect with potential investors and partners. We have a strong network of investors actively looking for new investment opportunities.",
];

const whyKanakkaalar = [
  "Unmatched Expertise: Our team brings unparalleled expertise in crafting effective pitch decks. We understand the nuances of presenting your business in a way that resonates with investors.",
  "Tailored Pitch Decks: We don't believe in one-size-fits-all. Your business is unique, and so should be your pitch deck. Our experts create tailored pitch decks that reflect the essence and potential of your venture.",
  "Investor Coaching and Pitch Preparation: Beyond designing the deck, we offer comprehensive investor coaching and pitch preparation. We equip you with the skills and confidence needed to deliver a compelling presentation.",
  "Proven Track Record of Success: With a track record of successful pitch decks, we have aided numerous businesses in securing the funding they need. Our approach is backed by real-world success stories.",
];

const pitchDeckFAQs = [
  { q: "What should be included in my investment pitch deck?", a: "A pitch deck should include the problem, solution, market size, business model, competition/USP, go-to-market strategy, team, traction/milestones, financial projections, and funding ask." },
  { q: "How long should my investment pitch deck be?", a: "Ideally, a pitch deck should be **10-15 slides**. The goal is to be concise, engaging, and to leave the investor wanting a follow-up meeting, not to provide every detail of the business plan." },
  { q: "What is the difference between an investment pitch deck and a business plan?", a: "The **pitch deck** is a concise visual presentation (10-15 slides) used to pique investor interest. The **business plan** is a detailed, long-form document (20-50+ pages) covering every operational and financial aspect." },
  { q: "How much does it cost to create an investment pitch deck?", a: "The cost varies widely, but professional services like Kanakkaalar balance **cost-effectiveness with expert design** and financial modeling, ensuring an investor-ready, high-quality output." },
  { q: "What are the common mistakes that people make when creating investment pitch decks?", a: "Common mistakes include too much text, confusing financial projections, lacking a clear 'why now' market context, and failing to highlight the team's relevant expertise." },
  { q: "What documents help you set up a business pitch deck?", a: "Key inputs include your detailed business plan, financial statements (P&L, Balance Sheet), market research data, company incorporation documents, and team resumes/KYC." },
  { q: "What is the purpose of a pitch deck?", a: "The primary purpose is to secure the next meeting, not the funding itself. It's a marketing tool designed to convey your company's potential, excite investors, and pass their initial screening quickly." },
  { q: "How long will the business pitch last?", a: "The verbal pitch accompanying the deck should generally be kept to **10-15 minutes**, leaving ample time for questions and discussion with investors." },
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

const ProcessStep = ({ stepNumber, step }) => (
  <li className="flex items-start gap-5">
    <div className="bg-[#022B50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
      {stepNumber}
    </div>
    <span className="text-lg text-gray-700">{step}</span>
  </li>
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

// --- TAB CONTENT COMPONENTS (Pitch Deck Content) ---

const PitchOverviewContent = () => (
  <section id="pitch-overview-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Overview" title="Investment Pitch Deck" description="An essential presentation used by startups to raise capital from investors." />
    <p className="max-w-4xl mx-auto mb-4 text-lg text-gray-700 text-center">
      An **investment pitch deck** is a presentation used by startups to raise capital from investors. It typically includes **10-15 slides** that outline the company's problem, solution, market opportunity, team, traction, financials, and funding needs.
    </p>
    <p className="max-w-4xl mx-auto mb-8 text-lg text-gray-700 text-center">
      Pitch deck designs should be clean, professional, and visually appealing. The pitch deck for investors should be **tailored to the specific audience** (e.g., angel investors focus on high returns, VCs focus on scalability). A business pitch is a short presentation that summarises the key points of your investment pitch deck.
    </p>

    <div className="p-8 bg-[#E6F0F6] rounded-xl border-l-4 border-[#022B50] shadow-md">
      <p className="font-semibold text-gray-800">
        The cost of a pitch deck in India can vary depending on the complexity of the deck, the experience of the designer, and the number of revisions required. We offer competitive pricing with expert analysis.
      </p>
    </div>
  </section>
);

const PitchAdvantagesContent = () => (
  <section id="pitch-advantages-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Benefits" title="Why Have A Pitch Deck?" description="Crucial for convincing investors and securing equity funding." />

    <div className="grid gap-10 md:grid-cols-3">
      <DetailItem
        title="Convince the Investors"
        description="Showcase your potential for success in an easily understandable presentation to bank executives, VCs, and private equity investors. Increase the potential investors' mental clarity."
        icon={Handshake}
      />
      <DetailItem
        title="Secure Equity Funding"
        description="Essential for technologists to present their vision in a way that makes business sense to close funding rounds. It acts as a primary marketing strategy for the company."
        icon={DollarSign}
      />
      <DetailItem
        title="Build the Roadmap"
        description="Serves as an internal memo for the founding team to set benchmarks, track progress, and adjust the business goal to particular customers and investors."
        icon={Briefcase}
      />
    </div>
  </section>
);

const PitchContainContent = () => (
  <section id="pitch-contain-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Components" title="What Does It Contain?" description="A powerful pitch deck follows a standard narrative arc." />
    <p className="max-w-4xl mx-auto mb-8 text-lg text-gray-700 text-center">
      A powerful pitch deck follows a standard narrative arc, guiding the investor from the problem to your solution, and finally to the massive potential of your business and team.
    </p>

    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {pitchDeckContent.map((item, i) => (
        <div key={i} className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
          <item.icon className="w-6 h-6 mb-2 text-amber-500" />
          <h4 className="mb-1 text-lg font-bold text-gray-800">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);

const PitchProcessContent = () => (
  <section id="pitch-process-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Process" title="Building Process" description="Structured to deliver an investor-ready pitch deck efficiently." />

    <ol className="space-y-5 list-none border-l-2 border-[#022B50] pl-4 mb-12">
      {serviceProcessSteps.map((step, i) => (
        <li key={i} className="flex items-start gap-5">
          <div className="bg-[#022B50] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
            {step.days.split(' ')[0]}
          </div>
          <div>
            <span className="block mb-1 text-lg font-bold text-gray-800">{step.days}</span>
            <span className="text-gray-700 text-md">{step.detail}</span>
          </div>
        </li>
      ))}
    </ol>

    <h4 className="mb-6 text-2xl font-bold text-gray-800">What Paperwork Is Necessary for an Investors Deck?</h4>
    <div className="max-w-4xl space-y-8 text-gray-700">
      {pitchDocuments.map((doc, i) => (
        <li key={i} className="flex items-start gap-5 list-none">
          <FileText className="flex-shrink-0 w-5 h-5 mt-1 text-red-500" />
          <span>**{doc.split('–')[0].trim()}** – {doc.split('–')[1].trim()}</span>
        </li>
      ))}
    </div>
  </section>
);

const PitchServicesContent = () => (
  <section id="pitch-services-content" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Services" title="Our Services" description="Detailed assistance for startups seeking funding." />

    <div className="mb-10 space-y-5">
      {KanakkaalarServices.map((service, i) => {
        const [title, description] = service.split('–').map(s => s.trim());
        const Icon = i === 0 ? FileText : i === 1 ? Users : Handshake;
        return (
          <div key={i} className="p-5 border border-blue-200 shadow-sm bg-blue-50 rounded-xl">
            <div className="flex items-center gap-5 mb-2">
              <Icon className="w-6 h-6 text-[#022B50] flex-shrink-0" />
              <h4 className="text-xl font-bold text-gray-800">{title}</h4>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        );
      })}
    </div>

    <h4 className="mb-6 text-2xl font-bold text-gray-800">Attract Investors, Secure Funding, and Grow Your Startup</h4>
    <ol className="pl-4 space-y-5 list-none border-l-2 border-gray-400">
      {deckCreationSteps.map((step, i) => (
        <li key={i} className="flex items-start gap-5">
          <div className="flex items-center justify-center flex-shrink-0 text-sm font-bold text-white bg-gray-700 rounded-full w-7 h-7">
            {i + 1}
          </div>
          <span className="text-gray-700 text-md">{step}</span>
        </li>
      ))}
    </ol>
  </section>
);

const PitchWhyKanakkaalar = () => (
  <section id="pitch-why-kanakkaalar" className="py-12 scroll-mt-24">
    <SectionHeading subtitle="Expertise" title="Why Kanakkaalar?" description="Strategically sound, financially viable, and legally compliant pitch decks." />

    <div className="grid gap-10 sm:grid-cols-2">
      {whyKanakkaalar.map((reason, i) => {
        const [title, description] = reason.split(':').map(s => s.trim());
        const Icon = i % 4 === 0 ? CheckCircle : i % 4 === 1 ? Scale : i % 4 === 2 ? Users : TrendingUp;
        return (
          <div key={i} className="flex items-start gap-5 p-5 border border-indigo-200 shadow-sm bg-indigo-50 rounded-xl">
            <Icon className="w-6 h-6 text-[#022B50] mt-1 flex-shrink-0" />
            <div>
              <h4 className="mb-1 text-lg font-bold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

const PitchFAQsContent = ({ faqs, faqOpen, setFaqOpen }) => (
  <section id="pitch-faqs-content" className="max-w-5xl py-12 mx-auto scroll-mt-24">
    <SectionHeading subtitle="FAQ" title="Pitch Guide" description="Frequently Asked Questions about Pitch Decks." />

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
export default function PitchDeck() {
  const [activeTab, setActiveTab] = useState(pitchDeckTabs[0].id);
  const [faqOpen, setFaqOpen] = useState(null);

  const SCROLL_OFFSET = 120;

  // --- SCROLLSPY IMPLEMENTATION ---
  useEffect(() => {
    const sectionIds = pitchDeckTabs.map(tab => tab.id);

    const handleScroll = () => {
      let currentActiveTab = sectionIds[0];

      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i];
        const section = document.getElementById(sectionId);

        if (section) {
          const rect = section.getBoundingClientRect();
          // Logic to check if the section's top edge is above or at the SCROLL_OFFSET line
          if (rect.top <= SCROLL_OFFSET) {
            currentActiveTab = sectionId;
          }
        }
      }

      // Check if the currentActiveTab is the last section and if we're scrolled to the bottom
      const isScrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5; // -5 for tolerance
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
            alt="Pitch Deck Background"
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
                      Pitch<br />Deck<br />Services
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                    <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                  Investment Pitch Deck <br className="hidden lg:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">For Business</span>
                </h1>

                <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                  Get a compelling pitch deck backed by expert market research. First draft in 20 days. 2 Free Revisions.
                </p>
<StartNowButton />
              </div>

              <div className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium pt-2">
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                  <span>Verified Experts</span>
                </div>
                <div className="flex items-center gap-5.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-[#C59B4E]" />
                  <span>100% Confidential</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-4 md:p-8">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Get Your Pitch Deck</h2>
                    <p className="text-slate-500 text-sm md:text-sm px-2 leading-relaxed">
                      Enter details to start your investor journey!
                    </p>
                  </div>
                  <LeadForm serviceName="Investment Pitch Deck" btnText="Get Started" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* === Sticky Navigation === */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white transition-all duration-300 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-start md:justify-center gap-10 md:gap-10 overflow-x-auto no-scrollbar py-0 list-none">
            {pitchDeckTabs.map((tab) => (
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

      {/* === All Tab Content Sections === */}
      <div className="w-full px-4 py-12 md:py-12 md:py-16">
        <div className="mx-auto max-w-7xl space-y-16">
          <PitchOverviewContent />
          <PitchAdvantagesContent />
          <PitchContainContent />
          <PitchProcessContent />
          <PitchServicesContent />
          <PitchWhyKanakkaalar />
          <PitchFAQsContent faqs={pitchDeckFAQs} faqOpen={faqOpen} setFaqOpen={setFaqOpen} />
        </div>
      </div>

    </div>
  );
}