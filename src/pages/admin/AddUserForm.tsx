import React, { useState } from "react";
import type { User, Role } from "../../types/User";

export default function AddUserForm({ onAddUser }: { onAddUser: (u: User) => void }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !surname || !email || !password) return;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      surname,
      email,
      role,
      password,
    };

    onAddUser(newUser);

    // reset fields
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setRole("doctor");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ➕ Shto Përdorues
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Emri</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mbiemri</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fjalëkalimi</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Roli</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="doctor">Doktor</option>
            <option value="nurse">Infermiere</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Shto
        </button>
      </form>
    </div>
  );
}
