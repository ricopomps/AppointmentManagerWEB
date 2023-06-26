import {
  format,
  parse,
  isBefore,
  addDays,
  eachDayOfInterval,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Week {
  day: string;
  schedules?: string[];
}

export enum Subtitle {
  Vacant = "success",
  Occupied = "danger",
  Selected = "warning",
}

export const getTooltip = (check: string) => {
  switch (check) {
    case Subtitle.Vacant:
      return "Livre";
    case Subtitle.Occupied:
      return "Sem vagas";
    case Subtitle.Selected:
      return "Selecionado";
    default:
      return "Agendamento";
  }
};

export function getWeekDayNames(): string[] {
  const startDate = startOfWeek(new Date());
  const endDate = addDays(startDate, 6);

  const weekDaysDates = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDayNames = weekDaysDates.map((date) => {
    const day = format(date, "EEEE", { locale: ptBR }).replace("-feira", "");
    return day.charAt(0).toUpperCase() + day.slice(1);
  });
  return weekDayNames;
}

export function getWeekDays(): Date[] {
  const startDate = startOfWeek(new Date());
  const endDate = addDays(startDate, 6);

  const weekDaysDates = eachDayOfInterval({ start: startDate, end: endDate });

  return weekDaysDates;
}

export const dateFormat = "dd/MM/yyyy";

export const dayFormat = "dd/MM";

export const hourFormat = "HH:mm";

export function getWeekAndAppointments(): Week[] {
  const days = getWeekDays();
  return days.map((day) => {
    return { day: format(day, dateFormat) };
  });
}

export const check = (interval: string, week: Week) => {
  const intervalo = interval.split(" ")[0];
  const date = parse(week.day, dateFormat, new Date());
  const dateHour = parse(intervalo, hourFormat, date);
  const formatedHourNow = format(new Date(), `${dateFormat} ${hourFormat}`);
  const hourNow = parse(
    formatedHourNow,
    `${dateFormat} ${hourFormat}`,
    new Date()
  );

  const timeAlredyPassed = isBefore(dateHour, hourNow);
  if (timeAlredyPassed) return Subtitle.Occupied;

  if (week.schedules && week.schedules.filter((s) => s === interval).length > 0)
    return Subtitle.Occupied;
  return Subtitle.Vacant;
};
