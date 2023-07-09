import { Clinic } from "../context/SelectedDayContext";
import { API } from "./api";

export async function getClinics(): Promise<Clinic[]> {
  const response = await API.get("/api/clinics");
  return response.data;
}
