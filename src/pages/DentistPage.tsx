import { Col, Container, Row } from "react-bootstrap";
import { User } from "../models/user";
import TextInputField from "../components/Form/TextInputField";
import { useEffect, useState } from "react";
import { Clinic } from "../context/SelectedDayContext";
import * as ClinicsApi from "../network/clinicsApi";
import { useForm } from "react-hook-form";
import stylesUtils from "../styles/utils.module.css";
import AppointmentSchedule from "../components/Form/AppointmentSchedule";

interface DentistPageProps {
  loggedDentist: User;
}

const DentistPage = ({ loggedDentist }: DentistPageProps) => {
  const [clinics, setClinics] = useState<Clinic[] | undefined>(undefined);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | undefined>(
    undefined
  );
  useEffect(() => {
    async function fetchClinics() {
      try {
        const clinicsReturn = await ClinicsApi.getClinics();
        setClinics(clinicsReturn);
        if (clinicsReturn) setSelectedClinic(clinicsReturn[0]);
      } catch (error) {}
    }
    fetchClinics();
  }, []);

  const { register } = useForm<any>({
    defaultValues: {
      clinic: clinics?.[0]?._id || "",
      dentist: clinics?.[0].dentists?.[0]?._id || "",
    },
  });
  return (
    <div>
      <Container>
        <Row>
          <Col>Bem vindo {loggedDentist.username}</Col>
          <Col className={stylesUtils.flexCenter}>
            <div>Clinica:</div>
            <div>
              <TextInputField
                name="clinic"
                options={
                  clinics &&
                  clinics.map((clinic) => ({
                    key: clinic.name,
                    value: clinic._id,
                  }))
                }
                margin={false}
                as="select"
                placeholder="Consultório"
                register={register}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const clinic = clinics?.find((c) => c._id === e.target.value);
                  setSelectedClinic(clinic);
                }}
                registerOptions={{ required: "Campo Obrigatório" }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <AppointmentSchedule day={"segunda"} clinic={selectedClinic} />
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
};

export default DentistPage;
