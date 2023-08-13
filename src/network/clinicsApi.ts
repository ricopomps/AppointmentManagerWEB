import { Clinic } from "../context/SelectedDayContext";
import { getApi } from "./api";

export async function getClinics(): Promise<Clinic[]> {
  const response = await getApi().get("/api/clinics");
  return response.data;
}

export async function createClinic(clinic: Clinic): Promise<Clinic> {
  const response = await getApi().post("/api/clinics", clinic);
  return response.data;
}

export async function updateClinic(
  clinicId: string,
  clinic: Clinic
): Promise<Clinic> {
  const response = await getApi().patch(`/api/clinics/${clinicId}`, clinic);
  return response.data;
}

export async function addUserToClinic(
  clinicId: string,
  userId: string
): Promise<Clinic> {
  const response = await getApi().patch(`/api/clinics/adduser`, {
    clinicId,
    userId,
  });
  return response.data;
}

export async function removeUserFromClinic(
  clinicId: string,
  userId: string
): Promise<Clinic> {
  const response = await getApi().patch(`/api/clinics/removeUser`, {
    clinicId,
    userId,
  });
  return response.data;
}
