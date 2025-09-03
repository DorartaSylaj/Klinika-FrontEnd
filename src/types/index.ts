export type Role = "admin" | "doctor" | "nurse";

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  symptoms: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: Role;
  email: string;
}
