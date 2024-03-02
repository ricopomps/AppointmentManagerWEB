import api from "@/network/axiosInstance";
import { PaymentTablePreferences } from "@prisma/client";

const baseUrl = "paymentTablePreferences";

export async function findPaymentTablePreferences(clinicId: string) {
  const response = await api.get<PaymentTablePreferences | null>(
    `${baseUrl}/${clinicId}`,
  );
  return response.data;
}

export async function updatePaymentTablePreferences(
  clinicId: string,
  paymentTablePreferences: PaymentTablePreferences,
) {
  const response = await api.put<PaymentTablePreferences>(
    `${baseUrl}/${clinicId}`,
    paymentTablePreferences,
  );
  return response.data;
}
