import { UserContext } from "@/context/UserProvider";
import { getRoles } from "@/lib/utils";
import { User } from "@clerk/nextjs/server";
import { User as UserIcon } from "lucide-react";
import { useContext } from "react";
import UserActions from "./UserActions";

interface UserListTableProps {
  users: User[];
  removeUser: (userId: string) => void;
}

export default function UserListTable({
  users,
  removeUser,
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
          {users.map((user) => (
            <UserListItem user={user} key={user.id} removeUser={removeUser} />
          ))}
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
  removeUser: (userId: string) => void;
}
function UserListItem({ user, removeUser }: UserListItemProps) {
  const { clinic } = useContext(UserContext);

  return (
    <tr className="hover:bg-white/20">
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <UserIcon />
            </div>
          </div>
          <div>
            <div className="font-bold">{user.firstName ?? "-"}</div>
            <div className="text-sm opacity-50">{user.lastName ?? "-"} </div>
          </div>
        </div>
      </td>
      <td>
        {clinic &&
          getRoles(user, clinic.id).map((role) => <p key={role}>{role}</p>)}
      </td>
      <th>
        <UserActions user={user} removeUser={removeUser} />
      </th>
    </tr>
  );
}
