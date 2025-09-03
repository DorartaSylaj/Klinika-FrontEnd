import React, { useEffect, useState } from "react";
import type { User } from "../types/User";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

export default function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-10 rounded-3xl shadow-2xl text-center w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-blue-700 mb-4 animate-pulse">
            Mirë se erdhe, {user.name}! 👋
          </h1>
          <p className="text-blue-600 font-medium">Po përgatitim panelin tuaj...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-8">🦷 Klinika</h2>
        <nav className="flex flex-col space-y-4 text-blue-700 font-medium">
          <button className="text-left hover:text-blue-900">📊 Dashboard</button>
          <button className="text-left hover:text-blue-900">👥 Pacientët</button>
          <button className="text-left hover:text-blue-900">📅 Takimet</button>
          <button className="text-left hover:text-blue-900">📑 Raportet</button>
        </nav>
        <div className="mt-auto">
          <Button onClick={onLogout} variant="red" className="w-full">
            Dil
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Roli juaj: <span className="font-medium">{user.role}</span></p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">Mirësevini në panel</h2>
          <p className="text-gray-600">
            Këtu do të shfaqet lista e pacientëve dhe informacionet e tjera të rëndësishme.
          </p>
        </div>
      </main>
    </div>
  );
}
