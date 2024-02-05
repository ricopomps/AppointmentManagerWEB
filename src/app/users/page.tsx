"use client";
import AddUserModal from "@/components/Modal/AddUserModal";
import Pagination from "@/components/Paginations";
import { UserContext } from "@/context/UserProvider";
import useFindUsersByClinic from "@/hooks/useFindUsersByClinic";
import { hasRole } from "@/lib/utils";
import { Role } from "@/models/roles";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { Search, UserPlus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import UserListTable from "./UserListTable";

interface UserPageProps {
  searchParams: {
    name?: string;
    page?: string;
  };
}

export default function UsersPage({
  searchParams: { name, page },
}: UserPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { clinic } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState(name || "");
  const [totalCount, setTotalCount] = useState(0);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const { users, mutateUsers } = useFindUsersByClinic();

  const currentPage = page ? +page : 1;

  function handleValueChange(value: string) {
    setSearchValue(value);
    const searchParams = new URLSearchParams({
      ...(name && { name }),
      ...(page && { page }),
    });
    searchParams.set("name", value);

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  const usersPerPage = 10;

  function onAddedUser(user: User) {
    mutateUsers([...users, user]);
    setOpenAddUserModal(false);
    toast.success("Usuário adicionado com sucesso!");
  }

  return (
    <main className="m-auto min-w-[300px] max-w-7xl p-4">
      <div className="flex items-center justify-center gap-3">
        <div className="grow" />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="input input-bordered w-full max-w-xs"
          defaultValue={searchValue}
          onChange={(e) => handleValueChange(e.target.value)}
        />
        <button className="btn btn-primary">
          <Search />
        </button>
        <div className="flex grow justify-end">
          {user &&
            clinic &&
            hasRole(user, clinic.id, [Role.admin, Role.creator]) && (
              <button
                onClick={() => {
                  setOpenAddUserModal(true);
                }}
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
      <UserListTable users={users} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / usersPerPage)}
      />
      {openAddUserModal && (
        <AddUserModal
          onAccept={onAddedUser}
          onClose={() => setOpenAddUserModal(false)}
        />
      )}
    </main>
  );
}
