import React from "react";
import type { Patient } from "./types";

type Props = {
  patient: Patient;
  onBack: () => void;
};

export default function PatientDetail({ patient, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Pacienti</h1>
          <p className="text-gray-500 text-sm mt-1">
            Detajet e plotë të vizitës së pacientit
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Kthehu
        </button>
      </header>

      {/* Breadcrumb */}
      <div className="px-8 py-4 text-gray-500 text-sm">
        <span className="hover:underline cursor-pointer" onClick={onBack}>
          Tabela Pacientëve
        </span>{" "}
        / <span className="font-medium">{patient.name}</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolona e Majtë – Info Personale */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-700">
              <span className="font-medium">Datëlindja:</span> {patient.birthDate}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Data Vizitës:</span> {patient.visitDate}
            </p>
            {patient.recoveryDays && (
              <p className="text-green-700 font-medium">
                Rikuperimi: {patient.recoveryDays} ditë
              </p>
            )}
          </div>

          {/* Kolona e Djathtë – Simptoma dhe Receta */}
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium">Simptoma:</span> {patient.symptoms}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Receta:</span> {patient.prescription}
            </p>
          </div>
        </div>

        {/* Butoni për Download Raport */}
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
            onClick={() => console.log("Download Word Raport")}
          >
            Download Raport Word
          </button>
        </div>
      </main>
    </div>
  );
}
