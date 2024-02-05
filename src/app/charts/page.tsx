"use client";

import Chart, { ChartData, ChartTypeEnum } from "@/components/Chart/Chart";
import useFindDentists from "@/hooks/useFindDentists";
import useFindPayments from "@/hooks/useFindPayments";
import { Payment } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ChartsPage() {
  const [option, setOption] = useState(1);
  const { register } = useForm();

  const { payments } = useFindPayments();
  const { dentists } = useFindDentists();

  if (payments.length === 0) return null;

  function getUniqueMonths(payments: Payment[]) {
    const uniqueMonths = new Set<string>();

    payments.forEach((payment) => {
      const month = new Date(payment.createdAt).toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      uniqueMonths.add(month);
    });

    return Array.from(uniqueMonths);
  }

  function getPaymentsForMonth(payments: Payment[], selectedMonth: string) {
    return payments.filter((payment) => {
      const month = new Date(payment.createdAt).toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });
      return month === selectedMonth;
    });
  }

  const months = getUniqueMonths(payments);
  const colors = ["#00ff00", "#ffff00", "#00ffff"];

  const chartData: ChartData = {
    labels: months,
    datasets: dentists.map((dentist, index) => {
      const dentistData = months.map((selectedMonth) => {
        const filteredPayments = getPaymentsForMonth(payments, selectedMonth);
        const dentistPayments = filteredPayments.filter(
          (item) => item.userId === dentist.id,
        );
        const totalValue = dentistPayments.reduce(
          (sum, item) => sum + item.value,
          0,
        );
        const totalCost = dentistPayments.reduce(
          (sum, item) => sum + item.cost,
          0,
        );
        switch (option) {
          case 1:
            return totalValue;
          case 2:
            return totalCost;
          case 3:
            return totalValue - totalCost;
        }
        return totalValue;
      });

      return {
        label: `${dentist.firstName} ${dentist.lastName}`,
        data: dentistData,
        backgroundColor: [colors[index % colors.length]],
        borderColor: "black",
        borderWidth: 2,
        minBarLength: 7,
      };
    }),
  };

  const options = [
    {
      key: "Receita total",
      value: 1,
    },
    {
      key: "Custo",
      value: 2,
    },
    {
      key: "Subtotal",
      value: 3,
    },
  ];
  return (
    <main className="m-auto min-w-[300px] max-w-full p-4 md:p-16 md:pt-4">
      <div className="flex justify-center">
        <label>
          Tipo de gráfico
          <select
            {...register("expertise")}
            className="input input-bordered mb-3 w-full"
            onChange={(e) => setOption(+e.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.key}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Chart
        data={chartData}
        currency
        showLabelInTitle
        chartType={ChartTypeEnum.Bar}
      />
    </main>
  );
}
