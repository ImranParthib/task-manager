const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TASKS_URL = `${API_BASE}/tasks`;
const AUTH_URL = `${API_BASE}/auth`;

function getToken() {
  return localStorage.getItem("token");
}

export async function getTasks() {
  const res = await fetch(TASKS_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(TASKS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${TASKS_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

export async function register({ username, password }) {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function login({ username, password }) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}
