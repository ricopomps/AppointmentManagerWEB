import { Payment, PaymentTablePreferences } from "@prisma/client";
import PaymentListItem from "./PaymentListItem";

interface PaymentTableBodyProps {
  data: Payment[];
  preferences?: PaymentTablePreferences;
}

export default function PaymentTableBody({
  data,
  preferences,
}: PaymentTableBodyProps) {
  return (
    <tbody>
      {data.map((payment) => (
        <PaymentListItem
          payment={payment}
          key={payment.id}
          preferences={preferences}
        />
      ))}
    </tbody>
  );
}
