"use client";

import useFindDentists from "@/hooks/useFindDentists";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function DentistsTabs() {
  const { dentists } = useFindDentists();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
    <div role="tablist" className="tabs-boxed h-fit w-fit">
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
