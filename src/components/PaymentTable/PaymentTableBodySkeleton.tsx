import { Payment } from "@prisma/client";
import PaymentListItem from "./PaymentListItem";

interface PaymentTableBodySkeletonProps {
  numberOfLines?: number;
}

export default function PaymentTableBodySkeleton({
  numberOfLines,
}: PaymentTableBodySkeletonProps) {
  let pay: Payment;
  const numberOfPayments = numberOfLines ?? 3;

  return (
    <tbody>
      {Array.from({ length: numberOfPayments }).map((_, index) => (
        <PaymentListItem payment={pay} key={index} isLoading={true} />
      ))}
    </tbody>
  );
}
