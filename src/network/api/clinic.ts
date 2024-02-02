import { CreateClinicSchema } from "@/lib/validation/clinic";
import api from "@/network/axiosInstance";
import { Clinic } from "@prisma/client";

const baseUrl = "clinic";

export async function createClinic(data: CreateClinicSchema) {
  const response = await api.post<Clinic>(baseUrl, data);
  return response.data;
}

export async function getClinic(clinicId: string) {
  const response = await api.get<Clinic>(`${baseUrl}/${clinicId}`);
  return response.data;
}

export async function getUserClinics() {
  const response = await api.get<Clinic[]>(baseUrl);
  return response.data;
}
