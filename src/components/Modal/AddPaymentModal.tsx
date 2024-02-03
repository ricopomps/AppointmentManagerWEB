import { UserContext } from "@/context/UserProvider";
import {
  CreatePaymentSchema,
  createPaymentSchema,
} from "@/lib/validation/payment";
import { Especialidade } from "@/models/especialidade";
import { Pagamento } from "@/models/pagamento";
import { Role } from "@/models/roles";
import { Status } from "@/models/status";
import { createPayment } from "@/network/api/payment";
import { findUsersWithRole } from "@/network/api/user";
import { User } from "@clerk/nextjs/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Payment } from "@prisma/client";
import { X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LoadingButton from "../LoadingButton";

interface AddPaymentModalProps {
  onClose: () => void;
  onAccept: (payment: Payment) => void;
}

export default function AddPaymentModal({
  onClose,
  onAccept,
}: AddPaymentModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {},
  });

  async function onSubmit(data: CreatePaymentSchema) {
    try {
      if (!clinic) throw Error("Clínica obrigatória");
      const response = await createPayment(data, clinic.id);
      onAccept(response);
    } catch (error) {
      console.error(error);
    }
  }

  const expertiseOptions = Object.keys(Especialidade).map((key) => ({
    key: Especialidade[key as keyof typeof Especialidade].toString(),
    value: key,
  }));

  const paymentMethodOptions = Object.keys(Pagamento).map((key) => ({
    key: Pagamento[key as keyof typeof Pagamento].toString(),
    value: key,
  }));

  const statusOptions = Object.keys(Status).map((key) => ({
    key: Status[key as keyof typeof Status].toString(),
    value: key,
  }));
  const { clinic } = useContext(UserContext);

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (clinic) {
          const users = await findUsersWithRole(clinic.id, Role.doctor);
          setUsers(users);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [clinic]);

  return (
    <dialog className={"modal modal-open"}>
      <div className="modal-box">
        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 m-2"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="mb-3 text-lg font-bold">Adicionar pagamento</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Dentista</label>
          {/* <DentistSelector
            register={{
              ...register("pacientName", { required: "Campo obrigatório" }),
            }}
          /> */}
          <select
            {...register("userId", { required: "Campo obrigatório" })}
            className="input input-bordered mb-3 w-full"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {`${user.firstName} ${user.lastName}`}
              </option>
            ))}
          </select>
          {errors.userId && (
            <p className="mb-1 text-red-500">{errors.userId.message}</p>
          )}

          <label>
            Nome do paciente
            <input
              type="text"
              placeholder="Nome do paciente"
              className="input input-bordered mb-3 w-full"
              {...register("pacientName", { required: "Campo obrigatório" })}
            />
          </label>
          {errors.pacientName && (
            <p className="mb-1 text-red-500">{errors.pacientName.message}</p>
          )}

          <label>
            Especialidade
            <select
              {...register("expertise")}
              className="input input-bordered mb-3 w-full"
            >
              {expertiseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
          </label>
          {errors.expertise && (
            <p className="mb-1 text-red-500">{errors.expertise.message}</p>
          )}

          <label>
            Procedimento
            <input
              type="text"
              placeholder="Procedimento"
              className="input input-bordered mb-3 w-full"
              {...register("procedure")}
            />
          </label>
          {errors.procedure && (
            <p className="mb-1 text-red-500">{errors.procedure.message}</p>
          )}

          <label>
            Forma de Pagamento
            <select
              {...register("paymentMethod", { required: "Campo obrigatório" })}
              className="input input-bordered mb-3 w-full"
            >
              {paymentMethodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
          </label>
          {errors.paymentMethod && (
            <p className="mb-1 text-red-500">{errors.paymentMethod.message}</p>
          )}

          <label>
            Valor
            <input
              type="number"
              placeholder="Valor"
              className="input input-bordered mb-3 w-full"
              {...register("value", {
                required: "Campo obrigatório",
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.value && (
            <p className="mb-1 text-red-500">{errors.value.message}</p>
          )}

          <label>
            Custo (Protético)
            <input
              type="number"
              placeholder="Custo (Protético)"
              className="input input-bordered mb-3 w-full"
              {...register("cost", {
                required: "Campo obrigatório",
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.cost && (
            <p className="mb-1 text-red-500">{errors.cost.message}</p>
          )}

          <label>
            Status
            <select
              {...register("status")}
              className="input input-bordered mb-3 w-full"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.key}
                </option>
              ))}
            </select>
          </label>
          {errors.status && (
            <p className="mb-1 text-red-500">{errors.status.message}</p>
          )}

          <label>
            Observação / Procedimentos de Particular
            <input
              type="text"
              placeholder="Observação / Procedimentos de Particular"
              className="input input-bordered mb-3 w-full"
              {...register("observations")}
            />
          </label>
          {errors.observations && (
            <p className="mb-1 text-red-500">{errors.observations.message}</p>
          )}

          <label>
            Data
            <input
              type="date"
              placeholder="Data"
              className="input input-bordered mb-3 w-full"
              lang="pt-br"
              {...register("paymentDate", {
                required: "Campo obrigatório",
                valueAsDate: true,
              })}
            />
          </label>
          {errors.paymentDate && (
            <p className="mb-1 text-red-500">{errors.paymentDate.message}</p>
          )}

          <LoadingButton loading={isSubmitting}>Adicionar</LoadingButton>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default" onClick={onClose} />
      </form>
    </dialog>
  );
}
