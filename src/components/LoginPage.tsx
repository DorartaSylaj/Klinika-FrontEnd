import { useState } from "react";
import { motion } from "framer-motion";
import type { User } from "../types/User";
import api from "../api"; // ⬅️ added axios instance

export default function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Get CSRF cookie
      await api.get("/sanctum/csrf-cookie");

      // 2️⃣ Login request
      const res = await api.post("/api/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const data = res.data;

      // Store token
      localStorage.setItem("token", data.token);

      const user: User = {
        id: data.user.id.toString(),
        name: data.user.name,
        role: data.user.role,
      };

      onLogin(user);

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Email ose fjalëkalimi është i pasaktë!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/60 to-transparent rounded-3xl pointer-events-none" />

        <div className="flex items-center justify-center gap-3 mb-6 relative z-10">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-7 h-7 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 8c0 5-2 10-4 10-1.5 0-1-4-3-4s-1.5 4-3 4c-2 0-4-5-4-10a6 6 0 1 1 12 0z" />
            <path d="M9.5 8c.5-1 1.5-1.5 2.5-1.5S14 7 14.5 8" />
          </svg>
          <h1 className="text-2xl font-bold text-blue-700 drop-shadow-sm">
            Klinika Stomatologjike
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email duhet të përmbajë @"
              className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Fjalëkalimi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Shkruaj fjalëkalimin"
              className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${loading ? "bg-blue-300 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Duke u kyçur..." : "Hyr"}
          </button>

          <p className="text-xs text-blue-700/70 mt-1 text-center">
            *Pas kyçjes ju do të ridrejtoheni në faqen kryesore.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
