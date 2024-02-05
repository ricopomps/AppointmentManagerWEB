"use client";

import useUniqueMonthsWithPayments from "@/hooks/useUniqueMonthsWithPayments";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function DatesTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { dates: monthsWithPayments } = useUniqueMonthsWithPayments();

  function generateDateLink(date: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selectedMonth", date);

    return `${pathname}?${params}`;
  }

  function generateAllLink() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("selectedMonth");

    return `${pathname}?${params}`;
  }

  function isSelected(dentistId: string) {
    const params = new URLSearchParams(searchParams.toString());
    const selectedMonth = params.get("selectedMonth");

    return selectedMonth === dentistId;
  }

  function isAll() {
    const params = new URLSearchParams(searchParams.toString());
    const selectedMonth = params.get("selectedMonth");

    return !selectedMonth;
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
      {monthsWithPayments.map((month, index) => (
        <Link
          href={generateDateLink(month)}
          role="tab"
          className={cn("tab", isSelected(month) && "tab-active")}
          key={index}
        >
          {month}
        </Link>
      ))}
    </div>
  );
}
