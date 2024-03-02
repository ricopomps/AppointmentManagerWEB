import usePaymentTablePreferences from "@/hooks/usePaymentTablePreferences";
import PaymentTableBodySkeleton from "../PaymentTableBodySkeleton";
import PaymentTableFooter from "../PaymentTableFooter";
import PaymentTableHeader from "../PaymentTableHeader";
import PaymentTablePreferencesBody from "./PaymentTablePreferencesBody";

export default function PaymentTablePreferences() {
  const {
    paymentTablePreferences: tablePreferences,
    paymentTablePreferencesLoading: loading,
  } = usePaymentTablePreferences();
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <PaymentTableHeader />
        {loading ? (
          <PaymentTableBodySkeleton numberOfLines={1} />
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
