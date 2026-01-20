import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
chevronDown,
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
    Search,
    Scale,
    Gavel,
    BookOpen,
    Target
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- IP EXPERT CONSULTATION FULL DATA ---

const tabs = [
    { id: 'expertise-content', label: 'Expertise' },
    { id: 'benefits-content', label: 'Benefits' },
    { id: 'why-content', label: 'Why Bizzfiling' },
    { id: 'faqs-content', label: 'FAQs' },
];

const ipExpertiseList = [
    "Trademark Registration", "Copyright Services", "Patent Filing",
    "IP Infringement", "IP Litigation Support", "Licensing & Franchising",
    "Design Registration", "Geographical Indication", "IP Audit & Valuation",
    "Trade Secret Protection", "IP Management Strategy", "International IP Filing",
    "IP Search & Analysis", "Domain Name Disputes", "Customs Registration for IP"
];

const ipBenefits = [
    { title: "Brand Protection", description: "Prevent competitors from using your unique brand name, logo, or slogans.", icon: Shield },
    { title: "Asset Value", description: "Intellectual property is a valuable intangible asset that increases business valuation.", icon: DollarSign },
    { title: "Legal Recourse", description: "Gives you the legal standing to sue infringers and claim damages for unauthorized use.", icon: Gavel },
    { title: "Market Confidence", description: "Registered IP provides confidence to investors and consumers about your brand's authenticity.", icon: Target },
    { title: "Revenue Generation", description: "Monetize your IP through licensing, franchising, or selling rights to third parties.", icon: Zap },
];

const ipFAQs = [
    { q: "What is the difference between Trademark and Copyright?", a: "Trademarks protect brand names/logos; Copyrights protect creative works like literature, music, and software." },
    { q: "How long does it take to register a trademark in India?", a: "The initial filing takes 24 hours (allowing you to use the TM symbol); final registration typically takes 6-12 months." },
    { q: "Can I protect my business idea?", a: "Ideas themselves cannot be protected, but the expression of the idea (Copyright) or the technical invention (Patent) can be." },
    { q: "Does an Indian trademark protect me globally?", a: "No, trademarks are territorial. You need to file in each country or use the Madrid Protocol for international protection." },
    { q: "What should I do if someone uses my brand name?", a: "You should immediately consult an IP expert to issue a Cease and Desist notice and evaluate further legal action." },
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
            <SectionHeading subtitle="IP Expertise" title="Trademark, Patent & Copyright" description="Securing your innovations and brand identity in a competitive world." />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {ipExpertiseList.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-[#C59B4E] transition-all">
                        <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-[#1A7F7D] shadow-sm group-hover:bg-[#1A7F7D] group-hover:text-white transition-all"><Check size={12} /></div>
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-tight">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-12 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Protection" title="Benefits of IP Consultation" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {ipBenefits.map((benefit, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white hover:shadow-xl transition-all text-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-[#1A7F7D] mb-4 mx-auto shadow-inner"><benefit.icon size={18} /></div>
                        <h4 className="text-xs font-bold text-[#0F2D30] mb-2">{benefit.title}</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">{benefit.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const WhyBizzfilingContent = () => (
    <section id="why-content" className="py-14 bg-[#0F2D30] text-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Trust" title="Why IP Experts at Bizzfiling?" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="p-7 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center">
                    <Shield className="text-[#C59B4E] mb-4" size={32} />
                    <h4 className="text-lg font-bold mb-2">Legal Security</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Highly experienced trademark and patent attorneys with a 99% success rate in renewals and filings.</p>
                </div>
                <div className="p-7 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center">
                    <Award className="text-[#C59B4E] mb-4" size={32} />
                    <h4 className="text-lg font-bold mb-2">Comprehensive Search</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Deep-dive public search across Indian and International databases to ensure your IP is unique.</p>
                </div>
                <div className="p-7 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center">
                    <BookOpen className="text-[#C59B4E] mb-4" size={32} />
                    <h4 className="text-lg font-bold mb-2">End-to-End Support</h4>
                    <p className="text-slate-400 text-[11px] leading-relaxed">From initial search to filing objections and hearings, we handle the entire IP lifecycle.</p>
                </div>
            </div>
        </div>
    </section>
);

// --- MAIN COMPONENT ---
export default function TalkToIP() {
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
                    <img src={BackgroundImageSrc} alt="IP Expert Consultation" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-3/5 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Shield size={12} className="text-[#C59B4E]" />
                                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Intellectual Property Protection</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight">
                                Talk to an <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">IP Expert</span>
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                                Secure your startup's future. From Trademark search to Patent filing, consult with India's best IP attorneys to protect and monetize your innovations.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                                    <Award size={14} className="text-[#C59B4E]" /> 10k+ Trademarks
                                </div>
                                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                                    <Globe size={14} className="text-[#C59B4E]" /> Global Coverage
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-slate-800 text-center mb-4">Book IP Session</h3>
                                    <LeadForm serviceName="Talk to an IP Expert" btnText="Schedule Session" />
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
                <BenefitsContent />
                <WhyBizzfilingContent />

                {/* FAQ - Compact */}
                <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
                    <div className="max-w-2xl mx-auto px-4">
                        <SectionHeading subtitle="FAQ" title="IP Queries" />
                        <div className="mt-8">
                            {ipFAQs.map((f, i) => (
                                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Icon fallbacks
const Target = ({ size }) => <div className="w-4 h-4 bg-slate-200 rounded-full" style={{ width: size, height: size }} />;