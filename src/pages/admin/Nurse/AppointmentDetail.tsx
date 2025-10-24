import { useState } from "react"; // <-- Add this

type Appointment = {
  id: number;
  name: string;
  date: string;
  type: "Kontrollë" | "Kontrollë Urgjente" | "Operim";
};

type Props = {
  appointment: Appointment;
  onBack: () => void;
};

export default function AppointmentDetail({ appointment, onBack }: Props) {
  const [name, setName] = useState(appointment.name);
  const [date, setDate] = useState(appointment.date);
  const [type, setType] = useState<"Kontrollë" | "Kontrollë Urgjente" | "Operim">(appointment.type);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !date) return;

    setLoading(true);
    try {
      const updatedAppointment = { id: appointment.id, name, date, type };

      const response = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedAppointment),
      });

      if (!response.ok) throw new Error("Failed to update appointment");

      const saved = await response.json();
      console.log("Appointment updated:", saved);

      onBack(); // go back to previous page
    } catch (err) {
      console.error(err);
      alert("Diçka shkoi gabim gjatë ruajtjes së terminës.");
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
          <label className="block text-gray-700 mb-1">Lloji:</label>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as "Kontrollë" | "Kontrollë Urgjente" | "Operim")
            }
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
            disabled={loading}
          >
            Kthehu
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={loading}
          >
            {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
          </button>
        </div>
      </div>
    </div>
  );
}
