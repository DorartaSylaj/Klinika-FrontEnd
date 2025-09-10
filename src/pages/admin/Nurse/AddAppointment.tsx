import React, { useState } from "react";
import type { AppointmentType } from "./DashboardPage";

type Appointment = {
  name: string;
  date: string;
  type: AppointmentType;
};

type Props = {
  onBack: () => void;
  onSave: (appointment: Appointment) => void;
};

export default function AddAppointment({ onBack, onSave }: Props) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<AppointmentType>("Kontrollë");

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Shto Termin të Ri</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Emri Pacientit:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Data:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            onClick={() => {
              if (!name || !date) return;
              onSave({ name, date, type });
            }}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Shto Termin
          </button>
        </div>
      </div>
    </div>
  );
}
