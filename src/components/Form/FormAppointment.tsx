import { Alert, Button, Card, Form } from "react-bootstrap";
import TextInputField from "./TextInputField";
import { useForm } from "react-hook-form";
import stylesUtils from "../../styles/utils.module.css";
import { AppointmentForm } from "../../network/notes_api";
import { UnathorizedError } from "../../errors/http_errors";
import { useState } from "react";
import PhoneInputField from "./PhoneInputField";
interface FormAppointmentProps {}

const FormAppointment = ({}: FormAppointmentProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentForm>();
  async function onSubmit(credentials: AppointmentForm) {
    try {
      console.log(credentials);
    } catch (error) {
      if (error instanceof UnathorizedError) setErrorText(error.message);
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
            placeholder="Usuário"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.name}
          />
          <TextInputField
            name="email"
            label="E-mail"
            type="text"
            placeholder="Senha"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.email}
          />
          <TextInputField
            name="cpf"
            label="Cpf"
            type="text"
            placeholder="Usuário"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
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
