import { formatDate, formatMoney } from "@/lib/utils";
import { Especialidade } from "@/models/especialidade";
import { Pagamento } from "@/models/pagamento";
import { Status } from "@/models/status";
import { Payment } from "@prisma/client";
import PaymentActions from "./PaymentActions";

interface PaymentListItemProps {
  payment: Payment;
}

export default function PaymentListItem({ payment }: PaymentListItemProps) {
  return (
    <tr className="hover:bg-white/20">
      <td>{formatDate(payment.paymentDate)}</td>
      <td>{payment.pacientName}</td>
      <td>{Especialidade[payment.expertise]}</td>
      <td>{payment.procedure}</td>
      <td>{Pagamento[payment.paymentMethod]}</td>
      <td>{formatMoney(payment.value)}</td>
      <td>{formatMoney(payment.cost)}</td>
      <td>{formatMoney(payment.value - payment.cost)}</td>
      <td>{formatMoney((payment.value - payment.cost) * 0.6)}</td>
      <td>{formatMoney((payment.value - payment.cost) * 0.4)}</td>
      <td>{Status[payment.status]}</td>
      <td>{payment.observations.length > 0 ? payment.observations : " - "}</td>
      <td>
        <PaymentActions payment={payment} />
      </td>
    </tr>
  );
}
