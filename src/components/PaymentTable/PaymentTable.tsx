import { Payment } from "@prisma/client";
import PaymentTableBody from "./PaymentTableBody";
import PaymentTableFooter from "./PaymentTableFooter";
import PaymentTableHeader from "./PaymentTableHeader";

interface PaymentTableProps {
  payments: Payment[];
}

export default function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <PaymentTableHeader />
        <PaymentTableBody data={payments} />
        <PaymentTableFooter />
      </table>
    </div>
  );
}
