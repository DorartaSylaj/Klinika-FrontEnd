import React, { useState, useEffect } from "react";
import type { Appointment } from "./DoctorDashboard";
import type { Patient } from "../Nurse/types";
import jsPDF from "jspdf";

type ReportsPageProps = {
  patient?: Patient;
  appointment?: Appointment;
  onSave: () => void;
  onBack: () => void;
};

export default function ReportsPage({ patient, appointment, onSave, onBack }: ReportsPageProps) {
  const [reportText, setReportText] = useState(
    "Ju lutem pershkruani me kujdes per pacientin..." // <- placeholder text
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Update placeholder text if appointment has a patient
  useEffect(() => {
    if (appointment) {
      setReportText(
        `Ju lutem pershkruani me kujdes per pacientin ${appointment.patient_name}...`
      );
    } else if (patient) {
      setReportText(`Ju lutem pershkruani me kujdes per pacientin ${patient.first_name}...`);
    }
  }, [appointment, patient]);

  const handleSave = async () => {
    if (!appointment?.patient_id && !patient?.id) {
      setError("Pacienti nuk është i lidhur me termin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: appointment?.patient_id || patient?.id,
          appointment_id: appointment?.id || null,
          content: reportText,
        }),
      });

      if (!res.ok) throw new Error("Gabim gjatë ruajtjes së raportit");
      onSave();
    } catch (err) {
      console.error(err);
      setError("Gabim gjatë ruajtjes së raportit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const patientName = appointment?.patient_name || patient?.first_name || "Pa emër";
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Raporti për ${patientName}`, 10, 20);
    doc.setFontSize(12);
    doc.text(reportText, 10, 40);
    doc.save(`Raport_${patientName}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Raport për {appointment?.patient_name || patient?.first_name}
        </h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Mbrapa
        </button>
      </header>

      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="Ju lutem pershkruani me kujdes per pacientin..."
        className="w-full h-64 p-4 border border-gray-300 rounded shadow focus:outline-none focus:ring focus:border-blue-300 resize-none text-gray-700"
      />

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Duke ruajtur..." : "Ruaj Raportin"}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          Shkarko PDF
        </button>
      </div>
    </div>
  );
}
