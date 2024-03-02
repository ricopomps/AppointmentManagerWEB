import { UserContext } from "@/context/UserProvider";
import { PaymentTablePreferences } from "@prisma/client";
import { useContext } from "react";
import PaymentTablePreferencesListItem from "./PaymentTablePreferencesListItem";

interface PaymentTablePreferencesBodyProps {
  tablePreferences: PaymentTablePreferences;
  loading: boolean;
}

export default function PaymentTablePreferencesBody({
  tablePreferences,
  loading,
}: PaymentTablePreferencesBodyProps) {
  const { clinic } = useContext(UserContext);
  if (loading)
    return (
      <tbody>
        <tr>
          <td>Loading...</td>
        </tr>
      </tbody>
    );
  if (!clinic)
    return (
      <tbody>
        <tr>
          <td>Nenhuma clínica selecionada</td>
        </tr>
      </tbody>
    );

  return (
    <tbody>
      <PaymentTablePreferencesListItem tablePreferences={tablePreferences} />
    </tbody>
  );
}
