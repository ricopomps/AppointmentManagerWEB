import { CreatePaymentSchema } from "@/lib/validation/payment";
import api from "@/network/axiosInstance";
import { Payment } from "@prisma/client";

const baseUrl = "payment";

export async function createPayment(
  data: CreatePaymentSchema,
  clinicId: string,
) {
  const response = await api.post<Payment>(`${baseUrl}/${clinicId}`, data);
  return response.data;
}

export async function getPayments(clinicId: string) {
  const response = await api.get<Payment[]>(`${baseUrl}/${clinicId}`);
  return response.data;
}

export async function getUniqueMonthsWithPayments(clinicId: string) {
  const response = await api.get<string[]>(`${baseUrl}/dates/${clinicId}`);
  return response.data;
}
