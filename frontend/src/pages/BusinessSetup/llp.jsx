import React, { useState, useEffect } from "react";
import LeadForm from "../../components/LeadForm";
import PricingCards from "../../components/PricingCards";
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
        price: "₹4,999",
        description: "Ideal for small teams starting their professional journey.",
        features: [
            "Expert assisted process",
            "Your company name is reserved in just 2 - 4 days",
            "DSC in 4 - 7 days",
            "LLP Incorporation form filing done in 21 days*",
            "LLP Incorporation Certificate",
            "LLP agreement form filing done in 14 days(Post Incorporation)",
            "Company PAN+TAN",
            "DIN for directors"
        ],
        isRecommended: true,
        isPremium: false,
    },
    {
        title: "Premium",
        price: "₹5,499",
        description: "Priority processing for those who need to start immediately.",
        features: [
            "Expert assisted process",
            "Your company name is reserved in just 24 hours*",
            "DSC in just 24 hours*",
            "LLP Incorporation form filing done in 14 days*",
            "LLP Incorporation Certificate",
            "LLP agreement form filing done in 7 days(Post Incorporation)",
            "Company PAN+TAN",
            "Digital welcome kit that includes a checklist of all post-incorporation compliances",
            "DIN for directors",
            "Form 8 & 11 filing(One year)",
            "DIR 3 KYC (For 2 directors)",
            "One Year Income Tax filing(Upto turnover of 20 lakhs)",
            "Accounting & Bookeeping(Upto 100 transactions)",
            "Financial statement preparation"
        ],
        isRecommended: false,
        isPremium: false,
    },
    {
        title: "Elite",
        price: "₹15,000",
        description: "Complete solution including LLP incorporation + 1-year annual compliance.",
        features: [
            "Expert assisted process",
            "Your company name is reserved in just 24 hours*",
            "DSC in just 24 hours*",
            "LLP Incorporation form filing done in 14 days*",
            "LLP Incorporation Certificate",
            "LLP agreement form filing done in 14 days(Post Incorporation)",
            "Company PAN+TAN",
            "DIN for directors",
            "30-minute call with a senior CA/CS for your business planning"
        ],
        isRecommended: false,
        isPremium: true,
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

const ServiceCard = ({ title, description, isHighlighted, icon: Icon }) => (
    <div className={`p-8 rounded-xl border transition-all duration-300 flex flex-col items-start h-full group
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
        <p className={`text-sm leading-relaxed mb-4 flex-grow ${isHighlighted ? 'text-[#5C4518]/80' : 'text-slate-500'}`}>
            {description}
        </p>
        <div className={`flex items-center text-sm font-bold uppercase tracking-wider mt-auto cursor-pointer group-hover:gap-5 transition-all
       ${isHighlighted ? 'text-[#5C4518]' : 'text-[#1A7F7D]'}
    `}>
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 ml-1" />
        </div>
    </div>
);

const FaqItem = ({ faq, isOpen, onClick }) => (
    <div className={`border rounded-xl transition-all duration-300 overflow-hidden mb-4
       ${isOpen ? 'border-[#1F4B4E] bg-[#1F4B4E] text-white shadow-lg scale-[1.01]' : 'border-slate-100 bg-white text-slate-800 hover:border-[#1A7F7D]/30 shadow-sm'}
    `}>
        <button className="flex items-center justify-between w-full p-8 text-left" onClick={onClick}>
            <h3 className={`text-lg md:text-xl font-bold pr-6 ${isOpen ? 'text-white' : 'text-slate-800'}`}>{faq.q}</h3>
            <div className="flex-shrink-0">
                <ChevronDown size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#C59B4E]' : 'text-slate-400'}`} />
            </div>
        </button>
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <p className={`px-6 pb-6 text-base md:text-lg leading-relaxed ${isOpen ? 'text-white/90' : 'text-slate-600'}`}>{faq.a}</p>
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
            <section className="relative w-full min-h-[500px] flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 text-left">
                <div className="absolute inset-0 z-0">
                    <img src={BackgroundImageSrc} alt="LLP Registration" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2D30] via-[#0F2D30]/95 to-transparent z-10"></div>
                </div>
                <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-3/5 space-y-8">
                            <div className="inline-flex items-center gap-5 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20">
                                <Briefcase size={14} className="text-[#C59B4E]" />
                                <span className="text-white text-sm md:text-sm uppercase font-bold tracking-[0.2em]">Verified LLP Filing Support</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                Limited Liability <br className="hidden lg:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E0F2F1] to-[#C59B4E]">Partnership Registration</span>
                            </h1>
                            <p className="text-sm md:text-lg text-slate-300 max-w-lg font-light leading-relaxed">
                                Combine the flexibility of a partnership with the benefits of limited liability. Connect with experts for reliable LLP formation and governance.
                            </p>
                            <div className="flex gap-10 pt-2">
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <CheckCircle size={18} className="text-[#C59B4E]" /> Easy to Manage
                                </div>
                                <div className="flex items-center gap-5 text-white/90 text-sm md:text-sm font-bold">
                                    <Shield size={18} className="text-[#C59B4E]" /> 100% Tax Efficient
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                                <div className="p-8 md:p-8">
                                    <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Register Now</h3>
                                    <LeadForm serviceName="LLP Registration" btnText="Start Registration" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nav */}
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

            {/* Overview */}
            <section id="overview-content" className="py-20 bg-slate-50/50">
                <div className="max-w-7xl px-6 mx-auto">
                    <SectionHeading subtitle="Introduction" title="Limited Liability Partnership" description="The perfect blend of a traditional partnership and a modern corporation." />

                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-8">
                            <h4 className="text-2xl font-bold text-slate-800">What is an LLP?</h4>
                            <p className="text-slate-600 leading-relaxed">
                                Formed under the Limited Liability Partnership Act, 2008, an LLP is a distinct legal entity where the liability of partners is limited to their agreed contribution. Unlike traditional partnerships, the personal assets of partners are protected from business debts and legal actions against the firm.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                It is highly favored by professionals such as Chartered Accountants, Lawyers, Architects, and Consultants, as well as startups that prefer a flexible management structure without the rigorous compliance of a Private Limited Company.
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Separate Legal Entity</span>
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Perpetual Succession</span>
                                <span className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">Low Compliance</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <Scale className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Legal Protection</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <Globe className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Global Recognition</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <CreditCard className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">Easy Funding</span>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                                <FileSearch className="w-8 h-8 text-[#1A7F7D] mb-3" />
                                <span className="text-sm font-bold text-slate-800">High Credibility</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
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
            <section id="pricing-content" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading subtitle="Pricing" title="Affordable Packages" description="Choose the plan that best fits your business needs." />
                    <PricingCards plans={llpPlans} serviceName="Limited Liability Partnership" />
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits-content" className="py-20 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <SectionHeading subtitle="Why LLP?" title="Top Benefits" description="Unlock growth and stability with a Limited Liability Partnership." />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-2"><Shield className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">Limited Liability</h5>
                            <p className="text-sm text-slate-500 leading-relaxed">No partner is liable for the independent or unauthorized actions of other partners.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-2"><Activity className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">No Minimum Capital</h5>
                            <p className="text-sm text-slate-500 leading-relaxed">Freedom to start with small capital and increase as the business grows.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-2"><Users className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">Perpetual Existence</h5>
                            <p className="text-sm text-slate-500 leading-relaxed">The LLP continues to exist even if partners change or pass away.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm space-y-8">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-2"><Zap className="w-6 h-6" /></div>
                            <h5 className="font-bold text-slate-800">No Audit till 40L</h5>
                            <p className="text-sm text-slate-500 leading-relaxed">No statutory audit requirement until turnover exceeds ₹40 Lakhs.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Requirements */}
            <section id="requirements-content" className="py-20 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4">
                    <SectionHeading subtitle="Checklist" title="Key Requirements" description="Ensure you meet these criteria before starting the registration." />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {llpRequirements.map((item, i) => (
                            <div
                                key={i}
                                className={`group relative rounded-2xl border p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center
                            ${i === 1
                                        ? 'bg-[#0F2D30] border-[#0F2D30] text-white ring-4 ring-[#0F2D30]/10'
                                        : 'bg-white border-slate-100 text-slate-800 hover:border-[#1A7F7D]/30'
                                    }`}
                            >

                                {/* Hover Top Border */}
                                {i !== 1 && (
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#1A7F7D] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                                )}

                                {/* Icon */}
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-inner group-hover:shadow-lg mt-2
                            ${i === 1
                                        ? 'bg-white text-[#0F2D30]'
                                        : 'bg-[#F0FDFA] text-[#1A7F7D] group-hover:bg-[#1A7F7D] group-hover:text-white'
                                    }
                        `}>
                                    {item.icon ? <item.icon size={36} strokeWidth={1.5} /> : <FileText size={36} strokeWidth={1.5} />}
                                </div>

                                {/* Title */}
                                <h3 className={`text-xl font-bold mb-4 transition-colors ${i === 1 ? 'text-white' : 'text-slate-800 group-hover:text-[#1A7F7D]'}`}>
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className={`text-[15px] leading-relaxed mb-6 min-h-[80px] ${i === 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                                    {item.description}
                                </p>

                                {/* Read More Button */}
                                <div className="mt-auto">
                                    <button className={`inline-flex items-center px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300
                                ${i === 1
                                            ? 'bg-[#1A7F7D] text-white hover:bg-[#156664] hover:shadow-lg'
                                            : 'bg-[#F0FDFA] text-[#1A7F7D] hover:bg-[#1A7F7D] hover:text-white'
                                        }
                            `}>
                                        Read More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documents */}
            <section id="documents-content" className="py-20 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B4E]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1A7F7D]/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <span className="text-[#C59B4E] font-bold text-sm uppercase tracking-widest mb-3 block">Documentation</span>
                        <h3 className="text-3xl font-bold mb-4">Required Documents</h3>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">Keep these digital copies ready for a smooth filing process.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {llpDocuments.map((doc, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8">
                                <h4 className="text-xl font-bold text-[#C59B4E] mb-6 flex items-center gap-5">
                                    <div className="w-8 h-8 rounded-full bg-[#C59B4E]/20 flex items-center justify-center text-sm text-[#C59B4E]">{idx + 1}</div>
                                    {doc.category}
                                </h4>
                                <ul className="grid grid-cols-1 gap-5">
                                    {doc.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-5 text-slate-300 text-sm">
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
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-10 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 mt-[-28px]"></div>
                        {llpSteps.map((step, idx) => (
                            <div key={idx} className="space-y-8">
                                <div className="w-16 h-16 bg-white border-2 border-[#1A7F7D] rounded-full flex items-center justify-center mx-auto shadow-lg relative bg-white">
                                    <step.icon className="w-7 h-7 text-[#1A7F7D]" />
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#C59B4E] text-white rounded-full flex items-center justify-center text-sm font-bold ring-4 ring-white">{idx + 1}</div>
                                </div>
                                <h5 className="text-lg font-bold text-slate-800">{step.title}</h5>
                                <p className="text-sm text-slate-500 leading-relaxed px-4">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Compliance */}
            <section id="compliance-content" className="py-20 bg-slate-50/50">
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
                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
                            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                                    <FileText className="w-4 h-4 text-[#C59B4E]" /> Form 8
                                </h6>
                                <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Statement of Solvency</p>
                                <p className="text-sm text-slate-600 leading-relaxed">Due by 30th October every year, detailing financial health.</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                                    <Calendar className="w-4 h-4 text-[#C59B4E]" /> Form 11
                                </h6>
                                <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Annual Return</p>
                                <p className="text-sm text-slate-600 leading-relaxed">Due within 60 days of the end of the financial year (By 30th May).</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                                    <Calculator className="w-4 h-4 text-[#C59B4E]" /> ITR Filing
                                </h6>
                                <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Income Tax Return</p>
                                <p className="text-sm text-slate-600 leading-relaxed">Income Tax Return must be filed in ITR-5 by 31st July (or 30th Sept if audit applies).</p>
                            </div>
                            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-teal-50/50">
                                <h6 className="font-bold text-slate-800 mb-2 flex items-center gap-5">
                                    <UserCheck className="w-4 h-4 text-[#C59B4E]" /> DIR-3 KYC
                                </h6>
                                <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Director KYC</p>
                                <p className="text-sm text-slate-600 leading-relaxed">Annual KYC filing for all designated partners with a DIN.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section id="faqs-content" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <SectionHeading subtitle="Help Desk" title="Frequently Asked Questions" description="Common queries about LLP registration and management." />
                    <div className="space-y-8">
                        {llpFAQs.map((f, i) => (<FaqItem key={i} faq={f} isOpen={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)} />))}
                    </div>
                </div>
            </section>
        </div>
    );
}