import { useState } from "react";

interface AddPatientPageProps {
  onBack: () => void;
  onLogout: () => void;
  onAddPatient: (patient: {
    name: string;
    surname: string;
    birthDate: string;
    symptoms: string;
    recoveryDays?: number;
  }) => void;
}

export default function AddPatientPage({
  onBack,
  onLogout,
  onAddPatient,
}: AddPatientPageProps) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    birthDate: "",
    symptoms: "",
    recoveryDays: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient({
      name: form.name,
      surname: form.surname,
      birthDate: form.birthDate,
      symptoms: form.symptoms,
      recoveryDays: form.recoveryDays ? Number(form.recoveryDays) : undefined,
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Kthehu
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Dil
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Shto Pacient të Ri</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Emri</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mbiemri</label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Data e lindjes</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Simptomat</label>
            <textarea
              name="symptoms"
              value={form.symptoms}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Ditët e rikuperimit (opsionale)
            </label>
            <input
              type="number"
              name="recoveryDays"
              value={form.recoveryDays}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Shto Pacientin
          </button>
        </form>
      </div>
    </div>
  );
}
