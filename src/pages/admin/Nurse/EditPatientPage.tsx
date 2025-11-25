import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { sq } from "date-fns/locale";

registerLocale("sq", sq);

export interface Patient {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    symptoms?: string;
    recovery_days?: number;
    prescription?: string;
}

interface EditPatientPageProps {
    patient: Patient;
    onBack: () => void;
    onLogout: () => void;
    onPatientUpdated: (patient: Patient) => void;
}

const EditPatientPage: React.FC<EditPatientPageProps> = ({
    patient,
    onBack,
    onLogout,
    onPatientUpdated,
}) => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        birth_date: null as Date | null,
        symptoms: "",
        recovery_days: "",
        prescription: "",
    });

    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        setForm({
            first_name: patient.first_name,
            last_name: patient.last_name,
            birth_date: patient.birth_date ? new Date(patient.birth_date) : null,
            symptoms: patient.symptoms || "",
            recovery_days: patient.recovery_days?.toString() || "",
            prescription: patient.prescription || "",
        });
    }, [patient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.first_name || !form.last_name || !form.birth_date) {
            alert("Ju lutem plotësoni të gjitha fushat e domosdoshme.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: form.first_name,
                last_name: form.last_name,
                birth_date: form.birth_date.toISOString().split("T")[0],
                symptoms: form.symptoms,
                recovery_days: form.recovery_days ? Number(form.recovery_days) : null,
                prescription: form.prescription || "",
            };

            const res = await fetch(
                `http://127.0.0.1:8000/api/nurse/patients/${patient.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("Failed to update");

            const resJson = await res.json();

            const updatedPatient: Patient = {
                id: patient.id,
                first_name: resJson.data?.first_name ?? form.first_name,
                last_name: resJson.data?.last_name ?? form.last_name,
                birth_date:
                    resJson.data?.birth_date ?? form.birth_date.toISOString().split("T")[0],
                symptoms: resJson.data?.symptoms ?? form.symptoms,
                recovery_days:
                    resJson.data?.recovery_days ?? (form.recovery_days ? Number(form.recovery_days) : undefined),
                prescription: resJson.data?.prescription ?? form.prescription,
            };

            onPatientUpdated(updatedPatient);

            onBack();
        } catch (error) {
            console.error(error);
            alert("Ndodhi një gabim gjatë përditësimit të pacientit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex flex-col items-center p-6">
            {/* Header */}
            <div className="w-full max-w-xl flex justify-between mb-6">
                <button
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold transition"
                >
                    Kthehu
                </button>

                <button
                    onClick={onLogout}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-semibold transition"
                >
                    Dil
                </button>
            </div>

            {/* Form */}
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-700 text-center">
                    Modifiko Pacientin
                </h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Emri</label>
                        <input
                            type="text"
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mbiemri</label>
                        <input
                            type="text"
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Data e lindjes</label>
                        <DatePicker
                            selected={form.birth_date}
                            onChange={(date) => setForm({ ...form, birth_date: date })}
                            dateFormat="dd/MM/yyyy"
                            locale="sq"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Simptomat</label>
                        <textarea
                            value={form.symptoms}
                            onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ditët e rikuperimit</label>
                        <input
                            type="number"
                            value={form.recovery_days}
                            onChange={(e) => setForm({ ...form, recovery_days: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Receta (Udhëzim)</label>
                        <textarea
                            value={form.prescription}
                            onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 resize-none"
                            rows={3}
                            placeholder="Shto recetën e pacientit"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {loading ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPatientPage;
