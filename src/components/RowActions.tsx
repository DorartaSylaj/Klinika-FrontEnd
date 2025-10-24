

import type { Patient } from "../types/Patient";
import { Button } from "./ui/Button";
import { Edit, Trash2 } from "lucide-react";

export default function RowActions({ role, patient }: { role: string; patient: Patient }) {
  return (
    <div className="flex gap-2 justify-end">
      {role !== "doctor" && (
        <Button variant="orange" size="sm" onClick={() => alert("Edit " + patient.firstName)}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {role === "admin" && (
        <Button variant="red" size="sm" onClick={() => alert("Delete " + patient.firstName)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
