import React from "react";
import { EditIcon, TrashIcon, CheckIcon } from "./Icons";

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  actionLoading,
}) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "todo":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 task-card-hover transition-all duration-300 ${
        isOverdue
          ? "border-red-300 bg-red-50 shadow-red-100"
          : "border-gray-200 hover:border-blue-300 hover:shadow-md"
      }`}
    >
      {/* Task Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">
            {task.title}
            {isOverdue && (
              <span className="text-red-600 text-sm ml-2 font-normal">
                (OVERDUE)
              </span>
            )}
          </h3>
        </div>

        <div className="flex gap-2 shrink-0">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              task.priority || "medium"
            )}`}
          >
            {(task.priority || "medium").toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              task.status || "todo"
            )}`}
          >
            {(task.status || "todo").replace("_", " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-700 mb-3 break-words leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center mb-4">
          <span
            className={`text-sm flex items-center ${
              isOverdue ? "text-red-600 font-semibold" : "text-gray-600"
            }`}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Due:{" "}
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all duration-200 text-sm flex items-center gap-1 hover:shadow-sm"
        >
          <EditIcon />
          Edit
        </button>

        {task.status !== "done" && (
          <button
            onClick={() => onStatusChange(task._id, "done")}
            disabled={actionLoading === `status-${task._id}`}
            className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all duration-200 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
          >
            {actionLoading === `status-${task._id}` ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-800"></div>
            ) : (
              <CheckIcon />
            )}
            Complete
          </button>
        )}

        <button
          onClick={() => onDelete(task._id)}
          disabled={actionLoading === task._id}
          className="px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-200 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
        >
          {actionLoading === task._id ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-800"></div>
          ) : (
            <TrashIcon />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
