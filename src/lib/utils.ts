import { Role } from "@/models/roles";
import { User } from "@clerk/nextjs/server"; // User from back
import { UserResource } from "@clerk/types"; // User from front
import { clsx, type ClassValue } from "clsx";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filter users based on their roles in a specific clinic.
 * @param user - User object to check roles for.
 * @param clinicId - ID of the clinic to check roles against.
 * @param roles - Array of roles to check for.
 * @returns True if the user has any of the specified roles in the clinic, otherwise false.
 */
export function hasRole(
  user: User | UserResource,
  clinicId: string,
  roles: Role[],
) {
  try {
    const userRoles = getRoles(user, clinicId);

    if (!userRoles) return false;

    return roles.some((role) => userRoles.includes(role));
  } catch (error) {
    console.error(error);
    return false;
  }
}

export function getRoles(user: User | UserResource, clinicId: string) {
  try {
    return (
      user.publicMetadata.clinics?.find(
        (clinic) => clinic.clinicId === clinicId,
      )?.roles ?? []
    );
  } catch (error) {
    return [];
  }
}

export function handleStringToDate(dateString: string) {
  let originalDate;
  originalDate = new Date(dateString);
  const timeZoneOffset = originalDate.getTimezoneOffset();
  const adjustedDate = new Date(
    originalDate.getTime() + timeZoneOffset * 60000,
  );
  return adjustedDate;
}

export function formatDate(date: Date | string) {
  if (!(date instanceof Date)) {
    date = handleStringToDate(date);
  }

  return format(date, "dd/MM/yyyy", { locale: ptBR });
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function getMonthAndYear(date: Date | string) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  const formattedMonth = format(date, "MMM yyyy", {
    locale: ptBR,
  });

  return formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);
}

export function parseMonthAndYear(formattedString: string) {
  const parsedDate = parse(formattedString, "MMMM yyyy", new Date(), {
    locale: ptBR,
  });

  return parsedDate;
}

/**
 * Formats a date or date string as "YYYY-MM-DD" for use in an input field.
 * @param date - A Date object or date string to be formatted.
 * @returns A string representing the formatted date in "YYYY-MM-DD" format.
 */
export const formatDateForInput = (date: Date | string) => {
  if (!(date instanceof Date)) {
    date = handleStringToDate(date);
  }

  return format(date, "yyyy-MM-dd");
};
