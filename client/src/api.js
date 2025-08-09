const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

export async function getTasks() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.json();
}
