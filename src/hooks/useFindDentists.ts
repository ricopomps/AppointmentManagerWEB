import { UserContext } from "@/context/UserProvider";
import { Role } from "@/models/roles";
import { findUsersWithRole } from "@/network/api/user";
import { UnauthorizedError } from "@/network/http-errors";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";
import useSWR from "swr";

export default function useFindDentists() {
  const { clinic, isDoctor } = useContext(UserContext);
  const { user } = useUser();
  const { data, isLoading, error, mutate } = useSWR(
    `findDentists_${clinic?.id}`,
    async () => {
      try {
        if (!clinic) return null;
        if (isDoctor && user) return [user];
        const dentists = await findUsersWithRole(clinic.id, Role.doctor);
        return dentists;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  return {
    dentists: data ?? [],
    dentistsLoading: isLoading,
    dentistsLoadingError: error,
    mutateDentists: mutate,
  };
}
