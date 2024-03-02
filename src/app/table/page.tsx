"use client";
import PaymentTablePreferences from "@/components/PaymentTable/PreferencesTable/PaymentTablePreferences";
import usePaymentTablePreferences from "@/hooks/usePaymentTablePreferences";

export default function TablePreferencesPage() {
  const { paymentTablePreferences, paymentTablePreferencesLoading } =
    usePaymentTablePreferences();
  return (
    <main className="m-auto min-w-[300px] max-w-full p-4 md:p-16 md:pt-4">
      <PaymentTablePreferences
        loading={paymentTablePreferencesLoading}
        tablePreferences={paymentTablePreferences}
      />
    </main>
  );
}
