import { UserContext } from "@/context/UserProvider";
import { findUsers } from "@/network/api/user";
import { UnauthorizedError } from "@/network/http-errors";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import useSWR from "swr";

export function readFromUserSearchParams(params: URLSearchParams) {
  const search = params.get("search") ?? "";
  const page = params.get("page");
  const amountPerPage = params.get("usersPerPage");

  const currentPage = page ? +page : 1;
  const defaultUserPerPage = 10;
  const usersPerPage =
    amountPerPage && +amountPerPage > 0 && +amountPerPage < 50
      ? +amountPerPage
      : defaultUserPerPage;

  const take = usersPerPage;
  const skip = (currentPage - 1) * usersPerPage;

  return {
    currentPage,
    search,
    take,
    skip,
  };
}

export default function useFindUsers() {
  const { clinic } = useContext(UserContext);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const { search, skip, take } = readFromUserSearchParams(params);
  const { data, isLoading, error, mutate } = useSWR(
    `findUsers_${clinic?.id}}_${search}_${take}_${skip}}`,
    async () => {
      try {
        if (!clinic) return null;
        const paginatedUsers = await findUsers(clinic.id, search, take, skip);
        return paginatedUsers;
      } catch (error) {
        if (error instanceof UnauthorizedError) return null;
        else throw error;
      }
    },
  );

  useEffect(() => {
    if (search !== undefined) {
      mutate();
    }
  }, [search, mutate]);

  return {
    users: data?.users ?? [],
    totalUsers: data?.totalUsers ?? 0,
    usersLoading: isLoading,
    usersLoadingError: error,
    mutateUsers: mutate,
  };
}
