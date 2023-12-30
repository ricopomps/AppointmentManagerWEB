"use client";

import ProfileImage from "@/components/ProfileImage";
import PaymentCreateEditModal from "@/components/modal/PaymentCreateEditModal";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/user";
import { generateIntervals } from "@/utils/prepareIntervals";
import {
  capitalizeFirstLetter,
  formatCurrency,
  formatDate,
} from "@/utils/utils";
import { Payment } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button, Col, Tab, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "./Home.module.css";
export interface Interval {
  interval: string;
  startTime: string;
  endTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

interface DentistSchedulesInterface {
  dentist: User;
  schedules: {
    day: number;
    intervals: string[];
  }[];
}

export default function Home() {
  const [selectedDentist, setSelectedDentist] = useState({
    name: "Todos",
    id: "0",
  });
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | undefined>(
    undefined
  );
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const getData = async () => {
      const payments = await UsersApi.getPayments();
      console.log(JSON.stringify(payments));
      setPayments(payments);
    };
    getData();
  }, []);
  const dentistas = [
    { name: "Renata", id: "64ab18249dff233e74f2be51" },
    { name: "Natália", id: "648a454d532dcd711b38d4ee" },
    { name: "Júlia", id: "64ab23662cdbdb203b94421f" },
    { name: "Todos", id: "0" },
  ];

  function returnPayments() {
    let paymentsToReturn: Payment[] = [];
    if (payments.length === 0) return paymentsToReturn;
    if (selectedDentist.id === "0") {
      paymentsToReturn = payments;
    } else {
      paymentsToReturn = payments.filter(
        (payment) => payment.userId == selectedDentist.id
      );
    }
    if (selectedMonth) {
      paymentsToReturn = getPaymentsForMonth(paymentsToReturn, selectedMonth);
    }
    return paymentsToReturn;
  }

  function returnPaymentsFromDentist() {
    let paymentsToReturn: Payment[] = [];
    if (payments.length === 0) return paymentsToReturn;
    if (selectedDentist.id === "0") {
      paymentsToReturn = payments;
    } else {
      paymentsToReturn = payments.filter(
        (payment) => payment.userId == selectedDentist.id
      );
    }
    return paymentsToReturn;
  }

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

  function getValues() {
    const paymentsSelected = returnPayments();
    const totalRecipe = paymentsSelected.reduce(
      (sum, payment) => sum + payment.value,
      0
    );
    const totalCost = paymentsSelected.reduce(
      (sum, payment) => sum + payment.cost,
      0
    );

    return { totalRecipe, totalCost };
  }

  const { totalRecipe, totalCost } = getValues();

  return (
    <>
      <div className="d-flex gap-2 full mb-2">
        {dentistas.map((dentista) => (
          <Button
            key={dentista.id}
            onClick={() => {
              setSelectedDentist(dentista);
            }}
            variant={selectedDentist.id === dentista.id ? "warning" : undefined}
          >
            {dentista.name}
          </Button>
        ))}
        <Button
          className="ms-auto"
          onClick={() => {
            setPaymentToEdit(undefined);
            setOpen(true);
          }}
        >
          Adicionar Pagamento
        </Button>
      </div>
      <div className="d-flex gap-2 full mb-2">
        {getUniqueMonths(returnPaymentsFromDentist()).map((month, index) => (
          <Button
            key={index}
            variant={selectedMonth === month ? "warning" : undefined}
            onClick={() => setSelectedMonth(month)}
          >
            {month}
          </Button>
        ))}
        <Button
          onClick={() => {
            setSelectedMonth(null);
          }}
          variant={selectedMonth === null ? "warning" : undefined}
        >
          Todos
        </Button>
      </div>
      <div className="d-flex gap-2 full mb-2">
        <div className="ms-auto p-3 bg-dark rounded shadow-sm">
          <div className="fw-bold fs-5 text-success">
            Receita total: {formatCurrency(totalRecipe)}
          </div>
          <div className="fw-bold fs-5 text-danger">
            Custo (Protético): {formatCurrency(totalCost)}
          </div>
          <div className="fw-bold fs-5 text-primary">
            Subtotal: {formatCurrency(totalRecipe - totalCost)}
          </div>
          <div className="fw-bold fs-5 text-info">
            Dentista: {formatCurrency((totalRecipe - totalCost) * 0.6)}
          </div>
          <div className="fw-bold fs-5 text-warning">
            Clínica: {formatCurrency((totalRecipe - totalCost) * 0.4)}
          </div>
        </div>
      </div>

      <div className="d-flex gap-4">
        <PaymentTable
          payments={returnPayments()}
          dentist={selectedDentist}
          setPaymentToEdit={(payment: Payment) => {
            setPaymentToEdit(payment);
          }}
          removePayment={(paymentId: string) => {
            setPayments(payments.filter((pay) => pay.id !== paymentId));
          }}
        />
      </div>
      {(open || paymentToEdit) && (
        <PaymentCreateEditModal
          onDismiss={() => {
            setPaymentToEdit(undefined);
            setOpen(false);
          }}
          updateEdit={(payment: Payment) => {
            if (payments.find((pay) => pay.id === payment.id)) {
              setPayments(
                payments.map((pay) => (pay.id === payment.id ? payment : pay))
              );
            } else {
              setPayments([...payments, payment]);
            }
          }}
          paymentToEdit={paymentToEdit}
        />
      )}
    </>
  );
}

async function DentistSchedules() {
  const intervalValues: Interval = {
    interval: "00:30:00",
    startTime: "08:00:00",
    endTime: "18:00:00",
    breakStartTime: "12:00:00",
    breakEndTime: "14:00:00",
  };

  const week = Array.from({ length: 7 }, (_, index) => index);

  const data = week.map((week) => ({
    day: week + 1,
    intervals: generateIntervals(intervalValues),
  }));
  const [dentists, setDentists] = useState<DentistSchedulesInterface[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const dentistsResponse = await UsersApi.findDentists();
      console.log(dentistsResponse);
      setDentists(
        dentistsResponse.map((dentist) => ({
          dentist,
          schedules: data,
        }))
      );
    };
    fetchData();
  }, []);

  const day = 1;
  if (dentists.length === 0) return <></>;
  return (
    <div>
      {dentists.map((dentist) => {
        const daySchedule = dentist.schedules.find(
          (schedule) => schedule.day === day
        );
        return (
          <div className="d-flex gap-2 p-2">
            <div
              className={`d-flex flex-column justify-content-center ${styles.dentistImage}`}
            >
              <ProfileImage />
              <p>{dentist.dentist.username}</p>
            </div>
            <div className="d-flex gap-2">
              <Col className="p-2 ">
                {daySchedule &&
                  daySchedule.intervals.map((schedules) => {
                    return (
                      <Button
                        variant="outline-primary"
                        className="text-nowrap m-2"
                      >
                        {schedules}
                      </Button>
                    );
                  })}
                <hr />
              </Col>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface PaymentTableProps {
  payments: any[];
  dentist: { name: string; id: string };
  setPaymentToEdit: (payment: Payment) => void;
  removePayment: (paymentId: string) => void;
}

function PaymentTable({
  payments,
  dentist,
  setPaymentToEdit,
  removePayment,
}: PaymentTableProps) {
  async function remove(paymentId: string) {
    try {
      await UsersApi.deletePayment(paymentId);
      removePayment(paymentId);
    } catch (error) {
      toast.error("Error");
    }
  }
  return (
    <Tab.Content className="">
      <Table striped bordered hover className="" responsive>
        <thead>
          <tr>
            {dentist.id !== "0" && <th className="text-warning">Dentista</th>}
            <th className="text-warning">Data</th>
            <th className="text-warning">Nome do Paciente</th>
            <th className="text-warning">Especialidade</th>
            <th className="text-warning">Procedimento</th>
            <th className="text-warning">Forma de Pagamento</th>
            <th className="text-warning">Valor</th>
            <th className="text-warning">Custo (Protético)</th>
            <th className="text-warning">Subtotal</th>
            <th className="text-warning">60%</th>
            <th className="text-warning">40%</th>
            <th className="text-warning">Status</th>
            <th className="text-warning">
              Observação / Procedimentos de Particular
            </th>
            <th className="text-warning">Opções</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              {dentist.id !== "0" && (
                <td className="text-info">{dentist.name}</td>
              )}
              <td className="text-primary">
                {formatDate(payment.createdAt.toString())}
              </td>
              <td className="text-primary">
                {capitalizeFirstLetter(payment.pacientName)}
              </td>
              <td className="text-primary">
                {
                  UsersApi.Especialidade[
                    payment.expertise as keyof typeof UsersApi.Especialidade
                  ]
                }
              </td>
              <td className="text-primary">{payment.procedure}</td>
              <td className="text-primary">
                {
                  UsersApi.Pagamento[
                    payment.paymentMethod as keyof typeof UsersApi.Pagamento
                  ]
                }
              </td>
              <td className="text-primary">{formatCurrency(payment.value)}</td>
              <td className="text-primary">{formatCurrency(payment.cost)}</td>
              <td className="text-primary">
                {formatCurrency(payment.value - payment.cost)}
              </td>
              <td className="text-primary">
                {formatCurrency((payment.value - payment.cost) * 0.6)}
              </td>
              <td className="text-primary">
                {formatCurrency((payment.value - payment.cost) * 0.4)}
              </td>
              <td className="text-primary">
                {
                  UsersApi.Status[
                    payment.status as keyof typeof UsersApi.Status
                  ]
                }
              </td>
              <td className="text-primary">{payment.observations}</td>
              <td className="text-primary">
                <div className="d-flex gap-2">
                  <Button onClick={() => setPaymentToEdit(payment)}>
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      remove(payment.id);
                    }}
                    variant="danger"
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Tab.Content>
  );
}
