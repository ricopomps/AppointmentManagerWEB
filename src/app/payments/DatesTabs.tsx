"use client";

import { UserContext } from "@/context/UserProvider";
import { cn } from "@/lib/utils";
import { getUniqueMonthsWithPayments } from "@/network/api/payment";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function DatesTabs() {
  const { clinic } = useContext(UserContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [monthsWithPayments, setMonthsWithPayments] = useState<string[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (clinic) {
          const uniqueMonths = await getUniqueMonthsWithPayments(clinic.id);
          setMonthsWithPayments(uniqueMonths);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, [clinic]);

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
    <div role="tablist" className="tabs-boxed h-fit">
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
