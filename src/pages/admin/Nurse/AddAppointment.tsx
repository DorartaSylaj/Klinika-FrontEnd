import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sq } from "date-fns/locale";
import type { Appointment as BackendAppointment } from "../../../types/Patient";
registerLocale("sq", sq);

export type AppointmentType = "Kontrollë" | "Kontrollë Urgjente" | "Operim";

export interface Appointment {
  id: number;
  patient_name: string;
  appointment_date: string;
  type: AppointmentType;
  status?: string;
}

type Props = {
  onBack: () => void;
  nurseId: number;
  onNewAppointment?: (appt: Appointment) => void;
};

export default function AddAppointment({ onBack, nurseId, onNewAppointment }: Props) {
  const [patientId, setPatientId] = useState<number | null>(null);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>(""); // HH:MM
  const [type, setType] = useState<AppointmentType>("Kontrollë");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !date || !time) {
      alert("Ju lutem plotësoni të gjitha fushat e kërkuara!");
      return;
    }

    const datetime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0]),
      parseInt(time.split(":")[1])
    ).toISOString().slice(0, 19).replace("T", " "); // "YYYY-MM-DD HH:MM:SS"

    const appointmentData = {
      nurse_id: nurseId,
      doctor_id: null, // optional, can extend later
      patient_id: patientId,
      patient_name: patientName,
      appointment_date: datetime,
      type,
      status: "pending",
    };

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) throw new Error("Failed to save appointment");

      const savedAppointment: BackendAppointment = await response.json();

      const newAppt: Appointment = {
        id: savedAppointment.id,
        patient_name: savedAppointment.patient_name,
        appointment_date: savedAppointment.appointment_date,
        type: savedAppointment.type as AppointmentType,
        status: savedAppointment.status || undefined,
      };

      if (onNewAppointment) onNewAppointment(newAppt);

      alert("Termini u shtua me sukses!");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Gabim gjatë ruajtjes së terminës!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-700">Shto Termin</h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Patient Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Emri i pacientit</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Shkruani emrin e pacientit"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Data e terminit</label>
            <DatePicker
              selected={date}
              onChange={(d) => setDate(d)}
              dateFormat="dd/MM/yyyy"
              locale="sq"
              placeholderText="Zgjidh datën"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>

          {/* Appointment Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ora e terminit</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Lloji i terminit</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AppointmentType)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Kontrollë">Kontrollë</option>
              <option value="Kontrollë Urgjente">Kontrollë Urgjente</option>
              <option value="Operim">Operim</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              disabled={loading}
            >
              Kthehu
            </button>

            <button
              type="submit"
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              disabled={loading}
            >
              {loading ? "Duke ruajtur..." : "Shto Termin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
