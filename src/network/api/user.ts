import { Role } from "@/models/roles";
import api from "@/network/axiosInstance";
import { User } from "@clerk/nextjs/server";

const baseUrl = "user";

export enum Pagamento {
  CASH = "Dinheiro",
  CREDIT_CARD = "Cartão de crédito",
  DEBIT_CARD = "Cartão de débito",
  PIX = "Pix",
}
export enum Status {
  PENDING = "Pendente",
  COMPLETED = "Completo",
  CANCELED = "Cancelado",
}

export enum Especialidade {
  ORTHODONTICS = "Ortodontia",
  ENDODONTICS = "Endodontia",
  DENTISTRY = "Dentistica",
  PERIODONTICS = "Periodontia",
  GENERAL = "Geral",
  SPECIALIZED = "Especializado",
  OTHER = "Outro",
}

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
