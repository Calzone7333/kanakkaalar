import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ClockIcon,
  UserIcon,
  CurrencyRupeeIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
  XCircleIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { orderAPI, workflowAPI, userAPI } from "@/lib/api";
import { toast } from "react-hot-toast";

const WorkflowEventTimeline = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <ClockIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No workflow events recorded yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="relative pl-8">
            {idx < events.length - 1 && (
              <div className="absolute left-2 top-10 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-transparent"></div>
            )}
            <div className="absolute left-0 w-5 h-5 bg-blue-500 border-4 border-white rounded-full shadow-lg top-1"></div>
            <div className="p-4 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {event.stage || "Stage"}
                </h3>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${event.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : event.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : event.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {event.status?.replace(/_/g, " ") || "PENDING"}
                </span>
              </div>
              <p className="mb-2 text-sm text-gray-700">{event.description}</p>
              {event.details && (
                <p className="mb-2 text-xs italic text-gray-600">
                  {event.details}
                </p>
              )}
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <CalendarIcon className="w-3 h-3" />
                {new Date(event.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                at{" "}
                {new Date(event.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StageActionButtons = ({ currentStage, orderId, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleAdvanceStage = async (nextStage) => {
    setLoading(true);
    try {
      await workflowAPI.advanceStage(orderId, {
        nextStage,
        description: `Advanced to ${nextStage}`,
      });
      toast.success(`Advanced to ${nextStage}`);
      onRefresh();
    } catch (error) {
      console.error("Error advancing stage:", error);
      toast.error("Failed to advance stage");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStage = async () => {
    setLoading(true);
    try {
      await workflowAPI.completeStage(orderId, {
        stage: currentStage,
        description: `Completed ${currentStage} stage`,
      });
      toast.success(`Completed ${currentStage}`);
      onRefresh();
    } catch (error) {
      console.error("Error completing stage:", error);
      toast.error("Failed to complete stage");
    } finally {
      setLoading(false);
    }
  };

  const stageSequence = [
    "APP_REC",
    "DOC_VER",
    "PROC",
    "DRAFT",
    "FILING",
    "GOVT_REV",
    "APPR",
    "DEL",
  ];
  const currentIndex = stageSequence.indexOf(currentStage);
  const nextStage =
    currentIndex < stageSequence.length - 1
      ? stageSequence[currentIndex + 1]
      : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleCompleteStage}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-white transition bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <CheckCircleIcon className="w-5 h-5" />
        Complete {currentStage}
      </button>
      {nextStage && (
        <button
          onClick={() => handleAdvanceStage(nextStage)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5" />
          Move to {nextStage}
        </button>
      )}
    </div>
  );
};

const DocumentCard = ({ doc, onDownload, onVerify, loading, isEmployee }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    );
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext))
      return <span className="text-red-600">📄</span>;
    if (["doc", "docx"].includes(ext))
      return <span className="text-blue-600">📝</span>;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <span className="text-green-600">📊</span>;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <span className="text-purple-600">🖼️</span>;
    return <span className="text-gray-600">📎</span>;
  };

  return (
    <div className="flex items-center justify-between p-4 transition border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300">
      <div className="flex items-center flex-1 min-w-0 gap-3">
        <div className="flex-shrink-0 text-2xl">{getFileIcon(doc.fileName)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {doc.fileName}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{formatFileSize(doc.size)}</span>
            <span>•</span>
            <span>
              {new Date(doc.uploadedAt).toLocaleDateString("en-IN")}
            </span>
            {doc.verified ? (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-green-600">
                  <CheckIcon className="w-3 h-3" />
                  Verified
                </span>
              </>
            ) : (
              isEmployee && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium text-amber-600">
                    <ExclamationTriangleIcon className="w-3 h-3" />
                    Pending Verification
                  </span>
                </>
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isEmployee && !doc.verified && (
          <button
            onClick={() => onVerify(doc.id)}
            disabled={loading}
            className="p-2 text-green-600 transition rounded-lg hover:bg-green-50"
            title="Verify Document"
          >
            <ShieldCheckIcon className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onDownload(doc.id)}
          disabled={loading}
          className="flex items-center flex-shrink-0 gap-1 px-3 py-2 ml-3 text-sm font-medium text-indigo-600 transition rounded-lg hover:text-indigo-700 hover:bg-indigo-50"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [progress, setProgress] = useState(null);
  const [events, setEvents] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingDocId, setDownloadingDocId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userStr = localStorage.getItem("authUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
  }, []);

  const isEmployee = currentUser?.role === "EMPLOYEE" || currentUser?.role === "ADMIN";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderRes, progressRes, eventsRes, docsRes] = await Promise.all([
        orderAPI.getById(orderId),
        workflowAPI.getProgress(orderId),
        workflowAPI.getTimeline(orderId),
        orderAPI.listDocuments(orderId),
      ]);

      setOrder(orderRes.data);
      setProgress(progressRes.data);
      setEvents(eventsRes.data || []);
      setDocuments(docsRes.data || []);

      // Fetch user info if order has userId
      if (orderRes.data.userId) {
        try {
          const userRes = await userAPI.getById(orderRes.data.userId);
          setUser(userRes.data);
        } catch (err) {
          console.warn("Could not fetch user details:", err);
          // Fallback to basic user info from order
          setUser({
            id: orderRes.data.userId,
            email: orderRes.data.customerEmail,
            fullName: "Customer",
            phone: "N/A",
          });
        }
      } else if (orderRes.data.customerEmail) {
        // Fallback if only email is available
        setUser({
          email: orderRes.data.customerEmail,
          fullName: "Customer",
          phone: "N/A",
        });
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentDownload = async (docId) => {
    setDownloadingDocId(docId);
    try {
      const response = await orderAPI.downloadDocument(orderId, docId);
      const doc = documents.find((d) => d.id === docId);
      const fileName = doc?.fileName || `document-${docId}`;

      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading document:", err);
      toast.error("Failed to download document.");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleVerifyDocument = async (docId) => {
    try {
      await orderAPI.verifyDocument(orderId, docId);
      toast.success("Document verified successfully");
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error verifying document:", err);
      toast.error("Failed to verify document");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      await orderAPI.addDocument(orderId, file);
      toast.success("Document uploaded successfully");
      fetchData();
    } catch (err) {
      console.error("Error uploading document:", err);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full animate-pulse">
            <ClockIcon className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-lg font-medium text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="mb-4 text-lg font-medium text-gray-900">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Order #{orderId}
          </h1>
          <p className="max-w-2xl text-gray-600">
            Track and manage your service delivery workflow, documents, and
            order progress in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Order Summary */}
          <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2">
              <div className="p-5 border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <p className="mb-1 text-sm font-semibold text-gray-600">
                  Service Type
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {order?.serviceName || "N/A"}
                </p>
              </div>
              <div className="p-5 border border-green-100 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <p className="mb-1 text-sm font-semibold text-gray-600">
                  Order Value
                </p>
                <p className="text-lg font-bold text-green-600">
                  ₹{(order?.totalAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-5 border border-purple-100 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
                <p className="mb-1 text-sm font-semibold text-gray-600">
                  Current Stage
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {progress?.currentStage || "N/A"}
                </p>
              </div>
              <div className="p-5 border border-orange-100 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
                <p className="mb-1 text-sm font-semibold text-gray-600">
                  Overall Progress
                </p>
                <p className="text-lg font-bold text-orange-600">
                  {progress?.completionPercentage || 0}%
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">
                  Completion Progress
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  {progress?.completionPercentage || 0}%
                </span>
              </div>
              <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full shadow-inner">
                <div
                  className="h-full transition-all duration-500 ease-out shadow-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                  style={{
                    width: `${progress?.completionPercentage || 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Order Status Badge */}
            <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
              <p className="mb-1 text-sm text-gray-600">Order Status</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${order?.status === "PAYMENT_COMPLETED"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                    }`}
                ></span>
                <span className="font-semibold text-gray-900">
                  {order?.status?.replace(/_/g, " ") || "Unknown"}
                </span>
              </div>
            </div>

            {/* Stage Actions */}
            {progress && isEmployee && (
              <StageActionButtons
                currentStage={progress.currentStage}
                orderId={orderId}
                onRefresh={fetchData}
              />
            )}
          </div>

          {/* Documents Section */}
          <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Uploaded Documents
                </h2>
                {documents.length > 0 && (
                  <span className="px-3 py-1 ml-2 text-xs font-bold text-indigo-700 bg-indigo-100 rounded-full">
                    {documents.length}
                  </span>
                )}
              </div>
              {isEmployee && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <CloudArrowUpIcon className="w-4 h-4" />
                    )}
                    Upload
                  </button>
                </div>
              )}
            </div>

            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    onDownload={handleDocumentDownload}
                    onVerify={handleVerifyDocument}
                    loading={downloadingDocId === doc.id}
                    isEmployee={isEmployee}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <PaperClipIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>No documents uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Workflow Timeline */}
          <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Workflow Timeline
            </h2>
            <WorkflowEventTimeline events={events} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information Card */}
          {user && (
            <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Customer Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.fullName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900 break-all">
                      {user.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">
                      Phone
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-600">
                      Customer Since
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {order?.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage Progress */}
          {progress?.stages && progress.stages.length > 0 && (
            <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Stage Progress
              </h3>
              <div className="space-y-3">
                {progress.stages.map((stage) => (
                  <div
                    key={stage.stage}
                    className={`p-4 rounded-lg border-l-4 transition ${stage.status === "COMPLETED"
                      ? "bg-green-50 border-l-green-500"
                      : stage.status === "IN_PROGRESS"
                        ? "bg-blue-50 border-l-blue-500"
                        : "bg-gray-50 border-l-gray-300"
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {stage.status === "COMPLETED" ? (
                        <CheckIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : stage.status === "IN_PROGRESS" ? (
                        <SparklesIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0"></div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {stage.sequence}. {stage.label}
                        </p>
                        <p
                          className={`text-xs mt-1 font-medium ${stage.status === "COMPLETED"
                            ? "text-green-600"
                            : stage.status === "IN_PROGRESS"
                              ? "text-blue-600"
                              : "text-gray-600"
                            }`}
                        >
                          {stage.status.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues/Exceptions */}
          {progress?.exceptions && progress.exceptions.length > 0 && (
            <div className="p-6 border-2 border-red-200 shadow-lg bg-red-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                <h3 className="font-bold text-gray-900">Active Issues</h3>
              </div>
              <div className="space-y-2">
                {progress.exceptions.map((exc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border border-red-200 rounded-lg"
                  >
                    <p className="text-sm font-semibold text-red-800">
                      {exc.stage}
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      {exc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="p-6 bg-white border border-gray-100 shadow-lg rounded-2xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-600">
                  Total Documents
                </span>
                <span className="text-lg font-bold text-indigo-600">
                  {documents.length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-600">
                  Verified Documents
                </span>
                <span className="text-lg font-bold text-green-600">
                  {documents.filter((d) => d.verified).length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm font-medium text-gray-600">
                  Timeline Events
                </span>
                <span className="text-lg font-bold text-purple-600">
                  {events.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
