import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  CheckIcon,
  SparklesIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { orderAPI, userAPI, adminAPI } from "@/lib/api";

export default function AdminOrderDetailModal({
  order,
  onClose,
  onAssigned,
}) {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(
    order.assigneeEmail || ""
  );
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch documents
        const docsRes = await orderAPI.listDocuments(order.id);
        setDocuments(docsRes.data || []);

        // Fetch user info
        if (order.userId) {
          try {
            const userRes = await userAPI.getById(order.userId);
            setUser(userRes.data);
          } catch (err) {
            console.warn("Could not fetch user details:", err);
            setUser({
              email: order.customerEmail,
              fullName: "Customer",
              phone: "N/A",
            });
          }
        }

        // Fetch employees list
        try {
          const empRes = await adminAPI.listEmployees();
          console.log("AdminOrderDetailModal: Fetched employees response:", empRes);

          // Handle response structure { employees: [...], stats: ... }
          let employeesList = [];
          if (empRes.data && Array.isArray(empRes.data.employees)) {
            employeesList = empRes.data.employees;
          } else if (Array.isArray(empRes.data)) {
            employeesList = empRes.data;
          }

          console.log("AdminOrderDetailModal: Parsed employees list:", employeesList);
          setEmployees(employeesList);
        } catch (err) {
          console.error("AdminOrderDetailModal: Could not fetch employees:", err);
          setEmployees([]);
        }

      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [order.id, order.userId, order.customerEmail]);

  const handleDocumentDownload = async (docId) => {
    setDownloadingDocId(docId);
    try {
      const response = await orderAPI.downloadDocument(order.id, docId);
      const doc = documents.find((d) => d.id === docId);
      const fileName = doc?.fileName || `document-${docId}`;

      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/octet-stream",
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
      alert("Failed to download document");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleAssignOrder = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    setAssigning(true);
    try {
      const response = await orderAPI.assign(order.id, {
        assigneeEmail: selectedEmployee,
      });

      if (onAssigned) {
        onAssigned(response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error assigning order:", error);
      alert("Failed to assign order");
    } finally {
      setAssigning(false);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return <span className="text-red-600">📄</span>;
    if (["doc", "docx"].includes(ext))
      return <span className="text-blue-600">📝</span>;
    if (["xls", "xlsx", "csv"].includes(ext))
      return <span className="text-green-600">📊</span>;
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return <span className="text-purple-600">🖼️</span>;
    return <span className="text-gray-600">📎</span>;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-xl font-bold text-white">Order #{order.id}</h2>
          <button
            onClick={onClose}
            className="p-1 transition rounded-lg hover:bg-blue-700"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 rounded-full animate-pulse">
                  <SparklesIcon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-gray-600">Loading order details...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Order Info Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    Service
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {order.serviceName || "N/A"}
                  </p>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    Order Value
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    Status
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {order.status?.replace(/_/g, " ") || "Unknown"}
                  </p>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    Created On
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              {user && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <UserIcon className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Name
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullName || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <EnvelopeIcon className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {user.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600">
                          Phone
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.phone || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                  <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
                  Documents ({documents.length})
                </h3>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 transition border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300"
                      >
                        <div className="flex items-center flex-1 min-w-0 gap-3">
                          <div className="flex-shrink-0 text-xl">
                            {getFileIcon(doc.fileName)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.fileName}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span>{formatFileSize(doc.size)}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  doc.uploadedAt
                                ).toLocaleDateString("en-IN")}
                              </span>
                              {doc.verified && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-medium text-green-600">
                                    <CheckIcon className="w-3 h-3" />
                                    Verified
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDocumentDownload(doc.id)
                          }
                          disabled={downloadingDocId === doc.id}
                          className="flex items-center flex-shrink-0 gap-1 px-3 py-2 ml-3 text-sm font-medium text-indigo-600 transition rounded-lg hover:text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          {downloadingDocId === doc.id
                            ? "..."
                            : "Download"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-sm text-center text-gray-500">
                    No documents uploaded
                  </p>
                )}
              </div>

              {/* Assignment Section */}
              <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900">
                  <UserPlusIcon className="w-5 h-5 text-indigo-600" />
                  Assign Order to Employee
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      Select Employee
                    </label>
                    {employees.length > 0 ? (
                      <select
                        value={selectedEmployee}
                        onChange={(e) =>
                          setSelectedEmployee(e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Choose an employee...</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.email}>
                            {emp.fullName} ({emp.email})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg">
                        No employees available. Please create employees first.
                      </p>
                    )}
                  </div>

                  {order.assigneeEmail && (
                    <div className="p-3 bg-white border border-indigo-200 rounded-lg">
                      <p className="mb-1 text-xs font-semibold text-gray-600">
                        Currently Assigned To
                      </p>
                      <p className="text-sm font-medium text-indigo-600">
                        {order.assigneeEmail}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleAssignOrder}
                    disabled={
                      assigning ||
                      !selectedEmployee ||
                      employees.length === 0
                    }
                    className="flex items-center justify-center w-full gap-2 px-4 py-2 font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    {assigning ? "Assigning..." : "Assign Order"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
