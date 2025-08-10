import React from "react";
import { SearchIcon, FilterIcon, ClearIcon } from "./Icons";

const QuickFilters = ({
  statusFilter,
  setStatusFilter,
  stats,
  onClearFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("todo")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "todo"
                ? "bg-orange-600 text-white shadow-md"
                : "bg-orange-100 text-orange-800 hover:bg-orange-200 hover:shadow-sm"
            }`}
          >
            To Do ({stats.todo})
          </button>

          <button
            onClick={() => setStatusFilter("in progress")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "in progress"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-sm"
            }`}
          >
            In Progress ({stats.inProgress})
          </button>

          <button
            onClick={() => setStatusFilter("done")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "done"
                ? "bg-green-600 text-white shadow-md"
                : "bg-green-100 text-green-800 hover:bg-green-200 hover:shadow-sm"
            }`}
          >
            Done ({stats.done})
          </button>

          {stats.overdue > 0 && (
            <button
              onClick={() => setStatusFilter("overdue")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === "overdue"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-red-100 text-red-800 hover:bg-red-200 hover:shadow-sm"
              }`}
            >
              Overdue ({stats.overdue})
            </button>
          )}

          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              statusFilter === "all"
                ? "bg-gray-600 text-white shadow-md"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200 hover:shadow-sm"
            }`}
          >
            All ({stats.total})
          </button>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
        >
          <ClearIcon />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default QuickFilters;
