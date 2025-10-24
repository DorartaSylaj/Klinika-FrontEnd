import { useState } from "react";

type UserData = {
  name: string;
  email: string;
  role: string;
  password: string;
};

export default function AddUserForm({
  onAddUser,
}: {
  onAddUser: (user: UserData) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doktor");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    onAddUser({ name, email, role, password });

    setName("");
    setEmail("");
    setRole("Doktor");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Emri dhe Mbiemri"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="Doktor">Doktor</option>
        <option value="Infermiere">Infermiere</option>
      </select>
      <input
        type="password"
        placeholder="Fjalëkalimi"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Shto
        </button>
      </div>
    </form>
  );
}
