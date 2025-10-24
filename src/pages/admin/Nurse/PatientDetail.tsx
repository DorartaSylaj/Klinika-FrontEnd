import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import type { Patient } from "./types";

type Props = {
  patient: Patient;
  onBack: () => void;
  onAddReport: (patient: Patient) => void; // open ReportsPage for this patient
};

export default function PatientDetail({ patient, onBack, onAddReport }: Props) {
  const handleDownloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: `Raporti Pacientit: ${patient.first_name} ${patient.last_name}`, bold: true, size: 28 })],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun(`Datëlindja: ${patient.birth_date}`)] }),
            new Paragraph({ children: [new TextRun(`Data Vizitës: ${patient.visit_date}`)] }),
            patient.recovery_days &&
            new Paragraph({ children: [new TextRun(`Ditët e rikuperimit: ${patient.recovery_days}`)] }),
            new Paragraph({ children: [new TextRun(`Simptoma: ${patient.symptoms || "Pa të dhëna"}`)] }),
            new Paragraph({ children: [new TextRun(`Receta: ${patient.prescription || "Nuk ka receta"}`)] }),
          ].filter(Boolean) as Paragraph[],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${patient.first_name}_${patient.last_name}_Raporti.docx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Pacienti</h1>
          <p className="text-gray-500 text-sm mt-1">Detajet e plotë të vizitës së pacientit</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Kthehu
          </button>
          <button
            onClick={() => onAddReport(patient)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Shto Raport
          </button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-8 py-4 text-gray-500 text-sm">
        <span className="hover:underline cursor-pointer" onClick={onBack}>
          Tabela Pacientëve
        </span>{" "}
        / <span className="font-medium">{patient.first_name} {patient.last_name}</span>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{patient.first_name} {patient.last_name}</h2>
            <p className="text-gray-700">
              <span className="font-medium">Datëlindja:</span> {patient.birth_date}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Data Vizitës:</span> {patient.visit_date}
            </p>
            {patient.recovery_days && (
              <p className="text-green-700 font-medium">Rikuperimi: {patient.recovery_days} ditë</p>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium">Simptoma:</span> {patient.symptoms || "Pa të dhëna"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Receta:</span> {patient.prescription || "Nuk ka receta"}
            </p>
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-8 flex gap-4">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
            onClick={handleDownloadWord}
          >
            Download Raport Word
          </button>
        </div>
      </main>
    </div>
  );
}
