import { Role } from "@/models/roles";
import api from "@/network/axiosInstance";
import { User } from "@clerk/nextjs/server";

const baseUrl = "user";

export async function findUsers(clinicId: string) {
  const response = await api.get<User[]>(`${baseUrl}/${clinicId}`);
  return response.data;
}

export async function findUsersWithRole(clinicId: string, role: Role) {
  const response = await api.get<User[]>(`${baseUrl}/${clinicId}`, {
    params: { role },
  });
  return response.data;
}
