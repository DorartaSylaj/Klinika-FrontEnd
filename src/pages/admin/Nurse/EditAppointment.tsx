import { useState } from "react";
import type { Appointment, AppointmentType } from "./DashboardPage";

type Props = {
  appointment: Appointment;
  onBack: () => void;
  onSave?: (updated: Appointment) => void; // optional callback for local state
};

export default function EditAppointment({ appointment, onBack, onSave }: Props) {
  const [patientName, setPatientName] = useState(appointment.patient_name);
  const [appointmentDate, setAppointmentDate] = useState(appointment.appointment_date);
  const [type, setType] = useState<AppointmentType>(appointment.type);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token"); // logged-in token

  const handleSave = async () => {
    if (!token) {
      alert("Ju nuk jeni i kyçur. Rifreskoni faqen dhe logohuni.");
      return;
    }

    const updatedAppointment = {
      patient_name: patientName,
      appointment_date: appointmentDate,
      type,
      patient_email: appointment.patient_email ?? null,
    };

    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/api/nurse/appointments/${appointment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedAppointment),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error(errData);
        throw new Error(`Gabim: ${res.status}`);
      }

      const data: Appointment = await res.json();

      if (onSave) onSave(data); // update local state if callback exists
      onBack();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së terminës.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Modifiko Termin</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Emri Pacientit:</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Data:</label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Lloji i Terminës:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AppointmentType)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="Kontrollë">Kontrollë</option>
            <option value="Kontrollë Urgjente">Kontrollë Urgjente</option>
            <option value="Operim">Operim</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Kthehu
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
          </button>
        </div>
      </div>
    </div>
  );
}
