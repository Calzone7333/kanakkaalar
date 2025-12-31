import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  change,
  description,
  onClick,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50";
  const trendIcon = isPositive ? (
    <TrendingUp className="w-4 h-4" />
  ) : (
    <TrendingDown className="w-4 h-4" />
  );

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${bgColor} dark:${bgColor.replace(
            "50",
            "900/20"
          )} rounded-lg flex items-center justify-center ${iconColor} flex-shrink-0`}
        >
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full ${changeColor}`}>
          {trendIcon}
          <span className="text-xs font-semibold">
            {isPositive ? "+" : ""}
            {change}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
