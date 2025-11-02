// ------------------
// NurseDashboard.tsx
// ------------------
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { User } from "../../../types/User";
import PatientsPage from "./PatientsPage";
import AddPatientPage from "./AddPatientPage";
import AddAppointment from "./AddAppointment";
import PatientDetail from "./PatientDetail";

export type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  symptoms?: string;
  recovery_days?: number;
  visit_date?: string;
  prescription?: string;
  created_at?: string;
  updated_at?: string;
};

export type Appointment = {
  id: number;
  patient_name: string;
  appointment_date: string;
  type: "Kontrollë" | "Kontrollë Urgjente" | "Operim";
  status: "pending" | "done" | "cancelled";
  notes?: string;
  nurse_id?: number;
};

type NurseDashboardProps = {
  onLogout: () => void;
  user: User;
};

export default function NurseDashboard({ onLogout, user }: NurseDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<
    "dashboard" | "patientsList" | "addPatient" | "addAppointment" | "patientDetail"
  >("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("token");

  // Fetch patients
  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/nurse/patients", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => setPatients(Array.isArray(data) ? data : data.data || []))
      .catch(() => setError("Gabim gjatë marrjes së pacientëve"));
  }, [token]);

  // Fetch appointments (fixed nurse endpoint)
  useEffect(() => {
    if (!token) return;
    setLoading(true);

    fetch("http://127.0.0.1:8000/api/nurse/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const appointmentsArray = Array.isArray(data) ? data : data.data || [];
        setAppointments(appointmentsArray);
      })
      .catch(() => setError("Gabim gjatë marrjes së termineve"))
      .finally(() => setLoading(false));

    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, [token]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView("patientDetail");
  };

  const handleAddPatient = (patient: Patient) => setPatients((prev) => [...prev, patient]);
  const handleAddAppointment = (appt: Appointment) => setAppointments((prev) => [...prev, appt]);

  if (showWelcome)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-12 rounded-3xl shadow-2xl text-center w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4 animate-pulse">
            Mirë se erdhe, {user.name}!
          </h1>
          <p className="text-blue-600 text-base font-medium">Po përgatitim panelin tuaj...</p>
        </motion.div>
      </div>
    );

  if (view === "patientsList")
    return (
      <PatientsPage
        patients={patients}
        onBackToDashboard={() => setView("dashboard")}
        onSelectPatient={handleSelectPatient}
      />
    );

  if (view === "patientDetail" && selectedPatient)
    return (
      <PatientDetail
        patient={selectedPatient}
        onBack={() => {
          setSelectedPatient(null);
          setView("patientsList");
        }}
        onAddReport={() => alert("Opsioni 'Shto Raport' do të lidhet në të ardhmen.")}
      />
    );

  if (view === "addPatient")
    return (
      <AddPatientPage
        onBack={() => setView("dashboard")}
        onLogout={onLogout}
        onPatientAdded={handleAddPatient}
      />
    );

  if (view === "addAppointment")
    return (
      <AddAppointment
        onBack={() => setView("dashboard")}
        nurseId={user.id}
        onNewAppointment={handleAddAppointment}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-md rounded-b-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Paneli i Infermieres 🦷</h1>
        <button
          onClick={onLogout}
          className="px-5 py-2 rounded-xl bg-red-500 text-white text-base font-semibold shadow-md hover:bg-red-600 transition"
        >
          Dil
        </button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full mb-8 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => setView("patientsList")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-200 text-blue-800 font-semibold shadow-md hover:bg-blue-300"
          >
            Shiko Pacientët
          </button>
          <button
            onClick={() => setView("addPatient")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-green-200 text-green-800 font-semibold shadow-md hover:bg-green-300"
          >
            Shto Pacient
          </button>
          <button
            onClick={() => setView("addAppointment")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-yellow-200 text-yellow-800 font-semibold shadow-md hover:bg-yellow-300"
          >
            Shto Termin
          </button>
        </section>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && <div className="text-center mb-4 text-gray-600">Duke ngarkuar të dhënat...</div>}

        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Terminet e ardhshme
          </h2>
          <ul className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appt, index) => (
                <li
                  key={appt.id || index}
                  className={`p-4 rounded-xl text-base shadow-sm flex justify-between items-center ${appt.type === "Kontrollë Urgjente"
                    ? "bg-red-50 border border-red-300 hover:bg-red-100"
                    : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                    }`}
                >
                  <div>
                    <span className="font-semibold text-gray-900">{appt.patient_name}</span>{" "}
                    – {appt.appointment_date} ({appt.type})
                  </div>
                  <span
                    className={`font-medium ${appt.status === "done"
                      ? "text-green-600"
                      : appt.status === "cancelled"
                        ? "text-red-600"
                        : "text-gray-600"
                      }`}
                  >
                    {appt.status}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-4">
                Nuk ka termine për të shfaqur.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
