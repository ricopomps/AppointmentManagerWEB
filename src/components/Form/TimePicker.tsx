import { FieldError, UseFormRegister } from "react-hook-form";
import TextInputField from "./TextInputField";
import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";

interface TimePickerProps {
  hourName: string;
  minuteName: string;
  label: string;
  hourError?: FieldError;
  minuteError?: FieldError;
  setValue?: (value: string) => void;
  register: UseFormRegister<any>;
}

const TimePicker = ({
  label,
  setValue,
  register,
  hourError,
  minuteError,
  hourName = "hour",
  minuteName = "minute",
}: TimePickerProps) => {
  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");
  const hours = Array.from({ length: 24 }, (_, index) =>
    index.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, index) =>
    index.toString().padStart(2, "0")
  );
  const updateValue = (hour: string, minute: string) => {
    setHour(hour);
    setMinute(minute);
    setValue && setValue(`${hour}:${minute}`);
  };
  return (
    <>
      <div className="mb-2">{label}</div>
      <Container>
        <Row>
          <Col>
            <TextInputField
              name={hourName}
              options={hours.map((h) => ({
                key: h,
                value: h,
              }))}
              margin={false}
              as="select"
              hasDefaultValue
              register={register}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateValue(e.target.value, minute);
              }}
              registerOptions={{
                required: "Campo Obrigatório",
              }}
              error={hourError}
            />
          </Col>
          <Col>
            <TextInputField
              name={minuteName}
              options={minutes.map((m) => ({
                key: m,
                value: m,
              }))}
              margin={false}
              as="select"
              hasDefaultValue
              register={register}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                updateValue(hour, e.target.value);
              }}
              registerOptions={{ required: "Campo Obrigatório" }}
              error={minuteError}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TimePicker;
