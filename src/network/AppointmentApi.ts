import { endOfDay, startOfDay } from "date-fns";
import { SelectedDay } from "../context/SelectedDayContext";
import { API } from "./api";

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface GetAppointmentsBetweenDates {
  startDate: Date;
  endDate: Date;
}

export async function getAppointmentsBetweenDates(
  dates: GetAppointmentsBetweenDates
) {
  console.log(dates);
  const response = await API.get("/api/appointments", {
    params: {
      startDate: startOfDay(dates.startDate),
      endDate: endOfDay(dates.endDate),
    },
  });
  return response.data;
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
