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
    Search,
    Scale
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- INTERNATIONAL TRADEMARK FULL DATA ---

const tabs = [
    { id: 'overview-content', label: 'Overview' },
    { id: 'benefits-content', label: 'Benefits' },
    { id: 'methods-content', label: 'Filing Methods' },
    { id: 'process-content', label: 'Process' },
    { id: 'documents-content', label: 'Documents' },
    { id: 'faqs-content', label: 'FAQs' },
];

const trademarkBenefits = [
    { title: "Global Protection", description: "Secure your brand identity in multiple countries, preventing unauthorized use by competitors worldwide.", icon: Globe },
    { title: "Asset Value", description: "An international trademark increases the commercial value of your business and attracts global investors.", icon: DollarSign },
    { title: "Legal Rights", description: "Gain the exclusive right to use your brand in designated territories and take legal action against infringers.", icon: Scale },
    { title: "Market Entry", description: "Smooth entry into new markets with the confidence that your brand is already protected.", icon: Zap },
    { title: "Prevent Counterfeiting", description: "Stop the import of counterfeit goods through customs cooperation in member countries.", icon: Shield }
];

const filingMethods = [
    {
        type: "Madrid Protocol",
        description: "A cost-effective system for filing a single application to protect your trademark in up to 130 countries.",
        key_points: ["One Application", "One Language", "Lower Fees"],
    },
    {
        type: "Direct Filing",
        description: "Filing individual applications directly with the trademark office of each specific country of interest.",
        key_points: ["Specific Countries", "Local Attorneys", "Tailored Strategy"],
    },
    {
        type: "Regional Filing",
        description: "Filing one application for a specific geographic region, such as the EUIPO (European Union Intellectual Property Office).",
        key_points: ["Multi-country block", "Uniform protection", "E.g., EU, OAPI"],
    },
];

const trademarkProcess = [
    { title: "Strategy", desc: "Consulting with IP experts to determine which countries and filing methods are best for your business." },
    { title: "Search", desc: "Conducting a comprehensive international trademark search to identify potential conflicts." },
    { title: "Application", desc: "Drafting and filing the application via the Madrid Protocol or direct national routes." },
    { title: "Examination", desc: "The trademark offices of the designated countries examine the application for compliance." },
    { title: "Publication", desc: "The trademark is published in official journals to allow for any third-party oppositions." },
    { title: "Registration", desc: "Once passed, the Certificate of International Registration is issued by WIPO or national offices." },
];

const trademarkDocuments = [
    "Copy of the Base Trademark (The Indian trademark application or registration).",
    "Clear image of the Trademark/Logo.",
    "List of Goods and Services (International Classes).",
    "Power of Attorney (Drafted by Bizzfiling).",
    "Applicant details (Individual or Corporate).",
];

const trademarkFAQs = [
    { q: "What is the Madrid Protocol?", a: "The Madrid System is a convenient and cost-effective solution for registering and managing trademarks worldwide." },
    { q: "Do I need an Indian trademark first?", a: "Yes, for a Madrid application, you must have a 'basic' application or registration in your home country (India)." },
    { q: "How long does international trademarking take?", a: "The process typically takes 12 to 18 months, depending on the response from designated countries." },
    { q: "How long is a trademark valid?", a: "International trademarks are generally valid for 10 years and can be renewed indefinitely." },
    { q: "What happens if someone opposes my trademark?", a: "Bizzfiling's legal team helps you respond to objections and opposition notices from international registries." },
];

// --- Reusable Components (Compact & Premium) ---

const SectionHeading = ({ subtitle, title, description, align = "center" }) => (
    <div className={`mb-8 ${align === "center" ? "text-center" : "text-left"}`}>
        <span className="inline-block py-1 px-3 rounded-full bg-[#E0F2F1] text-[#00695C] font-bold text-[10px] uppercase tracking-widest mb-2 border border-[#B2DFDB]">
            {subtitle}
        </span>
        <h3 className="mb-2 text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            {title}
        </h3>
        <p className="text-slate-500 text-[11px] max-w-2xl leading-relaxed mx-auto">
            {description}
        </p>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-2
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/30'}
  `}>
        <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
            <h3 className={`text-xs font-semibold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
            </div>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden`}>
            <p className={`px-4 pb-4 text-[10px] leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
        </div>
    </div>
);

// --- Sections ---

const OverviewContent = () => (
    <section id="overview-content" className="py-12 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Overview" title="International Trademark" description="Protect your brand on a global scale. Secure your intellectual property across 130+ countries." />
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <p className="text-slate-600 leading-relaxed text-xs">
                        Your brand name and logo are your most valuable assets. Don't let others profit from your hard work. Bizzfiling's IP attorneys manage the entire international filing process, from search to registration, via the Madrid Protocol or direct filing.
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100"><CheckCircle size={12} /> Madrid Protocol</div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"><Search size={12} /> Worldwide Search</div>
                    </div>
                </div>
                <div className="p-6 bg-[#0F2D30] rounded-2xl text-center text-white border-t-2 border-[#C59B4E]">
                    <h5 className="text-2xl font-bold mb-1">130+</h5>
                    <p className="text-[10px] text-[#C59B4E] uppercase tracking-widest font-bold">Countries Covered</p>
                </div>
            </div>
        </div>
    </section>
);

const BenefitsContent = () => (
    <section id="benefits-content" className="py-12 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Protection" title="Why Trademark Globally?" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trademarkBenefits.map((adv, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all group hover:border-[#C59B4E]">
                        <div className="w-10 h-10 bg-[#F0FDFA] rounded-full flex items-center justify-center mb-4 text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white transition-all shadow-inner">
                            <adv.icon size={18} />
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mb-2">{adv.title}</h4>
                        <p className="text-slate-500 text-[10px] leading-relaxed">{adv.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const MethodsContent = () => (
    <section id="methods-content" className="py-12 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Methods" title="Filing Pathways" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filingMethods.map((method, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all border-t-2 border-t-[#C59B4E]">
                        <h4 className="text-lg font-bold text-[#0F2D30] mb-2">{method.type}</h4>
                        <p className="text-slate-600 text-[10px] leading-relaxed mb-4">{method.description}</p>
                        <div className="space-y-2">
                            {method.key_points.map((point, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                                    <CheckCircle size={12} className="text-green-500" />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const ProcessContent = () => (
    <section id="process-content" className="py-12 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Timeline" title="Registration Journey" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-8">
                {trademarkProcess.map((step, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all flex flex-col items-center text-center">
                        <div className="w-8 h-8 mb-3 bg-[#0F2D30] text-[#C59B4E] rounded-full flex items-center justify-center font-bold text-xs shadow-md">
                            {i + 1}
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 mb-1 leading-tight">{step.title}</h4>
                        <p className="text-slate-500 text-[9px] leading-tight">{step.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="documents-content" className="py-12 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="w-full lg:w-1/2">
                    <SectionHeading subtitle="Checklist" title="IP Requirements" align="left" />
                    <div className="grid sm:grid-cols-1 gap-2">
                        {trademarkDocuments.map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <FileText size={12} className="text-[#1A7F7D] flex-shrink-0" />
                                <p className="text-slate-700 font-bold text-[10px]">{doc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 bg-[#0F2D30] p-8 rounded-3xl text-white relative flex flex-col items-center text-center">
                    <Shield size={48} className="text-[#C59B4E] mb-4" />
                    <h3 className="text-xl font-bold mb-2">Basic TM Mandatory</h3>
                    <p className="text-slate-300 mb-6 text-xs leading-relaxed max-w-sm">To file via the Madrid Protocol, you must already have a filed or registered trademark in your base country (e.g., India). Don't have one yet? We can help you file both simultaneously.</p>
                    <button className="w-full max-w-xs bg-[#C59B4E] text-[#0F2D30] px-6 py-3 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">Start Indian Filing</button>
                </div>
            </div>
        </div>
    </section>
);

// --- MAIN COMPONENT ---
export default function InternationalTrademarkPage() {
    const [activeTab, setActiveTab] = useState('overview-content');
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
            <section className="relative w-full min-h-[450px] flex items-center pt-32 pb-12 lg:pt-36 lg:pb-16 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="International Trademark" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="w-full lg:w-3/5 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1A7F7D]/20 backdrop-blur rounded-full border border-[#1A7F7D]/30">
                                <Shield size={12} className="text-[#C59B4E]" />
                                <span className="text-white text-[9px] uppercase font-bold tracking-[0.2em]">Global IP Protection</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                International <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Trademark Registration</span>
                            </h1>
                            <p className="text-xs md:text-sm text-slate-300 max-w-lg font-light leading-relaxed">
                                Protect your brand in 130+ countries. Filing made easy via the Madrid Protocol. Secure your logo, name, and slogans globally with Bizzfiling's IP experts.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                                    <CheckCircle size={14} className="text-[#C59B4E]" /> Madrid Protocol
                                </div>
                                <div className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                                    <Shield size={14} className="text-[#C59B4E]" /> Certified IP Lawyers
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Secure Your Brand</h3>
                                    <LeadForm serviceName="International Trademark Registration" btnText="Check Available TM" />
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
                <OverviewContent />
                <BenefitsContent />
                <MethodsContent />
                <ProcessContent />
                <DocumentsContent />

                {/* FAQ - Compact */}
                <section id="faqs-content" className="py-16 bg-white scroll-mt-24">
                    <div className="max-w-2xl mx-auto px-4">
                        <SectionHeading subtitle="FAQ" title="Global IP Queries" />
                        <div className="mt-8">
                            {trademarkFAQs.map((f, i) => (
                                <FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}