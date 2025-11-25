import React, { useState } from "react";
import type { Patient } from "./types";

type Props = {
  patients: Patient[];
  onBackToDashboard: () => void;
  onSelectPatient: (patient: Patient) => void;
  onDeletePatient: (patientId: number) => void; // handle confirmation in parent
  onModifyPatient: (patient: Patient) => void;
};

export default function PatientsPage({
  patients,
  onBackToDashboard,
  onSelectPatient,
  onDeletePatient,
  onModifyPatient,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and deduplicate patients
  const filteredPatients = patients
    .filter((p, index, self) => self.findIndex((x) => x.id === p.id) === index)
    .filter((p) => {
      const query = searchQuery.toLowerCase();
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const symptoms = p.symptoms?.toLowerCase() ?? "";
      const birthDate = p.birth_date?.toLowerCase() ?? "";

      return (
        fullName.includes(query) ||
        symptoms.includes(query) ||
        birthDate.includes(query)
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

      <input
        type="text"
        placeholder="Kërko sipas emrit, mbiemrit, datëlindjes ose simptomave"
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
                <span
                  onClick={() => onSelectPatient(p)}
                  className="font-semibold cursor-pointer text-blue-600 hover:underline"
                >
                  {p.first_name} {p.last_name}
                </span>{" "}
                – {p.symptoms || "Pa të dhëna"}
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-gray-500">
                  {p.recovery_days
                    ? `${p.recovery_days} ditë rikuperim`
                    : "Nuk ka nevojë"}
                </span>

                <button
                  onClick={() => onModifyPatient(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 transition"
                >
                  Ndrysho
                </button>

                {/* DELETE BUTTON: call parent, confirmation handled there */}
                <button
                  onClick={() => onDeletePatient(p.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
                >
                  Fshij
                </button>

                <button
                  onClick={() => {
                    import("jspdf").then(({ jsPDF }) => {
                      const doc = new jsPDF();
                      const lines = [
                        `Raporti për pacientin: ${p.first_name} ${p.last_name}`,
                        `Datëlindja: ${p.birth_date || "Pa të dhëna"}`,
                        `Simptoma: ${p.symptoms || "Pa të dhëna"}`,
                        `Ditë rikuperim: ${p.recovery_days ?? "Pa të dhëna"}`,
                        `Receta: ${p.prescription || "Pa të dhëna"}`,
                      ];

                      let y = 10;
                      lines.forEach((line) => {
                        const split = doc.splitTextToSize(line, 180);
                        doc.text(split, 10, y);
                        y += split.length * 10;
                      });

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
