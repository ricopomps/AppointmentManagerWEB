import { UserContext } from "@/context/UserProvider";
import useDebounce from "@/hooks/useDebounce";
import { hasRole } from "@/lib/utils";
import { Role } from "@/models/roles";
import { useUser } from "@clerk/nextjs";
import { Search, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

interface UserSearchProps {
  search?: string;
  page: number;
  usersPerPage: number;
  setOpenAddUserModal: () => void;
}

export default function UserSearch({
  search,
  page,
  usersPerPage,
  setOpenAddUserModal,
}: UserSearchProps) {
  const [searchValue, setSearchValue] = useState(search ?? "");
  const searchValueDebounced = useDebounce(searchValue);

  const { user } = useUser();
  const { clinic } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleValueChange(value: string) {
      setSearchValue(value);
      const searchParams = new URLSearchParams({
        ...(page && { page: page.toString() }),
        ...(value && { search: value }),
        ...(usersPerPage && { amountPerPage: usersPerPage.toString() }),
      });

      router.replace(`${pathname}/?${searchParams.toString()}`);
    }
    handleValueChange(searchValueDebounced);
  }, [searchValueDebounced, page, pathname, router, usersPerPage]);

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="grow" />
      {searchValueDebounced}
      <input
        type="text"
        placeholder="Pesquisar..."
        className="input input-bordered w-full max-w-xs"
        defaultValue={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <button className="btn btn-primary">
        <Search />
      </button>
      <div className="flex grow justify-end">
        {user &&
          clinic &&
          hasRole(user, clinic.id, [Role.admin, Role.creator]) && (
            <button
              onClick={setOpenAddUserModal}
              className="end btn btn-primary"
              disabled={
                !user ||
                !clinic ||
                !hasRole(user, clinic.id, [Role.admin, Role.creator])
              }
            >
              <UserPlus />
            </button>
          )}
      </div>
    </div>
  );
}
