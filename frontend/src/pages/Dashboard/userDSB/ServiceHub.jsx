import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ChevronRightIcon, BanknotesIcon, ShieldCheckIcon, DocumentMagnifyingGlassIcon, RocketLaunchIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { serviceHubAPI, processAPI } from "../../../lib/api";
import { getAuth } from "../../../lib/auth";

// ===========================================
// STATIC DATA
// ===========================================

const tabData = {
    "Licenses/Registrations": {
        "Business Essentials": [
            { title: "GST Registration", desc: "Starts from ₹749₹499", to: "/compliances/gst", categoryKey: "licenses" },
            { title: "MSME Registration", desc: "Starts from ₹699", to: "/Licenses/msme", categoryKey: "licenses" },
            { title: "Food License", desc: "Contact Expert to Get Price", to: "/licenses/fssai", categoryKey: "licenses" },
            { title: "Digital Signature Certificate", desc: "Starts from ₹847", to: "/licenses/dsc", categoryKey: "licenses" },
            { title: "Trade License", desc: "Starts from ₹1499₹999", to: "/licenses/trade", categoryKey: "licenses" }
        ],
        "Labour Compliance": [
            { title: "PF/ESI Registration", desc: "Starts from ₹249", to: "/compliances/pf-esi", categoryKey: "licenses" },
            { title: "Professional Tax Registration", desc: "Starts from ₹2999₹2699", to: "/compliances/professional-tax", categoryKey: "licenses" },
            { title: "Shops & Establishment License", desc: "Starts from ₹1999", to: "/licenses/shop", categoryKey: "licenses" }
        ],
        "Export Business": [
            { title: "Import Export Code Registration (IEC)", desc: "Starts from ₹249", to: "/licenses/iec", categoryKey: "licenses" },
            { title: "AD Code Registration", desc: "Contact Expert to Get Price", to: "/licenses/adcode", categoryKey: "licenses" },
            { title: "APEDA Registration", desc: "Starts from ₹1499₹999", to: "/licenses/apeda", categoryKey: "licenses" }
        ],
        "Quality & Standards": [
            { title: "ISO Certification", desc: "Contact Expert to Get Price", to: "/licenses/iso", categoryKey: "licenses" },
            { title: "Hallmark Registration", desc: "Starts from ₹1499₹999", to: "/licenses/hallmark", categoryKey: "licenses" }
        ]
    },
    "Trademark/IP": {
        "Trademark": [
            { title: "Trademark Registration", desc: "Starts from ₹1499₹1349", to: "/ip/trademark-registration", categoryKey: "ip" },
            { title: "Respond to Trademark Objection", desc: "Starts from ₹2999", to: "/ip/trademark-objection", categoryKey: "ip" },
            { title: "Trademark Hearing Service", desc: "Starts from ₹1999₹1499", to: "/ip/trademark-hearing", categoryKey: "ip" },
            { title: "Renewal of Trademark", desc: "Starts from ₹1499₹999", to: "/ip/trademark-renewal", categoryKey: "ip" },
            { title: "International Trademark", desc: "Starts from ₹1499₹999", to: "/ip/international-trademark", categoryKey: "ip" }
        ],
        "Copyright": [
            { title: "Copyright Music", desc: "Starts from ₹499", to: "/ip/copyright-music", categoryKey: "ip" }
        ],
        "Patent": [
            { title: "Patent Search", desc: "Starts from ₹1999", to: "/ip/patent-search", categoryKey: "ip" },
            { title: "Provisional Patent Application", desc: "Contact Expert to Get Price", to: "/ip/provisional-patent", categoryKey: "ip" },
            { title: "Patent Registration", desc: "Starts from ₹5999", to: "/ip/patent-registration", categoryKey: "ip" }
        ],
        "Infringement": [
            { title: "Patent Infringement", desc: "Starts from ₹1499₹999", to: "/ip/patent-infringement", categoryKey: "ip" }
        ]
    },
    "Company Change": {
        "Company Name/Management": [
            { title: "Change the Name of Your Company", desc: "Contact Expert to Get Price", to: "/company/change-name", categoryKey: "company" },
            { title: "Change the Objectives of Your Business", desc: "Contact Expert to Get Price", to: "/company/change-objectives", categoryKey: "company" },
            { title: "Appointment of a Director/Partner", desc: "Contact Expert to Get Price", to: "/company/appoint-director", categoryKey: "company" },
            { title: "Removal of a Director/Partner", desc: "Contact Expert to Get Price", to: "/company/remove-director", categoryKey: "company" },
            { title: "Change the Official Address of Your Company (Within the City)", desc: "Contact Expert to Get Price", to: "/company/change-address-city", categoryKey: "company" },
            { title: "Change the Official Address of Your Company (From One State to Another State)", desc: "Contact Expert to Get Price", to: "/company/change-address-state", categoryKey: "company" }
        ],
        "Capital & Share Services": [
            { title: "Transfer of Shares", desc: "Contact Expert to Get Price", to: "/company/transfer-shares", categoryKey: "company" },
            { title: "Changing the Authorized Capital of your Company", desc: "Contact Expert to Get Price", to: "/company/change-capital", categoryKey: "company" }
        ],
        "Business Upgrades": [
            { title: "Convert your Partnership into a Private Limited company", desc: "Contact Expert to Get Price", to: "/company/partnership-to-private", categoryKey: "company" },
            { title: "Convert your LLP into a Private Limited Company", desc: "Contact Expert to Get Price", to: "/company/llp-to-private", categoryKey: "company" },
            { title: "Convert your Sole Proprietorship into a Private Limited Company", desc: "Contact Expert to Get Price", to: "/company/sole-to-private", categoryKey: "company" }
        ]
    },
    "Taxation & Compliance": {
        "Direct & Indirect Tax": [
            { title: "Income Tax Return Filing (ITR)", desc: "Contact Expert to Get Price", to: "/tax/itr-filing", categoryKey: "tax" },
            { title: "TDS Return Filing", desc: "Contact Expert to Get Price", to: "/tax/tds-filing", categoryKey: "tax" },
            { title: "GSTR Filings", desc: "Starts from ₹3999₹2999", to: "/tax/gstr-filings", categoryKey: "tax" }
        ],
        "RoC/Secretarial Compliance": [
            { title: "Annual Compliance for PVT", desc: "Contact Expert to Get Price", to: "/roc/annual-pvt", categoryKey: "tax" },
            { title: "Annual Compliance for LLP", desc: "Contact Expert to Get Price", to: "/roc/annual-llp", categoryKey: "tax" },
            { title: "Director KYC(DIR-3) Filing", desc: "Contact Expert to Get Price", to: "/roc/dir-3-filing", categoryKey: "tax" }
        ],
        "Labour Compliance": [
            { title: "PF & ESI Filings", desc: "Contact Expert to Get Price", to: "/labour/pf-esi", categoryKey: "tax" },
            { title: "Professional Tax Filings", desc: "Contact Expert to Get Price", to: "/labour/professional-tax", categoryKey: "tax" },
            { title: "Payroll", desc: "Contact Expert to Get Price", to: "/labour/payroll", categoryKey: "tax" }
        ],
        "Accounting & Financial Management": [
            { title: "Audit of a Company", desc: "Contact Expert to Get Price", to: "/accounting/audit", categoryKey: "tax" },
        ],
        "Business Expansion": [
            { title: "Due Diligence", desc: "Starts from ₹1499₹999", to: "/business/due-diligence", categoryKey: "tax" },
            { title: "Pitch Deck Service", desc: "Starts from ₹999", to: "/business/pitch-deck", categoryKey: "tax" }
        ]
    },
    "New Business/Closure": {
        "Business Registration": [
            { title: "Private Limited Company Registration", desc: "Starts from ₹999", to: "/formation/private-ltd", categoryKey: "formation" },
            { title: "Limited Liability Partnership Registration", desc: "Starts from ₹1499", to: "/formation/llp", categoryKey: "formation" },
            { title: "Sole Proprietorship", desc: "Starts from ₹699", to: "/formation/sole-proprietorship", categoryKey: "formation" },
            { title: "One Person Company Registration", desc: "Starts from ₹999", to: "/formation/opc", categoryKey: "formation" },
            { title: "Partnership Firm Registration", desc: "Starts from ₹2499", to: "/formation/partnership", categoryKey: "formation" }
        ],
        "Foreign Incorporation": [
            { title: "US Incorporation", desc: "Starts from ₹1499₹999", to: "/formation/us-inc", categoryKey: "formation" },
            { title: "Dubai Incorporation", desc: "Starts from ₹1499₹999", to: "/formation/dubai-inc", categoryKey: "formation" },
            { title: "UK Incorporation", desc: "Starts from ₹1499₹999", to: "/formation/uk-inc", categoryKey: "formation" },
            { title: "Singapore Incorporation", desc: "Starts from ₹1499₹999", to: "/formation/singapore-inc", categoryKey: "formation" }
        ],
        "NGO": [
            { title: "Section 8 Registration", desc: "Starts from ₹999", to: "/formation/section8", categoryKey: "formation" },
            { title: "Trust Registration", desc: "Starts from ₹1999", to: "/formation/trust", categoryKey: "formation" }
        ],
        "Closure/Cancellation": [
            { title: "Company Closure Service", desc: "Starts from ₹1499₹999", to: "/closure/company-closure", categoryKey: "closure" },
            { title: "GST Cancellation Service", desc: "Contact Expert to Get Price", to: "/closure/gst-cancellation", categoryKey: "closure" }
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

    if (service.title === "GST Registration") {
        return {
            isSpecific: true,
            sections: [
                {
                    id: 'overview_group',
                    title: 'Overview',
                    content: (
                        <div className="space-y-6">
                            {/* 1.2 Description */}
                            <h4 className="pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">Description</h4>
                            <p className="text-gray-700">
                                Every business or corporation that buys and sells goods or services has to register for GST if they cross the threshold. The threshold limit is Rs.40 lakhs for goods and Rs.20 lakhs for services in normal states. While there is a threshold limit for intrastate trade, those involved in the inter-state or e-commerce sectors have to register under GST mandatorily. With us, you can register for GST for your Private Limited Company and get your GSTIN easily in a few simple steps.
                            </p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <DetailBlock
                                    icon={ShieldCheckIcon}
                                    title="Process Time"
                                    content="3-7 working days (subject to government processing time)."
                                />
                                <DetailBlock
                                    icon={BanknotesIcon}
                                    title="Compliance Authority"
                                    content="GST Council / CBIC"
                                />
                            </div>

                            {/* 1.1 Benefits */}
                            <h4 className="pt-6 pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">Benefits</h4>
                            <ul className="ml-4 space-y-2 text-gray-700 list-disc list-inside">
                                <li className="flex items-start">
                                    <span className="mr-2 text-green-500">•</span>
                                    <div>Become **compliant**, reduce indirect taxes, and grow your business.</div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-green-500">•</span>
                                    <div>You can open a **current account** easily with GST registration.</div>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 text-green-500">•</span>
                                    <div>Ability to **claim input tax credit** on purchases.</div>
                                </li>
                            </ul>
                        </div>
                    ),
                },
                {
                    id: 'process_docs_group',
                    title: 'Process & Documents',
                    content: (
                        <div className="space-y-6">
                            {/* 2.1 Documents Required */}
                            <h4 className="pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">Documents Required</h4>
                            <ul className="ml-4 space-y-2 font-medium text-gray-700 list-decimal list-inside">
                                <li>Company PAN number</li>
                                <li>Certificate of Incorporation</li>
                                <li>Board Resolution</li>
                                <li>All directors'/All Partners'/Applicant's individual PAN</li>
                                <li>All directors'/All Partners'/Applicant's passport size photo</li>
                                <li>All directors'/All Partners'/Applicant's email ID & mobile number</li>
                                <li>All directors'/All Partners'/Applicant's Aadhar card</li>
                                <li>DSC of the Authorized Director</li>
                            </ul>

                            {/* 2.2 Deliverables */}
                            <h4 className="pt-6 pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">Deliverables</h4>
                            <ul className="ml-4 space-y-2 font-medium text-gray-700 list-decimal list-inside">
                                <li>GSTIN Number, HSN, and SAC Code</li>
                                <li>Provisional GST login credentials (Will be sent by the department)</li>
                                <li>Expert consultation for 30 days post-registration.</li>
                            </ul>
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
                            {/* 1.2 Description */}
                            <h4 className="pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">1.2 Description</h4>
                            <p className="text-gray-700">
                                Small scale businesses play a vital role in improving the economy of any country. These businesses can register themselves under the **MSME Act**, also known as **Udyog Aadhaar** or **SSI registration**. To encourage new and existing business, (manufacturers and service providers) the government of India has launched many schemes to help small and medium scale businesses to sustain and grow. These schemes can be availed easily when you have an MSME registered.
                            </p>

                            {/* 1.1 Benefits */}
                            <h4 className="pt-6 pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">1.1 Benefits</h4>
                            <p className="text-gray-700">There are many benefits to getting an MSME certificate. Some of them are:</p>
                            <ul className="ml-4 space-y-2 text-gray-700 list-decimal list-inside">
                                <li className="flex items-start">It gets much easier to get **licenses, registrations**, and **approvals**.</li>
                                <li className="flex items-start">You can get **collateral-free loans**.</li>
                                <li className="flex items-start">Avail various **government schemes** for small and medium enterprises.</li>
                            </ul>
                        </div>
                    ),
                },
                {
                    id: 'process_docs_group',
                    title: '2. Process & Documents',
                    content: (
                        <div className="space-y-6">
                            {/* 2.1 Documents Required */}
                            <h4 className="pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">2.1 Documents Required</h4>
                            <p className="pb-2 text-gray-700">Scanned copies of:</p>
                            <ul className="ml-4 space-y-2 font-medium text-gray-700 list-decimal list-inside">
                                <li>Applicant’s Aadhaar card</li>
                                <li>Applicant’s PAN</li>
                                <li>Company PAN / Incorporation Certificate (not applicable in case of a proprietorship firm)</li>
                                <li>Basic details about company/firm</li>
                            </ul>

                            {/* 2.2 Deliverables */}
                            <h4 className="pt-6 pb-2 text-xl font-semibold text-gray-700 border-b border-gray-100">2.2 Deliverables</h4>
                            <ul className="ml-4 space-y-2 font-medium text-gray-700 list-decimal list-inside">
                                <li>MSME certificate</li>
                            </ul>
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
                        <h4 className="pb-1 text-base font-semibold text-gray-700 border-b border-gray-100">
                            Description
                        </h4>
                        <p className="text-xs leading-relaxed text-gray-600">
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
            {
                id: 'process_docs_group',
                title: 'Process & Documents',
                content: (
                    <div className="space-y-4">
                        {/* Process Steps */}
                        <h4 className="pb-1 text-base font-semibold text-gray-700 border-b border-gray-100">
                            Process Steps
                        </h4>
                        {processDetails.map((step, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start p-3 space-x-3 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#E6F3FF]">
                                    <step.icon className="w-4 h-4 text-[#2E96FF]" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800">{step.title}</h4>
                                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}

                        {/* 2.1 Documents Required */}
                        <h4 className="pt-4 pb-1 text-base font-semibold text-gray-700 border-b border-gray-100">
                            2.1 Documents Required
                        </h4>
                        <p className="text-xs leading-relaxed text-gray-600">
                            Typical documents include Proof of Identity, Proof of Address (of business and director/partner),
                            and Business Registration documents. Specific requirements are shared upon consultation.
                        </p>

                        {/* 2.2 Deliverables */}
                        <h4 className="pt-4 pb-1 text-base font-semibold text-gray-700 border-b border-gray-100">
                            Deliverables
                        </h4>
                        <p className="text-xs leading-relaxed text-gray-600">
                            You will receive the final official certificate/document, the government filing receipt, and expert
                            consultation support post-delivery.
                        </p>
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

    // navigation hook
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

            // Adjust the offset to account for the sticky header and nav bar (approx 120-150px)
            const scrollPosition = offset - 120;

            contentRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' });
            setActiveSectionId(id);
        }
    };

    // Intersection Observer for Scroll Tracking
    useEffect(() => {
        if (!contentRef.current || sections.length === 0) return;

        const observerOptions = {
            root: contentRef.current,
            // Trigger intersection high up the viewport (just below the sticky nav)
            rootMargin: '-120px 0px -60% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Set the current intersecting section as active
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Close on backdrop click
        >
            <motion.div
                className="w-[95%] md:w-[70%] lg:w-[55%] bg-white rounded-t-3xl shadow-2xl relative h-[85vh] flex flex-col"
                variants={drawerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the drawer
            >
                {/* Sticky Header & Close Button */}
                <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white border-b shadow-sm md:p-5">
                    <h2 className="text-xl md:text-2xl font-bold text-[#003366] truncate">
                        {service.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 transition duration-150 bg-gray-100 rounded-full hover:bg-gray-200"
                        aria-label="Close details"
                    >
                        <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Horizontal Navigation (Sticky below header - the split/switch) */}
                <div className="sticky top-[65px] md:top-[70px] z-20 bg-white border-b shadow-md px-4 md:px-8">
                    <nav className="flex py-2 space-x-4 overflow-x-auto md:py-3 md:space-x-6 whitespace-nowrap">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex-shrink-0 text-xs md:text-sm font-medium pb-2 transition-colors duration-200
                                    ${activeSectionId === section.id
                                        ? "text-[#2E96FF] border-b-2 border-[#2E96FF] font-semibold"
                                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-b-2 hover:border-gray-300"
                                    }`}
                            >
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Scrollable Content */}
                <div ref={contentRef} className="flex-grow overflow-y-auto">
                    <div className="p-4 md:p-6">
                        <p className="pb-3 mb-6 text-sm text-gray-600 border-b md:text-base">
                            {service.desc.replace("₹", "Rs. ")}
                        </p>

                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="mb-8"
                                id={section.id}
                                // Attach ref for Intersection Observer to track scroll position
                                ref={(el) => (sectionRefs.current[section.id] = el)}
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 border-b-2 border-[#2E96FF] pb-1">
                                    {section.title}
                                </h3>
                                <div className="text-sm text-gray-700 md:text-base">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sticky Footer (Call to Action) */}
                <div className="sticky bottom-0 z-40 bg-white p-3 md:p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] border-t border-gray-100 flex-shrink-0">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                            onClick={() => {
                                // Navigate to service order flow page with basic params
                                const params = new URLSearchParams({ title: service.title, desc: service.desc });
                                navigate(`/dashboard/user/service-order?${params.toString()}`);
                            }}
                            className="flex-1 text-center bg-[#2E96FF] text-white py-2 md:py-3 rounded-md text-sm md:text-base font-semibold shadow-md hover:bg-[#007acc] transition duration-200 transform hover:scale-[1.01]"
                        >
                            {isSpecific ? "Avail Service" : `Get Started`}
                        </button>
                        <button
                            onClick={() => console.log("Requesting callback for:", service.title)}
                            className="flex-1 text-center border border-[#2E96FF] text-[#2E96FF] py-2 md:py-3 rounded-md text-sm md:text-base font-semibold hover:bg-[#E6F3FF] transition duration-200"
                        >
                            Callback
                        </button>
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


    const subTabs = Object.keys(tabData[activeTab] || {});
    const contentKey = `${activeTab}-${activeSubTab}`;
    const displayedData = tabData[activeTab]?.[activeSubTab] || [];
    const placeholdersCount = Math.max(0, 10 - displayedData.length);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCardClick = (service) => {
        // This opens the ServiceDetailDrawer popup
        setSelectedService(service);
    };

    return (
        <div className="font-sans antialiased">
            <div className="p-4 bg-white rounded-xl md:p-8">

                {/* 1. Main Tab Navigation (Responsive, Auto-scroll, Scrollbar Hidden) */}
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

                {/* 2. Sub Tabs */}
                {subTabs.length > 0 && (
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
