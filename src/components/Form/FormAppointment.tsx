import { Alert, Button, Card, Form } from "react-bootstrap";
import TextInputField from "./TextInputField";
import { useForm } from "react-hook-form";
import stylesUtils from "../../styles/utils.module.css";
import { AppointmentForm } from "../../network/AppointmentApi";
import { UnathorizedError } from "../../errors/http_errors";
import { useState } from "react";
import PhoneInputField from "./PhoneInputField";
import { useSelectedDay } from "../../context/SelectedDayContext";
import * as AppointmentApi from "../../network/AppointmentApi";

interface FormAppointmentProps {
  refresh: () => void;
}

const FormAppointment = ({ refresh }: FormAppointmentProps) => {
  const { selectedDay, clearSelectedDay } = useSelectedDay();
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentForm>();
  async function onSubmit(credentials: AppointmentForm) {
    try {
      setErrorText(null);
      if (!selectedDay) throw Error("Selecione uma data");
      await AppointmentApi.appoint({
        appointmentForm: { ...credentials, ...selectedDay },
      });
      refresh();
      clearSelectedDay();
    } catch (error) {
      if (error instanceof UnathorizedError) setErrorText(error.message);
      else if (error instanceof Error) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Realizar agendamento</Card.Title>
      </Card.Header>
      <Card.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="name"
            label="Nome"
            type="text"
            placeholder="Nome"
            register={register}
            registerOptions={{
              required: "Campo Obrigatório",
              validate: {
                minLength: (n) => n.length > 4 || "Nome muito curto",
                matchPattern: (n) => /^[A-Za-z]+$/.test(n) || "Nome inválido",
              },
            }}
            error={errors.name}
          />
          <TextInputField
            name="email"
            label="E-mail"
            type="text"
            placeholder="E-mail"
            register={register}
            registerOptions={{
              required: "Campo Obrigatório",
              validate: {
                maxLength: (v) =>
                  v.length <= 50 || "O Email pode ter até apenas 50 caracteres",
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                  "Email inválido",
              },
            }}
            error={errors.email}
          />

          <TextInputField
            name="cpf"
            label="Cpf"
            type="text"
            placeholder="Cpf"
            register={register}
            registerOptions={{
              required: "Campo Obrigatório",
              validate: {
                matchPattern: (c) =>
                  /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/.test(
                    c
                  ) || "Cpf inválido",
              },
            }}
            error={errors.cpf}
          />
          <PhoneInputField
            control={control}
            error={errors.phone}
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
          />
          <br />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={stylesUtils.width100}
          >
            Agendar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormAppointment;
