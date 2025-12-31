import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
// Consolidated lucide-react icons for llp registration page
import {
    ChevronDown,
    Briefcase,
    ArrowRight,
    UserCheck,
    CheckCircle,
    FileText,
    Scale,
    Calculator,
    Zap,
    Star,
    Shield,
    Activity,
    Award,
    Timer,
    FilePenLine,
    Rocket,
    Users,
    Layers,
    Home,
    Trello,
    Gavel,
    Globe,
    Calendar,
    IndianRupee,
    CreditCard,
    FileSearch,
    BadgeCheck
} from "lucide-react";
import BackgroundImageSrc from "../../assets/lawyer_office_bg.png"; // Reusing the premium background

const tabs = [
    { id: 'overview-content', label: 'Overview' },
    { id: 'pricing-content', label: 'Pricing' },
    { id: 'benefits-content', label: 'Benefits' },
    { id: 'requirements-content', label: 'Requirements' },
    { id: 'documents-content', label: 'Documents' },
    { id: 'process-content', label: 'Process' },
    { id: 'compliance-content', label: 'Compliance' },
    { id: 'faqs-content', label: 'FAQs' },
];

const llpPlans = [
    {
        title: "Standard",
        price: "₹1,499",
        originalPrice: "₹1,999",
        discountText: "25% discount",
        description: "Ideal for small teams starting their professional journey.",
        features: [
            "Expert assisted process",
            "Name reserved in 2 - 4 days",
            "DSC (Digital Signature) for 2 Partners",
            "DIN (Director Identification Number) for 2 Partners",
            "Drafting of LLP Agreement",
            "LLP Incorporation Certificate",
            "Company PAN+TAN Filing"
        ],
        isRecommended: true,
        isPremium: false,
        govtFeeNote: "+ Govt. Fee",
    },
    {
        title: "Fastrack",
        price: "₹2,499",
        originalPrice: "₹3,599",
        discountText: "35% discount",
        description: "Priority processing for those who need to start immediately.",
        features: [
            "All Standard Features",
            "Name reserved in just 24 hours*",
            "DSC in just 24 hours*",
            "Priority Application Filing",
            "Relationship Manager Support",
            "Digital Welcome Kit (Seal & Letterhead templates)"
        ],
        isRecommended: false,
        isPremium: false,
        govtFeeNote: "+ Govt. Fee",
    },
    {
        title: "Compliance Pack",
        price: "₹10,999",
        originalPrice: "₹21,999",
        discountText: "50% discount",
        description: "Complete solution including LLP incorporation + 1-year annual compliance.",
        features: [
            "Includes Fastrack Incorporation",
            "30-minute call with senior CA/CS",
            "Form 8 (Statement of Accounts) filing",
            "Form 11 (Annual Return) filing",
            "DIR 3 KYC (For 2 designated partners)",
            "Income Tax filing (One Year Business ITR)",
            "Unlimited GST Consultations"
        ],
        isRecommended: false,
        isPremium: true,
        govtFeeNote: "+ Govt. Fee",
    },
];

const llpRequirements = [
    { icon: Users, title: "Minimum Two Partners", description: "At least two individuals must act as partners. There is no upper limit on the maximum number of partners." },
    { icon: Layers, title: "Designated Partners", description: "At least two designated partners must be individuals, and at least one must be a resident of India." },
    { icon: FileText, title: "No Minimum Capital", description: "An LLP can be started with any amount of capital. There is no minimum requirement prescribed by law." },
    { icon: Home, title: "Registered Office", description: "A physical office address in India is mandatory. It can even be a residential address." },
    { icon: Briefcase, title: "Digital Signatures", description: "All designated partners must have a valid Class 3 Digital Signature Certificate (DSC)." },
    { icon: Trello, title: "LLP Agreement", description: "A written agreement between partners or between the LLP and its partners must be filed with the MCA." },
];

const llpFAQs = [
    { q: "What is a Limited Liability Partnership (LLP)?", a: "An LLP is a corporate business vehicle that enables professional expertise and entrepreneurial initiative to combine and operate in flexible, innovative and efficient manner, providing benefits of limited liability while allowing its members the flexibility of organizing their internal structure as a partnership." },
    { q: "What is the main difference between a Company and an LLP?", a: "An LLP is more flexible to manage and has fewer compliance requirements compared to a Private Limited Company. For instance, an LLP doesn't need to get its accounts audited unless its turnover exceeds ₹40 Lakhs or contribution exceeds ₹25 Lakhs." },
    { q: "Is there any minimum capital requirement for LLP?", a: "No, there is no minimum capital requirement for starting an LLP. Partners can contribute any amount as agreed upon in the LLP agreement." },
    { q: "Can a NRI or Foreigner be a partner in an LLP?", a: "Yes, an NRI or a foreign national can be a partner in an LLP, provided at least one designated partner is a resident of India." },
    { q: "How much time does it take to register an LLP?", a: "The entire process of LLP registration, from DSC procurement to getting the Incorporation Certificate, usually takes about 10 to 15 working days, depending on government processing times." },
    { q: "What if I don't file the LLP Agreement?", a: "The LLP Agreement must be filed within 30 days of incorporation using Form 3. Failure to do so attracts a penalty of ₹100 per day of delay without any upper limit." },
    { q: "Is an audit mandatory for all LLPs?", a: "No. Audit is mandatory only if the annual turnover of the LLP exceeds ₹40 Lakhs or the capital contribution exceeds ₹25 Lakhs." },
    { q: "Can an existing partnership firm be converted into an LLP?", a: "Yes, the LLP Act 2008 allows the conversion of an existing partnership firm, private company, or unlisted public company into an LLP." },
];

const llpDocuments = [
    { category: "For Partners", items: ["PAN Card (Mandatory)", "Aadhaar Card", "Voter ID / Passport / DL", "Latest Bank Statement / Utility Bill", "Passport Size Photo"] },
    { category: "For Registered Office", items: ["NOC from House Owner", "Utility Bill (Electricity/Gas/Water)", "Rent Agreement (if rented)", "Property Papers (if owned)"] }
];

const llpSteps = [
    { icon: Zap, title: "DSC Procurement", desc: "Obtain Class 3 Digital Signatures for all designated partners for secure e-filing." },
    { icon: BadgeCheck, title: "Name Approval", desc: "Apply for a unique name through the RUN-LLP (Reserve Unique Name) service on MCA portal." },
    { icon: FilePenLine, title: "Incorporation", desc: "Submit FiLLiP (Form for incorporation of LLP) including details of partners and registered office." },
    { icon: Gavel, title: "LLP Agreement", desc: "Draft and file the LLP Agreement within 30 days of incorporation to define partner roles." }
];

// --- Components ---

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

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
    <div className={`p-6 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
    ${isHighlighted
            ? 'bg-gradient-to-br from-[#E8DCC2] to-[#D4B982] border-transparent shadow-lg transform -translate-y-1'
            : 'bg-white border-slate-100 hover:shadow-lg hover:border-[#1A7F7D]/30 shadow-sm'}
  `}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors
       ${isHighlighted ? 'bg-white/30 text-[#8C6B28]' : 'bg-slate-50 text-[#1A7F7D]'}
    `}>
            {Icon ? <Icon className="w-5 h-5" /> : (isHighlighted ? <Star className="w-5 h-5" /> : <FileText className="w-5 h-5" />)}
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

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-lg transition-all duration-300 overflow-hidden
     ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg' : 'border-slate-200 bg-white text-slate-800 hover:border-[#1A7F7D]/50'}
  `}>
        <button className="flex items-center justify-between w-full p-4 text-left" onClick={onClick}>
            <h3 className={`text-sm font-bold pr-4 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                {isOpen ? <ChevronDown className="w-4 h-4 text-white rotate-180 transition-transform" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform" />}
            </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className={`px-4 pb-4 text-xs leading-relaxed ${isOpen ? 'text-white/80' : 'text-slate-500'}`}>{faq.a}</p>
        </div>
    </div>
);

// --- Main Pages ---

export default function LlpPage() {
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
        <div className="min-h-screen font-sans w-full overflow-x-hidden text-slate-900 selection:bg-[#1A7F7D] selection:text-white">
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* Hero */}
            <section className="relative w-full min-h-[auto] lg:min-h-screen flex items-center pt-32 pb-12 lg:pt-36 lg:pb-20">
                <div className="absolute inset-0 w-full h-full z-0">
                    <img src={BackgroundImageSrc} alt="LLP Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/90 to-[#0F2D30]/40 lg:to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
                        <div className="w-full lg:w-1/2 text-left space-y-8 flex flex-col items-start">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[#C59B4E]/20 rounded-full blur-xl"></div>
                                <div className="relative w-full h-full bg-[#1a1a1a] rounded-full flex items-center justify-center border-2 border-[#C59B4E] shadow-xl">
                                    <div className="absolute inset-1 rounded-full border border-[#C59B4E]/30"></div>
                                    <div className="text-center px-1">
                                        <div className="flex justify-center gap-0.5 mb-1.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-[#C59B4E] text-[#C59B4E]" />)}
                                        </div>
                                        <span className="block text-[#C59B4E] font-serif font-bold text-[10px] leading-tight uppercase tracking-wider mb-1">
                                            LLP<br />Registration<br />In India
                                        </span>
                                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mb-1"></div>
                                        <span className="block text-white text-[9px] uppercase tracking-[0.2em] font-medium">Verified</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight drop-shadow-lg">
                                    LLP <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#80CBC4]">Registration</span>
                                </h1>
                                <p className="text-sm md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
                                    Combine the flexibility of a partnership with the benefits of limited liability. Start your professional firm today with expert guidance and seamless processing.
                                </p>
                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex flex-col">
                                        <span className="text-white text-2xl font-bold italic">₹1,499</span>
                                        <span className="text-slate-400 text-[10px] uppercase tracking-wider">Starting Price</span>
                                    </div>
                                    <div className="h-10 w-[1px] bg-white/20"></div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-2xl font-bold italic">10-15</span>
                                        <span className="text-slate-400 text-[10px] uppercase tracking-wider">Business Days</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden lg:flex items-center gap-6 text-white/90 text-sm font-medium pt-2">
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <CheckCircle className="w-4 h-4 text-[#C59B4E]" />
                                    <span>Verified Experts</span>
                                </div>
                                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <Shield className="w-4 h-4 text-[#C59B4E]" />
                                    <span>100% Secure</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-md lg:max-w-none lg:w-[400px] relative z-30 mx-auto lg:mx-0">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-4 md:p-8">
                                    <div className="text-center mb-4 md:mb-6">
                                        <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Talk to an Expert</h2>
                                        <p className="text-slate-500 text-[10px] md:text-xs px-2 leading-relaxed">Fill the form below to get started with your LLP registration!</p>
                                    </div>
                                    <LeadForm serviceName="LLP Registration" btnText="Get Started Now" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nav */}
            <div className="sticky top-20 lg:top-24 z-40 bg-white shadow-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-start md:justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar py-0 list-none">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    className={`relative py-4 text-sm font-bold tracking-wide transition-all border-b-[3px] ${activeTab === tab.id ? 'text-[#0F4C49] border-[#0F4C49]' : 'text-slate-700 border-transparent hover:text-[#0F4C49]'}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >{tab.label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Overview */}
            <section id="overview-content" className="py-16 bg-slate-50/50">
                <div className="max-w-7xl px-6 mx-auto">
                    <SectionHeading subtitle="Introduction" title="Limited Liability Partnership" description="The perfect blend of a traditional partnership and a modern corporation." />

                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6">
                            <h4 className="text-2xl font-bold text-slate-800">What is an LLP?</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Formed under the Limited Liability Partnership Act, 2008, an LLP is a distinct legal entity where the liability of partners is limited to their agreed contribution. Unlike traditional partnerships, the personal assets of partners are protected from business debts and legal actions against the firm.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                It is highly favored by professionals such as Chartered Accountants, Lawyers, Architects, and Consultants, as well as startups that prefer a flexible management structure without the rigorous compliance of a Private Limited Company.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Separate Legal Entity</span>
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Perpetual Succession</span>
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">Low Compliance</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <Scale className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Legal Protection</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <Globe className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Global Recognition</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <CreditCard className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Easy Funding</span>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <FileSearch className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">High Credibility</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                            <FilePenLine className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">Easy to Manage</h4>
                            <p className="text-gray-300 text-sm">Flexible management through the LLP Agreement without complex board meetings.</p>
                        </div>
                        <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                            <Timer className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">Cost Effective</h4>
                            <p className="text-gray-300 text-sm">Significantly lower compliance and registration costs than a Private Limited Company.</p>
                        </div>
                        <div className="rounded-xl p-8 text-center bg-[#103B3E] hover:bg-[#154d51] transition-colors shadow-lg">
                            <Shield className="w-16 h-16 text-[#C59B4E] mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-white mb-2">Liability Protection</h4>
                            <p className="text-gray-300 text-sm">Personal assets of partners are shielded from the liabilities of the LLP.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing-content" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading subtitle="Pricing" title="Affordable Packages" description="Choose the plan that best fits your business needs." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {llpPlans.map((plan, i) => (
                            <div key={i} className={`flex flex-col p-6 rounded-2xl border ${plan.isRecommended ? 'bg-[#F0FDFA] border-[#1A7F7D] shadow-xl relative scale-105 z-10' : 'bg-white border-slate-100 hover:shadow-lg'}`}>
                                {plan.isRecommended && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A7F7D] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</span>}
                                <h3 className="text-lg font-bold mb-1 text-slate-800">{plan.title}</h3>
                                <p className="text-[10px] text-slate-500 mb-4 h-8">{plan.description}</p>
                                <div className="flex items-baseline gap-2 mb-6">
                                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                                    {plan.originalPrice && <span className="text-sm text-slate-400 line-through font-medium">{plan.originalPrice}</span>}
                                </div>
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="flex items-start gap-3 text-xs text-slate-600">
                                            <CheckCircle className="w-4 h-4 text-[#1A7F7D] flex-shrink-0" />
                                            <span className="leading-tight">{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-xl font-bold text-xs uppercase transition-all duration-300 ${plan.isPremium ? 'bg-[#C59B4E] hover:bg-[#A37D35]' : 'bg-[#1A7F7D] hover:bg-[#146361]'} text-white shadow-md`}>Buy Now</button>
                                <p className="text-[10px] text-center text-slate-400 mt-4 font-medium">{plan.govtFeeNote}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits-content" className="py-16 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeading subtitle="Why LLP?" title="Top Benefits" description="Unlock growth and stability with a Limited Liability Partnership." />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2"><Shield className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">Limited Liability</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">No partner is liable for the independent or unauthorized actions of other partners.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-2"><Activity className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">No Minimum Capital</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">Freedom to start with small capital and increase as the business grows.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-2"><Users className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">Perpetual Existence</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">The LLP continues to exist even if partners change or pass away.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-2"><Zap className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">No Audit till 40L</h5>
                            <p className="text-xs text-slate-500 leading-relaxed">No statutory audit requirement until turnover exceeds ₹40 Lakhs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section id="requirements-content" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading subtitle="Checklist" title="Key Requirements" description="Ensure you meet these criteria before starting the registration." />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {llpRequirements.map((req, i) => (<ServiceCard key={i} title={req.title} description={req.description} icon={req.icon} />))}
                    </div>
                </div>
            </section>

            {/* Documents */}
            <section id="documents-content" className="py-16 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1A7F7D]/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-[#C59B4E] font-bold text-xs uppercase tracking-widest mb-3 block">Documentation</span>
                        <h3 className="text-3xl font-bold mb-4">Required Documents</h3>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">Keep these digital copies ready for a smooth filing process.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {llpDocuments.map((doc, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8">
                                <h4 className="text-xl font-bold text-[#C59B4E] mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#C59B4E]/20 flex items-center justify-center text-xs text-[#C59B4E]">{idx + 1}</div>
                                    {doc.category}
                                </h4>
                                <ul className="grid grid-cols-1 gap-4">
                                    {doc.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#1A7F7D]"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process */}
            <section id="process-content" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <SectionHeading subtitle="Workflow" title="Registration Journey" description="A streamlined 4-step process to get your LLP ready." />
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                        {llpSteps.map((step, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative bg-white">
                                    <step.icon className="w-7 h-7 text-[#1A7F7D]" />
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">{idx + 1}</div>
                                </div>
                                <h5 className="text-lg font-bold text-slate-800">{step.title}</h5>
                                <p className="text-xs text-slate-500 leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section id="compliance-content" className="py-16 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/3">
                            <SectionHeading
                                subtitle="Advisory"
                                title="Post Registration Compliance"
                                description="Running an LLP requires periodic filings with the MCA and Income Tax Department."
                                align="left"
                            />
                        </div>
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#C59B4E]" /> Form 8
                                </h6>
                                <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Statement of Solvency</p>
                                <p className="text-xs text-slate-600 leading-relaxed">Due by 30th October every year, detailing financial health.</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#C59B4E]" /> Form 11
                                </h6>
                                <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Annual Return</p>
                                <p className="text-xs text-slate-600 leading-relaxed">Due within 60 days of the end of the financial year (By 30th May).</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-[#C59B4E]" /> ITR Filing
                                </h6>
                                <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Income Tax Return</p>
                                <p className="text-xs text-slate-600 leading-relaxed">Income Tax Return must be filed in ITR-5 by 31st July (or 30th Sept if audit applies).</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-[#C59B4E]" /> DIR-3 KYC
                                </h6>
                                <p className="text-[11px] text-slate-500 uppercase font-semibold mb-2">Director KYC</p>
                                <p className="text-xs text-slate-600 leading-relaxed">Annual KYC filing for all designated partners with a DIN.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="Help Desk" title="Frequently Asked Questions" description="Common queries about LLP registration and management." />
                    <div className="space-y-4">
                        {llpFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}