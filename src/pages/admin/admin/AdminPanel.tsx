import StaffManagement from "./StaffManagement";

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">Paneli i Administratorit</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Dil
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* StaffManagement handles fetching and adding staff */}
        <StaffManagement />
      </main>
    </div>
  );
}