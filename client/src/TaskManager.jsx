
import React, { useEffect, useState } from "react";
// Heroicons SVGs (inline for simplicity)
const EditIcon = () => (
  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
);
const CheckIcon = () => (
  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
);
import { getTasks, createTask, updateTask, deleteTask } from "./api";


export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setTasks(await getTasks());
    setLoading(false);
  }


  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editing) {
        await updateTask(editing, form);
        setEditing(null);
        showToast('Task updated!', 'success');
      } else {
        await createTask(form);
        showToast('Task added!', 'success');
      }
      setForm({ title: "", description: "", dueDate: "" });
      fetchTasks();
    } catch (err) {
      showToast('Error saving task', 'error');
    }
  }

  function handleEdit(task) {
    setEditing(task._id);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }


  async function handleDelete(id) {
    try {
      await deleteTask(id);
      fetchTasks();
      showToast('Task deleted!', 'success');
    } catch (err) {
      showToast('Error deleting task', 'error');
    }
  }

  function showToast(message, type) {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }

  // Filter tasks by status
  const filteredTasks = statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter);

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Task Manager</h2>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 text-white animate-fade-in ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckIcon /> : <TrashIcon />} {toast.message}
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {['all', 'todo', 'in progress', 'done'].map(status => (
          <button
            key={status}
            className={`px-3 py-1 rounded-full border ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition`}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-6 animate-fade-in"
      >
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {editing ? "Update" : "Add"} Task
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ title: "", description: "", dueDate: "" });
            }}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </form>
      {loading ? (
        <p className="text-center text-gray-500 animate-fade-in">Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center text-gray-400 animate-fade-in">No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-2 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <b className="text-lg break-words">{task.title}</b>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                  {task.status}
                </span>
              </div>
              {task.description && (
                <span className="text-gray-700 break-words">{task.description}</span>
              )}
              {task.dueDate && (
                <span className="text-gray-500 text-sm">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 bg-yellow-400 text-gray-900 rounded hover:bg-yellow-500 transition flex items-center"
                >
                  <EditIcon /> Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center"
                >
                  <TrashIcon /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
 
    </div>
  );
}
