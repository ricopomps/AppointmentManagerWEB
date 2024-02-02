import { Roles } from "@/models/roles";
import { User } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasRole(user: User, clinicId: string, roles: Roles[]) {
  try {
    const userRoles = getRoles(user, clinicId);

    if (!userRoles) return false;

    return roles.every((role) => userRoles.includes(role));
  } catch (error) {
    return false;
  }
}

export function getRoles(user: User, clinicId: string) {
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
