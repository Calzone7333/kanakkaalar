import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { orderAPI, paymentsAPI } from "@/lib/api";
import {
    CloudArrowUpIcon,
    CheckCircleIcon,
    CurrencyRupeeIcon,
    ShieldCheckIcon,
    ListBulletIcon,
    ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { getAuth } from "../../../lib/auth";
import { servicesData } from "../../../data/servicePricing";

const loadRazorpay = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

// Base documents required for most services
const DEFAULT_DOCS = [
    "Identity Proof (PAN/Aadhar)",
    "Address Proof (Rent Agreement/Electricity Bill)",
    "Passport Size Photo"
];

// Configuration for documents based on Service Title AND Plan
const REQUIRED_DOCS_MAP = {
    "GST Registration": {
        base: [
            "PAN Card of Applicant/Directors",
            "Aadhar Card of Applicant/Directors",
            "Passport Size Photo",
            "Business Address Proof",
            "Bank Account Statement / Cancelled Cheque"
        ],
        // Premium/Elite might include Trademark application
        premium: ["Logo (for Trademark - Optional)", "Brand Name Details"],
        elite: ["Logo (for Trademark)", "Letterhead Design Preferences"]
    },
    "MSME Registration": {
        base: ["Aadhar Card of Applicant", "PAN Card of Applicant", "Business Address Proof"]
    },
    "Udyam Registration": {
        base: ["Aadhar Card of Applicant", "PAN Card of Applicant"]
    },
    "Food License": {
        base: ["Photo of Food Business Operator", "Government ID Proof", "Proof of Business Premises"],
        premium: ["GST Certificate (if available)"], // Example addition
    },
    "Import Export Code (IEC)": {
        base: ["PAN Card", "Aadhar/Voter ID", "Cancelled Cheque", "Rent Agreement/Electricity Bill"]
    },
    "Trademark Registration": {
        base: ["Logo or Brand Name Representation", "Power of Attorney (Form 48)", "Identity Proof", "Address Proof"]
    },
    "Private Limited Company Registration": {
        base: ["PAN Card of all Directors", "Aadhar/Passport of all Directors", "Photos of Directors", "Business Address Proof", "NOC from Owner"]
    }
};

export default function ServiceOrder() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get params from URL
    const title = searchParams.get("title") || "Service";
    const desc = searchParams.get("desc") || "Complete your application.";
    const planName = searchParams.get("plan")?.toLowerCase() || "standard";
    const rawPrice = searchParams.get("price");

    // Parse price
    const price = rawPrice ? parseFloat(rawPrice) : 499.0;
    const orderIdParam = searchParams.get("orderId");

    const [mockUploadedDocs, setMockUploadedDocs] = useState([]);

    // State Declarations
    const [order, setOrder] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [filesToUpload, setFilesToUpload] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [agreementDownloaded, setAgreementDownloaded] = useState(false);
    const [initAttempted, setInitAttempted] = useState(false);

    // --- Utility Functions ---
    const isOrderCreated = order && order.id;
    const areDocsUploaded = (uploadedDocs.length > 0 || mockUploadedDocs.length > 0);
    const displayTitle = order?.serviceName || title;

    // Fetch Plan Features for Display
    const getPlanFeatures = () => {
        const service = servicesData.find(s => s.name === displayTitle) ||
            servicesData.find(s => displayTitle.includes(s.name));
        if (service && service.plans && service.plans[planName]) {
            return service.plans[planName].features || [];
        }
        return [];
    };

    const planFeatures = getPlanFeatures();

    // Determine required docs based on Service AND Plan
    const getRequiredDocs = (serviceTitle, plan) => {
        // Find matching key
        const key = Object.keys(REQUIRED_DOCS_MAP).find(k => serviceTitle.includes(k));
        if (!key) return DEFAULT_DOCS;

        const config = REQUIRED_DOCS_MAP[key];
        let docs = [...(config.base || [])];

        // Add plan specific docs if they exist
        if (plan === 'premium' && config.premium) {
            docs = [...docs, ...config.premium];
        } else if (plan === 'elite' && config.elite) {
            // Elite usually includes premium benefits too, or specific ones
            const extra = config.elite || [];
            // Optionally include premium docs if elite implies premium features? 
            // For now, let's keep it specific to the config
            docs = [...docs, ...extra];
        }

        return docs.length > 0 ? docs : DEFAULT_DOCS;
    };

    const requiredDocs = getRequiredDocs(displayTitle, planName);

    const fetchDocs = useCallback(async () => {
        if (!order || !order.id) return;
        try {
            const r = await orderAPI.listDocuments(order.id);
            setUploadedDocs(r.data || []);
        } catch (err) {
            console.warn("Failed to fetch documents:", err);
        }
    }, [order]);

    useEffect(() => {
        const initOrder = async () => {
            if (initAttempted) return;
            setInitAttempted(true);

            const authData = getAuth();
            if (!authData?.user?.email) {
                setMessage("Please log in to continue.");
                return;
            }

            if (orderIdParam) {
                setLoading(true);
                try {
                    const r = await orderAPI.getById(orderIdParam);
                    setOrder(r.data);
                } catch (err) {
                    setMessage("Failed to load application.");
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!order) {
            initOrder();
        }
    }, [title, initAttempted, order, orderIdParam]);

    // --- API Handlers ---
    const handleFiles = (e) => {
        const selected = Array.from(e.target.files || []);
        setFilesToUpload(f => [...f, ...selected]);
    };

    const downloadAgreement = () => {
        const element = document.createElement("a");
        const file = new Blob([`SERVICE AGREEMENT\n\nService: ${displayTitle}\nPlan: ${planName}\nPrice: ${price}\n\nTerms and Conditions...`], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Service_Agreement.txt";
        document.body.appendChild(element);
        element.click();
        setAgreementDownloaded(true);
        setMessage("Agreement downloaded.");
    };

    const uploadDocs = async () => {
        if (filesToUpload.length === 0) return setMessage("Please select files to upload.");

        if (!isOrderCreated) {
            setLoading(true);
            await new Promise(r => setTimeout(r, 1000));

            const newMockDocs = filesToUpload.map(f => ({
                id: "mock_" + Date.now() + Math.random(),
                fileName: f.name,
                fileObj: f
            }));

            setMockUploadedDocs(prev => [...prev, ...newMockDocs]);
            setFilesToUpload([]);
            setLoading(false);
            setMessage("Documents uploaded successfully (Draft).");
            return;
        }

        setLoading(true);
        try {
            for (const f of filesToUpload) {
                await orderAPI.addDocument(order.id, f);
            }
            setFilesToUpload([]);
            await fetchDocs();
            setMessage("Documents uploaded successfully.");
        } catch (err) {
            setMessage("Document upload failed.");
        } finally { setLoading(false); }
    };

    const proceedToReview = () => {
        if (!areDocsUploaded) return setMessage("Please upload the required documents.");
        setCurrentStep(2);
    };

    const verifyAndSubmit = async () => {
        setCurrentStep(3);
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            let currentOrder = order;
            if (!currentOrder || !currentOrder.id) {
                const authData = getAuth();
                const r = await orderAPI.create({
                    serviceName: title,
                    customerEmail: authData.user.email,
                    totalAmount: price,
                    metadata: { plan: planName }
                });
                currentOrder = r.data;
                setOrder(currentOrder);

                if (mockUploadedDocs.length > 0) {
                    setMessage("Syncing documents...");
                    for (const d of mockUploadedDocs) {
                        if (d.fileObj) {
                            await orderAPI.addDocument(currentOrder.id, d.fileObj);
                        }
                    }
                }
            }

            const res = await loadRazorpay("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                setMessage("Razorpay SDK failed to load.");
                setLoading(false);
                return;
            }

            const keyRes = await paymentsAPI.getKey();
            let keyId = keyRes.data?.key || keyRes.data;
            if (typeof keyId === 'string' && keyId.startsWith('"')) {
                keyId = keyId.substring(1, keyId.length - 1);
            }

            if (!keyId || !keyId.startsWith("rzp_")) {
                setMessage("System Error: Invalid Payment Configuration.");
                setLoading(false);
                return;
            }

            const orderRes = await paymentsAPI.createOrder({
                amount: Math.round(price * 100),
                currency: "INR",
                description: `Payment for ${title} - ${planName}`
            });

            const { orderId: razorpayOrderId } = orderRes.data;

            const options = {
                key: keyId,
                name: "Kanakkaalar",
                description: `${title} (${planName})`,
                order_id: razorpayOrderId,
                handler: async function (response) {
                    try {
                        await paymentsAPI.confirm({
                            orderId: razorpayOrderId,
                            paymentId: response.razorpay_payment_id
                        });
                        await orderAPI.pay(currentOrder.id, { paymentId: response.razorpay_payment_id });
                        const r = await orderAPI.getById(currentOrder.id);
                        setOrder(r.data);
                        setCurrentStep(4);
                        setMessage("Payment Successful!");
                    } catch (err) {
                        setMessage("Payment verification failed.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setMessage("Payment cancelled.");
                    }
                },
                prefill: { email: getAuth()?.user?.email },
                theme: { color: "#2563EB" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            setMessage("Payment initiation failed.");
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: "Upload Documents", icon: CloudArrowUpIcon },
        { id: 2, title: "Review Application", icon: ShieldCheckIcon },
        { id: 3, title: "Payment", icon: CurrencyRupeeIcon },
        { id: 4, title: "Success", icon: CheckCircleIcon },
    ];

    const StepIndicator = ({ stepId, title, icon: Icon }) => (
        <div className="flex flex-col items-center z-10">
            <div
                className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-300 ${currentStep === stepId
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                    : currentStep > stepId
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
            >
                {currentStep > stepId ? <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
            <p className={`mt-2 text-[10px] md:text-xs font-medium text-center whitespace-nowrap ${currentStep >= stepId ? 'text-gray-800' : 'text-gray-400'}`}>{title}</p>
        </div>
    );

    return (
        <div className="max-w-5xl p-4 md:p-6 mx-auto antialiased shadow-xl bg-gray-50 rounded-xl min-h-[85vh]">
            {/* Header */}
            <div className="p-6 mb-8 bg-white border-l-4 border-blue-600 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{displayTitle}</h2>
                    <p className="mt-1 text-sm md:text-base text-gray-600">{desc}</p>
                </div>
                <div className="bg-blue-50 px-5 py-3 rounded-lg border border-blue-100 text-right min-w-[140px]">
                    <p className="text-xs text-blue-500 uppercase font-bold tracking-wider mb-1">Plan Selected</p>
                    <p className="text-xl font-extrabold text-[#003366] capitalize">{planName}</p>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="relative flex items-center justify-between px-4 md:px-12 mb-10">
                <div className="absolute left-0 top-4 md:top-5 w-full h-0.5 bg-gray-200 -z-0" />
                {steps.map((step) => (
                    <StepIndicator key={step.id} {...step} />
                ))}
            </div>

            {/* --- Main Content --- */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden min-h-[400px]">

                {/* 1. Upload Documents */}
                {currentStep === 1 && (
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left: Requirements List */}
                            <div className="md:w-1/3 space-y-6">
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <h3 className="flex items-center text-lg font-bold text-blue-900 mb-4">
                                        <ListBulletIcon className="w-5 h-5 mr-2" />
                                        Required Documents
                                    </h3>
                                    <p className="text-xs text-blue-600 mb-4 italic">Based on your {planName} plan</p>
                                    <ul className="space-y-3">
                                        {requiredDocs.map((doc, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-blue-800">
                                                <span className="mr-2 mt-0.5">•</span>
                                                <span className="leading-snug">{doc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {planFeatures.length > 0 && (
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-700 text-sm mb-3 uppercase tracking-wide">Included Features</h4>
                                        <ul className="space-y-2">
                                            {planFeatures.map((f, i) => (
                                                <li key={i} className="flex items-start text-xs text-gray-600">
                                                    <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Right: Upload Area */}
                            <div className="md:w-2/3 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Upload Documents</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    Securely upload the documents listed. Multiple files supported.
                                </p>

                                <div className="flex-1">
                                    <label className="block cursor-pointer group">
                                        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 group-hover:bg-blue-50 group-hover:border-blue-400 transition-all">
                                            <CloudArrowUpIcon className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3" />
                                            <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Click to browse files</span>
                                            <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                                            <input type="file" multiple onChange={handleFiles} className="hidden" />
                                        </div>
                                    </label>

                                    {/* Selected Files Preview */}
                                    {filesToUpload.length > 0 && (
                                        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-fade-in">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-700">Selected ({filesToUpload.length})</span>
                                                <button onClick={uploadDocs} disabled={loading} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 transition">
                                                    {loading ? 'Uploading...' : 'Upload Now'}
                                                </button>
                                            </div>
                                            <ul className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                                                {filesToUpload.map((f, idx) => <li key={idx} className="truncate">• {f.name}</li>)}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Uploaded List */}
                                    <div className="mt-6">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Uploaded Documents</h4>
                                        {uploadedDocs.length === 0 && mockUploadedDocs.length === 0 ? (
                                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                                <p className="text-gray-400 text-sm">No documents uploaded yet</p>
                                            </div>
                                        ) : (
                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {[...uploadedDocs, ...mockUploadedDocs].map(d => (
                                                    <li key={d.id} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                                                        <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 shrink-0" />
                                                        <span className="text-sm text-gray-700 truncate">{d.fileName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                                    <button onClick={downloadAgreement} className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                                        <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" /> Service Agreement
                                    </button>
                                    <button
                                        onClick={proceedToReview}
                                        disabled={!areDocsUploaded}
                                        className="px-6 py-2.5 bg-[#003366] text-white font-semibold rounded-lg hover:bg-[#002244] disabled:bg-gray-200 disabled:text-gray-400 transition shadow-sm"
                                    >
                                        Next Step &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Review */}
                {currentStep === 2 && (
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            Review & Payment Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Summary Card */}
                            <div className="col-span-2 bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">Application Summary</h4>
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div>
                                        <p className="text-gray-500 mb-1">Service</p>
                                        <p className="font-semibold text-gray-900">{displayTitle}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Plan</p>
                                        <p className="font-semibold text-gray-900 capitalize">{planName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Email</p>
                                        <p className="font-semibold text-gray-900">{getAuth()?.user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Documents</p>
                                        <p className="font-semibold text-green-600">{uploadedDocs.length + mockUploadedDocs.length} Uploaded</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Card */}
                            <div className="bg-[#003366] rounded-xl p-6 text-white flex flex-col justify-between shadow-lg">
                                <div>
                                    <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">Total Payable</p>
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold">₹{price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-blue-200 text-xs mt-2 opacity-80">Inclusive of Taxes</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-blue-800">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Plan:</span>
                                        <span className="capitalize font-bold">{planName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Agreement Check */}
                        <div className="flex items-center mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                            <input
                                type="checkbox"
                                id="agree"
                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                checked={agreementDownloaded}
                                onChange={() => setAgreementDownloaded(!agreementDownloaded)}
                            />
                            <label htmlFor="agree" className="ml-3 text-sm text-gray-700">
                                I verify that all uploaded documents are authentic and I agree to the
                                <button onClick={downloadAgreement} className="text-blue-600 hover:text-blue-800 ml-1 font-medium underline">Service Agreement</button>.
                            </label>
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={() => setCurrentStep(1)} className="text-gray-500 hover:text-gray-700 font-medium px-4">
                                &larr; Back
                            </button>
                            <button
                                onClick={verifyAndSubmit}
                                disabled={!agreementDownloaded}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md flex items-center"
                            >
                                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                Payment & Submit
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Payment */}
                {currentStep === 3 && (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CurrencyRupeeIcon className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Secure Payment</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">Complete your payment of <span className="font-bold text-gray-900">₹{price.toLocaleString()}</span> to finalize your application.</p>

                        <button
                            onClick={handleRazorpayPayment}
                            disabled={loading}
                            className="px-10 py-4 bg-[#003366] text-white font-bold rounded-xl hover:bg-[#002244] transition shadow-lg transform active:scale-95"
                        >
                            {loading ? 'Processing...' : 'Pay with Razorpay'}
                        </button>
                        <p className="mt-4 text-xs text-gray-400 flex items-center justify-center">
                            <ShieldCheckIcon className="w-3 h-3 mr-1" /> 100% Secure Transaction
                        </p>
                    </div>
                )}

                {/* 4. Success */}
                {currentStep === 4 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                            <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            Thank you! Your <strong>{planName}</strong> plan for <strong>{displayTitle}</strong> is now active. Our team will verify your documents and reach out within 24 hours.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/user/my-orders')}
                            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition shadow-lg"
                        >
                            Track Application Status
                        </button>
                    </div>
                )}
            </div>

            {/* Global Message Toast */}
            {message && (
                <div className="fixed bottom-6 right-6 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-xl z-50">
                    {message}
                </div>
            )}
        </div>
    );
}