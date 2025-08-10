import React from "react";
import { SortIcon, ChevronDownIcon } from "./Icons";

const SortControls = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => {
  return (
    <div className="flex items-center gap-2">
      <SortIcon />
      <span className="text-sm font-medium text-gray-700 hidden sm:inline">
        Sort:
      </span>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="status">Status</option>
        <option value="title">Title</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="asc">↑ Asc</option>
        <option value="desc">↓ Desc</option>
      </select>
    </div>
  );
};

export default SortControls;
