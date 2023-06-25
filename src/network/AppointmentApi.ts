import { SelectedDay } from "../context/SelectedDayContext";
import { API } from "./api";

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  date: Date;
  time: string;
}

interface AppointmentCreationForm {
  appointmentForm: AppointmentForm & SelectedDay;
}

export async function appoint(appointment: AppointmentCreationForm) {
  const response = await API.post("/api/appointments", appointment);
  return response.data;
}
