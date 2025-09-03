import React from "react";
import { Button } from "../../components/ui/Button";

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold p-6 border-b border-blue-500">
            Admin Panel
          </h2>
          <ul className="p-4 space-y-3">
            <li>👨‍⚕️ Menaxho Doktorët</li>
            <li>👩‍⚕️ Menaxho Infermierët</li>
            <li>🔑 Ndrysho Fjalëkalimet</li>
          </ul>
        </div>

        {/* Butoni Dil poshtë */}
        <div className="p-4 border-t border-blue-500">
          <Button onClick={onLogout} variant="red" className="w-full">
            Dil
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10 bg-blue-50">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">
          Mirësevjen në panelin e adminit 👋
        </h1>
        <p className="text-gray-700">
          Këtu do të mund të shtosh dhe menaxhosh përdoruesit e sistemit.
        </p>
      </div>
    </div>
  );
}
