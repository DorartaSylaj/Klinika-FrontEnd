import React from "react";
import type { User } from "../../../types/User";

type Props = {
  user: User;
  onBack: () => void;
  onLogout: () => void;
};

export default function PatientsPage({ user, onBack, onLogout }: Props) {
  const patients = [
    { id: 1, name: "Ardit Krasniqi", birthDate: "1990-05-10", visits: 3 },
    { id: 2, name: "Elira Gashi", birthDate: "1985-08-21", visits: 1 },
    { id: 3, name: "Blerim Hoti", birthDate: "1975-11-03", visits: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Lista e Pacientëve</h1>
          <div className="space-x-2">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Kthehu
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            >
              Dil
            </button>
          </div>
        </div>

        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Emri</th>
              <th className="p-3">Datëlindja</th>
              <th className="p-3">Numri i Vizitave</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.birthDate}</td>
                <td className="p-3">{p.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
