import { UserContext } from "@/context/UserProvider";
import { getRoles } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
import { UserIcon } from "lucide-react";
import { useContext } from "react";
import UserActions from "./UserActions";

interface UserListTableProps {
  users: User[];
  isLoading: boolean;
}

export default function UserListTable({
  users,
  isLoading,
}: UserListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <UserListTableSkeleton />
          ) : (
            users.map((user) => <UserListItem user={user} key={user.id} />)
          )}
        </tbody>
        <tfoot>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

interface UserListItemProps {
  user: User;
}

function UserListItem({ user }: UserListItemProps) {
  const { clinic } = useContext(UserContext);

  return (
    <tr className="hover:bg-white/20">
      <td>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <UserIcon size={48} />
          </div>
          <div>
            <div className="font-bold">{user.firstName ?? "-"}</div>
            <div className="text-sm opacity-50">{user.lastName ?? "-"}</div>
          </div>
        </div>
      </td>
      <td>
        {clinic &&
          getRoles(user, clinic.id).map((role) => <p key={role}>{role}</p>)}
      </td>
      <td>
        <UserActions user={user} />
      </td>
    </tr>
  );
}

function UserListTableSkeleton() {
  const numberOfUsers = 3;

  return Array.from({ length: numberOfUsers }).map((_, index) => (
    <UserListItemSkeleton key={index} />
  ));
}

function UserListItemSkeleton() {
  return (
    <tr className="hover:bg-white/20">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle skeleton h-12 w-12" />
          </div>
          <div>
            <div className="skeleton h-4 w-28 font-bold"></div>
            <div className="skeleton mt-2 h-4 w-36 text-sm opacity-50"></div>
          </div>
        </div>
      </td>
      <td>
        <p className="skeleton h-3 w-16"></p>
        <p className="skeleton mt-2 h-3 w-16"></p>
        <p className="skeleton mt-2 h-3 w-16"></p>
      </td>
      <td>
        <div className="skeleton h-3 w-12"></div>
      </td>
    </tr>
  );
}
