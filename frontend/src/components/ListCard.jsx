import React from "react";

const ListCard = ({ title, items, renderItem, emptyText = "No items available" }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      {items && items.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {items.map((item, index) => (
            <div
              key={index}
              className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">{emptyText}</p>
        </div>
      )}
    </div>
  );
};

export default ListCard;
