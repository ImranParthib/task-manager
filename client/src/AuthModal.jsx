import React, { useState } from "react";
import { login, register } from "./api";

export default function AuthModal({ open, onClose, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fn = mode === "login" ? login : register;
      const res = await fn(form);
      if (res.token) {
        localStorage.setItem("token", res.token);
        onAuth();
        onClose();
      } else {
        setError(res.error || "Unknown error");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xs animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Register"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>
        <div className="text-center mt-3">
          {mode === "login" ? (
            <span>
              New user?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
