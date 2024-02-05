import { AddUserSchema, RemoveUserSchema } from "@/lib/validation/user";
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

export async function findUsersNotInClinic(
  clinicId: string,
  search: string,
  take: number,
) {
  const response = await api.get<User[]>(baseUrl, {
    params: {
      clinicId,
      search,
      take,
    },
  });
  return response.data;
}

export async function addUserToClinic(data: AddUserSchema) {
  const response = await api.put<User>(baseUrl, data);
  return response.data;
}

export async function editUserRoles(data: AddUserSchema) {
  const response = await api.patch<User>(baseUrl, data);
  return response.data;
}

export async function removeFromClinic(data: RemoveUserSchema) {
  const response = await api.delete<User>(baseUrl, { data });
  return response.data;
}
