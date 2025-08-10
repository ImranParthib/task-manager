import React, { useState } from "react";
import {
  useTasks,
  useTaskFilters,
  useTaskActions,
  useTaskStats,
} from "../hooks/useTasks";
import TaskStats from "../components/TaskStats";
import QuickFilters from "../components/QuickFilters";
import FilterPanel from "../components/FilterPanel";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { CheckIcon, TrashIcon, PlusIcon } from "../components/Icons";

// Toast Component
const Toast = ({ toast, onClose }) => {
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 text-white animate-bounce-in ${
        toast.type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {toast.type === "success" ? <CheckIcon /> : <TrashIcon />}
        {toast.message}
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading your tasks...</p>
    </div>
  </div>
);

export default function TaskManager() {
  // Custom hooks for state management
  const { tasks, loading, refetchTasks } = useTasks();
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredTasks,
    clearFilters,
  } = useTaskFilters(tasks);

  const {
    actionLoading,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange,
  } = useTaskActions(refetchTasks);

  const stats = useTaskStats(tasks, filteredTasks);

  // Local state for UI
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "todo",
    priority: "medium",
  });

  // Helper functions
  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      dueDate: "",
      status: "todo",
      priority: "medium",
    });
    setEditing(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
    resetForm();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Task operations
  const handleSubmit = async () => {
    let result;
    if (editing) {
      result = await handleUpdateTask(form._id, form);
    } else {
      result = await handleCreateTask(form);
    }

    showToast(result.message, result.success ? "success" : "error");

    if (result.success) {
      setShowForm(false);
      resetForm();
    }
  };

  const handleEdit = (task) => {
    setForm(task);
    setEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const result = await handleDeleteTask(id);
    if (result.success !== false) {
      // Only show toast if operation was attempted
      showToast(result.message, result.success ? "success" : "error");
    }
  };

  const handleTaskStatusChange = async (id, newStatus) => {
    const result = await handleStatusChange(id, newStatus);
    showToast(result.message, result.success ? "success" : "error");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2"></h1>
              <p className="text-gray-600">
                Organize your work and increase productivity
              </p>
            </div>

            {/* Add New Task Button - Top Right */}
            <button
              onClick={handleShowForm}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg button-pulse"
            >
              <PlusIcon />
              {showForm ? "Hide Form" : "Add New Task"}
            </button>
          </div>
        </div>

        {/* Task Form - Shows at top when active */}
        {showForm && (
          <div className="mb-8 animate-slide-in">
            <TaskForm
              form={form}
              setForm={setForm}
              editing={editing}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              actionLoading={actionLoading}
            />
          </div>
        )}

        {/* Statistics Dashboard */}
        <TaskStats stats={stats} />

        {/* Quick Filters */}
        <QuickFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          stats={stats}
          onClearFilters={clearFilters}
        />

        {/* Main Content Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Advanced Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>

          {/* Tasks List */}
          <div className="lg:col-span-3">
            <TaskList
              tasks={filteredTasks}
              stats={stats}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleTaskStatusChange}
              onShowForm={handleShowForm}
              actionLoading={actionLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
