import React, { useState } from "react";
import type { User } from "../../../types/User";

type StaffMember = User & { password: string };

export default function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<User["role"] | "">("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name || !role || !password) return;

    if (editingId) {
      // Përditëso user ekzistues
      setStaff(
        staff.map((member) =>
          member.id === editingId
            ? { ...member, name, role, password }
            : member
        )
      );
      setEditingId(null);
    } else {
      // Shto user të ri
      setStaff([...staff, { id: Date.now().toString(), name, role, password }]);
    }

    setName("");
    setRole("");
    setPassword("");
  };

  const removeStaff = (id: string) => {
    setStaff(staff.filter((member) => member.id !== id));
  };

  const editStaff = (member: StaffMember) => {
    setEditingId(member.id);
    setName(member.name);
    setRole(member.role);
    setPassword(member.password); // vendos password-in aktual për ndryshim
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 space-y-8">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {editingId ? "Modifiko anëtarin e stafit" : "Shto anëtar të stafit"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Emri"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as User["role"])}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Zgjidh rolin</option>
            <option value="doctor">Doktor</option>
            <option value="nurse">Infermiere</option>
            <option value="admin">Administrator</option>
          </select>

          <input
            type="password"
            placeholder="Fjalëkalimi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? "Ruaj Ndryshimet" : "Shto"}
          </button>

          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setRole("");
                setPassword("");
              }}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Anulo
            </button>
          )}
        </div>
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Lista e stafit
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-2 text-left">Emri</th>
                <th className="border px-4 py-2 text-left">Roli</th>
                <th className="border px-4 py-2 text-left">Fjalëkalimi</th>
                <th className="border px-4 py-2 text-center">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center text-gray-500 py-6"
                  >
                    Nuk ka staf të regjistruar.
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{member.name}</td>
                    <td className="border px-4 py-2 capitalize">{member.role}</td>
                    <td className="border px-4 py-2">{member.password}</td>
                    <td className="border px-4 py-2 text-center space-x-3">
                      <button
                        onClick={() => editStaff(member)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                      >
                        Modifiko
                      </button>
                      <button
                        onClick={() => removeStaff(member.id)}
                        className="px-4 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
