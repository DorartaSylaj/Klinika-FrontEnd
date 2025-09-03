import React, { useState } from "react";
import type { Patient } from "../../types";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      firstName: "Arben",
      lastName: "Krasniqi",
      symptoms: "Dhimbje dhëmbi",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      firstName: "Elira",
      lastName: "Berisha",
      symptoms: "Kontroll rutinë",
      createdAt: new Date().toISOString(),
    },
  ]);

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pacientët</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Kërko pacientin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 rounded-xl border border-blue-300 mb-6 focus:ring-2 focus:ring-blue-400"
      />

      {/* Table */}
      <table className="w-full bg-white shadow-md rounded-xl overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left">Emri</th>
            <th className="px-4 py-2 text-left">Mbiemri</th>
            <th className="px-4 py-2 text-left">Simptomat</th>
            <th className="px-4 py-2 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.firstName}</td>
              <td className="px-4 py-2">{p.lastName}</td>
              <td className="px-4 py-2">{p.symptoms}</td>
              <td className="px-4 py-2">
                {new Date(p.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
