import { User } from "@clerk/nextjs/server";
import { User as UserIcon } from "lucide-react";
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
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
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
            <th></th>
            <th>Nome</th>
            <th>Email</th>
            <th>Status</th>
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
function UserListItem({
  user: { id, firstName, lastName },
  removeUser,
}: UserListItemProps) {
  return (
    <tr className="hover:bg-white/20">
      <th>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </th>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <UserIcon />
            </div>
          </div>
          <div>
            <div className="font-bold">{firstName ?? "Usuário"}</div>
            <div className="text-sm opacity-50">{lastName ?? "Pendente"} </div>
          </div>
        </div>
      </td>
      <td>
        <span className="badge badge-ghost badge-lg">{"email"}</span>
      </td>
      <td>{status}</td>
      <th>
        <UserActions userId={id} removeUser={removeUser} />
      </th>
    </tr>
  );
}
