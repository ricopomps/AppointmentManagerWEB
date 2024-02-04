import { UserContext } from "@/context/UserProvider";
import { getUniqueMonthsWithPayments } from "@/network/api/payment";
import { UnauthorizedError } from "@/network/http-errors";
import { useContext } from "react";
import useSWR from "swr";

export default function useUniqueMonthsWithPayments() {
  const { clinic } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    `findDates_${clinic?.id}`,
    async () => {
      try {
        if (!clinic) return null;
        const dates = await getUniqueMonthsWithPayments(clinic.id);
        return dates;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  return {
    dates: data ?? [],
    datesLoading: isLoading,
    datesLoadingError: error,
    mutateDates: mutate,
  };
}
