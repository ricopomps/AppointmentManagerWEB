"use client";
import Pagination from "@/components/Paginations";
import { UserContext } from "@/context/UserProvider";
import { findUsers } from "@/network/api/user";
import { User } from "@clerk/nextjs/server";
import { Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
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
  const { clinic: selectedClinic } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();
  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState(name || "");
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = page ? +page : 1;

  const removeUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

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
  useEffect(() => {
    async function fetchData() {
      try {
        // const { users, totalCount: usersCount } = await UsersApi.findUsers({
        //   condo: condoId,
        //   name: searchValue,
        //   take: usersPerPage,
        //   skip: usersPerPage * (currentPage - 1),
        // });
        if (selectedClinic) {
          const users = await findUsers(selectedClinic.id);
          setUsers(users);
        }
        // setTotalCount(usersCount);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [currentPage, name, searchValue, selectedClinic]);

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
          <Link href={`${pathname}/create`} className="end btn btn-primary">
            <UserPlus />
          </Link>
        </div>
      </div>
      <UserListTable users={users} removeUser={removeUser} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / usersPerPage)}
      />
    </main>
  );
}
