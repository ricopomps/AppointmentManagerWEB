import { UserContext } from "@/context/UserProvider";
import { findUsers } from "@/network/api/user";
import { UnauthorizedError } from "@/network/http-errors";
import { useContext } from "react";
import useSWR from "swr";

export default function useFindUsersByClinic() {
  const { clinic } = useContext(UserContext);

  const { data, isLoading, error, mutate } = useSWR(
    `findUsers_${clinic?.id}`,
    async () => {
      try {
        if (!clinic) return null;
        const users = await findUsers(clinic.id);
        return users;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  return {
    users: data ?? [],
    usersLoading: isLoading,
    usersLoadingError: error,
    mutateUsers: mutate,
  };
}
