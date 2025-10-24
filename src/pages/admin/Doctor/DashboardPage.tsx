import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatientsPage from "../Nurse/PatientsPage";
import ReportPage from "./ReportsPage";
import type { Patient } from "../Nurse/types";
import type { User } from "../../../types/User";

export type Appointment = {
  id: number;
  patient_name: string;
  appointment_date: string;
  type: "Kontrollë" | "Urgjente" | "Operim";
  status: "pending" | "done" | "cancelled";
  notes?: string;
};

type DoctorDashboardProps = {
  user: User;
  onLogout: () => void;
};

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [view, setView] = useState<"dashboard" | "patients" | "report">("dashboard");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDone, setShowDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const token = localStorage.getItem("token");

  // Fetch patients
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/patients", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => setPatients(json.data || []))
      .catch(() => setError("Gabim gjatë marrjes së pacientëve"));
  }, [token]);

  // Fetch appointments
  const fetchAppointments = () => {
    if (!token) return;
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((json) => setAppointments(json.data || []))
      .catch(() => setError("Gabim gjatë marrjes së termineve"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, [token]);

  const filteredAppointments = appointments
    .filter((a) => a.status === "pending" || (showDone && a.status === "done"))
    .sort((a, b) => {
      const dateA = new Date(a.appointment_date).getTime();
      const dateB = new Date(b.appointment_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Update appointment status in DB
  const updateStatus = async (id: number, status: "done" | "cancelled") => {
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(`Failed to mark ${status}:`, err);
      setError(`Gabim gjatë përditësimit të statusit`);
    }
  };

  // -------------------------------
  // Views
  // -------------------------------
  if (showWelcome)
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

  if (view === "patients")
    return (
      <PatientsPage
        patients={patients}
        onBackToDashboard={() => setView("dashboard")}
        onSelectPatient={(p) => {
          setSelectedPatient(p);
          setSelectedAppointment(null);
          setView("report");
        }}
      />
    );

  if (view === "report")
    return (
      <ReportPage
        patient={selectedPatient || undefined}
        appointment={selectedAppointment || undefined}
        patientsList={patients}
        onSave={() => {
          setSelectedPatient(null);
          setSelectedAppointment(null);
          setView("dashboard");
          fetchAppointments();
        }}
        onBack={() => {
          setSelectedPatient(null);
          setSelectedAppointment(null);
          setView("dashboard");
        }}
      />
    );

  // -------------------------------
  // Dashboard
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col">
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
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView("patients")}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Shiko pacientët
          </button>
          <button
            onClick={() => {
              setSelectedPatient({ id: 0, first_name: "", last_name: "", birth_date: "", symptoms: "", recovery_days: 0 });
              setSelectedAppointment(null);
              setView("report");
            }}
            className="px-6 py-2 rounded-xl bg-green-600 text-white font-medium shadow hover:bg-green-700 transition"
          >
            Krijo Raport
          </button>
        </div>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && <div className="text-center mb-4">Duke ngarkuar të dhënat...</div>}

        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Terminet e ardhshme</h2>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-1 rounded bg-gray-200 text-gray-800 shadow hover:bg-gray-300 transition"
            >
              {sortOrder === "asc" ? "Nga më i afërti → më i larguari" : "Nga më i larguari → më i afërti"}
            </button>
          </div>
          <ul className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((a) => (
                <li
                  key={a.id}
                  className={`p-4 rounded-xl text-base shadow-sm flex justify-between items-center ${a.type === "Urgjente"
                    ? "bg-red-50 border border-red-300 hover:bg-red-100"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  <div>
                    <span className="font-semibold">{a.patient_name}</span> – {a.appointment_date} ({a.type})
                  </div>
                  <div className="flex gap-2">
                    {a.status !== "done" && (
                      <button
                        onClick={() => updateStatus(a.id, "done")}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-white shadow transition"
                      >
                        ✅
                      </button>
                    )}
                    {a.status !== "cancelled" && (
                      <button
                        onClick={() => updateStatus(a.id, "cancelled")}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow transition"
                      >
                        ❌
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedAppointment(a);
                        setSelectedPatient(null);
                        setView("report");
                      }}
                      className="px-3 py-1 rounded bg-blue-600 text-white shadow hover:bg-blue-700"
                    >
                      Shto Raport
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-4">Nuk ka termine për të shfaqur.</li>
            )}
          </ul>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowDone((prev) => !prev)}
              className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
            >
              {showDone ? "Fshi terminet e përfunduara" : "Shfaq terminet e përfunduara"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
