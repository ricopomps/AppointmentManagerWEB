import { Clinic, Dentist } from "../context/SelectedDayContext";

export interface Appointment {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  index: number;
  interval: string;
  day: Date | string;
  clinicId: string;
  dentistId: string;
  dentist?: Dentist;
  clinic?: Clinic;
}
