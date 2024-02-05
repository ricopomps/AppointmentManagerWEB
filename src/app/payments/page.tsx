"use client";
import AddPaymentModal from "@/components/Modal/AddPaymentModal";
import PaymentTable from "@/components/PaymentTable/PaymentTable";
import useFindPayments from "@/hooks/useFindPayments";
import { Payment } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-toastify";
import DatesTabs from "./DatesTabs";
import DentistsTabs from "./DentistsTabs";
import TotalAmountCard from "./TotalAmountsCard";

interface PaymentsPageProps {
  searchParams: {
    selectedMonth?: string;
    selectedDentistId?: string;
  };
}

export default function PaymentsPage({
  searchParams: { selectedDentistId, selectedMonth },
}: PaymentsPageProps) {
  const { payments, mutatePayments } = useFindPayments(
    selectedMonth,
    selectedDentistId,
  );
  const [isOpen, setIsOpen] = useState(false);

  const addPayment = (payment: Payment) => {
    mutatePayments([...payments, payment]);
  };

  const onAccept = (payment: Payment) => {
    addPayment(payment);
    setIsOpen(false);
    toast.success("Pagamento adicionado com sucesso!");
  };

  function getValues() {
    const totalRecipe = payments.reduce(
      (sum, payment) => sum + payment.value,
      0,
    );
    const totalCost = payments.reduce((sum, payment) => sum + payment.cost, 0);

    return { totalRecipe, totalCost };
  }

  const { totalRecipe, totalCost } = getValues();

  return (
    <main className="m-auto min-w-[300px] max-w-full p-4 md:p-16 md:pt-4">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row">
          <DentistsTabs />
          <DatesTabs />
        </div>
        <TotalAmountCard totalRecipe={totalRecipe} totalCost={totalCost} />
        <button onClick={() => setIsOpen(true)} className="btn btn-primary">
          Adicionar pagamento
        </button>
      </div>
      <PaymentTable payments={payments} />
      {isOpen && (
        <AddPaymentModal onClose={() => setIsOpen(false)} onAccept={onAccept} />
      )}
    </main>
  );
}
