import { Payment } from "@prisma/client";
import PaymentListItem from "./PaymentListItem";

export default function PaymentTableBodySkeleton() {
  let pay: Payment;
  const numberOfPayments = 3;

  return (
    <tbody>
      {Array.from({ length: numberOfPayments }).map((_, index) => (
        <PaymentListItem payment={pay} key={index} isLoading={true} />
      ))}
    </tbody>
  );
}
