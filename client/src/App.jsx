import React, { useState, useEffect } from "react";
import TaskManager from "./TaskManager";
import AuthModal from "./AuthModal";

export default function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setAuth(!!localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setAuth(false);
  }

  return (
    <div>
      <nav className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white">
        <span className="font-bold text-lg">Task Manager</span>
        {auth ? (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            Login / Register
          </button>
        )}
      </nav>
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onAuth={() => setAuth(true)}
      />
      <div className="mt-4">
        {auth ? (
          <TaskManager />
        ) : (
          <div className="text-center text-gray-600 mt-10 text-lg">
            Please log in or register to manage your tasks.
          </div>
        )}
      </div>
    </div>
  );
}
