import React, { useState } from "react";
import type { Patient } from "./types";
import PatientDetail from "./PatientDetail";
import { mockPatients } from "./mockPatients";
import * as XLSX from "xlsx";

type Props = {
  onBackToDashboard: () => void;
  onAddSuccess?: (msg: string) => void;
};

export default function PatientsPage({ onBackToDashboard, onAddSuccess }: Props) {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");

  const filteredPatients = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.visitDate.includes(term) ||
      p.symptoms.toLowerCase().includes(term)
    );
  });

  // Funksioni për download Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPatients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pacientët");
    XLSX.writeFile(workbook, "pacientet.xlsx");
  };

  if (selectedPatient) {
    return (
      <PatientDetail
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
        onSuccess={(msg) => onAddSuccess && onAddSuccess(msg)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pacientët</h1>
        <div className="space-x-2">
          <button
            onClick={onBackToDashboard}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Kthehu në Dashboard
          </button>
          <button
            onClick={downloadExcel}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
          >
            Download Excel
          </button>
        </div>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Kërko pacient sipas emrit, datës ose simptomave..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 mb-4 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      {/* Tabela me pacientët */}
      <table className="w-full bg-white rounded-lg shadow border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Emri</th>
            <th className="p-3 text-left">Datëlindja</th>
            <th className="p-3 text-left">Data Vizitës</th>
            <th className="p-3 text-left">Simptoma</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr
              key={p.id}
              className="border-t cursor-pointer hover:bg-blue-50 transition"
              onClick={() => setSelectedPatient(p)}
            >
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.birthDate}</td>
              <td className="p-3">{p.visitDate}</td>
              <td className="p-3">{p.symptoms}</td>
            </tr>
          ))}
          {filteredPatients.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Nuk u gjet asnjë pacient
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
