import { PaymentTablePreferences } from "@prisma/client";
import PaymentTableBodySkeleton from "../PaymentTableBodySkeleton";
import PaymentTableFooter from "../PaymentTableFooter";
import PaymentTableHeader from "../PaymentTableHeader";
import PaymentTablePreferencesBody from "./PaymentTablePreferencesBody";

interface PaymentTablePreferencesProps {
  loading: boolean;
  tablePreferences: PaymentTablePreferences;
}

export default function PaymentTablePreferences({
  tablePreferences,
  loading,
}: PaymentTablePreferencesProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <PaymentTableHeader />
        {loading ? (
          <PaymentTableBodySkeleton />
        ) : (
          <PaymentTablePreferencesBody
            loading={loading}
            tablePreferences={tablePreferences}
          />
        )}
        <PaymentTableFooter />
      </table>
    </div>
  );
}
