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
  Users,
  DollarSign,
  Clock,
  Landmark,
  MapPin,
  Globe,
  AlertTriangle,
  Lightbulb,
  Award,
  Search,
  Timer,
  FilePenLine,
  Rocket,
  UserCheck,
  GlassWater
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- LIQUOR LICENSE STATIC DATA DEFINITIONS ---

const tabs = [
  { id: 'liquor-overview-content', label: 'Overview' },
  { id: 'liquor-types-content', label: 'License Types' },
  { id: 'liquor-need-content', label: 'Need' },
  { id: 'liquor-documents-content', label: 'Documents' },
  { id: 'liquor-validity-renewal', label: 'Validity' },
  { id: 'liquor-why-Bizzfiling', label: 'Why Us' },
  { id: 'liquor-faqs-content', label: 'FAQs' },
];

const liquorIntroBullets = [
  "Expert legal guidance to apply for your liquor license quickly and legally compliant.",
  "Apply for bar, restaurant, retail, or distribution licenses with end-to-end support.",
  "Operate legally with official State Excise Department permission to serve alcohol.",
];

const liquorTypes = [
  { title: "Retail Outlet", detail: "Selling pre-packaged beverages for off-site consumption (Liquor Stores).", icon: Briefcase },
  { title: "Hotel & Restaurant", detail: "Serving on-premises alcohol in bars, pubs, and luxury dining hubs.", icon: TrendingUp },
  { title: "Club Access", detail: "Social and recreational clubs dispensing exclusively to registered members.", icon: Users },
  { title: "Temporary Event", detail: "Short-term permits for festivals, weddings, or corporate exhibitions.", icon: Clock },
  { title: "Wholesale Hub", detail: "Distributors procuring from manufacturers and supplying retail sectors.", icon: Handshake },
  { title: "Import/Export", detail: "Mandatory for enterprises trading alcoholic beverages across state borders.", icon: Globe },
];

const liquorDocs = [
  { title: "ID & Address", detail: "KYC records of the applicant or authorized signatory.", icon: Users },
  { title: "Premise Deed", detail: "Valid rent agreement or ownership proof of the location.", icon: MapPin },
  { title: "Fire Safety NOC", detail: "Department certificate confirming compliance with fire norms.", icon: Zap },
  { title: "Municipal NOC", detail: "Local body clearance for alcohol service at the premise.", icon: Landmark },
  { title: "Entity Papers", detail: "MOA, AOA, and List of Directors for corporate entities.", icon: FileText },
  { title: "Criminal Affidavit", detail: "Legal declaration of no past criminal record or defaults.", icon: AlertTriangle },
];

const liquorNeed = [
  { title: "State Monopoly", icon: Landmark, detail: "Alcohol is a State Subject (Schedule VII), making state licenses void otherwise." },
  { title: "Public Order", icon: Scale, detail: "Strict monitoring of sales to ensure social harmony and controlled consumption." },
  { title: "Penalty Shield", icon: AlertTriangle, detail: "Avoid severe imprisonment and massive fines for illegal vending or possesssion." },
  { title: "Revenue Audit", icon: DollarSign, detail: "Ensuring proper excise duty and tax collection for the state exchequer." },
];

const beverageCategories = [
  { title: "Beer & Wine", detail: "Soft and mild beverages; prohibits hard liquor service." },
  { title: "Restaurant (40%)", detail: "Eateries where alcohol sales cannot exceed 40% of food revenue." },
  { title: "Tavern License", detail: "For businesses deriving substantial profits from alcohol vs food." },
  { title: "Brewpub", detail: "For establishments that brew their own beer and wine onsite." },
];

const complianceNexus = [
  { title: "Annual Renewal", detail: "Licenses are initially valid for one year; renewal is mandatory.", icon: Clock },
  { title: "Dry Day Shield", detail: "Revocation if alcohol is served on designated Dry Days.", icon: AlertTriangle },
  { title: "Minor Regulation", detail: "Severe penalties for serving to minors (age varies by state).", icon: Users },
  { title: "Clean Record", detail: "Continued validity depends on following all excise guidelines.", icon: CheckCircle },
];

const liquorWhyBizzfiling = [
  { title: "State Law Experts", detail: "Navigating complex and varying excise rules across different Indian states.", icon: UserCheck },
  { title: "Portal Specialist", detail: "Precision in filing complex documents to avoid multiple department rejections.", icon: Zap },
  { title: "Timing Registry", detail: "Managing Fire and Municipal NOC timelines for faster license issuance.", icon: Timer },
  { title: "Renewal Reminders", detail: "Timely alerts to ensure your license never expires and stays active.", icon: Clock },
];

const liquorFAQs = [
  { q: "Can I sell without a license?", a: "No. Selling or serving alcohol without an excise permit is a criminal offense." },
  { q: "What is the age limit?", a: "Generally 21+ to apply, but consumption ages vary (21 or 25) depending on the state." },
  { q: "How long does it take?", a: "Timeline varies by state; can be a few weeks for temporary or months for permanent ones." },
  { q: "What is a Dry Day?", a: "Specific days (holidays/elections) when alcohol sale and service is strictly prohibited by law." },
  { q: "Does the location matter?", a: "Yes, licenses are usually not granted near schools, temples, or residential buffer zones." },
];

// --- Design Components ---

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

// --- Sub-sections ---

const OverviewContent = () => (
  <section id="liquor-overview-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Legalization" title="Excise Department Permit" description="Ensuring hospitality and retail adherence to strict Beverage and Liquor laws." />
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-slate-600 leading-relaxed italic">
          <p>
            Securing a liquor license is a critical stride towards presenting clientele with an extensive array of selections in hospitality, entertainment, or retail sectors.
          </p>
          <p>
            The scope encompasses production, import, export, transportation, and acquisition as stipulated by varying state legislations across India.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">EXCISE COMPLIANT</span>
            <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm uppercase italic">STATE CONTROLLED</span>
          </div>
        </div>
        <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl">
          <GlassWater className="absolute -top-6 -right-6 w-32 h-32 text-[#C59B4E]/10 group-hover:rotate-12 transition-all" />
          <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Usage Classification</h4>
          <div className="grid grid-cols-2 gap-4">
            {beverageCategories.map((c, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h6 className="text-[10px] font-bold text-[#C59B4E] uppercase mb-1">{c.title}</h6>
                <p className="text-[9px] text-slate-400 leading-tight italic">{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const TypesContent = () => (
  <section id="liquor-types-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Portfolio" title="Types of Excise Licenses" description="Segmented permits regulating retail stores, hotel pubs and event bars." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {liquorTypes.map((type, i) => (
          <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] flex flex-col items-center hover:bg-white hover:shadow-xl transition-all h-full">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-6 shrink-0"><type.icon size={32} /></div>
            <h6 className="font-bold text-slate-800 text-sm mb-2 uppercase italic tracking-tighter">{type.title}</h6>
            <p className="text-[11px] text-slate-500 italic leading-relaxed">{type.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NeedContent = () => (
  <section id="liquor-need-content" className="py-16 bg-slate-50/50 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4">
      <SectionHeading subtitle="Necessity" title="Why Obtain an Excise Permit?" description="Rooted in Article 47 of the Indian Constitution for rigorous monitoring of alcohol sales." />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {liquorNeed.map((item, i) => (
          <div key={i} className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
            <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
            <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.title}</h6>
            <p className="text-xs text-slate-500 leading-relaxed italic">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DocumentsContent = () => (
  <section id="liquor-documents-content" className="py-16 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <SectionHeading subtitle="Archive" title="Documents & Clearances" description="Mandatory NOCs from Fire and Municipal bodies required for premises." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liquorDocs.map((doc, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4 items-center shadow-sm text-left">
            <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
            <div>
              <h6 className="font-bold text-slate-800 text-xs italic uppercase mb-1 tracking-tight">{doc.title}</h6>
              <p className="text-[10px] text-slate-400 italic font-medium">{doc.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ValidityContent = () => (
  <section id="liquor-validity-renewal" className="py-24 bg-slate-900 scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionHeading subtitle="Integrity" title="Validity & Strict Compliance" description="Annual renewal and severe revocation grounds for non-compliance." />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex gap-6 group hover:border-[#C59B4E]/50 transition-all">
            <Clock size={48} className="text-[#C59B4E] shrink-0" />
            <div>
              <h5 className="font-bold text-white text-sm uppercase italic tracking-widest mb-1">1-Year Block</h5>
              <p className="text-xs text-slate-400 leading-relaxed italic">Initially valid for one year; annual renewal requires a fresh application on the State Excise portal.</p>
            </div>
          </div>
          <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex gap-6 group hover:border-red-500/50 transition-all">
            <AlertTriangle size={48} className="text-red-500 shrink-0" />
            <div>
              <h5 className="font-bold text-white text-sm uppercase italic tracking-widest mb-1 text-red-500">Revocation Grounds</h5>
              <p className="text-xs text-slate-400 leading-relaxed italic font-medium">Serving on Dry Days, selling to minors, or violating consumption age zones will lead to immediate license cancellation.</p>
            </div>
          </div>
        </div>
        <div className="p-12 bg-white rounded-[50px] shadow-3xl text-center relative overflow-hidden group">
          <Scale className="w-16 h-16 text-[#1A7F7D] mx-auto mb-6 group-hover:scale-110 transition-transform" />
          <h4 className="text-2xl font-bold text-slate-800 mb-4 tracking-tighter uppercase italic">State Listing Rule</h4>
          <p className="text-[11px] text-slate-500 italic leading-relaxed mb-8 px-6">"Laws vary significantly by state. Some (like Bihar or Gujarat) are strictly DRY STATES where liquor service is a criminal offense."</p>
          <div className="flex justify-center gap-4">
            <span className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-700 uppercase italic border border-slate-100 italic">Age 21-25 Limit</span>
            <span className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-700 uppercase italic border border-slate-100 italic">NOC Mandatory</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const WhyBizzfiling = () => (
  <section id="liquor-why-Bizzfiling" className="py-20 bg-white scroll-mt-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <SectionHeading subtitle="Expertise" title="Excise Strategy Partner" description="Navigating bureaucratic Fire and Municipal clearances with up-to-date state knowledge." align="left" />
          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            {liquorWhyBizzfiling.map((s, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-start gap-4">
                <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                <div>
                  <h6 className="font-bold text-slate-800 text-xs mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                  <p className="text-[10px] text-slate-500 italic leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
          <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
          <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Hospitality Quality Nexus</h4>
          <p className="text-slate-400 text-xs italic mb-8 px-10">"Facilitating Liquor and Excise clearance for India's leading restaurant chains and hotels."</p>
          <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-[11px] hover:bg-[#a37d35] transition-all">Talk to Bizzfiling expert</button>
        </div>
      </div>
    </div>
  </section>
);

// --- Main Component ---

export default function LiquorLicensePage() {
  const [activeTab, setActiveTab] = useState('liquor-overview-content');
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

      {/* Hero */}
      <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 z-0">
          <img src={BackgroundImageSrc} alt="Liquor Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
        </div>
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="w-full lg:w-1/2 flex flex-col items-start space-y-8">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full border-2 border-[#C59B4E] flex flex-col items-center justify-center p-2 text-center">
                  <Star className="fill-[#C59B4E] text-[#C59B4E]" size={12} />
                  <span className="text-[#C59B4E] font-bold text-[10px] text-center leading-tight uppercase mt-1">Liquor <br /> License</span>
                  <span className="text-white text-[8px] uppercase mt-1 opacity-70 italic tracking-widest">Excise Permit</span>
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1] font-serif italic tracking-tighter">
                  Statutory <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4] not-italic uppercase tracking-widest text-4xl md:text-6xl">Beverage Hub</span>
                </h1>
                <div className="space-y-3 pt-2">
                  {liquorIntroBullets.map((bullet, i) => (
                    <div key={i} className="flex gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-[#C59B4E] flex-shrink-0" />
                      <p className="text-sm font-light leading-relaxed italic">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar w-full">
                <div className="flex flex-col shrink-0">
                  <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">FL-3</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Luxury Hub</span>
                </div>
                <div className="h-10 w-[1px] bg-white/20"></div>
                <div className="flex flex-col shrink-0">
                  <span className="text-white text-3xl font-black italic tracking-tighter uppercase underline decoration-[#C59B4E]">On-Tap</span>
                  <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Portal Registry</span>
                </div>
              </div>
            </div>
            <div className="w-full max-w-sm lg:w-[400px]">
              <div className="bg-white rounded-[50px] shadow-3xl p-10 border border-white/5 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C59B4E]/5 rounded-full blur-2xl group-hover:scale-150 transition-all"></div>
                <h2 className="text-2xl font-bold mb-1 text-center text-slate-800 tracking-tighter uppercase italic">License Now</h2>
                <p className="text-[11px] text-slate-400 mb-8 text-center uppercase tracking-widest font-bold">Official Excise Portal Hub</p>
                <LeadForm serviceName="Liquor License" btnText="Apply Now" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="sticky top-20 lg:top-24 z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 md:gap-12 py-0 min-w-max list-none">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`py-5 text-[11px] md:text-sm font-bold border-b-[3px] transition-all uppercase tracking-widest ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-400 border-transparent hover:text-slate-700'}`}
                  onClick={() => handleTabClick(tab.id)}
                >{tab.label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <OverviewContent />
      <TypesContent />
      <NeedContent />
      <DocumentsContent />
      <ValidityContent />
      <WhyBizzfiling />

      <section id="liquor-faqs-content" className="py-24 bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          <SectionHeading subtitle="FAQ" title="Beverage Intelligence" description="Clearing compliance and registry protocols for Excise permits and age limits." />
          <div className="space-y-4 pt-10">
            {liquorFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
          </div>
        </div>
      </section>
    </div>
  );
}