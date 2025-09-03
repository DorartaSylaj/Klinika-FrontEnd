export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  reason: string;
  symptoms: string;
  stayDays: number;
  recoveryDays: number;
  urgent: boolean;
  nextAppointment: string;
  visitDate: string;
};
