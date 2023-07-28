import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Container, Row, Col } from "react-bootstrap";
import styles from "../styles/AppointmentSelector.module.css";
import TextInputField from "./Form/TextInputField";
import { Clinic, Dentist, useSelectedDay } from "../context/SelectedDayContext";
import * as ClinicsApi from "../network/clinicsApi";

interface AppointmentSelectorForm {
  clinic: string;
  dentist: string;
}
const AppointmentSelector = () => {
  const { setSelectedClinic, setSelectedDentist } = useSelectedDay();
  const [clinics, setClinics] = useState<Clinic[] | undefined>(undefined);
  const [dentists, setDentists] = useState<Dentist[] | undefined>(undefined);
  useEffect(() => {
    async function fetchClinics() {
      try {
        const clinicsReturn = await ClinicsApi.getClinics();
        setClinics(clinicsReturn);
        setDentists(clinicsReturn?.[0].dentists);
        setValue("clinic", clinicsReturn?.[0]?._id || "");
        setSelectedClinic(clinicsReturn?.[0]);
        setValue("dentist", clinicsReturn?.[0].dentists?.[0]?._id || "");
        setSelectedDentist(clinicsReturn?.[0].dentists?.[0]);
      } catch (error) {}
    }
    fetchClinics();
  }, []);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<AppointmentSelectorForm>({
    defaultValues: {
      clinic: clinics?.[0]?._id || "",
      dentist: clinics?.[0].dentists?.[0]?._id || "",
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
              options={
                clinics &&
                clinics.map((clinic) => ({
                  key: clinic.name,
                  value: clinic._id,
                }))
              }
              as="select"
              placeholder="Consultório"
              register={register}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const clinic = clinics?.find((c) => c._id === e.target.value);
                setDentists(clinic?.dentists);
                setSelectedClinic(clinic);
                setSelectedDentist(clinic?.dentists?.[0]);
              }}
              registerOptions={{ required: "Campo Obrigatório" }}
              error={errors.clinic}
            />
          </Col>
          <Col>
            <TextInputField
              name="dentist"
              label="Dentista"
              as="select"
              options={
                dentists &&
                dentists.map((dentist) => ({
                  key: dentist.username,
                  value: dentist._id,
                }))
              }
              placeholder="Dentista"
              register={register}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setSelectedDentist(
                  dentists?.filter((d) => d._id === e.target.value)?.[0]
                );
              }}
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
