import { formatDate, formatMoney } from "@/lib/utils";
import { Especialidade } from "@/models/especialidade";
import { Pagamento } from "@/models/pagamento";
import { Status } from "@/models/status";
import { Payment } from "@prisma/client";

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

interface PaymentListItemProps {
  payment: Payment;
}

function PaymentListItem({ payment }: PaymentListItemProps) {
  return (
    <tr>
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
      <td>Ações</td>
    </tr>
  );
}
