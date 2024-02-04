import { UserContext } from "@/context/UserProvider";
import { getPayments } from "@/network/api/payment";
import { UnauthorizedError } from "@/network/http-errors";
import { useContext } from "react";
import useSWR from "swr";

export default function useFindPayments(
  selectedMonth?: string,
  selectedDentistId?: string,
) {
  const { clinic } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    `findPayments_${clinic?.id}${selectedMonth ? `_${selectedMonth}` : ""}${selectedDentistId ? `_${selectedDentistId}` : ""}`,
    async () => {
      try {
        if (!clinic) return null;
        const payments = await getPayments(
          clinic.id,
          selectedMonth,
          selectedDentistId,
        );
        return payments;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  return {
    payments: data ?? [],
    paymentsLoading: isLoading,
    paymentsLoadingError: error,
    mutatePayments: mutate,
  };
}
