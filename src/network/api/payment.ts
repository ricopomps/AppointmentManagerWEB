import { parseMonthAndYear } from "@/lib/utils";
import { CreatePaymentSchema } from "@/lib/validation/payment";
import api from "@/network/axiosInstance";
import { Payment } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";

const baseUrl = "payment";

export async function createPayment(
  data: CreatePaymentSchema,
  clinicId: string,
) {
  const response = await api.post<Payment>(`${baseUrl}/${clinicId}`, data);
  return response.data;
}

export async function getPayments(
  clinicId: string,
  selectedMonth?: string,
  selectedDentistId?: string,
) {
  const params: {
    startDate?: Date;
    endDate?: Date;
    dentistId?: string;
  } = { dentistId: selectedDentistId };
  if (selectedMonth) {
    const data = parseMonthAndYear(selectedMonth);
    const startDate = startOfMonth(data);
    const endDate = endOfMonth(data);
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await api.get<Payment[]>(`${baseUrl}/${clinicId}`, {
    params,
  });
  return response.data;
}

export async function getUniqueMonthsWithPayments(clinicId: string) {
  const response = await api.get<string[]>(`${baseUrl}/dates/${clinicId}`);
  return response.data;
}
