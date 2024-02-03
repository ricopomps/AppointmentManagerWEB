"use client";

import { UserContext } from "@/context/UserProvider";
import { getUniqueMonthsWithPayments } from "@/network/api/payment";
import { useContext, useEffect, useState } from "react";

export default function DatesTabs() {
  const { clinic } = useContext(UserContext);
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

  return (
    <div role="tablist" className="tabs-boxed h-fit">
      <div role="tab" className="tab tab-active">
        Todos
      </div>
      {monthsWithPayments.map((month, index) => (
        <div role="tab" className="tab" key={index}>
          {month}
        </div>
      ))}
    </div>
  );
}
