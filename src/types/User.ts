export type Role = "admin" | "doctor" | "nurse";

export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: Role;
  password?: string;
};
