import { useEffect, useState } from "react";

interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // For adding/updating
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("nurse");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!newName.trim() || (!newPassword.trim() && !editingId)) {
      setError("Name and password are required.");
      return;
    }

    setError("");
    const token = localStorage.getItem("token");

    const email = `${newName.replace(/\s+/g, "").toLowerCase()}@mail.com`;

    try {
      const res = await fetch(
        editingId
          ? `http://127.0.0.1:8000/api/admin/staff/${editingId}`
          : "http://127.0.0.1:8000/api/admin/staff",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName,
            email,
            password: newPassword || undefined,
            role: newRole,
          }),
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      setNewName("");
      setNewPassword("");
      setNewRole("nurse");
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      console.error(err);
      setError("Failed to save staff.");
    }
  };

  const handleEdit = (s: Staff) => {
    setNewName(s.name);
    setNewRole(s.role);
    setEditingId(s.id);
  };

  const deleteStaff = async (id: number) => {
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/staff/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
      setError("Failed to delete staff.");
    }
  };

  return (
    <div className="p-6 font-sans text-gray-800 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Menaxhimi Stafit</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Add / Edit Staff Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex-1 max-w-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Staff" : "Shto Staf"}
          </h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col gap-3">
            <input
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
              placeholder="Emri Mbiemri"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
              type="password"
              placeholder={editingId ? "Leave blank to keep current password" : "Fjalëkalimi"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <select
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="nurse">Infermiere</option>
              <option value="doctor">Doktor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddOrUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
            >
              {editingId ? "Modifiko" : "Shto"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setNewName("");
                  setNewPassword("");
                  setNewRole("nurse");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg font-semibold transition mt-2"
              >
                Anulo Modifikimin
              </button>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Email gjenerohet në mënyrë automatike <span className="font-medium">emri@mail.com</span>
          </p>
        </div>

        {/* Staff Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex-1 overflow-x-auto">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Stafi Egzistues</h2>
          {loading ? (
            <p>Duke u ngarkuar...</p>
          ) : staff.length === 0 ? (
            <p className="text-gray-400">No staff available</p>
          ) : (
            <table className="min-w-full text-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left border-b">Emri Mbiemri</th>
                  <th className="p-3 text-left border-b">Email</th>
                  <th className="p-3 text-left border-b">Roli</th>
                  <th className="p-3 text-left border-b">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-200">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3 capitalize">{s.role}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Modifiko
                      </button>
                      <button
                        onClick={() => deleteStaff(s.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
