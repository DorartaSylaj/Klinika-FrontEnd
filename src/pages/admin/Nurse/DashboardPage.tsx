import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatientsPage from "./PatientsPage";
import AddPatientPage from "./AddPatientPage";
import type { User } from "../../../types/User";

type Appointment = {
  id: number;
  name: string;
  date: string;
  type: "Kontrollë" | "Urgjente";
};

type Patient = {
  id: number;
  name: string;
  birthdate: string;
  symptoms: string;
  recoveryDays?: number;
};

type NurseDashboardProps = {
  onLogout: () => void;
  user: User;
};

const mockAppointments: Appointment[] = [
  { id: 1, name: "Ardit Krasniqi", date: "2025-09-04", type: "Kontrollë" },
  { id: 2, name: "Elira Gashi", date: "2025-09-04", type: "Urgjente" },
  { id: 3, name: "Blerim Hoti", date: "2025-09-06", type: "Kontrollë" },
];

export default function DashboardPage({ onLogout, user }: NurseDashboardProps) {
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<"dashboard" | "patients" | "add">("dashboard");
  const [search, setSearch] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Welcome screen timer
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPatient = (patient: Omit<Patient, "id">) => {
    const newPatient: Patient = { id: patients.length + 1, ...patient };
    setPatients((prev) => [...prev, newPatient]);
  };

  // Welcome Screen
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
            Mirë se erdhe, {user.name}!
          </h1>
          <p className="text-blue-600 font-medium">
            Po përgatitim panelin tuaj...
          </p>
        </motion.div>
      </div>
    );
  }

  // Patients view
  if (view === "patients") {
    return (
      <PatientsPage
        patients={patients}
        onBack={() => setView("dashboard")}
        onLogout={onLogout}
      />
    );
  }

  // Add patient view
  if (view === "add") {
    return (
      <AddPatientPage
        onBack={() => setView("dashboard")}
        onLogout={onLogout}
        onAddPatient={handleAddPatient}
      />
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col">
      {/* Header (top bar) */}
      <div className="flex justify-between items-center p-6 shadow bg-white">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Paneli i Infermieres 🦷
        </h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Dil
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header brenda main */}
        <div className="flex items-center justify-between mb-6">
          
          <p className="text-gray-600">
            Roli juaj:{" "}
            <span className="font-medium">{user.role}</span>
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Kërko pacient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Terminet */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Terminet për 7 ditët e ardhshme
            </h2>
            <ul className="space-y-3">
              {appointments
                .filter((appt) =>
                  appt.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((appt) => (
                  <li
                    key={appt.id}
                    className={`p-3 rounded-lg shadow-sm ${
                      appt.type === "Urgjente"
                        ? "bg-red-50 border border-red-300"
                        : "bg-gray-50 border"
                    }`}
                  >
                    <span className="font-medium text-gray-800">
                      {appt.name}
                    </span>{" "}
                    <span className="text-gray-600">
                      – {appt.date} ({appt.type})
                    </span>
                  </li>
                ))}
            </ul>
          </div>

          {/* Veprime të Shpejta */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Veprime të Shpejta
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => setView("patients")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-blue-700 transition"
              >
                Shiko të gjithë pacientët
              </button>
              <button
                onClick={() => setView("add")}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:bg-green-700 transition"
              >
                Shto pacient të ri
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
