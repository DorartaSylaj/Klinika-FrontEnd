import type { Patient } from "../types/Patient";

export const mockPatients: Patient[] = [
  {
    id: "p1",
    firstName: "Arben",
    lastName: "Hoxha",
    dob: "1987-03-10",
    reason: "Kontroll rutinë",
    symptoms: "Plagë e vogël në mishrat e dhëmbëve",
    stayDays: 0,
    recoveryDays: 3,
    urgent: false,
    nextAppointment: "2025-09-10",
    visitDate: "2025-09-02",
  },
  {
    id: "p2",
    firstName: "Elira",
    lastName: "Dervishi",
    dob: "1992-11-25",
    reason: "Dhimbje e fortë",
    symptoms: "Dhimbje e menjëhershme në dhëmballë",
    stayDays: 1,
    recoveryDays: 7,
    urgent: true,
    nextAppointment: "2025-09-05",
    visitDate: "2025-09-02",
  },
];
