import { Alert, Button, Card, Form } from "react-bootstrap";
import TextInputField from "./TextInputField";
import { useForm } from "react-hook-form";
import stylesUtils from "../../styles/utils.module.css";
import { UnathorizedError } from "../../errors/http_errors";
import { useState } from "react";
import { Clinic } from "../../context/SelectedDayContext";
import { toast } from "react-toastify";
import TimePicker from "./TimePicker";

interface AppointmentScheduleProps {
  clinic?: Clinic;
  day: string;
}

interface AppointmentScheduleForm {
  day: string;
  appointmentHourTime: number;
  initialHourTime: string;
  endHourTime: string;
  initialBreakHourTime: string;
  endBreakHourTime: string;
  initialMinuteTime: string;
  endMinuteTime: string;
  initialBreakMinuteTime: string;
  endBreakMinuteTime: string;
  time: string;
  clinic?: Clinic;
}

const AppointmentSchedule = ({ clinic, day }: AppointmentScheduleProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentScheduleForm>();

  async function onSubmit(credentials: AppointmentScheduleForm) {
    try {
      credentials.clinic = clinic;
      credentials.day = day;
      toast.success(JSON.stringify(credentials));
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
        <Card.Title>Definir horário para o dia: {day}</Card.Title>
      </Card.Header>
      <Card.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="appointmentHourTime"
            label="Tempo por consulta (minutos)"
            type="number"
            placeholder="Nome"
            register={register}
            registerOptions={{
              required: "Campo Obrigatório",
              validate: {
                maxLength: (v) => v.length <= 4 || "Tempo muito grande",
              },
            }}
            error={errors.appointmentHourTime}
          />
          <TimePicker
            hourName="initialHourTime"
            minuteName="initialMinuteTime"
            register={register}
            label="Horário de início"
            hourError={errors.initialHourTime}
            minuteError={errors.initialMinuteTime}
          />
          <TimePicker
            hourName="endHourTime"
            minuteName="endMinuteTime"
            register={register}
            label="Horário de fim"
            hourError={errors.endHourTime}
            minuteError={errors.endMinuteTime}
          />
          <TimePicker
            hourName="initialBreakHourTime"
            minuteName="initialBreakMinuteTime"
            register={register}
            label="Horário de início do almoço"
            hourError={errors.initialBreakHourTime}
            minuteError={errors.initialBreakMinuteTime}
          />
          <TimePicker
            hourName="endBreakHourTime"
            minuteName="endBreakMinuteTime"
            register={register}
            label="Horário de fim do almoço"
            hourError={errors.endBreakHourTime}
            minuteError={errors.endBreakMinuteTime}
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

export default AppointmentSchedule;
