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
  compact = false,
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50";
  const trendIcon = isPositive ? (
    <TrendingUp className="w-3.5 h-3.5" />
  ) : (
    <TrendingDown className="w-3.5 h-3.5" />
  );

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl ${compact ? "p-3 sm:p-4" : "p-6"
        } shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate leading-tight">
            {title}
          </p>
          <p
            className={`${compact ? "text-lg sm:text-xl" : "text-3xl"
              } font-semibold text-gray-900 dark:text-white mt-1 truncate leading-none`}
          >
            {value}
          </p>
          {description && !compact && (
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-2 line-clamp-1">
              {description}
            </p>
          )}
        </div>
        <div
          className={`${compact ? "w-8 h-8 sm:w-9 sm:h-9" : "w-12 h-12"
            } ${bgColor} dark:${bgColor.replace(
              "50",
              "900/20"
            )} rounded-lg flex items-center justify-center ${iconColor} flex-shrink-0 shadow-sm transition-transform group-hover:scale-110`}
        >
          {React.cloneElement(icon, { size: compact ? 16 : 24 })}
        </div>
      </div>

      {change !== undefined && (
        <div
          className={`${compact ? "mt-2" : "mt-4"
            } inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${changeColor} font-black`}
        >
          {trendIcon}
          <span className="text-[9px]">
            {isPositive ? "+" : ""}
            {change}%
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
