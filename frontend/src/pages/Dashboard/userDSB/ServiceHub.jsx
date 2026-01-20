import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRightIcon,
    DocumentMagnifyingGlassIcon,
    ShieldCheckIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid'; // distinct style for checkmarks
import { servicesData } from "../../../data/servicePricing";
import { serviceHubAPI, processAPI } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

// ===========================================
// STATIC DATA
// ===========================================

const tabData = {
    "Licenses/Registrations": {
        "Business Essentials": [
            { title: "GST Registration", desc: "Price: ₹999 | Duration: 3-7 Days", to: "/compliances/gst", categoryKey: "licenses" },
            { title: "MSME Registration", desc: "Price: ₹499 | Duration: 1-2 Days", to: "/Licenses/msme", categoryKey: "licenses" },
            { title: "Udyam Registration", desc: "Price: ₹499 | Duration: 1-2 Days", to: "/Licenses/udyam", categoryKey: "licenses" },
            { title: "Food License", desc: "Price: ₹1,499 | Duration: 3-7 Days", to: "/licenses/fssai", categoryKey: "licenses" },
            { title: "Digital Signature (DSC)", desc: "Price: ₹999 | Duration: 30 Mins", to: "/licenses/dsc", categoryKey: "licenses" },
            { title: "Trade License", desc: "Price: ₹3,000 | Duration: 1 hr", to: "/licenses/trade", categoryKey: "licenses" }
        ],
        "Labour Compliance": [
            { title: "PF/ESI Registration", desc: "Price: ₹3,999 | Duration: 5-7 Days", to: "/compliances/pf-esi", categoryKey: "licenses" },
            { title: "Professional Tax Registration", desc: "Price: ₹1,500 | Duration: 30 mins", to: "/compliances/professional-tax", categoryKey: "licenses" },
            { title: "Shops & Establishment License", desc: "Price: ₹2,500 | Duration: 45 mins", to: "/licenses/shop", categoryKey: "licenses" },
            { title: "CLRA Registration", desc: "Price: ₹4,999 | Duration: 15-20 Days", to: "/licenses/clra", categoryKey: "licenses" }
        ],
        "Export Business": [
            { title: "Import Export Code (IEC)", desc: "Price: ₹1,999 | Duration: 2-3 Days", to: "/licenses/iec", categoryKey: "licenses" },
            { title: "AD Code Registration", desc: "Price: ₹2,999 | Duration: 3-5 Days", to: "/licenses/adcode", categoryKey: "licenses" },
            { title: "Spice Board Registration", desc: "Price: ₹4,999 | Duration: 10-15 Days", to: "/licenses/spice-board", categoryKey: "licenses" },
            { title: "FIEO Registration", desc: "Price: ₹5,999 | Duration: 7-10 Days", to: "/licenses/fieo", categoryKey: "licenses" },
            { title: "APEDA Registration", desc: "Contact Expert to Get Price", to: "/licenses/apeda", categoryKey: "licenses" }
        ],
        "Quality & Standards": [
            { title: "ISO Certification", desc: "Price: ₹1,999 | Duration: 3-5 Days", to: "/licenses/iso", categoryKey: "licenses" },
            { title: "Hallmark Registration", desc: "Price: ₹14,999 | Duration: 15-20 Days", to: "/licenses/hallmark", categoryKey: "licenses" },
            { title: "BIS Registration", desc: "Price: ₹24,999 | Duration: 20-30 Days", to: "/licenses/bis", categoryKey: "licenses" },
            { title: "Legal Metrology", desc: "Price: ₹9,999 | Duration: 30-45 Days", to: "/licenses/legal-metrology", categoryKey: "licenses" },
            { title: "Drug & Cosmetic License", desc: "Price: ₹29,999 | Duration: 45-60 Days", to: "/licenses/drug-license", categoryKey: "licenses" }
        ],
        "Other": [
            { title: "Liquor License", desc: "Price: ₹49,999 | Duration: 45-60 Days", to: "/licenses/liquor-license", categoryKey: "licenses" },
            { title: "IRDAI Registration", desc: "Price: ₹24,999 | Duration: 60-90 Days", to: "/licenses/irdai", categoryKey: "licenses" },
            { title: "Customs Clearance", desc: "On Request", to: "/licenses/customs-clearance", categoryKey: "licenses" }
        ]
    },
    "Trademark/IP": {
        "Trademark": [
            { title: "Trademark Registration", desc: "Price: ₹7,500", to: "/ip/trademark-registration", categoryKey: "ip" },
            { title: "Respond to Trademark Objection", desc: "Price: ₹10,000", to: "/ip/trademark-objection", categoryKey: "ip" },
            { title: "Trademark Hearing Service", desc: "Contact Expert to Get Price", to: "/ip/trademark-hearing", categoryKey: "ip" },
            { title: "Renewal of Trademark", desc: "Contact Expert to Get Price", to: "/ip/trademark-renewal", categoryKey: "ip" },
            { title: "International Trademark", desc: "Price: ₹35,000 | Duration: 6-12 Months", to: "/ip/international-trademark", categoryKey: "ip" }
        ],
        "Copyright": [
            { title: "Copyright Music", desc: "Contact Expert to Get Price", to: "/ip/copyright-music", categoryKey: "ip" }
        ],
        "Patent": [
            { title: "Patent Search", desc: "Contact Expert to Get Price", to: "/ip/patent-search", categoryKey: "ip" },
            { title: "Provisional Patent Application", desc: "Contact Expert to Get Price", to: "/ip/provisional-patent", categoryKey: "ip" },
            { title: "Patent Registration", desc: "Contact Expert to Get Price", to: "/ip/patent-registration", categoryKey: "ip" }
        ],
        "Infringement": [
            { title: "Patent Infringement", desc: "Contact Expert to Get Price", to: "/ip/patent-infringement", categoryKey: "ip" }
        ]
    },
    "Company Change": {
        "Company Name/Management": [
            { title: "Change Company Name", desc: "Price: ₹4,999 | Duration: 30 Days", to: "/company/change-name", categoryKey: "company" },
            { title: "Change Objectives", desc: "Price: ₹3,499 | Duration: 3-4 Days", to: "/company/change-objectives", categoryKey: "company" },
            { title: "Add/Remove Director", desc: "Price: ₹1,999 | Duration: 3-4 Days", to: "/company/director-change", categoryKey: "company" },
            { title: "Appointment of a Director/Partner", desc: "Price: ₹1,999 | Duration: 30 mins", to: "/company/appoint-director", categoryKey: "company" },
            { title: "Removal of a Director/Partner", desc: "Price: ₹1,999 | Duration: 30 mins", to: "/company/remove-director", categoryKey: "company" },
            { title: "Change Address (Same City)", desc: "Price: ₹1,500 | Duration: 3-4 Days", to: "/company/change-address-city", categoryKey: "company" },
            { title: "Change Address (Different State)", desc: "Price: ₹7,500 | Duration: 30 Days", to: "/company/change-address-state", categoryKey: "company" }
        ],
        "Capital & Share Services": [
            { title: "Transfer Shares", desc: "Price: ₹4,999 | Duration: 3-4 Days", to: "/company/transfer-shares", categoryKey: "company" },
            { title: "Increase Auth Capital", desc: "Price: ₹4,999 | Duration: 3-4 Days", to: "/company/change-capital", categoryKey: "company" },
            { title: "Wind Up Company", desc: "Price: ₹14,999 | Duration: 3-6 Months", to: "/closure/company-closure", categoryKey: "company" }
        ],
        "Business Upgrades": [
            { title: "Convert Sole to Pvt Ltd", desc: "Price: ₹9,999 | Duration: 7-10 Days", to: "/company/sole-to-private", categoryKey: "company" },
            { title: "Convert Partnership into a Private Limited company", desc: "Price: ₹9,999 | Duration: 2-3 hrs", to: "/company/partnership-to-private", categoryKey: "company" },
            { title: "Convert LLP to Pvt Ltd", desc: "Price: ₹9,999 | Duration: 10-15 Days", to: "/company/llp-to-private", categoryKey: "company" }
        ]
    },
    "Taxation & Compliance": {
        "Direct & Indirect Tax": [
            { title: "GST Registration", desc: "Price: ₹999 | Duration: 3-7 Days", to: "/compliances/gst", categoryKey: "tax" },
            { title: "GST Return Filing", desc: "Price: ₹499/mo | Duration: Monthly", to: "/tax/gst-filing", categoryKey: "tax" },
            { title: "ITR Filing (Business)", desc: "Price: ₹2,499 | Duration: 3-5 Days", to: "/tax/itr-filing-business", categoryKey: "tax" },
            { title: "ITR Filing (Salaried)", desc: "Price: ₹999 | Duration: 2-3 Days", to: "/tax/itr-filing-salaried", categoryKey: "tax" },
            { title: "TDS Return Filing", desc: "Price: ₹1,499/qtr | Duration: Quarterly", to: "/tax/tds-filing", categoryKey: "tax" },
            { title: "GSTR Filings", desc: "Price: ₹699 | Duration: 30 mins", to: "/tax/gstr-filings", categoryKey: "tax" }
        ],
        "RoC/Secretarial Compliance": [
            { title: "Annual Compliance for PVT", desc: "Price: ₹24,500", to: "/roc/annual-pvt", categoryKey: "tax" },
            { title: "Annual Compliance for LLP", desc: "Price: ₹10,999", to: "/roc/annual-llp", categoryKey: "tax" },
            { title: "Director KYC(DIR-3) Filing", desc: "Price: ₹499 | Duration: 20 mins", to: "/roc/dir-3-filing", categoryKey: "tax" }
        ],
        "Labour Compliance": [
            { title: "PF/ESI Registration", desc: "Price: ₹3,999 | Duration: 5-7 Days", to: "/compliances/pf-esi", categoryKey: "tax" },
            { title: "PF & ESI Filings", desc: "Price: ₹1,000", to: "/labour/pf-esi", categoryKey: "tax" },
            { title: "Professional Tax Filings", desc: "Price: ₹2,500 | Duration: 30 mins", to: "/labour/professional-tax", categoryKey: "tax" },
            { title: "Payroll Processing", desc: "Price: ₹99/emp | Duration: Monthly", to: "/labour/payroll", categoryKey: "tax" }
        ],
        "Accounting & Financial Management": [
            { title: "Audit of a Company", desc: "Price: ₹7,500", to: "/accounting/audit", categoryKey: "tax" },
        ],
        "Business Expansion": [
            { title: "Due Deligence", desc: "Price: ₹2,500", to: "/business/due-diligence", categoryKey: "tax" },
            { title: "Pitch Deck Service", desc: "Price: ₹4,999 | Duration: 5-7 Days", to: "/business/pitch-deck", categoryKey: "tax" },
            { title: "Business Loan", desc: "Price: 2% of Loan | Duration: 15-30 Days", to: "/business/loan", categoryKey: "tax" },
            { title: "DPR Service", desc: "Price: ₹24,999 | Duration: 10-15 Days", to: "/business/dpr", categoryKey: "tax" }
        ]
    },
    "New Business/Closure": {
        "Business Registration": [
            { title: "Private Limited Company", desc: "Price: ₹6,999 | Duration: 7-14 Days", to: "/formation/private-ltd", categoryKey: "formation" },
            { title: "Public Limited Company", desc: "Price: ₹19,999 | Duration: 15-20 Days", to: "/formation/public-ltd", categoryKey: "formation" },
            { title: "Limited Liability Partnership", desc: "Price: ₹3,999 | Duration: 10-15 Days", to: "/formation/llp", categoryKey: "formation" },
            { title: "One Person Company", desc: "Price: ₹5,999 | Duration: 7-14 Days", to: "/formation/opc", categoryKey: "formation" },
            { title: "Sole Proprietorship", desc: "Price: ₹1,499 | Duration: 3-5 Days", to: "/formation/sole-proprietorship", categoryKey: "formation" },
            { title: "Nidhi Company", desc: "Price: ₹19,999 | Duration: 20-30 Days", to: "/formation/nidhi", categoryKey: "formation" },
            { title: "Producer Company", desc: "Price: ₹24,999 | Duration: 20-30 Days", to: "/formation/producer", categoryKey: "formation" },
            { title: "Partnership Firm", desc: "Price: ₹1,999 | Duration: 5-7 Days", to: "/formation/partnership", categoryKey: "formation" },
            { title: "Startup India Registration", desc: "Price: ₹1,999 | Duration: 15-20 Days", to: "/formation/startup-india", categoryKey: "formation" }
        ],
        "International Business Setup": [
            { title: "US Incorporation", desc: "Price: ₹29,999 | Duration: 15-20 Days", to: "/formation/us-inc", categoryKey: "formation" },
            { title: "Singapore Incorporation", desc: "Price: ₹1,49,999 | Duration: 10-15 Days", to: "/formation/singapore-inc", categoryKey: "formation" },
            { title: "UK Incorporation", desc: "Price: ₹19,999 | Duration: 3-5 Days", to: "/formation/uk-inc", categoryKey: "formation" },
            { title: "Netherlands Incorporation", desc: "Price: ₹6,50,000 | Duration: 20-30 Days", to: "/formation/netherlands-inc", categoryKey: "formation" },
            { title: "Hong Kong Company", desc: "Price: ₹1,80,000 | Duration: 15-20 Days", to: "/formation/hongkong-inc", categoryKey: "formation" },
            { title: "Dubai Incorporation", desc: "Price: ₹4,50,000 | Duration: 15-20 Days", to: "/formation/dubai-inc", categoryKey: "formation" }
        ],
        "NGO Registration": [
            { title: "Section 8 Company", desc: "Price: ₹12,999 | Duration: 15-20 Days", to: "/formation/section8", categoryKey: "formation" },
            { title: "Trust Registration", desc: "Price: ₹9,999 | Duration: 10-15 Days", to: "/formation/trust", categoryKey: "formation" },
            { title: "Society Registration", desc: "Price: ₹9,999 | Duration: 15-20 Days", to: "/formation/society", categoryKey: "formation" },
            { title: "Darpan Registration", desc: "Price: ₹1,999 | Duration: 5-7 Days", to: "/formation/darpan", categoryKey: "formation" },
            { title: "80G & 12A Registration", desc: "Price: ₹9,999 | Duration: 2-3 Months", to: "/formation/80g-12a", categoryKey: "formation" },
            { title: "FCRA Registration", desc: "Price: ₹14,999 | Duration: 3-6 Months", to: "/formation/fcra", categoryKey: "formation" },
            { title: "CSR-1 Filing", desc: "Price: ₹1,999 | Duration: 3-5 Days", to: "/formation/csr1", categoryKey: "formation" }
        ],
        "Closure/Cancellation": [
            { title: "Company Closure Service", desc: "Price: ₹3,999", to: "/closure/company-closure", categoryKey: "closure" },
            { title: "GST Cancellation Service", desc: "Price: ₹2,499", to: "/closure/gst-cancellation", categoryKey: "closure" }
        ]
    },
    "Legal Agreements": {
        "Contracts & Agreements": [
            { title: "NDA", desc: "Contact Expert to Get Price", to: "/legal/nda", categoryKey: "legal" },
            { title: "Master Service Agreement", desc: "Price: ₹2,000", to: "/legal/msa", categoryKey: "legal" },
            { title: "Franchise Agreement", desc: "Price: ₹2,000", to: "/legal/franchise", categoryKey: "legal" },
            { title: "Joint Venture Agreement", desc: "Price: ₹2,000", to: "/legal/joint-venture", categoryKey: "legal" },
            { title: "Founders Agreements", desc: "Price: ₹2,000", to: "/legal/founders", categoryKey: "legal" },
            { title: "Consultancy Services Agreement", desc: "Price: ₹1,000", to: "/legal/consultancy", categoryKey: "legal" },
            { title: "Employment Agreement", desc: "Price: ₹1,000", to: "/legal/employment", categoryKey: "legal" },
            { title: "Service Contract", desc: "Price: ₹1,000", to: "/legal/service-contract", categoryKey: "legal" }
        ],
        "Notices": [
            { title: "Legal Notice", desc: "Price: ₹1,499", to: "/legal/legal-notice", categoryKey: "legal" },
            { title: "Cheque Bounce Notice", desc: "Price: ₹2,500", to: "/legal/cheque-bounce", categoryKey: "legal" },
            { title: "Recovery of Dues", desc: "Price: ₹1,000", to: "/legal/recovery", categoryKey: "legal" }
        ],
        "Policy": [
            { title: "Terms of Service and Privacy Policy", desc: "Price: ₹1,500", to: "/legal/policies", categoryKey: "legal" }
        ]
    },
    "Expert Consultation": {
        "Talk to Expert": [
            { title: "Talk to a Lawyer", desc: "Price: ₹499 | Duration: 30 Mins", to: "/consult/lawyer", categoryKey: "legal" },
            { title: "Talk to a CA", desc: "Price: ₹499 | Duration: 30 Mins", to: "/consult/ca", categoryKey: "tax" },
            { title: "Talk to a CS", desc: "Price: ₹499 | Duration: 30 Mins", to: "/consult/cs", categoryKey: "company" },
            { title: "Talk to IP Expert", desc: "Price: ₹999 | Duration: 30 Mins", to: "/consult/ip", categoryKey: "ip" }
        ]
    }
};

const defaultTab = "Licenses/Registrations";
const tabKeys = Object.keys(tabData);

// ===========================================
// 1. ComplianceCardSmall Component
// ===========================================

const ComplianceCardSmall = ({ title, desc, to, categoryKey, onClick }) => (
    <div
        onClick={() => onClick({ title, desc, to, categoryKey })}
        className="block flex-1 flex flex-col justify-start bg-white border border-[#94C8FA] rounded-xl p-3 cursor-pointer transition-transform transform hover:scale-[1.03] hover:shadow-xl shadow-md"
    >
        <div className="w-8 h-8 bg-[#E5F7F7] rounded-lg mb-2 flex items-center justify-center">
            {/* Placeholder Icon */}
            <svg
                className="w-4 h-4 text-[#5FA1F9]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        </div>
        <div className="text-xs font-semibold text-gray-800">{title}</div>
        <div className="text-[11px] text-[#515554] mt-1 line-clamp-2 flex-grow">{desc}</div>
        <div className="mt-1 text-[11px] text-[#5FA1F9] font-bold hover:text-[#2E96FF] transition-colors flex items-center">
            View Details <ChevronRightIcon className="w-2.5 h-2.5 ml-1" />
        </div>
    </div>
);


// ===========================================
// 2. Detail Drawer Component Utilities
// ===========================================

const DetailBlock = ({ title, content, icon: Icon }) => (
    <div className="flex items-start p-4 space-x-3 border border-gray-100 rounded-lg bg-gray-50">
        <Icon className="w-6 h-6 text-[#2E96FF] flex-shrink-0 mt-0.5" />
        <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <p className="mt-1 text-sm text-gray-600">{content}</p>
        </div>
    </div>
);

const PricingPlans = ({ plans, serviceTitle, serviceDesc }) => {
    if (!plans) return null;
    const navigate = useNavigate();

    const tiers = [
        { key: 'standard', name: 'Standard', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
        { key: 'premium', name: 'Premium', color: 'text-white', bg: 'bg-[#2E96FF]', border: 'border-[#2E96FF]', isPopular: true },
        { key: 'elite', name: 'Elite', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
    ];

    const handlePlanSelect = (planKey, planPrice) => {
        const params = new URLSearchParams({
            title: serviceTitle,
            desc: serviceDesc,
            plan: planKey,
            price: planPrice
        });
        navigate(`/dashboard/user/service-order?${params.toString()}`);
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
            {tiers.map(tier => {
                const plan = plans[tier.key];
                if (!plan) return null;
                return (
                    <div
                        key={tier.key}
                        className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${tier.isPopular
                            ? 'border-2 border-[#2E96FF] shadow-xl scale-105 z-10 bg-white'
                            : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                            }`}
                    >
                        {tier.isPopular && (
                            <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3">
                                <span className="bg-[#003366] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${tier.key === 'premium' ? 'text-[#2E96FF]' : 'text-gray-500'}`}>
                            {tier.name}
                        </h4>

                        <div className="mb-6 flex items-baseline">
                            <span className="text-3xl font-extrabold text-[#003366]">₹{plan.price?.toLocaleString()}</span>
                        </div>

                        <ul className="flex-1 mb-8 space-y-3">
                            {plan.features?.length > 0 ? (
                                plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                        <CheckIcon className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${tier.key === 'premium' ? 'text-[#2E96FF]' : 'text-green-500'}`} />
                                        <span className="leading-5">{feature}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm italic text-gray-400">Standard features included.</li>
                            )}
                        </ul>

                        <button
                            onClick={() => handlePlanSelect(tier.key, plan.price)}
                            className={`w-full py-3 text-sm font-bold rounded-xl transition-colors duration-200 ${tier.isPopular
                                ? 'bg-[#2E96FF] text-white hover:bg-[#2579cd] shadow-md hover:shadow-lg'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            Select {tier.name}
                        </button>
                    </div>
                )
            })}
        </div>
    );
};

// Component: show GST orders for the authenticated user
function GstOrdersList() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const user = getAuth()?.user;

    React.useEffect(() => {
        let mounted = true;
        setLoading(true);
        serviceHubAPI.myOrders('GST Registration').then(r => {
            if (!mounted) return;
            setOrders(r.data);
            setError(null);
        }).catch(err => { if (mounted) setError(err); }).finally(() => { if (mounted) setLoading(false); });
        return () => mounted = false;
    }, []);

    if (loading) return <div className="text-sm text-gray-500">Loading your GST orders...</div>;
    if (error) return <div className="text-sm text-red-600">Failed to load orders</div>;
    if (!orders.length) return <div className="text-sm text-gray-600">You have no GST registration orders yet. <Link to="/Licenses/gst" className="text-blue-600">Start now</Link></div>;

    return (
        <div className="space-y-4">
            {orders.map((entry) => (
                <div key={entry.order.id} className="p-3 bg-white border rounded">
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium">Order #{entry.order.id} — {entry.order.serviceName}</div>
                            <div className="text-xs text-gray-500">Status: {entry.order.status}</div>
                        </div>
                        <div className="text-xs text-right text-gray-500">Created: {new Date(entry.order.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="mt-3">
                        <div className="mb-2 text-sm font-semibold">Process Stages</div>
                        <ul className="space-y-2">
                            {entry.stages.map(s => (
                                <li key={s.id} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm">{s.stage}</div>
                                        <div className="text-xs text-gray-500">{s.status} — {s.notes}</div>
                                    </div>
                                    <div>
                                        {/* No actions for user */}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Component: admin/employee GST orders with quick actions
function GstAdminList() {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const user = getAuth()?.user;

    const load = () => {
        setLoading(true);
        serviceHubAPI.orders('GST Registration').then(r => { setOrders(r.data); setError(null); }).catch(e => setError(e)).finally(() => setLoading(false));
    };

    React.useEffect(() => { load(); }, []);

    const markStage = async (orderId, stageName) => {
        try {
            await processAPI.addStage(orderId, { stage: stageName, status: 'completed', notes: 'Marked completed via dashboard' });
            load();
        } catch (err) {
            alert('Failed to update stage');
        }
    };

    if (loading) return <div className="text-sm text-gray-500">Loading GST orders...</div>;
    if (error) return <div className="text-sm text-red-600">Failed to load orders</div>;
    if (!orders.length) return <div className="text-sm text-gray-600">No GST orders found.</div>;

    return (
        <div className="space-y-4">
            {orders.map((entry) => (
                <div key={entry.order.id} className="p-3 bg-white border rounded">
                    <div className="flex justify-between">
                        <div>
                            <div className="font-medium">Order #{entry.order.id} — {entry.order.serviceName}</div>
                            <div className="text-xs text-gray-500">Status: {entry.order.status} — Assigned: {entry.order.assigneeEmail || 'unassigned'}</div>
                        </div>
                        <div className="text-xs text-right text-gray-500">Created: {new Date(entry.order.createdAt).toLocaleString()}</div>
                    </div>

                    <div className="mt-3">
                        <div className="mb-2 text-sm font-semibold">Process Stages</div>
                        <ul className="space-y-2">
                            {entry.stages.map(s => (
                                <li key={s.id} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm">{s.stage}</div>
                                        <div className="text-xs text-gray-500">{s.status} — {s.notes}</div>
                                    </div>
                                    <div>
                                        {s.status !== 'completed' && (
                                            <button onClick={() => markStage(entry.order.id, s.stage)} className="px-2 py-1 text-xs text-white bg-green-600 rounded">Mark Completed</button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

const getServiceSpecificContent = (service) => {
    // Process steps for generic services, based on category
    const processStepData = {
        licenses: [
            { icon: DocumentMagnifyingGlassIcon, title: "Document Vetting", desc: "Specialists review your identity, address, and business documents for compliance." },
            { icon: ShieldCheckIcon, title: "Application Filing", desc: "The application is prepared and submitted to the relevant government portal." },
            { icon: BanknotesIcon, title: "Fee Payment & Receipt", desc: "Government fees are paid, and the official application receipt is generated." },
            { icon: CheckCircleIcon, title: "Certificate Delivery", desc: "Upon approval, the final license or registration certificate is uploaded." },
        ],
        ip: [
            { icon: DocumentMagnifyingGlassIcon, title: "Preliminary Search", desc: "Comprehensive search to ensure the trademark or patent is unique and registrable." },
            { icon: ShieldCheckIcon, title: "Drafting & Filing", desc: "Application specifications are drafted by legal experts and filed with the IP office." },
            { icon: ClockIcon, title: "Examination & Hearing", desc: "Handling official objections or hearing requirements on your behalf." },
            { icon: CheckCircleIcon, title: "Registration Granted", desc: "The final registration certificate is secured, granting you exclusive rights." },
        ],
        tax: [
            { icon: DocumentMagnifyingGlassIcon, title: "Data Collection", desc: "Gathering necessary financial data, invoices, and expense details." },
            { icon: ShieldCheckIcon, title: "Return Preparation", desc: "Our CAs prepare the ITR, GSTR, or TDS forms ensuring zero errors and maximum compliance." },
            { icon: BanknotesIcon, title: "E-Filing & Acknowledgment", desc: "The returns are filed electronically, and the official government acknowledgment is provided." },
            { icon: CheckCircleIcon, title: "Audit Support", desc: "Ongoing support provided for any notices or inquiries." },
        ],
        // Defaulting to a sensible set for 'company', 'formation', 'closure' etc.
        legal: [
            { icon: DocumentMagnifyingGlassIcon, title: "Requirement Gathering", desc: "Detailed consultation to understand the scope and intent of the agreement." },
            { icon: ShieldCheckIcon, title: "Drafting by Lawyer", desc: "The contract/agreement is drafted by a legal expert to ensure enforceability." },
            { icon: ClockIcon, title: "Review & Revisions", desc: "Up to two rounds of revisions based on client feedback." },
            { icon: CheckCircleIcon, title: "Final E-Sign Delivery", desc: "The final, legally vetted document is delivered for execution." },
        ],
        company: [ // Using a sensible default for company changes
            { icon: DocumentMagnifyingGlassIcon, title: "Data Collection & Vetting", desc: "Gathering required director/partner, shareholding, or objective data." },
            { icon: ShieldCheckIcon, title: "Drafting Resolutions & Forms", desc: "Preparation of Board Resolutions, EGM/AGM minutes, and statutory forms." },
            { icon: BanknotesIcon, title: "RoC Filing", desc: "Filing of required E-forms (e.g., MGT-14, DIR-12, INC-24) with the Registrar of Companies." },
            { icon: CheckCircleIcon, title: "Approval & Certificate Update", desc: "Receiving the official RoC approval and updated company certificate/documents." },
        ],
        formation: [ // Using a sensible default for new business
            { icon: DocumentMagnifyingGlassIcon, title: "Name Approval", desc: "Filing for name reservation (RUN) with the RoC or equivalent authority." },
            { icon: ShieldCheckIcon, title: "Document Submission", desc: "Filing of all incorporation documents (MoA, AoA, etc.) and fees." },
            { icon: BanknotesIcon, title: "PAN, TAN, Bank A/C", desc: "Application for PAN, TAN, and guidance on opening the corporate bank account." },
            { icon: CheckCircleIcon, title: "Certificate of Incorporation", desc: "Final delivery of the Certificate of Incorporation/Registration and other key documents." },
        ],
        closure: [ // Using a sensible default for closure
            { icon: DocumentMagnifyingGlassIcon, title: "Compliance Check", desc: "Verifying all pending tax and statutory liabilities." },
            { icon: ShieldCheckIcon, title: "Application Filing", desc: "Preparation and filing of the closure application (e.g., STK-2 or GST cancellation request)." },
            { icon: ClockIcon, title: "Authority Processing", desc: "Monitoring the process through the respective government authority." },
            { icon: CheckCircleIcon, title: "Final Approval Order", desc: "Delivery of the final order/notification confirming the successful closure/cancellation." },
        ]
    };

    const processDetails = processStepData[service.categoryKey] || processStepData.licenses;

    // Pricing Match Logic
    const pricingService = servicesData.find(s => s.name.toLowerCase().trim() === service.title.toLowerCase().trim()) ||
        servicesData.find(s => s.name.toLowerCase().includes(service.title.toLowerCase()) || service.title.toLowerCase().includes(s.name.toLowerCase()));

    let pricingSection = null;
    if (pricingService && pricingService.plans && (pricingService.plans.standard || pricingService.plans.premium)) {
        pricingSection = {
            id: 'pricing_group',
            title: 'Pricing Plans',
            content: (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-[#003366]">Transparent Pricing</h3>
                    <PricingPlans plans={pricingService.plans} serviceTitle={service.title} serviceDesc={service.desc} />
                </div>
            )
        };
    }

    if (service.title === "GST Registration") {
        return {
            isSpecific: true,
            sections: [
                {
                    id: 'overview_group',
                    title: 'Overview',
                    content: (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-base">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">About GST Registration</h4>
                                    <p>
                                        Every business or corporation that buys and sells goods or services has to register for GST if they cross the threshold. The threshold limit is Rs.40 lakhs for goods and Rs.20 lakhs for services in normal states.
                                    </p>
                                    <p className="mt-4">
                                        With us, you can register for GST electronically and get your GSTIN easily in a few simple steps.
                                    </p>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                    <h5 className="font-bold text-[#003366] mb-4 flex items-center">
                                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                        Compliance Authority
                                    </h5>
                                    <div className="text-3xl font-extrabold text-[#2E96FF] mb-1">CBIC</div>
                                    <div className="text-sm text-gray-500">Government of India</div>

                                    <div className="mt-6 pt-6 border-t border-blue-100 text-sm font-medium text-gray-700">
                                        <span className="block mb-1 text-gray-500 text-xs uppercase tracking-wider">Average Timeline</span>
                                        3-7 Working Days
                                    </div>
                                </div>
                            </div>    {/* 1.1 Benefits */}
                            <div className="mt-8">
                                <h4 className="pb-6 text-xl font-bold text-gray-900">Why Register GST?</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-2xl">⚖️</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Legal Shield</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Avoid penalties, seize legal protection, and operate worry-free.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-2xl">🏦</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Banking Access</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Open current accounts and access business loans with ease.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-2xl">💸</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Input Credit</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Reduce costs by claiming tax credit on your business purchases.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                ...(pricingSection ? [pricingSection] : []),
                {
                    id: 'process_docs_group',
                    title: 'Process & Documents',
                    content: (
                        <div className="space-y-8">
                            {/* 2.1 Documents Required */}
                            <div>
                                <h4 className="pb-6 text-xl font-bold text-gray-900">Required Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        "Company PAN",
                                        "Incorporation Cert",
                                        "Board Resolution",
                                        "Directors' PAN",
                                        "Passport Photos",
                                        "Email & Mobile",
                                        "Aadhar Card",
                                        "Director's DSC"
                                    ].map((doc, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 text-center h-full hover:border-[#2E96FF] transition-colors">
                                            <DocumentMagnifyingGlassIcon className="w-8 h-8 text-[#2E96FF] mb-3 opacity-80" />
                                            <span className="text-sm font-semibold text-gray-700">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2.2 Deliverables */}
                            <div className="mt-8 bg-[#003366] rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white/10 p-4 rounded-full">
                                        <CheckCircleIcon className="w-12 h-12 text-green-400" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="text-xl font-bold mb-2">Your Deliverables</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-blue-100 text-sm">
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>GSTIN Number</li>
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>HSN / SAC Codes</li>
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>Login Credentials</li>
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>30-Day Support</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        };
    } else if (service.title === "MSME Registration") {
        return {
            isSpecific: true,
            sections: [
                {
                    id: 'overview_group',
                    title: '1. Overview',
                    content: (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-base">
                                    <h4 className="text-xl font-bold text-gray-900 mb-4">About MSME Registration</h4>
                                    <p>
                                        Small scale businesses play a vital role in the economy. Registering under the **MSME Act** (Udyog Aadhaar) unlocks numerous government benefits, subsidies, and protection for your business.
                                    </p>
                                    <p className="mt-4">
                                        Whether you are a manufacturer or service provider, get your certificate easily and access the growth engine of the Indian economy.
                                    </p>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                                    <h5 className="font-bold text-orange-900 mb-4 flex items-center">
                                        <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                        Govt. Initiative
                                    </h5>
                                    <div className="text-3xl font-extrabold text-[#2E96FF] mb-1">MoMSME</div>
                                    <div className="text-sm text-gray-500">Ministry of MSME</div>

                                    <div className="mt-6 pt-6 border-t border-orange-100 text-sm font-medium text-gray-700">
                                        <span className="block mb-1 text-gray-500 text-xs uppercase tracking-wider">Validity</span>
                                        Lifetime Validity
                                    </div>
                                </div>
                            </div>

                            {/* 1.1 Benefits */}
                            <div className="mt-8">
                                <h4 className="pb-6 text-xl font-bold text-gray-900">MSME Benefits</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-2xl">📉</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Lower Rates</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Concession on electricity bills and lower interest rates on bank loans.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-2xl">💼</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Collateral Free</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Easier access to collateral-free loans under government credit guarantee schemes.</p>
                                    </div>
                                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-2xl">🚀</div>
                                        <h5 className="font-bold text-gray-900 mb-2">Subsidies</h5>
                                        <p className="text-sm text-gray-600 leading-relaxed">Avail subsidies on patent registration, ISO certification, and more.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
                ...(pricingSection ? [pricingSection] : []),
                {
                    id: 'process_docs_group',
                    title: '2. Process & Documents',
                    content: (
                        <div className="space-y-8">
                            {/* 2.1 Documents Required */}
                            <div>
                                <h4 className="pb-6 text-xl font-bold text-gray-900">Required Documents</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        "Aadhar Card (Applicant)",
                                        "PAN Card (Applicant)",
                                        "Company PAN (if applicable)",
                                        "Business Address Proof",
                                        "Bank Account Details",
                                        "NIC Code (Business Activity)",
                                        "Investment Details",
                                        "Turnover Details"
                                    ].map((doc, i) => (
                                        <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200 text-center h-full hover:border-orange-200 transition-colors">
                                            <DocumentMagnifyingGlassIcon className="w-8 h-8 text-orange-400 mb-3 opacity-80" />
                                            <span className="text-sm font-semibold text-gray-700">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 2.2 Deliverables */}
                            <div className="mt-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white/20 p-4 rounded-full">
                                        <CheckCircleIcon className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="text-xl font-bold mb-2">Deliverables</h4>
                                        <p className="text-orange-50 leading-relaxed text-sm">
                                            You will receive the official <strong>Udyam Registration Certificate</strong> (MSME Certificate) directly to your email. This certificate is valid for a lifetime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ],
        };
    }

    // --- Restructure Generic Content for all other services ---
    return {
        isSpecific: false,
        sections: [
            {
                id: 'overview_group',
                title: 'Overview',
                content: (
                    <div className="space-y-3">
                        {/* 1.2 Description */}
                        <h3 className="pb-4 text-xl font-bold text-[#003366]">About this Service</h3>
                        <p className="text-sm leading-relaxed text-gray-600">
                            This service helps businesses like yours fulfill regulatory requirements related to{" "}
                            <strong>{service.title}</strong>. Our experts ensure a smooth, transparent, and compliant
                            process from start to finish, letting you focus on your core business.
                        </p>

                        {/* 1.1 Benefits */}
                        <h4 className="pt-3 pb-1 text-base font-semibold text-gray-700 border-b border-gray-100">
                            Key Benefits
                        </h4>
                        <ul className="ml-4 space-y-1 text-xs text-gray-600 list-disc list-inside">
                            <li>
                                Ensures <strong>legal compliance</strong> and avoids penalties.
                            </li>
                            <li>
                                Builds <strong>credibility</strong> and trust with customers and partners.
                            </li>
                            <li>
                                Facilitates smoother <strong>business operations</strong> and expansion.
                            </li>
                        </ul>
                    </div>
                )
            },
            ...(pricingSection ? [pricingSection] : []),
            {
                id: 'process_docs_group',
                title: 'Process & Documents',
                content: (
                    <div className="space-y-8">
                        {/* Process Steps */}

                        <div>
                            <h4 className="pb-6 text-xl font-bold text-gray-900">How It Works</h4>
                            <div className="relative pl-4 space-y-8">
                                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-[#2E96FF] to-transparent"></div>
                                {processDetails.map((step, index) => (
                                    <div key={index} className="relative pl-10 group">
                                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-[#2E96FF] flex items-center justify-center z-10 shadow-sm group-hover:scale-110 transition-transform">
                                            <step.icon className="w-5 h-5 text-[#2E96FF]" />
                                        </div>
                                        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2.1 Documents Required */}
                        <div className="pt-8">
                            <h4 className="pb-6 text-xl font-bold text-gray-900">
                                Documents Required
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    "Proof of Identity",
                                    "Proof of Address (Business)",
                                    "Proof of Address (Directors)",
                                    "Registration Documents",
                                    "MOA / AOA (if applicable)",
                                    "Bank Statement / Cancelled Cheque"
                                ].map((doc, i) => (
                                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#2E96FF] hover:bg-blue-50 transition-all cursor-default">
                                        <DocumentMagnifyingGlassIcon className="w-6 h-6 text-[#2E96FF] mr-3 shrink-0" />
                                        <span className="text-sm font-semibold text-gray-700">{doc}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-xs text-gray-500 italic flex items-center">
                                <span className="bg-blue-100 text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-2 font-bold">i</span>
                                Specific document checklist will be shared after consultation.
                            </p>
                        </div>

                        {/* 2.2 Deliverables */}
                        <div className="pt-8">
                            <h4 className="pb-6 text-xl font-bold text-gray-900">
                                What You Receive
                            </h4>
                            <div className="bg-gradient-to-br from-[#003366] to-[#004e9a] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                        <CheckCircleIcon className="w-10 h-10 text-green-300" />
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h5 className="text-xl font-bold mb-2">Complete Success Kit</h5>
                                        <p className="text-blue-100 leading-relaxed max-w-xl">
                                            You will receive the final official certificate, government filing receipts, and access to 30 days of expert post-service consultation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
        ],
    };
};

// ===========================================
// 3. ServiceDetailDrawer Component (The Popup)
// ===========================================

const ServiceDetailDrawer = ({ service, onClose }) => {
    // Disable body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const { sections, isSpecific } = getServiceSpecificContent(service);
    const navigate = useNavigate();

    // State and Refs for Navigation
    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null);
    const sectionRefs = useRef({});
    const contentRef = useRef(null);

    const drawerVariants = {
        hidden: { y: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
        visible: { y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    };

    // Function to handle click and smooth scroll
    const scrollToSection = (id) => {
        const element = sectionRefs.current[id];
        if (element && contentRef.current) {
            // Calculate scroll position relative to the scrollable container's top
            const offset = element.offsetTop;
            // Desktop: Little offset for padding; Mobile: Account for sticky header
            const isMobile = window.innerWidth < 768;
            const scrollOffset = isMobile ? 120 : 30; // Reduced offset for desktop as no sticky header overlay

            contentRef.current.scrollTo({ top: offset - scrollOffset, behavior: 'smooth' });
            setActiveSectionId(id);
        }
    };

    // Intersection Observer for Scroll Tracking
    useEffect(() => {
        if (!contentRef.current || sections.length === 0) return;

        const observerOptions = {
            root: contentRef.current,
            rootMargin: '-20% 0px -60% 0px', // Adjusted for better triggering in sidebar layout
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSectionId(entry.target.id);
                }
            });
        }, observerOptions);

        const currentRefs = sectionRefs.current;
        const elements = sections.map(s => currentRefs[s.id]).filter(Boolean);

        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, [sections, service.title]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full h-full bg-gray-50 relative flex flex-col md:flex-row overflow-hidden shadow-2xl"
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* =======================
                    SIDEBAR (Desktop Only)
                   ======================= */}
                <div className="hidden md:flex w-80 bg-white border-r border-gray-200 flex-col shrink-0 z-20 h-full">
                    {/* Sidebar Header */}
                    <div className="p-8 pb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2E96FF] mb-4">
                            <DocumentMagnifyingGlassIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#003366] leading-tight">
                            {service.title}
                        </h2>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-2">Service Details</p>
                    </div>

                    {/* Sidebar Navigation */}
                    <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center group
                                    ${activeSectionId === section.id
                                        ? "bg-[#2E96FF]/10 text-[#2E96FF]"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-colors ${activeSectionId === section.id ? 'bg-[#2E96FF]' : 'bg-gray-300 group-hover:bg-gray-400'}`}></span>
                                {section.title}
                            </button>
                        ))}
                    </nav>

                </div>

                {/* =======================
                    MOBILE HEADER (Visible < md)
                   ======================= */}
                <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm shrink-0">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-lg font-bold text-[#003366] truncate pr-4">
                            {service.title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Mobile Horizontal Nav */}
                    <nav className="flex overflow-x-auto px-4 pb-0 hide-scrollbar space-x-6 border-t border-gray-50">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                                    ${activeSectionId === section.id
                                        ? "text-[#2E96FF] border-[#2E96FF]"
                                        : "text-gray-500 border-transparent"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>


                {/* =======================
                    MAIN CONTENT AREA
                   ======================= */}
                <div className="flex-1 relative flex flex-col h-full bg-gray-50 min-w-0">
                    {/* Desktop Close Button (Floating) */}
                    <button
                        onClick={onClose}
                        className="hidden md:flex absolute top-6 right-8 z-50 p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm hover:shadow-md"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Scrollable Container */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto scroll-smooth">
                        <div className="p-4 md:p-10 max-w-5xl mx-auto space-y-8 pb-32 md:pb-12">
                            {/* Service Snapshot Strip */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap gap-6 items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <BanknotesIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Starting Price</div>
                                        <div className="text-lg font-bold text-gray-900">{service.desc.split('|')[0] || "Custom"}</div>
                                    </div>
                                </div>

                                {service.desc.includes('|') && (
                                    <div className="w-px h-10 bg-gray-100 hidden sm:block"></div>
                                )}

                                {service.desc.includes('|') && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                                            <ClockIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Duration</div>
                                            <div className="text-lg font-bold text-gray-900">{service.desc.split('|')[1]}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Render Sections */}
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    id={section.id}
                                    ref={(el) => (sectionRefs.current[section.id] = el)}
                                    className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 scroll-mt-6"
                                >
                                    {section.title !== '1. Overview' && section.title !== 'Overview' && (
                                        <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">{section.title}</h3>
                                    )}
                                    <div className="text-base text-gray-700">
                                        {section.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};


// ===========================================
// MAIN COMPONENT: ServicesHub
// ===========================================

export default function ServicesHub() {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [activeSubTab, setActiveSubTab] = useState(
        Object.keys(tabData[defaultTab])[0] || ""
    );
    const [selectedService, setSelectedService] = useState(null);
    const navigate = useNavigate(); // Assume react-router-dom is correctly configured
    const tabNavRef = useRef(null);
    const tabRefs = useRef({});

    // Effect to reset sub-tab when main tab changes
    useEffect(() => {
        const firstSubTab = Object.keys(tabData[activeTab])[0];
        if (firstSubTab) {
            setActiveSubTab(firstSubTab);
        } else {
            setActiveSubTab("");
        }
        setSelectedService(null);
    }, [activeTab]);

    const location = useLocation(); // Make sure to import this

    // Effect to check location state for incoming service requests
    useEffect(() => {
        if (location.state?.serviceTitle) {
            const requestedService = location.state.serviceTitle.toLowerCase().trim();

            // Search through tabData to find the matching service
            for (const [tabKey, subTabs] of Object.entries(tabData)) {
                for (const [subTabKey, services] of Object.entries(subTabs)) {
                    if (Array.isArray(services)) {
                        const match = services.find(s =>
                            s.title.toLowerCase().trim() === requestedService ||
                            s.title.toLowerCase().includes(requestedService) ||
                            requestedService.includes(s.title.toLowerCase())
                        );

                        if (match) {
                            setActiveTab(tabKey);
                            setActiveSubTab(subTabKey);
                            // Optionally auto-open the detail drawer
                            setSelectedService(match);

                            // Clear state so it doesn't persist on refresh if desired (optional)
                            // window.history.replaceState({}, document.title)
                            return; // Stop searching once found
                        }
                    }
                }
            }
        }
    }, [location.state]);

    // Effect for smooth scrolling the main tab navigation bar
    useEffect(() => {
        const activeTabElement = tabRefs.current[activeTab];
        const navContainer = tabNavRef.current;

        if (activeTabElement && navContainer) {
            const scrollPosition =
                activeTabElement.offsetLeft -
                navContainer.offsetWidth / 2 +
                activeTabElement.offsetWidth / 2;

            navContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, [activeTab]);


    const [searchTerm, setSearchTerm] = useState("");

    // Flatten all services for search
    const allServices = useMemo(() => {
        const services = [];
        Object.entries(tabData).forEach(([category, subCats]) => {
            Object.entries(subCats).forEach(([subCat, items]) => {
                items.forEach(item => {
                    services.push({ ...item, category, subCat });
                });
            });
        });
        return services;
    }, []);

    const subTabs = Object.keys(tabData[activeTab] || {});
    const contentKey = `${activeTab}-${activeSubTab}`;

    // Determine which data to display: Search Results OR Current Tab Data
    const baseData = searchTerm
        ? allServices.filter(s =>
            s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : (tabData[activeTab]?.[activeSubTab] || []);

    // Dynamic Pricing Integration (Applied to whatever data is being displayed)
    const displayedData = baseData.map(item => {
        const pricingService = servicesData.find(s =>
            s.name.toLowerCase().trim() === item.title.toLowerCase().trim() ||
            s.name.toLowerCase().includes(item.title.toLowerCase()) ||
            item.title.toLowerCase().includes(s.name.toLowerCase())
        );

        if (pricingService) {
            let price = null;
            // Try standard, then premium, then elite to find a starting price
            if (pricingService.plans?.standard?.price) price = pricingService.plans.standard.price;
            else if (pricingService.plans?.premium?.price) price = pricingService.plans.premium.price;
            else if (pricingService.plans?.elite?.price) price = pricingService.plans.elite.price;

            if (price !== null) {
                const durationStr = pricingService.time ? ` | Duration: ${pricingService.time}` : "";
                return {
                    ...item,
                    // Update description with real price and time
                    desc: `Price: ₹${price.toLocaleString()}${durationStr}`
                };
            } else {
                // If plans exist but all prices are null (e.g., custom services)
                if (pricingService.plans && Object.values(pricingService.plans).every(p => !p || !p.price)) {
                    return { ...item, desc: "Contact Expert to Get Price" };
                }
            }
        }
        return item;
    });
    const placeholdersCount = Math.max(0, 10 - displayedData.length);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm(""); // Clear search when manually changing tabs
    };

    const handleCardClick = (service) => {
        // This opens the ServiceDetailDrawer popup
        setSelectedService(service);
    };

    return (
        <div className="font-sans antialiased">
            <div className="p-4 bg-white rounded-xl md:p-8">

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DocumentMagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#2E96FF] focus:border-transparent transition-all duration-200 sm:text-sm shadow-sm"
                        placeholder="Search for services (e.g., GST, Trademark, Payroll)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* 1. Main Tab Navigation (Hidden when searching) */}
                {!searchTerm && (
                    <nav
                        ref={tabNavRef}
                        className="flex px-4 pt-4 mb-6 -mx-4 overflow-x-auto border-b border-gray-200 whitespace-nowrap md:-mx-8 md:px-8"
                        style={{
                            scrollbarWidth: "none", // Firefox
                            msOverflowStyle: "none", // IE 10+
                        }}
                    >
                        {tabKeys.map((tab) => (
                            <button
                                key={tab}
                                ref={el => tabRefs.current[tab] = el}
                                onClick={() => handleTabChange(tab)}
                                className={`flex-shrink-0 pb-3 px-4 md:px-6 text-sm md:text-base font-medium transition-colors border-b-2
                                    ${activeTab === tab
                                        ? "text-[#2E96FF] border-[#2E96FF] font-semibold"
                                        : "text-gray-500 border-transparent hover:text-gray-800 hover:border-gray-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                )}

                {/* 2. Sub Tabs (Hidden when searching) */}
                {!searchTerm && subTabs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 md:gap-3">
                        {subTabs.map((sub) => (
                            <button
                                key={sub}
                                onClick={() => setActiveSubTab(sub)}
                                className={`py-2 px-3 md:px-4 text-xs sm:text-sm rounded-full transition-colors duration-200
                                    ${activeSubTab === sub
                                        ? "bg-[#2E96FF] text-white font-semibold shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results Header */}
                {searchTerm && (
                    <div className="mb-4 text-sm text-gray-500 font-medium">
                        Found {displayedData.length} results for "{searchTerm}"
                    </div>
                )}

                {/* 3. Grid Content */}

                {/* 3. Grid Content with Framer Motion Transition and Uniform Card Height */}
                <div className="mt-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={contentKey}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid items-stretch grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:gap-6"
                        >
                            {Array.isArray(displayedData) && displayedData.length > 0 ? (
                                displayedData.map((service, i) => (
                                    <motion.div
                                        key={service.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: i * 0.05 }}
                                        className="flex"
                                    >
                                        <ComplianceCardSmall
                                            {...service}
                                            onClick={handleCardClick}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full">
                                    No services available for this category.
                                </p>
                            )}

                            {/* Placeholder divs for consistent grid layout */}
                            {Array.from({ length: placeholdersCount }).map((_, i) => (
                                <div key={`placeholder-${i}`} className="hidden lg:block" />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Detail Drawer - The Popup that opens on card click */}
            <AnimatePresence>
                {selectedService && (
                    <ServiceDetailDrawer
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                )}
            </AnimatePresence>

        </div>
    );
}
