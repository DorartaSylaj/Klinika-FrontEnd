import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { User } from "../../../types/User";
import PatientsPage from "./PatientsPage";
import AddPatientPage from "./AddPatientPage";
import AddAppointment from "./AddAppointment";
import PatientDetail from "./PatientDetail";
import EditPatientPage from "./EditPatientPage";

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
  patient_email?: string;
};

type NurseDashboardProps = {
  onLogout: () => void;
  user: User;
};

export default function NurseDashboard({ onLogout, user }: NurseDashboardProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<
    "dashboard" | "patientsList" | "addPatient" | "addAppointment" | "patientDetail" | "editPatient"
  >("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [appointmentFilter, setAppointmentFilter] =
    useState<"all" | "pending" | "done" | "cancelled">("all");

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
      .then((data) => {
        const array = Array.isArray(data) ? data : data.data || [];
        setPatients(array);
      })
      .catch(() => setError("Gabim gjatë marrjes së pacientëve"));
  }, [token]);

  // Fetch appointments
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
        const arr = Array.isArray(data) ? data : data.data || [];
        setAppointments(arr);
      })
      .catch(() => setError("Gabim gjatë marrjes së termineve"))
      .finally(() => setLoading(false));

    const t = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(t);
  }, [token]);

  // Select patient
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setView("patientDetail");
  };

  // DELETE patient
  const handleDeletePatient = async (id: number) => {
    if (!token) return;
    if (!confirm("A jeni të sigurt që dëshironi të fshini këtë pacient?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/nurse/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      setPatients((prev) => prev.filter((p) => p.id !== id));

      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
        setView("patientsList");
      }
    } catch {
      alert("Ndodhi një gabim gjatë fshirjes së pacientit");
    }
  };

  // MODIFY → open EditPatientPage
  const handleModifyPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setView("editPatient");
  };

  // After edit page updates patient
  const handlePatientUpdated = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setPatientToEdit(null);
    setView("patientsList");
  };

  // Add patient
  const handleAddPatient = (patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  };

  // Add or update appointment
  const handleAddAppointment = (appt: Appointment) => {
    setAppointments((prev) => {
      const idx = prev.findIndex((a) => a.id === appt.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = appt;
        return copy;
      }
      return [...prev, appt];
    });
  };

  // Clear appointments
  const handleClearAppointments = async () => {
    if (!token) return;
    if (!confirm("A jeni të sigurt që dëshironi të fshini të gjitha terminet e përfunduara dhe të anuluara?"))
      return;

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/nurse/appointments/clear-non-pending",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      setAppointments((prev) => prev.filter((a) => a.status === "pending"));
    } catch {
      alert("Ndodhi një gabim gjatë fshirjes së termineve");
    }
  };

  const filteredAppointments = appointments.filter((a) =>
    appointmentFilter === "all" ? true : a.status === appointmentFilter
  );

  // Welcome screen
  if (showWelcome)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-gray-100 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-12 rounded-3xl shadow-2xl text-center w-full max-w-md"
        >
          <h1 className="text-3xl font-extrabold text-blue-700 mb-4 animate-pulse">
            Mirë se erdhe, Inf {user.name}!
          </h1>
          <p className="text-blue-600 font-medium">Po përgatitim panelin tuaj...</p>
        </motion.div>
      </div>
    );

  // Render views
  if (view === "patientsList")
    return (
      <PatientsPage
        patients={patients}
        onBackToDashboard={() => setView("dashboard")}
        onSelectPatient={handleSelectPatient}
        onDeletePatient={handleDeletePatient}
        onModifyPatient={handleModifyPatient}
      />
    );

  if (view === "editPatient" && patientToEdit)
    return (
      <EditPatientPage
        patient={patientToEdit}
        onBack={() => setView("patientsList")}
        onLogout={onLogout}
        onPatientUpdated={handlePatientUpdated}
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
        onAddReport={() => alert("Shto raporti do bëhet më vonë.")}
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
        onBack={() => {
          setAppointmentToEdit(null);
          setView("dashboard");
        }}
        nurseId={user.id}
        onNewAppointment={handleAddAppointment}
        appointmentToEdit={appointmentToEdit || undefined}
      />
    );

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 flex flex-col">
      <header className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm shadow-md rounded-b-2xl">
        <h1 className="text-3xl font-bold text-gray-900">Paneli i Infermieres 🦷</h1>

        <div className="flex items-center gap-4">


          <button
            onClick={onLogout}
            className="px-5 py-2 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          >
            Dil
          </button>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <section className="bg-white shadow-lg rounded-3xl p-6 w-full mb-8 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => setView("patientsList")}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Shiko Pacientët
          </button>

          <button
            onClick={() => setView("addPatient")}
            className="px-6 py-3 rounded-2xl bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
          >
            Shto Pacient
          </button>

          <button
            onClick={() => setView("addAppointment")}
            className="px-6 py-3 rounded-2xl bg-yellow-500 text-white font-semibold shadow-md hover:bg-yellow-600 transition"
          >
            Shto Termin
          </button>

          <button
            onClick={handleClearAppointments}
            className="px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          >
            Fshi Terminet
          </button>
        </section>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && <div className="text-center text-gray-600 mb-4">Duke ngarkuar...</div>}

        <section className="bg-white shadow-lg rounded-3xl p-6 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Terminet</h2>

          <div className="flex gap-3 mb-4 flex-wrap">
            {["all", "pending", "done", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setAppointmentFilter(s as any)}
                className={`px-4 py-2 rounded-xl font-semibold shadow-md ${appointmentFilter === s
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}
              >
                {s === "all"
                  ? "Të gjitha"
                  : s === "pending"
                    ? "Në pritje"
                    : s === "done"
                      ? "E kryer"
                      : "Anuluar"}
              </button>
            ))}
          </div>

          <ul className="space-y-4">
            {filteredAppointments.map((appt) => (
              <li
                key={appt.id}
                className={`p-4 rounded-xl flex justify-between items-center ${appt.type === "Kontrollë Urgjente"
                  ? "bg-red-50"
                  : "bg-gray-50"
                  }`}
              >
                <div>
                  <span className="font-semibold">{appt.patient_name}</span> –{" "}
                  {appt.appointment_date} ({appt.type})
                </div>

                <div className="flex gap-2 items-center">
                  <span
                    className={`font-medium ${appt.status === "done"
                      ? "text-green-600"
                      : appt.status === "cancelled"
                        ? "text-red-600"
                        : "text-gray-600"
                      }`}
                  >
                    {appt.status === "pending"
                      ? "Në pritje"
                      : appt.status === "done"
                        ? "E kryer"
                        : "Anuluar"}
                  </span>

                  <button
                    onClick={() => {
                      setAppointmentToEdit(appt);
                      setView("addAppointment");
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600"
                  >
                    Modifiko
                  </button>
                </div>
              </li>
            ))}

            {filteredAppointments.length === 0 && (
              <li className="text-center text-gray-500 py-4">Nuk ka termine.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
