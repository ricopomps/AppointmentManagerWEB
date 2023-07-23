import { endOfDay, startOfDay } from "date-fns";
import { SelectedDay } from "../context/SelectedDayContext";
import { API } from "./api";
import { Appointment } from "../models/appointment";

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
): Promise<Appointment[]> {
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
  clinicId: string;
  dentistId: string;
}
export async function appoint(
  appointment: AppointmentCreationForm
): Promise<Appointment> {
  const response = await API.post("/api/appointments", {
    ...appointment.appointmentForm,
    clinicId: appointment.clinicId,
    dentistId: appointment.dentistId,
  });
  return response.data;
}

export interface findAppointmentsForm {
  startDate?: Date;
  endDate?: Date;
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  clinicId?: string;
  dentistId?: string;
  skip?: number;
  take?: number;
}

interface paginatedAppointments {
  appointments: Appointment[];
  count: number;
}

export async function findAppointments(
  form: findAppointmentsForm
): Promise<paginatedAppointments> {
  const params: findAppointmentsForm = form;

  if (form.startDate) params.startDate = startOfDay(form.startDate);
  if (form.endDate) params.endDate = endOfDay(form.endDate);
  if (!form.skip) params.skip = 0;
  if (!form.take) params.take = 10;

  const response = await API.get("/api/appointments/find", {
    params,
  });
  return {
    appointments: response.data.appointments,
    count: response.data.count,
  };
}
