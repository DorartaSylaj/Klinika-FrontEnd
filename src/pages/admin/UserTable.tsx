import React from "react";
import type { User } from "../../types/User";

export default function UserTable({ users }: { users: User[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        👥 Lista e Përdoruesve
      </h2>
      {users.length === 0 ? (
        <p className="text-gray-500">Nuk ka përdorues të regjistruar.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2 border-b">Emri</th>
              <th className="px-4 py-2 border-b">Mbiemri</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Roli</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{u.name}</td>
                <td className="px-4 py-2 border-b">{u.surname}</td>
                <td className="px-4 py-2 border-b">{u.email}</td>
                <td className="px-4 py-2 border-b capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
