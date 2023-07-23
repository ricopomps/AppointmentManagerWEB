import { Clinic } from "../context/SelectedDayContext";
import { API } from "./api";

export async function getClinics(): Promise<Clinic[]> {
  const response = await API.get("/api/clinics");
  return response.data;
}

export async function createClinic(clinic: Clinic): Promise<Clinic> {
  const response = await API.post("/api/clinics", clinic);
  return response.data;
}

export async function updateClinic(
  clinicId: string,
  clinic: Clinic
): Promise<Clinic> {
  const response = await API.patch(`/api/clinics/${clinicId}`, clinic);
  return response.data;
}
