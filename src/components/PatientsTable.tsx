import { useState } from "react";
import type { Patient } from "../types/Patient";
import { Button } from "./ui/Button";


export default function PatientsTable({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = useState("");

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Kërko pacientin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Emri</th>
            <th className="p-2 text-left">Mbiemri</th>
            <th className="p-2 text-left">Arsyeja</th>
            <th className="p-2 text-left">Urgjent</th>
            <th className="p-2 text-left">Veprime</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.firstName}</td>
              <td className="p-2">{p.lastName}</td>
              <td className="p-2">{p.reason}</td>
              <td className="p-2">
                {p.urgent ? (
                  <span className="text-red-600 font-bold">URGJENT</span>
                ) : (
                  "—"
                )}
              </td>
              <td className="p-2 space-x-2">
                <Button variant="green">Shto</Button>
                <Button variant="orange">Edito</Button>
                <Button variant="red">Fshi</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
