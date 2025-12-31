import React from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const STAGES = [
  {
    key: "WEB",
    label: "Web/App",
    sequence: 1,
    color: "from-blue-500",
    lightColor: "bg-blue-100",
  },
  {
    key: "CRM",
    label: "CRM Routing",
    sequence: 2,
    color: "from-purple-500",
    lightColor: "bg-purple-100",
  },
  {
    key: "SALES",
    label: "Sales & Payment",
    sequence: 3,
    color: "from-pink-500",
    lightColor: "bg-pink-100",
  },
  {
    key: "ONBD",
    label: "Onboarding",
    sequence: 4,
    color: "from-orange-500",
    lightColor: "bg-orange-100",
  },
  {
    key: "CASE",
    label: "Case Mgmt",
    sequence: 5,
    color: "from-yellow-500",
    lightColor: "bg-yellow-100",
  },
  {
    key: "EXEC",
    label: "Execution",
    sequence: 6,
    color: "from-green-500",
    lightColor: "bg-green-100",
  },
  {
    key: "GOVT",
    label: "Gov't Portal",
    sequence: 7,
    color: "from-teal-500",
    lightColor: "bg-teal-100",
  },
  {
    key: "QA",
    label: "QA & Compliance",
    sequence: 8,
    color: "from-indigo-500",
    lightColor: "bg-indigo-100",
  },
  {
    key: "DEL",
    label: "Delivery",
    sequence: 9,
    color: "from-emerald-500",
    lightColor: "bg-emerald-100",
  },
];

const getStatusColor = (status) => {
  const colors = {
    COMPLETED: {
      circle: "bg-green-500 ring-green-300",
      text: "text-green-700",
      bg: "bg-green-50",
    },
    IN_PROGRESS: {
      circle: "bg-blue-500 ring-blue-300",
      text: "text-blue-700",
      bg: "bg-blue-50",
    },
    PENDING: {
      circle: "bg-gray-300 ring-gray-200",
      text: "text-gray-600",
      bg: "bg-gray-50",
    },
    FAILED: {
      circle: "bg-red-500 ring-red-300",
      text: "text-red-700",
      bg: "bg-red-50",
    },
    BLOCKED: {
      circle: "bg-yellow-500 ring-yellow-300",
      text: "text-yellow-700",
      bg: "bg-yellow-50",
    },
  };
  return colors[status] || colors.PENDING;
};

const StageCircle = ({ stage, status, isActive, onClick, onHover }) => {
  const colors = getStatusColor(status);
  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <div className="relative">
      <button
        onClick={() => onClick?.(stage)}
        onMouseEnter={() => onHover?.(stage, true)}
        onMouseLeave={() => onHover?.(stage, false)}
        className={`
          relative flex flex-col items-center cursor-pointer transition-all duration-200
          ${isActive ? "scale-110" : "hover:scale-105"}
        `}
      >
        {/* Circle */}
        <div className={`relative mb-3 z-10`}>
          <div
            className={`
              w-14 h-14 rounded-full ring-4 flex items-center justify-center 
              text-white font-bold text-sm shadow-lg transition-all
              ${colors.circle}
            `}
          >
            {isCompleted ? (
              <CheckCircleIcon className="w-7 h-7" />
            ) : isFailed ? (
              <ExclamationCircleIcon className="w-7 h-7" />
            ) : (
              <span>{stage.sequence}</span>
            )}
          </div>

          {/* Pulse animation for in-progress */}
          {status === "IN_PROGRESS" && (
            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse"></div>
          )}
        </div>

        {/* Stage Label */}
        <div className="text-center text-xs font-semibold text-gray-700 leading-tight w-24">
          {stage.label}
        </div>

        {/* Status Badge */}
        <div
          className={`
            text-xs font-medium mt-1 px-2 py-1 rounded-full
            ${colors.text} ${colors.bg}
          `}
        >
          {status.replace(/_/g, " ")}
        </div>
      </button>
    </div>
  );
};

const WorkflowTimeline = ({
  progress,
  onStageClick,
  showLabels = true,
  compact = false,
  height = "h-auto",
}) => {
  const [hoveredStage, setHoveredStage] = React.useState(null);

  const stageStatusMap = {};
  if (progress?.stages) {
    progress.stages.forEach((s) => {
      stageStatusMap[s.stage] = s.status;
    });
  }

  return (
    <div className={`w-full ${height}`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Overall Progress
          </h3>
          <span className="text-sm font-bold text-indigo-600">
            {progress?.completionPercentage || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress?.completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className={`relative ${!compact && "py-8"}`}>
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-emerald-300 transform -translate-y-1/2" />

        {/* Stages Grid */}
        <div className="grid grid-cols-9 gap-1 relative z-10">
          {STAGES.map((stage) => {
            const stageStatus = stageStatusMap[stage.key] || "PENDING";
            const isHovered = hoveredStage === stage.key;

            return (
              <div
                key={stage.key}
                className="flex justify-center"
                onMouseEnter={() => setHoveredStage(stage.key)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <StageCircle
                  stage={stage}
                  status={stageStatus}
                  isActive={isHovered}
                  onClick={onStageClick}
                  onHover={(key, isHover) => {
                    setHoveredStage(isHover ? key : null);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      {showLabels && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-5 gap-4 text-xs">
            {[
              {
                status: "COMPLETED",
                color: "bg-green-500",
                label: "Completed",
              },
              {
                status: "IN_PROGRESS",
                color: "bg-blue-500",
                label: "In Progress",
              },
              { status: "PENDING", color: "bg-gray-300", label: "Pending" },
              { status: "FAILED", color: "bg-red-500", label: "Failed" },
              { status: "BLOCKED", color: "bg-yellow-500", label: "Blocked" },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowTimeline;
