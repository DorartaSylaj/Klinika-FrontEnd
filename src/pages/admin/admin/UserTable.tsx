import React from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function UserTable({
  users,
  onRemoveUser,
}: {
  users: User[];
  onRemoveUser: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
            <th className="px-4 py-2 border-b">Emri</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Roli</th>
            <th className="px-4 py-2 border-b">Opsione</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50 text-sm">
              <td className="px-4 py-2 border-b">{u.name}</td>
              <td className="px-4 py-2 border-b">{u.email}</td>
              <td className="px-4 py-2 border-b">{u.role}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => onRemoveUser(u.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Fshij
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                Nuk ka staf të regjistruar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
