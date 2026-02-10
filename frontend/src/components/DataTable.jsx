import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const DataTable = ({
  title,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  searchPlaceholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      String(item[col.key])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      setTimeout(checkScroll, 100);
      const observer = new ResizeObserver(checkScroll);
      observer.observe(container);
      window.addEventListener("resize", checkScroll);
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [filteredData]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <div className="relative group w-full max-w-full isolate">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-gray-800 shadow-md rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 transition-all hover:scale-110"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="overflow-auto custom-scrollbar bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm w-full max-h-[calc(100vh-240px)]"
        >
          <table className="w-full whitespace-nowrap relative">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800"
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredData.map((item, index) => (
                <tr
                  key={item.id ? `${item.id}-${index}` : index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${item.id}-${col.key}`}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No results found" : "No data available"}
              </p>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-gray-800 shadow-md rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-50 transition-all hover:scale-110"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default DataTable;
