import * as UsersApi from "@/network/api/user";
import { UnauthorizedError } from "@/network/http-errors";
import { handleError } from "@/utils/utils";
import { requiredStringSchema } from "@/utils/validation";
import { Payment } from "@prisma/client";
import { format, parse } from "date-fns";
import { useState } from "react";
import { Alert, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import LoadingButton from "../LoadingButton";
import FormInputField from "../form/FormInputField";

const validationSchema = yup.object({
  username: requiredStringSchema,
  password: requiredStringSchema,
});

type LoginFormData = yup.InferType<typeof validationSchema>;
interface PaymentCreateEditModalProps {
  onDismiss: () => void;
  updateEdit: (payment: Payment) => void;
  paymentToEdit?: Payment;
}
type PaymentFormData = Omit<Payment, "createdAt"> & {
  createdAt: string;
};
export default function PaymentCreateEditModal({
  onDismiss,
  paymentToEdit,
  updateEdit,
}: PaymentCreateEditModalProps) {
  console.log(paymentToEdit);
  const [errorText, setErrorText] = useState<string | null>(null);
  const guy = format(new Date(), "yyyy-MM-dd");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    defaultValues: {
      cost: 0,
      ...paymentToEdit,
      createdAt: paymentToEdit?.createdAt
        ? format(
            parse(
              paymentToEdit.createdAt.toString(),
              "yyyy-MM-dd'T'HH:mm:ss.SSSX",
              new Date()
            ),
            "yyyy-MM-dd"
          )
        : format(new Date(), "yyyy-MM-dd"),
    },
  });

  async function onSubmit(formData: PaymentFormData) {
    try {
      console.log(formData);
      if (paymentToEdit) {
        const payment = await UsersApi.updatePayment(paymentToEdit.id, {
          ...formData,
          createdAt: parse(formData.createdAt, "yyyy-MM-dd", new Date()),
        });
        console.log("payment", payment);
        updateEdit(payment);
      } else {
        const payment = await UsersApi.createPayment({
          ...formData,
          createdAt: parse(formData.createdAt, "yyyy-MM-dd", new Date()),
        });
        updateEdit(payment);
      }
      toast.success(
        `Pagamento ${paymentToEdit ? "alterado" : "criado"} com sucesso`
      );

      onDismiss();
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedError) {
        setErrorText("Invalid credentials"); //change passport js to send the message
      } else {
        handleError(error);
      }
    }
  }
  const ExpertiseOptions = Object.keys(UsersApi.Especialidade).map((key) => ({
    key: UsersApi.Especialidade[
      key as keyof typeof UsersApi.Especialidade
    ].toString(),
    value: key,
  }));

  const paymentMethodOptions = Object.keys(UsersApi.Pagamento).map((key) => ({
    key: UsersApi.Pagamento[key as keyof typeof UsersApi.Pagamento].toString(),
    value: key,
  }));

  const statusOptions = Object.keys(UsersApi.Status).map((key) => ({
    key: UsersApi.Status[key as keyof typeof UsersApi.Status].toString(),
    value: key,
  }));

  const dentistasOptions = [
    { key: "Renata", value: "64ab18249dff233e74f2be51" },
    { key: "Natália", value: "648a454d532dcd711b38d4ee" },
    { key: "Júlia", value: "64ab23662cdbdb203b94421f" },
  ];

  return (
    <Modal onHide={onDismiss} centered show>
      <Modal.Header closeButton>
        <Modal.Title>
          {paymentToEdit ? "Editar" : "Adicionar"} Pagamento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInputField
            register={register("userId", { required: "Campo obrigatório" })}
            as="select"
            hasDefaultValue
            options={dentistasOptions}
            label="Dentista"
            placeholder="Dentista"
            error={errors.userId}
          />
          <FormInputField
            register={register("pacientName", {
              required: "Campo obrigatório",
            })}
            label="Nome do paciente"
            placeholder="Nome do paciente"
            error={errors.pacientName}
          />
          <FormInputField
            register={register("expertise")}
            as="select"
            options={ExpertiseOptions}
            label="Especialidade"
            placeholder="Especialidade"
            error={errors.expertise}
          />
          <FormInputField
            register={register("procedure")}
            label="Procedimento"
            placeholder="Procedimento"
            error={errors.procedure}
          />
          <FormInputField
            register={register("paymentMethod", {
              required: "Campo obrigatório",
            })}
            as="select"
            hasDefaultValue
            options={paymentMethodOptions}
            label="Forma de Pagamento"
            placeholder="Forma de Pagamento"
            error={errors.paymentMethod}
          />
          <FormInputField
            register={register("value", {
              required: "Campo obrigatório",
            })}
            type="number"
            label="Valor"
            placeholder="Valor"
            error={errors.value}
          />
          <FormInputField
            register={register("cost", { required: "Campo obrigatório" })}
            label="Custo (Protético)"
            type="number"
            placeholder="Custo (Protético)"
            error={errors.cost}
          />
          <FormInputField
            register={register("status")}
            as="select"
            options={statusOptions}
            label="Status"
            placeholder="Status"
            error={errors.status}
          />
          <FormInputField
            register={register("observations")}
            label="Observação / Procedimentos de Particular"
            placeholder="Observação / Procedimentos de Particular"
            error={errors.observations}
          />
          <FormInputField
            register={register("createdAt", { required: "Campo obrigatório" })}
            label="Data"
            type="date"
            placeholder="Data"
            lang="pt-br"
            error={errors.createdAt}
          />
          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            className="w-100"
          >
            {paymentToEdit ? "Editar" : "Adicionar"}
          </LoadingButton>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
