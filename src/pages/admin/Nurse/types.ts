export type Patient = {
  id: number;
  name: string;
  birthDate: string;
  visitDate: string;
  symptoms: string;
  prescription: string;
  recoveryDays?: number;
};
