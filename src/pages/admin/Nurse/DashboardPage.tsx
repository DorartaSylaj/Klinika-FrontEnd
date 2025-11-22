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
    "dashboard" | "patientsList" | "addPatient" | "addAppointment" | "patientDetail"
  >("dashboard");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [appointmentFilter, setAppointmentFilter] = useState<"all" | "pending" | "done" | "cancelled">("all");

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

  const handleAddAppointment = (appt: Appointment) => {
    setAppointments((prev) => {
      const index = prev.findIndex((a) => a.id === appt.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = appt;
        return updated;
      }
      return [...prev, appt];
    });
  };

  const handleClearAppointments = async () => {
    if (!token) return;
    if (!confirm("A jeni të sigurt që dëshironi të fshini të gjitha terminet e përfunduara dhe të humbura?")) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/nurse/appointments/clear-non-pending", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gabim gjatë fshirjes së termineve");
      setAppointments((prev) => prev.filter((appt) => appt.status === "pending"));
    } catch (err) {
      alert("Ndodhi një gabim gjatë fshirjes së termineve");
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    appointmentFilter === "all" ? true : appt.status === appointmentFilter
  );

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
            Mirë se erdhe, Inf {user.name}!
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
        onPatientAdded={(patient) => setPatients((prev) => [...prev, patient])}
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
          <button
            onClick={handleClearAppointments}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-200 text-red-800 font-semibold shadow-md hover:bg-red-300"
          >
            Fshi Terminet
          </button>
        </section>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading && <div className="text-center mb-4 text-gray-600">Duke ngarkuar të dhënat...</div>}

        <section className="bg-white shadow-lg rounded-3xl p-6 border border-gray-100 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Terminet e ardhshme</h2>

          <div className="flex gap-3 mb-4 flex-wrap">
            {["all", "pending", "done", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setAppointmentFilter(status as any)}
                className={`px-4 py-2 rounded-xl font-semibold shadow-md ${appointmentFilter === status ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
              >
                {status === "all"
                  ? "Të gjitha"
                  : status === "pending"
                    ? "Në pritje"
                    : status === "done"
                      ? "E kryer"
                      : "Anuluar"}
              </button>
            ))}
          </div>

          <ul className="space-y-4">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appt, index) => (
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
                  <div className="flex gap-2 items-center">
                    <span
                      className={`font-medium ${appt.status === "done" ? "text-green-600" : appt.status === "cancelled" ? "text-red-600" : "text-gray-600"
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                    >
                      Modifiko
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-4">Nuk ka termine për të shfaqur.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
}
