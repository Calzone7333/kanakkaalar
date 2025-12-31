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

const loadRazorpay = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const REQUIRED_DOCS_MAP = {
    "GST Registration": [
        "PAN Card of Applicant/Directors",
        "Aadhar Card of Applicant/Directors",
        "Passport Size Photo",
        "Business Address Proof (Electricity Bill / Rent Agreement + NOC)",
        "Bank Account Statement / Cancelled Cheque"
    ],
    "MSME Registration": [
        "Aadhar Card of Applicant",
        "PAN Card of Applicant",
        "Business Address Proof"
    ],
    "Trademark Registration": [
        "Logo or Brand Name Representation",
        "Signed Power of Attorney (Form 48)",
        "Identity Proof of Applicant",
        "Address Proof of Applicant"
    ],
    "Private Limited Company Registration": [
        "PAN Card of all Directors",
        "Aadhar Card/Passport/Voter ID of all Directors",
        "Passport Size Photos",
        "Business Address Proof (Utility Bill)",
        "NOC from Owner"
    ],
    "Import Export Code Registration (IEC)": [
        "PAN Card of Individual/Company",
        "Aadhar Card/Voter ID/Passport",
        "Cancelled Cheque of Current Account",
        "Rent Agreement/Electricity Bill"
    ]
};

const DEFAULT_DOCS = [
    "Identity Proof (PAN/Aadhar)",
    "Address Proof",
    "Passport Size Photo"
];

export default function ServiceOrder() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const title = searchParams.get("title") || "Service";
    const desc = searchParams.get("desc") || "Complete your application.";

    const MOCK_PRICE = 499.0;

    const orderIdParam = searchParams.get("orderId");

    const [mockUploadedDocs, setMockUploadedDocs] = useState([]);

    // Missing State Declarations
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
    // const areDocsUploaded = uploadedDocs.length > 0; // Update this to check mock too
    const areDocsUploaded = (uploadedDocs.length > 0 || mockUploadedDocs.length > 0);

    // Use order service name if available, otherwise fallback to URL param
    const displayTitle = order?.serviceName || title;
    const requiredDocs = REQUIRED_DOCS_MAP[displayTitle] || DEFAULT_DOCS;

    const fetchDocs = useCallback(async () => {
        if (!order || !order.id) return;
        try {
            const r = await orderAPI.listDocuments(order.id);
            setUploadedDocs(r.data || []);
        } catch (err) {
            console.warn("Failed to fetch documents:", err);
        }
    }, [order]);

    // Auto-create OR fetch order on mount (MODIFIED: Defer creation)
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
                // Fetch existing order
                try {
                    const r = await orderAPI.getById(orderIdParam);
                    setOrder(r.data);
                } catch (err) {
                    setMessage("Failed to load application.");
                } finally {
                    setLoading(false);
                }
            } else {
                // NEW: Do NOT create order immediately. Wait for payment.
                // Just let the UI render with 'title' and 'desc' parameters.
            }
        };

        if (!order) {
            initOrder();
        }
    }, [title, initAttempted, order, orderIdParam]);

    // ... (useEffect for order updates - unchanged) ...

    // --- API Handlers ---
    const handleFiles = (e) => {
        const selected = Array.from(e.target.files || []);
        setFilesToUpload(f => [...f, ...selected]);
    };

    const downloadAgreement = () => {
        const element = document.createElement("a");
        const file = new Blob(["E-Agreement Content\n\nTerms and Conditions..."], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "Service_Agreement.txt";
        document.body.appendChild(element);
        element.click();
        setAgreementDownloaded(true);
        setMessage("Agreement downloaded.");
    };

    const uploadDocs = async () => {
        if (filesToUpload.length === 0) return setMessage("Please select files to upload.");

        // If order doesn't exist yet, store locally
        if (!isOrderCreated) {
            setLoading(true);
            // Simulate delay
            await new Promise(r => setTimeout(r, 1000));

            // Allow files to be seen as "uploaded"
            const newMockDocs = filesToUpload.map(f => ({
                id: "mock_" + Date.now() + Math.random(),
                fileName: f.name,
                fileObj: f // Store actual file for later
            }));

            setMockUploadedDocs(prev => [...prev, ...newMockDocs]);
            setFilesToUpload([]);
            setLoading(false);
            setMessage("Documents uploaded successfully (Draft).");
            return;
        }

        // Standard flow if order exists
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
        try {
            if (order && order.id) {
                await orderAPI.update(order.id, { status: 'PENDING_PAYMENT' });
            }
            setCurrentStep(3);
        } catch (e) {
            console.error(e);
            setCurrentStep(3);
        }
    };

    // --- CORRECTED PAYMENT FUNCTION ---
    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            // NEW: Create Order If Needed
            let currentOrder = order;
            if (!currentOrder || !currentOrder.id) {
                // 1. Create Order
                const authData = getAuth();
                const r = await orderAPI.create({
                    serviceName: title,
                    customerEmail: authData.user.email,
                    totalAmount: MOCK_PRICE
                });
                currentOrder = r.data;
                setOrder(currentOrder);

                // 2. Upload Mock Docs
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

            // Handle both object {key: "..."} and string "..." formats
            let keyId = keyRes.data;
            if (typeof keyId === 'object' && keyId.key) {
                keyId = keyId.key;
            }
            if (typeof keyId === 'string') {
                // Strip quotes if they exist (sometimes raw string comes with quotes)
                if (keyId.startsWith('"') && keyId.endsWith('"')) {
                    keyId = keyId.substring(1, keyId.length - 1);
                }
            } else {
                keyId = String(keyId); // Fallback
            }

            console.log("Razorpay Key ID:", keyId);

            if (!keyId || !keyId.startsWith("rzp_")) {
                console.error("Invalid Razorpay Key Format:", keyId);
                setMessage("System Error: Invalid Payment Configuration. Please contact support.");
                setLoading(false);
                return;
            }

            // Fix: Use Math.round to avoid floating point issues
            const orderRes = await paymentsAPI.createOrder({
                amount: Math.round(MOCK_PRICE * 100),
                currency: "INR",
                description: `Payment for ${title}`
            });

            console.log("Order Response:", orderRes.data);
            // We destructure amount and currency here, but DO NOT pass them to options below
            const { orderId: razorpayOrderId } = orderRes.data;

            if (!razorpayOrderId) {
                throw new Error("Invalid order ID received from backend");
            }

            const options = {
                key: keyId,
                // Fix: REMOVED amount and currency. Passing them with order_id causes 500 Error.
                // amount: amount.toString(), 
                // currency: currency,

                name: "Calzone Financial",
                description: title,
                order_id: razorpayOrderId, // This locks the amount automatically

                handler: async function (response) {
                    try {
                        console.log("Payment Success:", response);
                        await paymentsAPI.confirm({
                            orderId: razorpayOrderId,
                            paymentId: response.razorpay_payment_id
                        });

                        await orderAPI.pay(currentOrder.id, { paymentId: response.razorpay_payment_id });

                        const r = await orderAPI.getById(currentOrder.id);
                        setOrder(r.data);
                        setCurrentStep(4);
                        setMessage("Payment Successful! Application Submitted.");
                    } catch (err) {
                        console.error("Payment Confirmation Failed:", err);
                        setMessage("Payment verification failed.");
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        setMessage("Payment cancelled.");
                    }
                },
                prefill: {
                    email: getAuth()?.user?.email,
                },
                theme: {
                    color: "#2563EB",
                },
            };

            console.log("Razorpay Options:", options);
            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                console.error("Payment Failed:", response.error);
                setMessage(`Payment Failed: ${response.error.description}`);
                setLoading(false);
            });

            paymentObject.open();

        } catch (err) {
            setMessage("Payment initiation failed. See console for details.");
            console.error("Payment Init Error:", err);
            setLoading(false);
        }
    };

    // --- Render Helpers ---
    const steps = [
        { id: 1, title: "Upload Documents", icon: CloudArrowUpIcon },
        { id: 2, title: "Review Application", icon: ShieldCheckIcon },
        { id: 3, title: "Payment", icon: CurrencyRupeeIcon },
        { id: 4, title: "Success", icon: CheckCircleIcon },
    ];

    const StepIndicator = ({ stepId, title, icon: Icon }) => (
        <div className="flex flex-col items-center z-10">
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep === stepId
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                    : currentStep > stepId
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
            >
                {currentStep > stepId ? <CheckCircleIcon className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
            </div>
            <p className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${currentStep >= stepId ? 'text-gray-800' : 'text-gray-400'}`}>{title}</p>
        </div>
    );

    return (
        <div className="max-w-5xl p-6 mx-auto antialiased shadow-2xl bg-gray-50 rounded-xl min-h-[80vh]">
            <div className="p-6 mb-8 bg-white border-l-4 border-blue-600 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900">{displayTitle}</h2>
                <p className="mt-2 text-gray-600">{desc}</p>
            </div>

            {/* Step Indicators */}
            <div className="relative flex items-center justify-between px-4 mb-12">
                <div className="absolute left-0 top-5 w-full h-0.5 bg-gray-200 -z-0" />
                {steps.map((step) => (
                    <StepIndicator key={step.id} {...step} />
                ))}
            </div>

            {/* --- Main Content --- */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

                {/* 1. Upload Documents */}
                {currentStep === 1 && (
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left: Requirements List */}
                            <div className="md:w-1/3 bg-blue-50 p-6 rounded-xl border border-blue-100 h-fit">
                                <h3 className="flex items-center text-lg font-bold text-blue-900 mb-4">
                                    <ListBulletIcon className="w-5 h-5 mr-2" />
                                    Required Documents
                                </h3>
                                <ul className="space-y-3">
                                    {requiredDocs.map((doc, idx) => (
                                        <li key={idx} className="flex items-start text-sm text-blue-800">
                                            <span className="mr-2 mt-1">•</span>
                                            <span>{doc}</span>
                                        </li>
                                    ))}
                                    <li className="flex items-start text-sm text-blue-800 font-semibold pt-2 border-t border-blue-200 mt-2">
                                        <span className="mr-2 mt-1">•</span>
                                        <span>Signed E-Agreement</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={downloadAgreement}
                                    className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium transition"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> Download Agreement
                                </button>
                            </div>

                            {/* Right: Upload Area */}
                            <div className="md:w-2/3">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Your Files</h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    Please upload the documents listed on the left. You can select multiple files at once.
                                </p>

                                <div className="mb-6">
                                    <div className="flex gap-4 items-center">
                                        <label className="flex-1 cursor-pointer">
                                            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition">
                                                <CloudArrowUpIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-500">Click to select files</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFiles}
                                                    className="hidden"
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    {filesToUpload.length > 0 && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Selected Files:</p>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {filesToUpload.map((f, idx) => <li key={idx}>{f.name}</li>)}
                                            </ul>
                                            <button
                                                onClick={uploadDocs}
                                                disabled={loading}
                                                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition w-full"
                                            >
                                                {loading ? 'Uploading...' : 'Upload Selected Files'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-6">
                                    <h4 className="font-semibold text-gray-700 mb-4">Uploaded Successfully</h4>
                                    {uploadedDocs.length === 0 && mockUploadedDocs.length === 0 ? (
                                        <p className="text-gray-500 italic text-sm">No documents uploaded yet.</p>
                                    ) : (
                                        <ul className="space-y-2 mb-6">
                                            {[...uploadedDocs, ...mockUploadedDocs].map(d => (
                                                <li key={d.id} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
                                                    <span className="text-sm text-gray-700">{d.fileName}</span>
                                                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="flex justify-end mt-8">
                                    <button
                                        onClick={proceedToReview}
                                        disabled={!areDocsUploaded}
                                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
                                    >
                                        Next: Review Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Review */}
                {currentStep === 2 && (
                    <div className="p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Review Your Application</h3>

                        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Service Selected</p>
                                    <p className="font-semibold text-gray-800 text-lg">{displayTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Applicant Email</p>
                                    <p className="font-semibold text-gray-800">{getAuth()?.user?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Documents</p>
                                    <p className="font-semibold text-gray-800">{uploadedDocs.length} Files</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">E-Agreement Status</p>
                                    <p className={`font-semibold ${agreementDownloaded ? 'text-green-600' : 'text-orange-500'}`}>
                                        {agreementDownloaded ? 'Downloaded' : 'Not Downloaded'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button onClick={() => setCurrentStep(1)} className="text-gray-500 hover:text-gray-700 font-medium px-4">
                                Back to Upload
                            </button>
                            <button
                                onClick={verifyAndSubmit}
                                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center"
                            >
                                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                                Confirm & Proceed to Payment
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
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Final Step: Payment</h3>
                        <p className="text-gray-600 mb-8">Pay the service fee to officially submit your application.</p>

                        <div className="bg-white p-6 rounded-xl max-w-sm mx-auto mb-8 border-2 border-indigo-100 shadow-sm">
                            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Total Payable</p>
                            <p className="text-4xl font-bold text-indigo-600">₹{MOCK_PRICE}</p>
                        </div>

                        <button
                            onClick={handleRazorpayPayment}
                            disabled={loading}
                            className="px-10 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg transform hover:scale-105"
                        >
                            {loading ? 'Processing...' : 'Pay Securely with Razorpay'}
                        </button>
                    </div>
                )}

                {/* 4. Success */}
                {currentStep === 4 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
                        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                            Your application for <strong>{displayTitle}</strong> has been successfully placed. Our experts will verify your documents and contact you shortly.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/user/my-orders')}
                            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                        >
                            View My Applications
                        </button>
                    </div>
                )}
            </div>

            {/* Global Message Toast */}
            {message && (
                <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up">
                    {message}
                </div>
            )}
        </div>
    );
}