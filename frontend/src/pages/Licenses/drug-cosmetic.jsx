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
    Shield,
    MapPin,
    Globe,
    BookOpen,
    Search,
    Timer,
    FilePenLine,
    Rocket,
    UserCheck,
    Award,
    Lightbulb,
    Activity,
    Factory
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png";

// --- DRUG & COSMETIC LICENSE STATIC DATA DEFINITIONS ---

const tabs = [
    { id: 'dc-overview-content', label: 'Overview' },
    { id: 'dc-drug-types', label: 'Drug License' },
    { id: 'dc-cosmetic-types', label: 'Cosmetic License' },
    { id: 'dc-documents-content', label: 'Documents' },
    { id: 'dc-rules-content', label: 'Governing Rules' },
    { id: 'dc-labelling-content', label: 'Labelling' },
    { id: 'dc-why-Bizzfiling', label: 'Why Us' },
    { id: 'dc-faqs-content', label: 'FAQs' },
];

const dcIntroBullets = [
    "Hassle-free online filing for Drug & Cosmetic licenses with expert CDSCO support.",
    "Comprehensive compliance audit for manufacturing units and retail pharmacies.",
    "Ensure 100% legal clearance to manufacture, distribute, or sell health products.",
];

const drugLicenseTypes = [
    { type: "Retail Drug Hub", detail: "Required for chemists selling directly to end consumers. Mandates a registered pharmacist.", icon: Users },
    { type: "Wholesale Trade", detail: "For bulk distribution to hospitals and retailers. Requires specialized storage facilities.", icon: Briefcase },
    { type: "Manufacturing Line", detail: "For production of Allopathic or Ayurvedic drugs. Issued by State Licensing Authority.", icon: Factory },
    { type: "Global Import", detail: "Required for importing drugs into India. Issued by the Central Authority (CDSCO).", icon: Globe },
    { type: "Loan License", detail: "For brand owners using 3rd party licensed manufacturing premises under their own label.", icon: Handshake },
    { type: "Multi-State Hub", detail: "Mandatory for operators with stock/sale points across multiple Indian states.", icon: MapPin },
];

const manufacturingRules = [
    { title: "GMP Protocols", detail: "Adherence to Good Manufacturing Practices prescribed by the DCGI/CDSCO.", icon: Scale },
    { title: "Technical Staff", detail: "Must employ a graduate in Pharmacy/Chemistry with relevant field experience.", icon: UserCheck },
    { title: "Testing Lab", detail: "Separate in-house arrangements for testing drug strength, quality, and purity.", icon: Activity },
    { title: "Site Logic", detail: "Adequate space with plant machinery and specific site plan approvals.", icon: MapPin },
];

const cosmeticRequirements = [
    { title: "Stability Proof", detail: "Lab reports demonstrating product shelf life and chemical stability.", icon: Clock },
    { title: "Ingredient Ledger", detail: "Comprehensive list of compositions used in the formulation.", icon: FileText },
    { title: "Brand Custody", detail: "Trademark registration or application proof for the cosmetic label.", icon: Award },
    { title: "Premises Proof", detail: "Ownership or lease of the unit where cosmetics are manufactured.", icon: Landmark },
];

const commonDocs = [
    { title: "Entity Charter", detail: "MOA, AOA, or Partnership Deeds defining the firm's constitution.", icon: Briefcase },
    { title: "Personnel KYC", detail: "Identity proof and certificates of Directors and Technical staff.", icon: Users },
    { title: "Site Blueprint", detail: "Architectural site plan and utility proofs of the premises.", icon: MapPin },
    { title: "Formulations", detail: "Complete list of product compositions and analysis methods.", icon: FileText },
    { title: "BIS Standards", detail: "Bureau of Indian Standards certifications where applicable.", icon: Scale },
    { title: "Non-Conviction", detail: "Sworn affidavit of clean regulatory record for lead partners.", icon: Shield },
];

const governingRules = [
    { title: "D&C Rules 1945", detail: "Primary regulation for import, sale, and storage of pharmaceuticals.", icon: BookOpen },
    { title: "Medical Devices 2017", detail: "Standards for manufacturing and quality of healthcare equipment.", icon: BookOpen },
    { title: "Cosmetics Rules 2020", detail: "Latest norms for cosmetic registration and safety labelling.", icon: BookOpen },
    { title: "DPCO 2013", detail: "Drugs (Prices Control) Order for mandatory MRP disclosures.", icon: BookOpen },
];

const labellingNorms = [
    "Registration certificate number for all imported cosmetics.",
    "Full name and address of manufacturer and importer.",
    "Clear nomenclature of the cosmetic product.",
    "Manufacturing and Expiry dates (Month/Year).",
    "Ingredient list in descending order of weight.",
    "Cautionary warnings and directions for usage.",
];

const whyBizzfiling = [
    { title: "Form Precision", detail: "Handling Form 19, 20, and COS-5 with zero clerical errors.", icon: Zap },
    { title: "Inspection Ready", detail: "Mock audits to ensure premises meet Drug Inspector requirements.", icon: Search },
    { title: "Tech Staff Check", detail: "Verifying pharmacist/chemist credentials ahead of submission.", icon: UserCheck },
    { title: "Price/Label Sync", detail: "Ensuring DPCO 2013 and 2020 labelling norms are met for labels.", icon: Scale },
];

const dcFAQs = [
    { q: "What is Form 44?", a: "Used to apply for a license to manufacture new drugs or investigational drugs." },
    { q: "Who issues the license?", a: "Usually the State Licensing Authority for manufacturing/retail and CDSCO for imports." },
    { q: "Is a pharmacist mandatory for retail?", a: "Yes, a registered pharmacist must be present for any retail drug sale." },
    { q: "What is a Loan License?", a: "When a brand uses another's manufacturing facility to make its products." },
    { q: "How long does approval take?", a: "Usually 30-60 days depending on the state authority and site inspection." },
];

// --- Design Components ---

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
            <p className={`px-4 pb-4 text-sm leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>
                {faq.a}
            </p>
        </div>
    </div>
);

// --- Sub-sections ---

const OverviewContent = () => (
    <section id="dc-overview-content" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Regulation" title="CDSCO Healthcare Nexus" description="The Central Drugs Standard Control Organisation oversees the D&C Act 1940." />
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-8 text-slate-600 leading-relaxed italic">
                    <p>
                        Overseen by the <strong>Drugs Controller General of India (DCGI)</strong>, this licensing system regulates the import, manufacture, and distribution of healthcare goods.
                    </p>
                    <p>
                        It is mandatory to ensure all products meet required safety standards, protecting public health while facilitating legitimate pharmaceutical trade across Indian soil.
                    </p>
                    <div className="flex flex-wrap gap-5 pt-2">
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">DCGI COMPLIANT</span>
                        <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm uppercase italic">SCHEDULE M HUB</span>
                    </div>
                </div>
                <div className="bg-[#103B3E] p-10 rounded-[50px] text-white relative group overflow-hidden shadow-2xl text-center">
                    <Activity className="w-16 h-16 text-[#C59B4E] mx-auto mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-xl font-bold mb-4 italic uppercase tracking-tighter text-[#C59B4E]">Public Safety Guard</h4>
                    <p className="text-sm text-slate-400 italic mb-6 leading-relaxed">Preventing substandard products from reaching consumers through rigorous site inspections and lab validations.</p>
                    <div className="flex justify-center gap-5 text-white">
                        <div className="flex items-center gap-1"><CheckCircle size={10} className="text-[#C59B4E]" /><span className="text-[8px] font-bold uppercase italic">RETAIL</span></div>
                        <div className="flex items-center gap-1"><CheckCircle size={10} className="text-[#C59B4E]" /><span className="text-[8px] font-bold uppercase italic">WHOLESALE</span></div>
                        <div className="flex items-center gap-1"><CheckCircle size={10} className="text-[#C59B4E]" /><span className="text-[8px] font-bold uppercase italic">EXPORT</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const DrugTypesContent = () => (
    <section id="dc-drug-types" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Tiers" title="Drug License Categories" description="Classification based on business activity and nature of pharmacuticals." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {drugLicenseTypes.map((item, i) => (
                    <div key={i} className="group p-8 bg-slate-50 border border-slate-100 rounded-[32px] hover:border-[#1A7F7D]/30 transition-all shadow-sm">
                        <item.icon className="w-10 h-10 text-[#C19A5B] mb-6 group-hover:scale-110 transition-transform" />
                        <h6 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-tighter italic">{item.type}</h6>
                        <p className="text-sm text-slate-500 leading-relaxed italic font-medium">{item.detail}</p>
                    </div>
                ))}
            </div>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {manufacturingRules.map((rule, i) => (
                    <div key={i} className="p-8 bg-[#F8FAFC] border border-slate-200 rounded-[24px] shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-[#1A7F7D] flex items-center justify-center mb-4"><rule.icon size={24} /></div>
                        <h6 className="font-bold text-slate-800 text-sm italic uppercase mb-2">{rule.title}</h6>
                        <p className="text-sm text-slate-500 italic font-medium">{rule.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CosmeticTypesContent = () => (
    <section id="dc-cosmetic-types" className="py-12 md:py-16 bg-slate-50/50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4">
            <SectionHeading subtitle="Beauty Care" title="Cosmetic Registry Hub" description="Mandatory standards for manufacturing and importing skincare/beauty products." />
            <div className="grid md:grid-cols-2 gap-10">
                {cosmeticRequirements.map((req, i) => (
                    <div key={i} className="flex gap-10 items-start p-8 bg-white border border-slate-100 rounded-[40px] hover:shadow-xl transition-all">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl text-[#1A7F7D] flex items-center justify-center shrink-0 shadow-sm"><req.icon size={28} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm italic uppercase mb-2 tracking-widest">{req.title}</h6>
                            <p className="text-sm text-slate-500 italic leading-relaxed">{req.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const DocumentsContent = () => (
    <section id="dc-documents-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <SectionHeading subtitle="Archive" title="Consolidated Registry Proofs" description="Legal, premises, and technical documentation required for portal filing." />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
                {commonDocs.map((doc, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex gap-5 items-center shadow-sm">
                        <div className="w-10 h-10 bg-white text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><doc.icon size={20} /></div>
                        <div>
                            <h6 className="font-bold text-slate-800 text-sm italic uppercase mb-1 tracking-tight">{doc.title}</h6>
                            <p className="text-sm text-slate-400 italic font-medium">{doc.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const RulesContent = () => (
    <section id="dc-rules-content" className="py-16 md:py-20 bg-slate-900 scroll-mt-24 text-center">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Statutes" title="Governing Framework" description="Legal rules defining standard operating procedures for various categories." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-16">
                {governingRules.map((rule, idx) => (
                    <div key={idx} className="relative p-10 bg-white/5 border border-white/10 rounded-[48px] overflow-hidden group hover:bg-[#C59B4E] transition-all">
                        <div className="w-12 h-12 bg-white/10 text-[#C59B4E] rounded-full flex items-center justify-center mx-auto mb-8 font-bold group-hover:bg-white group-hover:text-amber-900 transition-colors">
                            <rule.icon size={24} />
                        </div>
                        <h5 className="text-white font-bold text-sm uppercase italic mb-4">{rule.title}</h5>
                        <p className="text-sm text-slate-400 leading-relaxed font-bold italic uppercase tracking-tighter group-hover:text-amber-900">{rule.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const LabellingContent = () => (
    <section id="dc-labelling-content" className="py-12 md:py-16 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <SectionHeading subtitle="Protocols" title="Label Integrity norms" description="Mandatory disclosures for all imported and local pharmaceutical goods." />
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-8">
                    {labellingNorms.map((e, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 bg-slate-50 rounded-[28px] italic border border-slate-100 italic">
                            <CheckCircle size={16} className="text-[#C19A5B] shrink-0" />
                            <span className="text-sm font-bold text-slate-600 tracking-tight leading-relaxed">{e}</span>
                        </div>
                    ))}
                </div>
                <div className="p-12 bg-[#103B3E] rounded-[60px] text-white flex flex-col items-center text-center shadow-3xl">
                    <Search size={48} className="text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-xl font-bold uppercase italic tracking-tighter text-[#C59B4E] mb-4">Inspection Audit</h4>
                    <p className="text-sm text-slate-400 italic font-medium leading-relaxed mb-6 italic">We provide a comprehensive checklist for store layout, refrigerator calibration, and record-keeping to clear Drug Inspector visits on the first attempt.</p>
                    <button className="px-8 py-4 border-2 border-[#C59B4E] text-[#C59B4E] rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#C59B4E] hover:text-white transition-all">Prepare for visit</button>
                </div>
            </div>
        </div>
    </section>
);

const WhyUsContent = () => (
    <section id="dc-why-Bizzfiling" className="py-12 md:py-16 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                    <SectionHeading subtitle="Strategy" title="Healthcare compliance Specialist" description="Simplifying intricate CDSCO/DCGI procedures through legal precision." align="left" />
                    <div className="grid sm:grid-cols-2 gap-10 pt-4">
                        {whyBizzfiling.map((s, i) => (
                            <div key={i} className="p-8 bg-white rounded-[32px] border border-slate-100 flex flex-col items-start gap-5 shadow-sm">
                                <div className="w-10 h-10 bg-[#1A7F7D]/5 text-[#1A7F7D] rounded-xl flex items-center justify-center shrink-0 shadow-sm"><s.icon size={20} /></div>
                                <div>
                                    <h6 className="font-bold text-slate-800 text-sm mb-1 uppercase italic tracking-tighter">{s.title}</h6>
                                    <p className="text-sm text-slate-500 italic leading-relaxed font-bold">{s.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="order-1 lg:order-2 bg-[#103B3E] p-12 rounded-[50px] shadow-3xl text-white flex flex-col items-center text-center">
                    <Award className="w-20 h-20 text-[#C59B4E] mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold font-serif italic mb-4 uppercase tracking-tighter leading-tight italic decoration-[#C59B4E] underline underline-offset-8 decoration-4">Statutory Safety Nexus</h4>
                    <p className="text-slate-400 text-sm italic mb-8 px-10 italic">"Facilitating Drug & Cosmetic Act compliance for India's leading pharmaceutical hubs."</p>
                    <button className="px-10 py-5 bg-[#C59B4E] text-white rounded-full font-extrabold uppercase tracking-widest text-sm hover:bg-[#a37d35] transition-all italic">Talk to Bizzfiling expert</button>
                </div>
            </div>
        </div>
    </section>
);

// --- Main Component ---

export default function DrugCosmeticLicensePage() {
    const [activeTab, setActiveTab] = useState('dc-overview-content');
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

            {/* Hero Section - Premium Style */}
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-12 md:pb-16 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="Drug & Cosmetic License" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Award size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Official CDSCO / DCGI Compliance Hub</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-3xl font-extrabold text-white leading-tight">
                                Drug & <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Cosmetic License</span>
                            </h1>
                            <p className="text-sm md:text-base text-slate-300 max-w-lg font-light leading-relaxed">
                                Secure your healthcare business with official CDSCO/DCGI licensing. Full support for manufacturing, retail, and import certifications.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> 100% Statutory
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> Verified Experts
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Apply Now</h3>
                                    <LeadForm serviceName="Drug & Cosmetic License" btnText="Apply Now" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-10 overflow-x-auto no-scrollbar py-0">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    className={`py-5 text-sm md:text-sm font-bold uppercase tracking-widest border-b-[3px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#0F2D30] border-[#C59B4E]' : 'text-slate-400 border-transparent hover:text-[#0F2D30]'}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <OverviewContent />
            <DrugTypesContent />
            <CosmeticTypesContent />
            <DocumentsContent />
            <RulesContent />
            <LabellingContent />
            <WhyUsContent />

            <section id="dc-faqs-content" className="py-16 md:py-20 bg-white scroll-mt-24">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="FAQ" title="Pharma Law Intelligence" description="Clearing compliance and registry protocols for drugs, cosmetics and medical devices." />
                    <div className="space-y-8 pt-10">
                        {dcFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}