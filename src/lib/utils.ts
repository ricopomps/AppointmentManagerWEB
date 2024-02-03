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

export function formatDate(date: Date | string) {
  if (!(date instanceof Date)) {
    date = new Date(date);
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
