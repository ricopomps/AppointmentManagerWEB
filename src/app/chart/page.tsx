"use client";

import Chart, { ChartData, ChartTypeEnum } from "@/components/chart/Chart";
import FormInputField from "@/components/form/FormInputField";
import * as UsersApi from "@/network/api/user";
import { Payment } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ChartPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [option, setOption] = useState(1);
  const { register } = useForm();

  useEffect(() => {
    const getData = async () => {
      const payments = await UsersApi.getPayments();
      console.log(JSON.stringify(payments));
      setPayments(payments);
    };
    getData();
  }, []);

  if (payments.length === 0) return null;

  const dentists = [
    { name: "Renata", id: "64ab18249dff233e74f2be51" },
    { name: "Natália", id: "648a454d532dcd711b38d4ee" },
    { name: "Júlia", id: "64ab23662cdbdb203b94421f" },
  ];

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
          (item) => item.userId === dentist.id
        );
        const totalValue = dentistPayments.reduce(
          (sum, item) => sum + item.value,
          0
        );
        const totalCost = dentistPayments.reduce(
          (sum, item) => sum + item.cost,
          0
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
        label: dentist.name,
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
    <>
      <FormInputField
        register={register("chart")}
        as="select"
        options={options}
        label="Opção"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setOption(+e.target.value);
        }}
        placeholder="Opção"
      />
      <Chart
        data={chartData}
        currency
        showLabelInTitle
        chartType={ChartTypeEnum.Bar}
      />
    </>
  );
}
