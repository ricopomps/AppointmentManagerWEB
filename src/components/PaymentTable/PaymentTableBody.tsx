import { Payment } from "@prisma/client";
import PaymentListItem from "./PaymentListItem";

interface PaymentTableBodyProps {
  data: Payment[];
}

export default function PaymentTableBody({ data }: PaymentTableBodyProps) {
  return (
    <tbody>
      {data.map((payment) => (
        <PaymentListItem payment={payment} key={payment.id} />
      ))}
    </tbody>
  );
}
