import { UserContext } from "@/context/UserProvider";
import { Role } from "@/models/roles";
import { findUsersWithRole } from "@/network/api/user";
import { User } from "@clerk/nextjs/server";
import { useContext, useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface DentistSelectorProps {
  register: UseFormRegisterReturn;
}
export default function DentistSelector({ register }: DentistSelectorProps) {
  const { clinic } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (clinic) {
          const users = await findUsersWithRole(clinic.id, Role.doctor);
          setUsers(users);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [clinic]);
  return (
    <select {...register} className="input input-bordered mb-3 w-full">
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {`${user.firstName} ${user.lastName}`}
        </option>
      ))}
    </select>
  );
}
