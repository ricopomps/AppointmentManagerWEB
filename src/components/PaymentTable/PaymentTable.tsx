import usePaymentTablePreferences from "@/hooks/usePaymentTablePreferences";
import { Payment, PaymentTablePreferences } from "@prisma/client";
import PaymentTableBody from "./PaymentTableBody";
import PaymentTableBodySkeleton from "./PaymentTableBodySkeleton";
import PaymentTableFooter from "./PaymentTableFooter";
import PaymentTableHeader from "./PaymentTableHeader";

interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  tablePreferences?: PaymentTablePreferences;
}

export default function PaymentTable({ payments, loading }: PaymentTableProps) {
  const { paymentTablePreferences } = usePaymentTablePreferences();
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <PaymentTableHeader preferences={paymentTablePreferences} />
        {loading ? (
          <PaymentTableBodySkeleton />
        ) : (
          <PaymentTableBody
            data={payments}
            preferences={paymentTablePreferences}
          />
        )}
        <PaymentTableFooter preferences={paymentTablePreferences} />
      </table>
    </div>
  );
}
