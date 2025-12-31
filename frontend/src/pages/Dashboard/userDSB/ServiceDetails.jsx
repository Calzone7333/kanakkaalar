import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    DocumentTextIcon,
    BanknotesIcon,
    ShieldCheckIcon,
    ClockIcon,
    BuildingLibraryIcon,
    CheckBadgeIcon
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

    // Determine content based on title (Matching Android Logic)
    const isGST = title?.includes("GST Registration");
    const isMSME = title?.includes("MSME Registration");
    const isPvtLtd = title?.includes("Pvt Ltd") || title?.includes("Private Limited");
    const isGeneric = !isGST && !isMSME && !isPvtLtd;

    const handleApply = () => {
        // Navigate to ServiceOrder with params (Matching Android btnApply)
        navigate("/dashboard/user/service-order", {
            state: {
                serviceName: title,
                description: desc,
                price: price, // String 'Starts from ...' might need parsing in Order page, but passing as is for now
                category: category
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

            {/* 1. Top Bar */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-1">{title}</h1>
            </div>

            {/* 2. Hero Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">{category}</p>
                            <h2 className="text-3xl font-bold mb-2">{price}</h2>
                            <p className="text-blue-50/90 text-sm max-w-lg leading-relaxed">{desc}</p>
                        </div>
                        <div className="hidden md:block bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-xl" />
            </div>

            {/* 3. Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1 overflow-x-auto">
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

            {/* 4. Content Area */}
            <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                    >
                        {isGST && <GSTContent tab={activeTab} />}
                        {isMSME && <MSMEContent tab={activeTab} />}
                        {isPvtLtd && <PvtLtdContent tab={activeTab} />}
                        {isGeneric && <GenericContent tab={activeTab} title={title} category={category} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 5. Sticky Bottom Action (Mobile feel) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg md:relative md:bg-transparent md:border-0 md:shadow-none md:p-0 z-20">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button
                        onClick={() => alert("Callback requested! Our team will contact you shortly.")}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                        Request Callback
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-6 py-3 bg-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
            {/* Spacer for sticky footer on mobile */}
            <div className="h-24 md:h-0" />
        </div>
    );
};

// --- Content Components Matching Android Logic ---

const GSTContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <div className="space-y-6">
                <Section title="Description">
                    Every business or corporation that buys and sells goods or services has to register for GST if they cross the threshold. The threshold limit is Rs.40 lakhs for goods and Rs.20 lakhs for services in normal states.
                    <br /><br />
                    With us, you can register for GST for your Private Limited Company and get your GSTIN easily in a few simple steps.
                </Section>
                <Section title="Key Details">
                    <DetailRow label="Process Time" value="3-7 working days" />
                    <DetailRow label="Authority" value="GST Council / CBIC" />
                </Section>
                <Section title="Benefits">
                    <Bullet text="Become compliant, reduce indirect taxes, and grow your business." />
                    <Bullet text="You can open a current account easily with GST registration." />
                    <Bullet text="Ability to claim input tax credit on purchases." />
                </Section>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Documents Required">
                <Bullet text="Company PAN / Individual PAN" />
                <Bullet text="Certificate of Incorporation (if applicable)" />
                <Bullet text="Board Resolution (for companies)" />
                <Bullet text="Directors'/Partners' PAN & Aadhar" />
                <Bullet text="Passport size photo" />
                <Bullet text="Address Proof (Electricity Bill/Rent Agreement)" />
            </Section>
            <Section title="Deliverables">
                <Bullet text="GSTIN Number, HSN, and SAC Code" />
                <Bullet text="Provisional GST login credentials" />
                <Bullet text="Expert consultation for 30 days post-registration" />
            </Section>
        </div>
    );
};

const MSMEContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <div className="space-y-6">
                <Section title="Description">
                    Small scale businesses play a vital role in improving the economy. These businesses can register themselves under the MSME Act, also known as Udyog Aadhaar or SSI registration.
                    <br /><br />
                    Government schemes can be availed easily when you have an MSME registered.
                </Section>
                <Section title="Benefits">
                    <Bullet text="Easier to get licenses, registrations, and approvals." />
                    <Bullet text="You can get collateral-free loans." />
                    <Bullet text="Avail various government schemes for small and medium enterprises." />
                </Section>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Documents Required">
                <Bullet text="Applicant's Aadhaar card" />
                <Bullet text="Applicant's PAN" />
                <Bullet text="Company PAN / Incorporation Certificate" />
                <Bullet text="Basic details about company/firm" />
            </Section>
            <Section title="Deliverables">
                <Bullet text="MSME certificate" />
            </Section>
        </div>
    );
};

const PvtLtdContent = ({ tab }) => {
    if (tab === "overview") {
        return (
            <div className="space-y-6">
                <Section title="Description">
                    Private limited company registration in India provides limited liability, legal independence, and access to tax benefits. It is the ideal structure for startups and SMEs seeking credibility and funding.
                    <br /><br />
                    Governed by the Companies Act, 2013.
                </Section>
                <Section title="Key Advantages">
                    <Bullet text="Limited Liability: Personal assets are protected." />
                    <Bullet text="Separate Legal Entity: Can own property and contracts independently." />
                    <Bullet text="Easier Access to Capital: Attracts venture capital and loans." />
                    <Bullet text="Perpetual Existence: Business continuity regardless of owner changes." />
                </Section>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <Section title="Minimum Requirements">
                <Bullet text="Minimum Two Directors (One resident in India)" />
                <Bullet text="Minimum Two Shareholders" />
                <Bullet text="Registered Office Address in India" />
                <Bullet text="Digital Signature Certificate (DSC)" />
                <Bullet text="Director Identification Number (DIN)" />
            </Section>
            <Section title="Process Steps">
                <Step title="1. DSC & DIN" desc="Obtain Digital Signature and Director ID." />
                <Step title="2. Name Approval" desc="Apply for unique name reservation." />
                <Step title="3. Incorporation Filing" desc="File SPICe+ forms with MoA & AoA." />
                <Step title="4. PAN & TAN" desc="Auto-generated with incorporation." />
                <Step title="5. Certification" desc="Receive Certificate of Incorporation." />
            </Section>
        </div>
    );
};

const GenericContent = ({ tab, title, category }) => {
    if (tab === "overview") {
        return (
            <div className="space-y-6">
                <Section title="Description">
                    This service helps businesses like yours fulfill regulatory requirements related to {title}. Our experts ensure a smooth, transparent, and compliant process.
                </Section>
                <Section title="Key Benefits">
                    <Bullet text="Ensures legal compliance and avoids penalties." />
                    <Bullet text="Builds credibility and trust with customers." />
                    <Bullet text="Facilitates smoother business operations." />
                </Section>
            </div>
        );
    }

    // Logic for steps matching Android Generic Content
    const renderSteps = () => {
        if (category?.includes("Licenses") || category?.includes("Tax")) {
            return (
                <>
                    <Step title="1. Document Vetting" desc="Specialists review your documents." />
                    <Step title="2. Application Filing" desc="Application prepared and submitted." />
                    <Step title="3. Fee Payment" desc="Government fees paid." />
                    <Step title="4. Certificate Delivery" desc="Final certificate delivered." />
                </>
            );
        } else if (category?.includes("IP")) {
            return (
                <>
                    <Step title="1. Preliminary Search" desc="Comprehensive search for uniqueness." />
                    <Step title="2. Drafting & Filing" desc="Application drafted by experts." />
                    <Step title="3. Examination" desc="Handling objections if any." />
                    <Step title="4. Registration" desc="Certificate granted." />
                </>
            );
        } else {
            return (
                <>
                    <Step title="1. Data Collection" desc="Gathering required details." />
                    <Step title="2. Drafting" desc="Preparation of documents." />
                    <Step title="3. Filing" desc="Submission to authority." />
                    <Step title="4. Approval" desc="Final approval received." />
                </>
            );
        }
    };

    return (
        <div className="space-y-6">
            <Section title="Process Steps">
                {renderSteps()}
            </Section>
            <Section title="Documents Required">
                <Bullet text="Proof of Identity (PAN/Aadhar)" />
                <Bullet text="Proof of Address" />
                <Bullet text="Passport Size Photo" />
                <Bullet text="Business Registration Proof" />
            </Section>
        </div>
    );
};

// --- Reusable UI Parts ---

const TabButton = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium text-sm transition-colors rounded-lg whitespace-nowrap ${active
            ? "bg-blue-600 text-white shadow-md"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
    >
        {label}
    </button>
);

const Section = ({ title, children }) => (
    <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex gap-2 py-1">
        <span className="font-semibold text-gray-800 text-sm w-32 shrink-0">{label}:</span>
        <span className="text-gray-600 text-sm">{value}</span>
    </div>
);

const Bullet = ({ text }) => (
    <div className="flex items-start gap-2 py-1">
        <span className="text-blue-500 mt-1">•</span>
        <span className="text-gray-600 text-sm">{text}</span>
    </div>
);

const Step = ({ title, desc }) => (
    <div className="flex gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg shrink-0 h-fit">
            <CheckBadgeIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
            <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
            <p className="text-gray-500 text-sm">{desc}</p>
        </div>
    </div>
);

export default ServiceDetail;
