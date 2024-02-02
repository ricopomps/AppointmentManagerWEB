import api from "@/network/axiosInstance";
import { User } from "@clerk/nextjs/server";

const baseUrl = "user";

export async function findUsers(clinicId: string) {
  const response = await api.get<User[]>(`${baseUrl}/${clinicId}`);
  return response.data;
}
