"use client";
import AddPaymentModal from "@/components/Modal/AddPaymentModal";
import PaymentTable from "@/components/PaymentTable/PaymentTable";
import { UserContext } from "@/context/UserProvider";
import { getPayments } from "@/network/api/payment";
import { Payment } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function PaymentsPage() {
  const { clinic } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    try {
      const fetchPayments = async () => {
        if (!clinic) return;
        const payments = await getPayments(clinic.id);
        setPayments(payments);
      };
      fetchPayments();
    } catch (error) {}
  }, [clinic]);

  const addPayment = (payment: Payment) => {
    setPayments([...payments, payment]);
  };

  const onAccept = (payment: Payment) => {
    addPayment(payment);
    setIsOpen(false);
  };

  return (
    <main className="m-auto min-w-[300px] max-w-full p-4 md:p-16 md:pt-4">
      <div className="flex justify-center md:justify-end">
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
