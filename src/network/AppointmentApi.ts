import { SelectedDay } from "../context/SelectedDayContext";
import { API } from "./api";

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface AppointmentCreationForm {
  appointmentForm: AppointmentForm & SelectedDay;
}

export async function appoint(appointment: AppointmentCreationForm) {
  console.log(appointment);
  const response = await API.post(
    "/api/appointments",
    appointment.appointmentForm
  );
  return response.data;
}
