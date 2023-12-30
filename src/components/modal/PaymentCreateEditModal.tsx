import { Especialidade, Pagamento, Status } from "@/app/page";
import * as UsersApi from "@/network/api/user";
import { UnauthorizedError } from "@/network/http-errors";
import { handleError } from "@/utils/utils";
import { requiredStringSchema } from "@/utils/validation";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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

export default function PaymentCreateEditModal({
  onDismiss,
  paymentToEdit,
  updateEdit,
}: PaymentCreateEditModalProps) {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Payment>({
    defaultValues: {
      cost: 0,
      ...paymentToEdit,
    },
  });

  async function onSubmit(formData: Payment) {
    try {
      console.log(formData);
      if (paymentToEdit) {
        const payment = await UsersApi.updatePayment(
          paymentToEdit.id,
          formData
        );
        console.log("payment", payment);
        updateEdit(payment);
      } else {
        const payment = await UsersApi.createPayment(formData);
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
  const ExpertiseOptions = Object.keys(Especialidade).map((key) => ({
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
            hasDefaultValue={true}
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
            defaulValue={format(new Date(), "yyyy-MM-dd", { locale: ptBR })}
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
