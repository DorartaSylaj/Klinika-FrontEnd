import React, { useState, useEffect } from "react";
import type { Patient } from "./types";

type Props = {
  patients: Patient[];
  onBackToDashboard: () => void;
  onSelectPatient: (patient: Patient) => void; // open ReportsPage for patient
};

export default function PatientsPage({ patients, onBackToDashboard, onSelectPatient }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      (p.symptoms?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={onBackToDashboard}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-6"
      >
        Kthehu
      </button>

      <h1 className="text-2xl font-bold mb-4">Lista e Pacientëve</h1>

      {/* Search input */}
      <input
        type="text"
        placeholder="Kërko sipas emrit, mbiemrit ose simptomave"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring focus:border-blue-300"
      />

      {filteredPatients.length === 0 ? (
        <p className="text-gray-500">Nuk ka pacientë të regjistruar.</p>
      ) : (
        <ul className="space-y-4">
          {filteredPatients.map((p) => (
            <li
              key={p.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                {/* Clickable name opens ReportsPage */}
                <span
                  onClick={() => onSelectPatient(p)}
                  className="font-semibold cursor-pointer text-blue-600 hover:underline"
                >
                  {p.first_name} {p.last_name}
                </span>{" "}
                – {p.birth_date}
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-gray-500">
                  {p.recovery_days ? `${p.recovery_days} ditë rikuperim` : "Pa të dhëna"}
                </span>

                {/* PDF button */}
                <button
                  onClick={() => {
                    import("jspdf").then(({ jsPDF }) => {
                      const doc = new jsPDF();
                      const content = `
Raporti për pacientin: ${p.first_name} ${p.last_name}
Datëlindja: ${p.birth_date}
Simptoma: ${p.symptoms || "Pa të dhëna"}
Ditë rikuperim: ${p.recovery_days ?? "Pa të dhëna"}
`;
                      doc.text(content, 10, 10);
                      doc.save(`Raporti_${p.first_name}_${p.last_name}.pdf`);
                    });
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
                >
                  Shkarko PDF
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
