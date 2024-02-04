import useFindDentists from "@/hooks/useFindDentists";
import { UseFormRegisterReturn } from "react-hook-form";

interface DentistSelectorProps {
  register: UseFormRegisterReturn;
}
export default function DentistSelector({ register }: DentistSelectorProps) {
  const { dentists } = useFindDentists();

  return (
    <select {...register} className="input input-bordered mb-3 w-full">
      <option hidden value="" defaultValue="">
        Selecione um dentista
      </option>
      {dentists.map((dentist) => (
        <option key={dentist.id} value={dentist.id}>
          {`${dentist.firstName} ${dentist.lastName}`}
        </option>
      ))}
    </select>
  );
}
