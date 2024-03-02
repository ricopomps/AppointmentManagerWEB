import { UserContext } from "@/context/UserProvider";
import { handleError } from "@/lib/utils";
import { updatePaymentTablePreferences } from "@/network/api/paymentTablePreferences";
import { PaymentTablePreferences } from "@prisma/client";
import { useContext, useState } from "react";

interface PaymentTablePreferencesListItemProps {
  tablePreferences: PaymentTablePreferences;
}

export default function PaymentTablePreferencesListItem({
  tablePreferences: initialTablePreferences,
}: PaymentTablePreferencesListItemProps) {
  const { clinic } = useContext(UserContext);
  const [tablePreferences, setTablePreferences] =
    useState<PaymentTablePreferences>(initialTablePreferences);

  function handleToggleActiveWrapper(key: keyof PaymentTablePreferences) {
    return function handleToggleActive(value: PreferencesOptions) {
      if (value === PreferencesOptions.ACTIVE) {
        setTablePreferences({ ...tablePreferences, [key]: true });
      } else {
        setTablePreferences({ ...tablePreferences, [key]: false });
      }
    };
  }

  async function handleSubmit() {
    try {
      console.log("tablePreferences", tablePreferences);
      if (!clinic) throw Error("Clínica não selecionada");
      const returno = await updatePaymentTablePreferences(
        clinic.id,
        tablePreferences,
      );
      console.log("returno", returno);
    } catch (error) {
      handleError(error);
    }
  }

  function defaultValue(value?: boolean | null) {
    if (value === false) {
      return PreferencesOptions.INACTIVE;
    } else {
      return PreferencesOptions.ACTIVE;
    }
  }

  return (
    <tr className="hover:bg-white/20">
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem
          onChange={handleToggleActiveWrapper("hasSpecialty")}
          defaultValue={defaultValue(tablePreferences.hasSpecialty)}
        />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem
          onChange={handleToggleActiveWrapper("hasPaymentMethod")}
          defaultValue={defaultValue(tablePreferences.hasPaymentMethod)}
        />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <PaymentTablePreferencesItem disabled />
      </td>
      <td>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Salvar
        </button>
      </td>
    </tr>
  );
}

enum PreferencesOptions {
  ACTIVE = "Ativo",
  INACTIVE = "Inativo",
}

interface PaymentTablePreferencesItemProps {
  onChange?: (value: PreferencesOptions) => void;
  disabled?: boolean;
  defaultValue?: PreferencesOptions;
}

function PaymentTablePreferencesItem({
  disabled,
  onChange,
  defaultValue,
}: PaymentTablePreferencesItemProps) {
  return (
    <select
      disabled={disabled}
      defaultValue={defaultValue}
      onChange={(e) =>
        onChange && onChange(e.target.value as PreferencesOptions)
      }
      className="input input-bordered w-full min-w-24"
    >
      {(
        Object.keys(PreferencesOptions) as Array<
          keyof typeof PreferencesOptions
        >
      ).map((key) => (
        <option key={key} value={PreferencesOptions[key]}>
          {PreferencesOptions[key]}
        </option>
      ))}
    </select>
  );
}
