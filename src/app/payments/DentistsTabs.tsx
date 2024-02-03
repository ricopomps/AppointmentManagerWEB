"use client";

import { UserContext } from "@/context/UserProvider";
import { cn } from "@/lib/utils";
import { Role } from "@/models/roles";
import { findUsersWithRole } from "@/network/api/user";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function DentistsTabs() {
  const { clinic } = useContext(UserContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
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

  function generateDentistLink(dentistId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedDentistId", dentistId);

    return `${pathname}?${params}`;
  }

  function generateAllLink() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("selectedDentistId");

    return `${pathname}?${params}`;
  }

  function isSelected(dentistId: string) {
    const params = new URLSearchParams(searchParams.toString());
    const selectedDentistId = params.get("selectedDentistId");

    return selectedDentistId === dentistId;
  }

  function isAll() {
    const params = new URLSearchParams(searchParams.toString());
    const selectedDentistId = params.get("selectedDentistId");

    return !selectedDentistId;
  }

  return (
    <div role="tablist" className="tabs-boxed h-fit">
      <Link
        href={generateAllLink()}
        role="tab"
        className={cn("tab", isAll() && "tab-active")}
      >
        Todos
      </Link>
      {dentists.map((dentist) => (
        <Link
          href={generateDentistLink(dentist.id)}
          role="tab"
          className={cn("tab", isSelected(dentist.id) && "tab-active")}
          key={dentist.id}
        >
          {dentist.firstName}
        </Link>
      ))}
    </div>
  );
}
