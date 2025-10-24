import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginPage from "./components/LoginPage";
import DashboardPage from "./pages/admin/nurse/DashboardPage"; // nurse
import DoctorDashboardPage from "./pages/admin/Doctor/DashboardPage"; // doctor
import AdminPanel from "./pages/admin/admin/AdminPanel";

import type { User } from "./types/User";

const queryClient = new QueryClient();

export default function App() {
  // Load user from localStorage initially
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // optional: remove token on logout
    }
  }, [user]);

  const handleLogout = () => setUser(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

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
            <LoginPage onLogin={handleLogin} />
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
            <DoctorDashboardPage onLogout={handleLogout} user={user} />
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
