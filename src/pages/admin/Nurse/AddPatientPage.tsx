import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sq } from "date-fns/locale";
registerLocale("sq", sq);

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  symptoms?: string;
  recovery_days?: number;
  created_at?: string;
  updated_at?: string;
}

interface AddPatientPageProps {
  onBack: () => void;
  onLogout: () => void;
  onPatientAdded?: (patient: Patient) => void;
}

const AddPatientPage: React.FC<AddPatientPageProps> = ({ onBack, onLogout, onPatientAdded }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    birth_date: null as Date | null,
    symptoms: "",
    recovery_days: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.first_name || !form.last_name || !form.birth_date) {
      alert("Ju lutem plotësoni emrin, mbiemrin dhe datën e lindjes.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        birth_date: form.birth_date.toISOString().split("T")[0],
        symptoms: form.symptoms || "",
        recovery_days: form.recovery_days ? Number(form.recovery_days) : undefined,
      };

      const response = await fetch("http://127.0.0.1:8000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save patient");

      const savedPatient: Patient = await response.json();

      if (onPatientAdded) onPatientAdded(savedPatient);

      alert("Pacienti u shtua me sukses!");
      setForm({ first_name: "", last_name: "", birth_date: null, symptoms: "", recovery_days: "" });
      onBack();
    } catch (err) {
      console.error(err);
      alert("Diçka shkoi gabim gjatë ruajtjes së pacientit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center p-6">
      <div className="w-full max-w-2xl flex justify-between mb-6">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
        >
          Kthehu
        </button>
        <button
          onClick={onLogout}
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold transition"
        >
          Dil
        </button>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700 text-center">Shto Pacient të Ri</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Emri</label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              placeholder="Shkruani emrin"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mbiemri</label>
            <input
              type="text"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              placeholder="Shkruani mbiemrin"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data e lindjes</label>
            <DatePicker
              selected={form.birth_date}
              onChange={(date) => setForm({ ...form, birth_date: date })}
              dateFormat="dd/MM/yyyy"
              locale="sq"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Zgjidh datën e lindjes"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Simptomat (opsionale)</label>
            <textarea
              value={form.symptoms}
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows={3}
              placeholder="Përshkruani simptomat"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ditët e rikuperimit (opsionale)</label>
            <input
              type="number"
              value={form.recovery_days}
              onChange={(e) => setForm({ ...form, recovery_days: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="P.sh. 5"
              min="0"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-700 transition ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Duke ruajtur..." : "Shto Pacientin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientPage;
