"use client";
import AddUserModal from "@/components/Modal/AddUserModal";
import Pagination from "@/components/Paginations";
import useFindUsers, { readFromUserSearchParams } from "@/hooks/useFindUsers";
import { User } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import UserListTable from "./UserListTable";
import UserSearch from "./UserSearch";

export default function UsersPage() {
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const {
    currentPage,
    search,
    take: usersPerPage,
  } = readFromUserSearchParams(params);
  const { users, totalUsers, mutateUsers, usersLoading } = useFindUsers();

  function onAddedUser(user: User) {
    mutateUsers({ users: [...users, user], totalUsers: totalUsers + 1 });
    setOpenAddUserModal(false);
    toast.success("Usuário adicionado com sucesso!");
  }

  return (
    <main className="m-auto min-w-[300px] max-w-7xl p-4">
      <UserSearch
        page={currentPage}
        search={search}
        usersPerPage={usersPerPage}
        setOpenAddUserModal={() => {
          setOpenAddUserModal(true);
        }}
      />
      <UserListTable users={users} isLoading={usersLoading} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / usersPerPage)}
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
