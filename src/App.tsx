import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard"; // doktori (placeholder për tani)
import AdminPanel from "./pages/admin/admin/AdminPanel";
import DashboardPage from "./pages/admin/nurse/DashboardPage"; // infermierja

import type { User } from "./types/User";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => setUser(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {!user ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoginPage onLogin={setUser} />
          </motion.div>
        ) : user.role === "admin" ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AdminPanel onLogout={handleLogout} user={user} />
          </motion.div>
        ) : user.role === "nurse" ? (
          <motion.div
            key="nurse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardPage onLogout={handleLogout} user={user} />
          </motion.div>
        ) : (
          <motion.div
            key="doctor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard user={user} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
