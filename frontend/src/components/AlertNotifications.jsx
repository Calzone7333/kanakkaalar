import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

export const AlertNotifications = ({ orderId, onAlertUpdate }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `/api/workflow/alerts/orders/${orderId}/unresolved`,
        );
        setAlerts(response.data);
        onAlertUpdate?.(response.data.length);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [orderId, onAlertUpdate]);

  const handleResolveAlert = async (alertId) => {
    try {
      await axios.put(`/api/workflow/alerts/${alertId}/resolve`, {
        resolvedBy: "system",
      });
      setAlerts(alerts.filter((a) => a.id !== alertId));
      onAlertUpdate?.(alerts.length - 1);
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const toggleExpanded = (alertId) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "EXCEPTION":
      case "FAILURE":
      case "SLA_BREACH":
      case "PAYMENT_FAILED":
      case "DOCUMENT_MISSING":
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case "INFO":
        return <BellIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getAlertColor = (alertType) => {
    const colors = {
      EXCEPTION: "border-red-300 bg-red-50",
      FAILURE: "border-red-300 bg-red-50",
      SLA_BREACH: "border-orange-300 bg-orange-50",
      PAYMENT_FAILED: "border-red-300 bg-red-50",
      DOCUMENT_MISSING: "border-yellow-300 bg-yellow-50",
      INFO: "border-blue-300 bg-blue-50",
    };
    return colors[alertType] || colors.INFO;
  };

  const getTextColor = (alertType) => {
    const colors = {
      EXCEPTION: "text-red-800",
      FAILURE: "text-red-800",
      SLA_BREACH: "text-orange-800",
      PAYMENT_FAILED: "text-red-800",
      DOCUMENT_MISSING: "text-yellow-800",
      INFO: "text-blue-800",
    };
    return colors[alertType] || colors.INFO;
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">Loading alerts...</div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-600" />
        <p className="text-sm">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.alertType)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`${getTextColor(alert.alertType)} flex-shrink-0 mt-0.5`}
              >
                {getAlertIcon(alert.alertType)}
              </div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${getTextColor(alert.alertType)}`}
                >
                  {alert.title}
                </h3>
                <p className={`text-sm mt-1 ${getTextColor(alert.alertType)}`}>
                  {alert.message}
                </p>
                {expandedAlerts.has(alert.id) && alert.actionUrl && (
                  <a
                    href={alert.actionUrl}
                    className={`text-sm font-medium mt-2 inline-block underline ${getTextColor(alert.alertType)}`}
                  >
                    Take Action →
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => handleResolveAlert(alert.id)}
              className={`flex-shrink-0 ml-2 ${getTextColor(alert.alertType)} hover:opacity-70 transition`}
              title="Resolve alert"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => toggleExpanded(alert.id)}
            className={`text-xs mt-2 font-medium ${getTextColor(alert.alertType)} hover:opacity-70`}
          >
            {expandedAlerts.has(alert.id) ? "Show less" : "Show more"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertNotifications;
