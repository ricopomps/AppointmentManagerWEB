"use client";

import { UserContext } from "@/context/UserProvider";
import { Role } from "@/models/roles";
import { findUsersWithRole } from "@/network/api/user";
import { User } from "@clerk/nextjs/server";
import { useContext, useEffect, useState } from "react";

export default function DentistsTabs() {
  const { clinic } = useContext(UserContext);
  const [dentists, setDentists] = useState<User[]>([]);
  useEffect(() => {
    const fetchDentists = async () => {
      try {
        if (clinic) {
          const response = await findUsersWithRole(clinic.id, Role.doctor);
          setDentists(response || []);
        }
      } catch (error) {}
    };

    fetchDentists();
  }, [clinic]);

  return (
    <div role="tablist" className="tabs-boxed h-fit">
      <div role="tab" className="tab tab-active">
        Todos
      </div>
      {dentists.map((dentist) => (
        <div role="tab" className="tab" key={dentist.id}>
          {dentist.firstName}
        </div>
      ))}
    </div>
  );
}
