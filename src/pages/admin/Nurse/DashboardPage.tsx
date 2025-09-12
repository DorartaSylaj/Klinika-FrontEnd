import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatientsPage from "./PatientsPage";
import AddPatientPage from "./AddPatientPage";
import AddAppointmentPage from "./AddAppointment"; // Import i ri
import type { User } from "../../../types/User";

type Appointment = {
  id: number;
  name: string;
  date: string;
  type: "Kontrollë" | "Urgjente" | "Operim";
  status?: "done" | "missed";
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
  { id: 3, name: "Blerim Hoti", date: "2025-09-06", type: "Operim" },
];

export default function DashboardPage({ onLogout, user }: NurseDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<"dashboard" | "patients" | "add" | "addAppointment">("dashboard");
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPatient = (patient: Omit<Patient, "id">) => {
    const newPatient: Patient = { id: patients.length + 1, ...patient };
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleAddAppointment = (appointment: Omit<Appointment, "id">) => {
    const newAppointment: Appointment = { id: appointments.length + 1, ...appointment };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  // Status functions
  const handleTick = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: "done" } : appt))
    );
  };

  const handleX = (id: number) => {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, status: "missed" } : appt))
    );
  };

  const completedAppointments = appointments.filter(
    (appt) => appt.status === "done" || appt.status === "missed"
  );

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-12 rounded-3xl shadow-2xl text-center w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4 animate-pulse">
            Mirë se erdhe, {user.name}!
          </h1>
          <p className="text-blue-600 text-base font-medium">
            Po përgatitim panelin tuaj...
          </p>
        </motion.div>
      </div>
    );
  }

  if (view === "patients") {
    return <PatientsPage onBackToDashboard={() => setView("dashboard")} />;
  }

  if (view === "add") {
    return (
      <AddPatientPage
        onBack={() => setView("dashboard")}
        onLogout={onLogout}
        onAddPatient={handleAddPatient}
      />
    );
  }

  if (view === "addAppointment") {
    return (
      <AddAppointmentPage
        onBack={() => setView("dashboard")}
        onAddAppointment={handleAddAppointment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Paneli i Infermieres 🦷</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-red-500 text-white text-base font-semibold shadow-md hover:bg-red-600 transition"
        >
          Dil
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Role Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700 text-lg">
            Roli juaj: <span className="font-semibold">{user.role}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView("patients")}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-base font-medium shadow hover:bg-blue-700 transition"
          >
            Shiko pacientët
          </button>
          <button
            onClick={() => setView("add")}
            className="px-6 py-2 rounded-xl bg-green-600 text-white text-base font-medium shadow hover:bg-green-700 transition"
          >
            Shto pacient
          </button>
          <button
            onClick={() => setView("addAppointment")}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white text-base font-medium shadow hover:bg-purple-700 transition"
          >
            Shto termin
          </button>
        </div>

        {/* Appointments */}
        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Terminet për 5 ditët e ardhshme</h2>
          <ul className="space-y-4">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className={`p-4 rounded-xl text-base shadow-sm transition flex justify-between items-center ${appt.type === "Urgjente"
                    ? "bg-red-50 border border-red-300 hover:bg-red-100"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <div>
                  <span className="font-semibold text-gray-900">{appt.name}</span>
                  <span className="text-gray-600 ml-2">
                    {appt.date} ({appt.type})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTick(appt.id)}
                    className={`px-2 py-1 rounded shadow text-white transition ${appt.status === "done" ? "bg-green-600" : "bg-gray-300 hover:bg-green-500"
                      }`}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleX(appt.id)}
                    className={`px-2 py-1 rounded shadow text-white transition ${appt.status === "missed" ? "bg-red-600" : "bg-gray-300 hover:bg-red-500"
                      }`}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Completed Appointments */}
        {completedAppointments.length > 0 && (
          <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Terminet e Përfunduar</h2>
            <ul className="space-y-4">
              {completedAppointments.map((appt) => (
                <li
                  key={appt.id}
                  className={`p-4 rounded-xl text-base shadow-sm transition flex justify-between items-center ${appt.status === "done" ? "bg-green-50 border border-green-300" : "bg-red-50 border border-red-300"
                    }`}
                >
                  <div>
                    <span className="font-semibold text-gray-900">{appt.name}</span>
                    <span className="text-gray-600 ml-2">
                      {appt.date} ({appt.type})
                    </span>
                  </div>
                  <span className="font-semibold">
                    {appt.status === "done" ? "Done ✓" : "Missed X"}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  if (window.confirm("Jeni të sigurt që doni të fshini terminet e përfunduar?")) {
                    setAppointments((prev) =>
                      prev.filter((appt) => appt.status !== "done" && appt.status !== "missed")
                    );
                  }
                }}
                className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
              >
                Fshij Terminet e Përfunduar
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
