import { useState } from "react";
import type { Appointment } from "./NurseDashboard";

type AddAppointmentProps = {
  onBack: () => void;
  nurseId: number;
  onNewAppointment: (appt: Appointment) => void;
  appointmentToEdit?: Appointment;
};

export default function AddAppointment({ onBack, nurseId, onNewAppointment, appointmentToEdit }: AddAppointmentProps) {
  const [patientName, setPatientName] = useState(appointmentToEdit?.patient_name || "");
  const [appointmentDate, setAppointmentDate] = useState(appointmentToEdit?.appointment_date || "");
  const [type, setType] = useState<"Kontrollë" | "Kontrollë Urgjente" | "Operim">(appointmentToEdit?.type || "Kontrollë");
  const [doctorId, setDoctorId] = useState<number>(appointmentToEdit?.nurse_id || 3);
  const [patientEmail, setPatientEmail] = useState(appointmentToEdit?.patient_email || "");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        patient_name: patientName,
        appointment_date: appointmentDate,
        type,
        doctor_id: doctorId,
        patient_email: patientEmail,
      };

      const url = appointmentToEdit
        ? `http://127.0.0.1:8000/api/nurse/appointments/${appointmentToEdit.id}`
        : "http://127.0.0.1:8000/api/nurse/appointments";

      const res = await fetch(url, {
        method: appointmentToEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gabim gjatë ruajtjes së terminës");

      onNewAppointment(data.appointment);
      onBack();
    } catch (err: any) {
      alert(err.message || "Ndodhi një gabim gjatë ruajtjes së terminës");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">{appointmentToEdit ? "Modifiko Termin" : "Shto Termin"}</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Emri pacientit"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email pacientit (opsional)"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="Kontrollë">Kontrollë</option>
            <option value="Kontrollë Urgjente">Kontrollë Urgjente</option>
            <option value="Operim">Operim</option>
          </select>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 font-semibold transition"
          >
            {loading ? "Duke ruajtur..." : appointmentToEdit ? "Ruaj Ndryshimet" : "Ruaj Termin"}
          </button>
          <button
            onClick={onBack}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 font-semibold transition"
          >
            Kthehu
          </button>
        </div>
      </div>
    </div>
  );
}
