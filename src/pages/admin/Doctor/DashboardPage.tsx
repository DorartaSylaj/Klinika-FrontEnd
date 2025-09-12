import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatientsPage from "../Nurse/PatientsPage"; // path i saktë
import ReportPage from "./ReportsPage";

type Appointment = {
  id: number;
  name: string;
  date: string;
  type: "Kontrollë" | "Urgjente" | "Operim";
  status: "pending" | "done" | "missed";
};

type User = {
  id: string;
  name: string;
  role: string;
};

type DoctorDashboardProps = {
  user: User;
  onLogout: () => void;
};

const mockAppointments: Appointment[] = [
  { id: 1, name: "Ardit Krasniqi", date: "2025-09-04", type: "Kontrollë", status: "pending" },
  { id: 2, name: "Elira Gashi", date: "2025-09-04", type: "Urgjente", status: "pending" },
  { id: 3, name: "Blerim Hoti", date: "2025-09-06", type: "Kontrollë", status: "pending" },
];

export default function DoctorDashboardPage({ user, onLogout }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<"dashboard" | "patients" | "report">("dashboard");
  const [showWelcome, setShowWelcome] = useState(true);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMissed = (id: number) => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "missed" } : a))
    );
  };

  const filteredAppointments = hideCompleted
    ? appointments.filter(a => a.status !== "done")
    : appointments;

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
            Mirë se erdhe, Dr. {user.name}!
          </h1>
          <p className="text-blue-600 font-medium">Po përgatitim panelin tuaj...</p>
        </motion.div>
      </div>
    );
  }

  if (view === "patients") {
    return <PatientsPage onBackToDashboard={() => setView("dashboard")} />;
  }

  if (view === "report" && selectedAppointment) {
    return (
      <ReportPage
        appointment={selectedAppointment}
        onSave={() => {
          // heqim terminin nga dashboard pasi u ruajt raporti
          setAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
          setSelectedAppointment(null);
          setView("dashboard");
        }}
        onBack={() => {
          setSelectedAppointment(null);
          setView("dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Paneli i Doktorit 🩺</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
        >
          Dil
        </button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView("patients")}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Shiko pacientët
          </button>
          <button
            onClick={() => setView("report")}
            className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium shadow hover:bg-green-700 transition"
          >
            Krijo raport
          </button>
        </div>

        {/* Appointments */}
        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Terminet për 5 ditët e ardhshme
          </h2>
          <ul className="space-y-4">
            {filteredAppointments.map(a => (
              <li
                key={a.id}
                className={`p-4 rounded-xl text-base shadow-sm transition flex justify-between items-center ${a.type === "Urgjente"
                  ? "bg-red-50 border border-red-300 hover:bg-red-100"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <div>
                  <span className="font-semibold text-gray-900">{a.name}</span> – {a.date} ({a.type})
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAppointment(a);
                      setView("report"); // ky është ndryshimi kryesor
                    }}
                    className="px-2 py-1 rounded bg-green-500 text-white"
                  >
                    Shto Raport
                  </button>
                  <button
                    onClick={() => handleMissed(a.id)}
                    className={`px-2 py-1 rounded ${a.status === "missed" ? "bg-red-500 text-white" : "bg-gray-200"}`}
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
            {filteredAppointments.length === 0 && (
              <li className="text-center text-gray-500 py-4">
                Nuk ka termine për të shfaqur.
              </li>
            )}
          </ul>

          {/* Butoni për shfaq/fshih termine të përfunduara */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setHideCompleted(prev => !prev)}
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
            >
              {hideCompleted ? "Shfaq të gjitha terminet" : "Terminet e përfunduara"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
