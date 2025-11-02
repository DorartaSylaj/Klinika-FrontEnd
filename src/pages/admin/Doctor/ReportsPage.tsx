import React, { useState, useEffect } from "react";
import type { Patient } from "../../Nurse/types";
import type { Appointment } from "../../Doctor/DashboardPage";
import jsPDF from "jspdf";

type ReportsPageProps = {
  patient?: Patient; // optional preselected patient
  appointment?: Appointment; // optional appointment
  onSave: () => void;
  onBack: () => void;
};

export default function ReportsPage({
  patient,
  appointment,
  onSave,
  onBack,
}: ReportsPageProps) {
  const [patientsList, setPatientsList] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    patient ||
    (appointment
      ? {
        id: appointment.patient_id || 0,
        first_name: appointment.patient_name || "",
        last_name: "",
        birth_date: "",
        symptoms: "",
        recovery_days: 0,
      }
      : null)
  );
  const [reportText, setReportText] = useState(
    selectedPatient
      ? `${selectedPatient.first_name} ${selectedPatient.last_name} ka një raport mjekësor...`
      : ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all patients from backend
  useEffect(() => {
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setPatientsList(list);
      })
      .catch(() => setError("Gabim gjatë marrjes së pacientëve"));
  }, [token]);

  // Filter patients by search input for autocomplete
  const filteredPatients = patientsList.filter(
    (p) =>
      p.first_name.toLowerCase().startsWith(searchPatient.toLowerCase()) ||
      p.last_name.toLowerCase().startsWith(searchPatient.toLowerCase())
  );

  useEffect(() => {
    if (selectedPatient) {
      setReportText(
        (prev) =>
          prev.includes(selectedPatient.first_name)
            ? prev
            : `${selectedPatient.first_name} ${selectedPatient.last_name} ka një raport mjekësor...`
      );
    }
  }, [selectedPatient]);

  const handleSave = async () => {
    // FIX: derive patient_id correctly
    const patientId = selectedPatient?.id || appointment?.patient_id;
    if (!patientId) {
      setError("Zgjidhni një pacient përpara se të ruani raportin.");
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
          patient_id: patientId,
          appointment_id: appointment?.id || null, // optional, link to appointment
          report: reportText,
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      console.log("Report saved:", data);
      onSave();
    } catch (err) {
      console.error("Failed to save report:", err);
      setError("Gabim gjatë ruajtjes së raportit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedPatient) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(
      `Raporti për ${selectedPatient.first_name} ${selectedPatient.last_name}`,
      10,
      20
    );
    doc.setFontSize(12);
    doc.text(reportText, 10, 40);
    doc.save(
      `Raport_${selectedPatient.first_name}_${selectedPatient.last_name}.pdf`
    );
  };

  if (!selectedPatient && patientsList.length === 0)
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Asnjë pacient ose termin i zgjedhur</h2>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Kthehu mbrapa
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Krijo Raport për {selectedPatient?.first_name} {selectedPatient?.last_name}
        </h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Mbrapa
        </button>
      </header>

      {/* Patient selection input */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Zgjidh pacientin:</label>
        <input
          type="text"
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
          placeholder="Shkruaj emrin e pacientit"
          className="w-full p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring focus:border-blue-300"
        />
        {searchPatient && (
          <ul className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white">
            {filteredPatients.map((p) => (
              <li
                key={p.id}
                onClick={() => {
                  setSelectedPatient(p);
                  setSearchPatient("");
                }}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer"
              >
                {p.first_name} {p.last_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        className="w-full h-64 p-4 border border-gray-300 rounded shadow focus:outline-none focus:ring focus:border-blue-300 resize-none"
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
