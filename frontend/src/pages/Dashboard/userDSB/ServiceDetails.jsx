import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    CheckBadgeIcon,
    BanknotesIcon,
    ClockIcon,
    BuildingLibraryIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const ServiceDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Get params from navigation state or fallback
    const { title, desc, category, price } = location.state || {
        title: "Service Details",
        desc: "Service description unavailable.",
        category: "General",
        price: "Contact for Price"
    };

    const [activeTab, setActiveTab] = useState("overview");

    // Determine content based on title
    const isGST = title?.includes("GST Registration");
    const isMSME = title?.includes("MSME Registration");
    const isPvtLtd = title?.includes("Pvt Ltd") || title?.includes("Private Limited");
    const isGeneric = !isGST && !isMSME && !isPvtLtd;

    const handleApply = () => {
        navigate("/dashboard/user/service-order", {
            state: {
                serviceName: title,
                description: desc,
                price: price,
                category: category
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-28 md:pb-12">
            {/* Standard layout container */}
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

                {/* 1. Top Navigation & Header */}
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-sm font-medium text-gray-500">{category}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                    </div>
                </header>

                {/* 2. Premium Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-2xl ring-1 ring-white/10"
                >
                    <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between md:items-start gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
                                <ShieldCheckIcon className="w-3.5 h-3.5" />
                                Verified Service
                            </div>
                            <h2 className="text-3xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                                {price}
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                {desc}
                            </p>
                        </div>
                        {/* Decorative Icon Block */}
                        <div className="hidden md:flex items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <BanknotesIcon className="w-12 h-12 text-blue-300" />
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
                </motion.div>

                {/* 3. Modern Tabs */}
                <div className="sticky top-4 z-20 bg-gray-50/50 backdrop-blur-md py-2 -mx-2 px-2 md:static md:bg-transparent md:backdrop-blur-none md:p-0">
                    <div className="flex p-1 bg-white/80 border border-gray-200 rounded-xl w-full md:w-fit shadow-sm backdrop-blur-sm">
                        <TabButton
                            label="Overview"
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                        />
                        <TabButton
                            label="Process & Documents"
                            active={activeTab === "process"}
                            onClick={() => setActiveTab("process")}
                        />
                    </div>
                </div>

                {/* 4. Dynamic Content Area */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            {/* Main Content Column (2/3 width) */}
                            <div className="md:col-span-2 space-y-8">
                                {isGST && <GSTContent tab={activeTab} />}
                                {isMSME && <MSMEContent tab={activeTab} />}
                                {isPvtLtd && <PvtLtdContent tab={activeTab} />}
                                {isGeneric && <GenericContent tab={activeTab} title={title} category={category} />}
                            </div>

                            {/* Sidebar / quick info (1/3 width) */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <ClockIcon className="w-5 h-5 text-blue-600" />
                                        Quick Summary
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="pb-4 border-b border-gray-100">
                                            <p className="text-xs text-uppercase text-gray-400 font-semibold tracking-wider">TIMELINE</p>
                                            <p className="font-medium text-gray-700 mt-1">3-7 Working Days</p>
                                        </div>
                                        <div className="pb-4 border-b border-gray-100">
                                            <p className="text-xs text-uppercase text-gray-400 font-semibold tracking-wider">AUTHORITY</p>
                                            <p className="font-medium text-gray-700 mt-1">{isGST ? "CBIC Govt of India" : "Government of India"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-uppercase text-gray-400 font-semibold tracking-wider">SUPPORT</p>
                                            <p className="font-medium text-gray-700 mt-1">Life-time Expert Support</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleApply}
                                        className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                                    >
                                        Start Application
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* 5. Sticky Bottom Bar (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3">
                    <button
                        onClick={() => alert("Callback requested!")}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Call Me
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-[2] px-4 py-3 bg-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-200"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Content Components ---

const GSTContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <>
                <Section title="About this Service">
                    <p>Every business or corporation that buys and sells goods or services must register for GST if they cross the prescribed turnover threshold. The limit is typically <strong>₹40 lakhs</strong> for goods and <strong>₹20 lakhs</strong> for services in normal states.</p>
                    <p className="mt-4">With us, you can register for GST electronically and get your GSTIN easily in a few simple steps. We handle the complexity so you can focus on your business.</p>
                </Section>
                <Section title="Why Register for GST?">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />} title="Legal Shield" desc="Avoid penalties and seize legal protection." />
                        <FeatureCard icon={<BanknotesIcon className="w-6 h-6 text-blue-500" />} title="Banking Access" desc="Open current accounts easily with GSTIN." />
                        <FeatureCard icon={<CheckBadgeIcon className="w-6 h-6 text-purple-500" />} title="Input Credit" desc="Reduce costs by claiming tax credits." />
                        <FeatureCard icon={<BuildingLibraryIcon className="w-6 h-6 text-orange-500" />} title="Govt Tenders" desc="Eligible to apply for government contracts." />
                    </div>
                </Section>
            </>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Required Documents">
                <ul className="grid sm:grid-cols-2 gap-3">
                    <Bullet text="PAN of Applicant/Business" />
                    <Bullet text="Aadhaar Card" />
                    <Bullet text="Proof of Business Registration" />
                    <Bullet text="Identity & Address Proof of Promoters" />
                    <Bullet text="Address Proof of Business Place" />
                    <Bullet text="Bank Account Statement / Cancelled Cheque" />
                    <Bullet text="Digital Signature" />
                    <Bullet text="Letter of Authorization / Board Resolution" />
                </ul>
            </Section>
            <Section title="Deliverables">
                <div className="space-y-3">
                    <Step title="GST Identification Number (GSTIN)" desc="Your unique 15-digit tax identification number." />
                    <Step title="GST Certificate" desc="Official certificate issued by the Government." />
                    <Step title="Login Credentials" desc="Access to the GST portal for filing returns." />
                </div>
            </Section>
        </div>
    );
};

const MSMEContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <>
                <Section title="About MSME Registration">
                    <p>Small scale businesses play a vital role in the economy. Registering under the MSME Act (Udyam Registration) unlocks numerous benefits and government schemes designed to support small enterprises.</p>
                </Section>
                <Section title="Key Benefits">
                    <div className="grid gap-4">
                        <Bullet text="Collateral-free bank loans under CGS" />
                        <Bullet text="Subsidy on Patent Registration & Industrial Promotion" />
                        <Bullet text="Overdraft interest rate exemption" />
                        <Bullet text="Protection against delayed payments" />
                        <Bullet text="Concession in electricity bills" />
                    </div>
                </Section>
            </>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Documents Required">
                <ul className="grid sm:grid-cols-2 gap-3">
                    <Bullet text="Aadhaar Card of Applicant" />
                    <Bullet text="PAN Card of Applicant/Entity" />
                    <Bullet text="Business Name & Type" />
                    <Bullet text="Bank Account Details" />
                    <Bullet text="Business Address Proof" />
                </ul>
            </Section>
            <Section title="What You Get">
                <Step title="Udyam Registration Certificate" desc="Official MSME certificate with lifetime validity." />
                <Step title="Govt Scheme Eligibility" desc="Immediate eligibility for various subsidies." />
            </Section>
        </div>
    );
};

const PvtLtdContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <>
                <Section title="About Pvt Ltd Company">
                    <p>A Private Limited Company is the most popular legal structure for businesses in India. It offers limited liability protection to its shareholders, ability to raise equity funds, and separate legal entity status.</p>
                </Section>
                <Section title="Why Choose Pvt Ltd?">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <FeatureCard icon={<ShieldCheckIcon className="w-6 h-6 text-indigo-500" />} title="Limited Liability" desc="Protect personal assets from business loss." />
                        <FeatureCard icon={<BuildingLibraryIcon className="w-6 h-6 text-teal-500" />} title="Fundraising" desc="Easily raise capital from VCs and Angels." />
                        <FeatureCard icon={<CheckBadgeIcon className="w-6 h-6 text-rose-500" />} title="Credibility" desc="Higher trust factor for customers & vendors." />
                        <FeatureCard icon={<ClockIcon className="w-6 h-6 text-blue-500" />} title="Perpetual" desc="Company continues even if owners change." />
                    </div>
                </Section>
            </>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Registration Requirements">
                <ul className="grid sm:grid-cols-2 gap-3">
                    <Bullet text="Minimum 2 Directors" />
                    <Bullet text="Minimum 2 Shareholders" />
                    <Bullet text="Digital Signature Certificate (DSC)" />
                    <Bullet text="Director Identification Number (DIN)" />
                </ul>
            </Section>
            <Section title="Registration Process">
                <div className="space-y-4">
                    <Step title="1. Digital Signature" desc="Obtaining DSC for all directors." />
                    <Step title="2. Name Approval" desc="RUN application for name reservation." />
                    <Step title="3. Filing SPICe+ Form" desc="Submission of MoA, AoA & other documents." />
                    <Step title="4. Certificate of Incorporation" desc="Received along with PAN & TAN." />
                </div>
            </Section>
        </div>
    );
};

const GenericContent = ({ tab, title, category }) => {
    if (tab === "overview") {
        return (
            <>
                <Section title={`About ${title}`}>
                    <p>Professional service to help you manage your <strong>{title}</strong> requirements efficiently. We ensure complete compliance with the latest regulations so you can operate worry-free.</p>
                </Section>
                <Section title="Service Benefits">
                    <ul className="grid gap-3">
                        <Bullet text="Expert consultation and guidance" />
                        <Bullet text="End-to-end document processing" />
                        <Bullet text="Timely filing and approval updates" />
                        <Bullet text="Avoidance of penalties and late fees" />
                    </ul>
                </Section>
            </>
        );
    }

    // Logic for steps matching title/category
    const renderSteps = () => {
        return (
            <>
                <Step title="1. Consultation & Data" desc="We collect required details and documents." />
                <Step title="2. Processing & Drafting" desc="Our experts prepare the application." />
                <Step title="3. Filing & Submission" desc="Submitted to the relevant authority." />
                <Step title="4. Completion" desc="Receive your final certificate/output." />
            </>
        );
    };

    return (
        <div className="space-y-6">
            <Section title="Process Workflow">
                <div className="space-y-4">
                    {renderSteps()}
                </div>
            </Section>
            <Section title="Checklist">
                <ul className="grid sm:grid-cols-2 gap-3">
                    <Bullet text="Government ID Proof" />
                    <Bullet text="Address Proof" />
                    <Bullet text="Photographs" />
                    <Bullet text="Supporting Documents" />
                </ul>
            </Section>
        </div>
    );
};

// --- Reusable UI Parts ---

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${active
                ? "text-blue-700 bg-blue-50/50 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
    >
        {label}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-lg shadow-sm ring-1 ring-black/5 z-[-1]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}
    </button>
);

const Section = ({ title, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100/80"
    >
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="text-gray-600 leading-relaxed text-[15px]">{children}</div>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
        <div className="mb-3 p-2 bg-white rounded-lg w-fit shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <h4 className="font-bold text-gray-800 mb-1">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
    </div>
);

const Bullet = ({ text }) => (
    <li className="flex items-start gap-3">
        <CheckCircleIcon className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
        <span className="text-gray-700 font-medium">{text}</span>
    </li>
);

const Step = ({ title, desc }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <CheckBadgeIcon className="w-5 h-5" />
            </div>
            <div className="w-0.5 flex-1 bg-gray-100 group-last:hidden mt-2"></div>
        </div>
        <div className="pb-6">
            <h4 className="font-bold text-gray-900 text-[15px]">{title}</h4>
            <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default ServiceDetail;
