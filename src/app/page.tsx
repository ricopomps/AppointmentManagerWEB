"use client";

import ProfileImage from "@/components/ProfileImage";
import PaymentCreateEditModal from "@/components/modal/PaymentCreateEditModal";
import { User } from "@/models/user";
import * as UsersApi from "@/network/api/user";
import { generateIntervals } from "@/utils/prepareIntervals";
import { capitalizeFirstLetter, formatDate } from "@/utils/utils";
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

export enum Pagamento {
  CASH = "Dinheiro",
  CREDIT_CARD = "Cartão de crédito",
  DEBIT_CARD = "Cartão de débito",
  PIX = "Pix",
}
export enum Status {
  PENDING = "Pendente",
  COMPLETED = "Completo",
  CANCELED = "Cancelado",
}

export enum Especialidade {
  GENERAL = "Geral",
  SPECIALIZED = "Especializado",
}

export default function Home() {
  const [selectedDentist, setSelectedDentist] = useState({
    name: "Todos",
    id: "0",
  });
  const [open, setOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | undefined>(
    undefined
  );
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const getData = async () => {
      const payments = await UsersApi.getPayments();
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
    if (payments.length === 0) return [];
    if (selectedDentist.id === "0") {
      return payments;
    } else {
      return payments.filter((payment) => payment.userId == selectedDentist.id);
    }
  }

  return (
    <>
      <div className="d-flex gap-2 full mb-2">
        {dentistas.map((dentista) => (
          <Button
            onClick={() => {
              setSelectedDentist(dentista);
            }}
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
            {dentist.id !== "0" && <th>Dentista</th>}
            <th>Data</th>
            <th>Nome do Paciente</th>
            <th>Especialidade</th>
            <th>Procedimento</th>
            <th>Forma de Pagamento</th>
            <th>Valor</th>
            <th>Custo (Protético)</th>
            <th>Subtotal</th>
            <th>60%</th>
            <th>40%</th>
            <th>Status</th>
            <th>Observação / Procedimentos de Particular</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              {dentist.id !== "0" && <th>{dentist.name}</th>}
              <td>{formatDate(payment.createdAt.toString())}</td>
              <td>{capitalizeFirstLetter(payment.pacientName)}</td>
              <td>
                {Especialidade[payment.expertise as keyof typeof Especialidade]}
              </td>
              <td>{payment.procedure}</td>
              <td>
                {Pagamento[payment.paymentMethod as keyof typeof Pagamento]}
              </td>
              <td>{payment.value}</td>
              <td>{payment.cost}</td>
              <td>{payment.value}</td>
              <td>{payment.value * 0.6}</td>
              <td>{payment.value * 0.4}</td>
              <td>{Status[payment.status as keyof typeof Status]}</td>
              <td>{payment.observations}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button onClick={() => setPaymentToEdit(payment)}>
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      remove(payment.id);
                    }}
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
