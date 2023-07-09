import { Card, Container, Row, Col } from "react-bootstrap";
import styles from "../styles/AppointmentSelector.module.css";
import TextInputField from "./Form/TextInputField";
import { useForm } from "react-hook-form";
import { useSelectedDay } from "../context/SelectedDayContext";

interface AppointmentSelectorForm {
  clinic: string;
  dentist: string;
}
const AppointmentSelector = () => {
  const { selectedClinic, selectedDentist } = useSelectedDay();
  console.log("selectedClinic", selectedClinic);
  const {
    register,
    formState: { errors },
  } = useForm<AppointmentSelectorForm>({
    defaultValues: {
      clinic: selectedClinic?._id || "",
      dentist: selectedDentist?._id || "",
    },
  });
  return (
    <Card className={styles.selector}>
      <Container>
        <Row>
          <Col>
            <TextInputField
              name="clinic"
              label="Consultório"
              options={[
                { key: "consultorio 1", value: "1" },
                { key: "consultorio 2", value: "2" },
              ]}
              as="select"
              placeholder="Consultório"
              register={register}
              onChange={() => console.log(selectedClinic)}
              registerOptions={{ required: "Campo Obrigatório" }}
              error={errors.clinic}
            />
          </Col>
          <Col>
            <TextInputField
              name="dentist"
              label="Dentista"
              as="select"
              options={[
                { key: "dentista 1", value: "1" },
                { key: "dentista 2", value: "2" },
              ]}
              placeholder="Dentista"
              register={register}
              onChange={() => console.log("change")}
              registerOptions={{ required: "Campo Obrigatório" }}
              error={errors.dentist}
            />
          </Col>
        </Row>
      </Container>
    </Card>
  );
};

export default AppointmentSelector;
