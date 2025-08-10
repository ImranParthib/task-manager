import React from "react";
import TaskCard from "./TaskCard";
import SortControls from "./SortControls";
import { PlusIcon } from "./Icons";

const TaskList = ({
  tasks,
  stats,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  searchQuery,
  statusFilter,
  priorityFilter,
  onEdit,
  onDelete,
  onStatusChange,
  onShowForm,
  actionLoading,
}) => {
  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Sort Controls */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Tasks ({stats.filtered})
            </h2>
            {hasActiveFilters && (
              <p className="text-sm text-gray-500 mt-1">
                Showing filtered results
              </p>
            )}
          </div>

          {/* Sort Controls - Right side */}
          <div className="flex items-center justify-end">
            <SortControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {stats.total === 0 ? "No tasks yet" : "No matching tasks"}
            </h3>
            <p className="text-gray-500 mb-6">
              {stats.total === 0
                ? "Get started by creating your first task"
                : "Try adjusting your filters or search query"}
            </p>
            {stats.total === 0 && (
              <button
                onClick={onShowForm}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <PlusIcon />
                Create your first task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
