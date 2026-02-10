import React from "react";

const ChartCard = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm ${className}`}>
      <div className="mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
