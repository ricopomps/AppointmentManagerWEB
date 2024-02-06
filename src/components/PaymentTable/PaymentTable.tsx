import { Payment } from "@prisma/client";
import PaymentTableBody from "./PaymentTableBody";
import PaymentTableBodySkeleton from "./PaymentTableBodySkeleton";
import PaymentTableFooter from "./PaymentTableFooter";
import PaymentTableHeader from "./PaymentTableHeader";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
}

export default function PaymentTable({ payments, loading }: PaymentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <PaymentTableHeader />
        {loading ? (
          <PaymentTableBodySkeleton />
        ) : (
          <PaymentTableBody data={payments} />
        )}
        <PaymentTableFooter />
      </table>
    </div>
  );
}
