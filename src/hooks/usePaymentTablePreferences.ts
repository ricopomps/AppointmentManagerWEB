import { UserContext } from "@/context/UserProvider";
import { findPaymentTablePreferences } from "@/network/api/paymentTablePreferences";
import { UnauthorizedError } from "@/network/http-errors";
import { PaymentTablePreferences } from "@prisma/client";
import { useContext } from "react";
import useSWR from "swr";

export default function usePaymentTablePreferences() {
  const { clinic } = useContext(UserContext);

  const defaultEmptyPaymentTablePreferences: PaymentTablePreferences = {
    clinicId: "1",
    createdAt: new Date(),
    id: "1",
    updatedAt: new Date(),
    hasPaymentAccount: null,
    hasPaymentMethod: null,
    hasSpecialty: null,
  };

  const { data, isLoading, error, mutate } = useSWR(
    `payment_table_preferences_${clinic?.id}`,
    async () => {
      try {
        if (!clinic) return null;
        const paymentTablePreferences = await findPaymentTablePreferences(
          clinic.id,
        );
        return paymentTablePreferences;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  return {
    paymentTablePreferences: data ?? defaultEmptyPaymentTablePreferences,
    paymentTablePreferencesLoading: isLoading,
    paymentTablePreferencesError: error,
    mutatePaymentTablePreferences: mutate,
  };
}
