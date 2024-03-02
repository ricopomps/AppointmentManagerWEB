import { PaymentTablePreferences } from "@prisma/client";

interface PaymentTableFooterProps {
  preferences?: PaymentTablePreferences;
}

export default function PaymentTableFooter({
  preferences,
}: PaymentTableFooterProps) {
  function showColumn(preference?: boolean | null) {
    if (preference === false) return false;
    return true;
  }

  return (
    <tfoot>
      <tr>
        <th className="text-warning">Data</th>
        <th className="text-warning">Nome do Paciente</th>
        {showColumn(preferences?.hasSpecialty) && (
          <th className="text-warning">Especialidade</th>
        )}
        <th className="text-warning">Procedimento</th>
        {showColumn(preferences?.hasPaymentMethod) && (
          <th className="text-warning">Forma de Pagamento</th>
        )}
        <th className="text-warning">Valor</th>
        <th className="text-warning">Custo (Protético)</th>
        <th className="text-warning">Subtotal</th>
        <th className="text-warning">60%</th>
        <th className="text-warning">40%</th>
        <th className="text-warning">Status</th>
        <th className="text-warning">
          Observação / Procedimentos de Particular
        </th>
        <th className="text-warning">Opções</th>
      </tr>
    </tfoot>
  );
}
