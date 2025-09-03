import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./pages/admin/AdminPanel"; // ← importo AdminPanel
import type { User } from "./types/User";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

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
            {/* ✅ ia kalojmë onLogout */}
            <AdminPanel onLogout={() => setUser(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="dash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard user={user} onLogout={() => setUser(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
