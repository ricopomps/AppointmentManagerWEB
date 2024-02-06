import { formatDate, formatMoney } from "@/lib/utils";
import { Especialidade } from "@/models/especialidade";
import { Pagamento } from "@/models/pagamento";
import { Status } from "@/models/status";
import { Payment } from "@prisma/client";
import PaymentActions from "./PaymentActions";

interface PaymentListItemProps {
  payment: Payment;
  isLoading?: boolean;
}
export default function PaymentListItem({
  payment,
  isLoading,
}: PaymentListItemProps) {
  const skeleton = <div className="skeleton h-4 w-full"></div>;

  return (
    <tr className="hover:bg-white/20">
      <td>{isLoading ? skeleton : formatDate(payment.paymentDate)}</td>
      <td>{isLoading ? skeleton : payment.pacientName}</td>
      <td>{isLoading ? skeleton : Especialidade[payment.expertise]}</td>
      <td>{isLoading ? skeleton : payment.procedure}</td>
      <td>{isLoading ? skeleton : Pagamento[payment.paymentMethod]}</td>
      <td>{isLoading ? skeleton : formatMoney(payment.value)}</td>
      <td>{isLoading ? skeleton : formatMoney(payment.cost)}</td>
      <td>
        {isLoading ? skeleton : formatMoney(payment.value - payment.cost)}
      </td>
      <td>
        {isLoading
          ? skeleton
          : formatMoney((payment.value - payment.cost) * 0.6)}
      </td>
      <td>
        {isLoading
          ? skeleton
          : formatMoney((payment.value - payment.cost) * 0.4)}
      </td>
      <td>{isLoading ? skeleton : Status[payment.status]}</td>
      <td>
        {isLoading
          ? skeleton
          : payment.observations.length > 0
            ? payment.observations
            : " - "}
      </td>
      <td>{isLoading ? skeleton : <PaymentActions payment={payment} />}</td>
    </tr>
  );
}
