import React, { useState } from "react";
import jsPDF from "jspdf";

type ReportPageProps = {
  onBack: () => void;
};

export default function ReportPage({ onBack }: ReportPageProps) {
  const [patientName, setPatientName] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [therapy, setTherapy] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Raporti Mjekësor", 20, 20);
    doc.setFontSize(12);
    doc.text(`Emri i pacientit: ${patientName}`, 20, 40);
    doc.text(`Diagnoza: ${diagnosis}`, 20, 50);
    doc.text(`Terapia: ${therapy}`, 20, 60);
    doc.save(`${patientName}_Raporti.pdf`);

    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">Krijo Raport</h1>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-medium">Emri i pacientit</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Diagnoza</label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Terapia</label>
          <textarea
            value={therapy}
            onChange={(e) => setTherapy(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          onClick={handleGeneratePDF}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Gjenero PDF
        </button>
        <button
          onClick={onBack}
          className="w-full py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          Kthehu
        </button>
      </div>

      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">
          Raporti u gjenerua me sukses!
        </div>
      )}
    </div>
  );
}
