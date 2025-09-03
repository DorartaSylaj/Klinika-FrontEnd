import React from "react";

interface SidebarProps {
  active: string;
  onSelect: (page: string) => void;
}

export default function AdminSidebar({ active, onSelect }: SidebarProps) {
  const menu = [
    { key: "patients", label: "Pacientët" },
    { key: "staff", label: "Stafi" },
    { key: "schedule", label: "Orari" },
    { key: "reports", label: "Raportet" },
  ];

  return (
    <div className="h-full w-64 bg-blue-700 text-white flex flex-col p-4 rounded-r-3xl shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Admin Panel</h2>
      <ul className="space-y-3">
        {menu.map((item) => (
          <li key={item.key}>
            <button
              onClick={() => onSelect(item.key)}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                active === item.key
                  ? "bg-blue-500 font-semibold"
                  : "hover:bg-blue-600"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
