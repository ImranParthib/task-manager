// Custom hooks for task management
import { useState, useEffect, useCallback, useMemo } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        window.location.reload();
        return;
      }

      const fetchedTasks = await getTasks();
      if (Array.isArray(fetchedTasks)) {
        setTasks(fetchedTasks);
      } else {
        console.warn("API returned non-array:", fetchedTasks);
        setTasks([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setTasks([]);
      setError("Failed to load tasks");

      if (
        error.message &&
        (error.message.includes("401") ||
          error.message.includes("Unauthorized"))
      ) {
        localStorage.removeItem("token");
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetchTasks };
};

export const useTaskFilters = (tasks) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    return tasks.filter((task) => {
      if (!task || typeof task !== "object") return false;

      const matchesSearch =
        (task.title &&
          task.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        (task.priority || "medium") === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Sort filtered tasks
  const sortedTasks = useMemo(() => {
    const sorted = [...filteredTasks].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "title": {
          valueA = a.title?.toLowerCase() || "";
          valueB = b.title?.toLowerCase() || "";
          break;
        }
        case "priority": {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          valueA = priorityOrder[a.priority] || 2;
          valueB = priorityOrder[b.priority] || 2;
          break;
        }
        case "status": {
          const statusOrder = { todo: 1, "in progress": 2, done: 3 };
          valueA = statusOrder[a.status] || 1;
          valueB = statusOrder[b.status] || 1;
          break;
        }
        case "dueDate":
        default: {
          valueA = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
          valueB = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
          break;
        }
      }

      if (sortOrder === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredTasks, sortBy, sortOrder]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("dueDate");
    setSortOrder("asc");
  }, []);

  return {
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
    filteredTasks: sortedTasks,
    clearFilters,
  };
};

export const useTaskActions = (refetchTasks) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleCreateTask = useCallback(
    async (taskData) => {
      setActionLoading("save");
      try {
        await createTask(taskData);
        refetchTasks();
        return { success: true, message: "Task created successfully!" };
      } catch (error) {
        console.error("Create task error:", error);
        return { success: false, message: "Error creating task" };
      } finally {
        setActionLoading(null);
      }
    },
    [refetchTasks]
  );

  const handleUpdateTask = useCallback(
    async (id, taskData) => {
      setActionLoading("save");
      try {
        await updateTask(id, taskData);
        refetchTasks();
        return { success: true, message: "Task updated successfully!" };
      } catch (error) {
        console.error("Update task error:", error);
        return { success: false, message: "Error updating task" };
      } finally {
        setActionLoading(null);
      }
    },
    [refetchTasks]
  );

  const handleDeleteTask = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this task?"))
        return { success: false };

      setActionLoading(id);
      try {
        await deleteTask(id);
        refetchTasks();
        return { success: true, message: "Task deleted successfully!" };
      } catch (error) {
        console.error("Delete task error:", error);
        return { success: false, message: "Error deleting task" };
      } finally {
        setActionLoading(null);
      }
    },
    [refetchTasks]
  );

  const handleStatusChange = useCallback(
    async (id, newStatus) => {
      setActionLoading(`status-${id}`);
      try {
        await updateTask(id, { status: newStatus });
        refetchTasks();
        return { success: true, message: `Task marked as ${newStatus}!` };
      } catch (error) {
        console.error("Status update error:", error);
        return { success: false, message: "Error updating status" };
      } finally {
        setActionLoading(null);
      }
    },
    [refetchTasks]
  );

  return {
    actionLoading,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleStatusChange,
  };
};

export const useTaskStats = (tasks, filteredTasks) => {
  return useMemo(() => {
    const stats = {
      total: Array.isArray(tasks) ? tasks.length : 0,
      todo: Array.isArray(tasks)
        ? tasks.filter((t) => t && t.status === "todo").length
        : 0,
      inProgress: Array.isArray(tasks)
        ? tasks.filter((t) => t && t.status === "in progress").length
        : 0,
      done: Array.isArray(tasks)
        ? tasks.filter((t) => t && t.status === "done").length
        : 0,
      overdue: Array.isArray(tasks)
        ? tasks.filter(
            (t) =>
              t &&
              t.dueDate &&
              new Date(t.dueDate) < new Date() &&
              t.status !== "done"
          ).length
        : 0,
      filtered: Array.isArray(filteredTasks) ? filteredTasks.length : 0,
    };

    return stats;
  }, [tasks, filteredTasks]);
};
