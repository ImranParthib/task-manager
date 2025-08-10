import React from "react";

const StatsCard = ({ value, label, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600",
    orange: "text-orange-600",
    yellow: "text-yellow-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

const TaskStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <StatsCard value={stats.total} label="Total" color="blue" />
      <StatsCard value={stats.todo} label="To Do" color="orange" />
      <StatsCard value={stats.inProgress} label="In Progress" color="yellow" />
      <StatsCard value={stats.done} label="Completed" color="green" />
      <StatsCard value={stats.overdue} label="Overdue" color="red" />
      <StatsCard value={stats.filtered} label="Filtered" color="purple" />
    </div>
  );
};

export default TaskStats;
