import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { RiFilterFill, RiFilterLine } from "react-icons/ri";
import TextInputField from "./TextInputField";
import stylesUtils from "../../styles/utils.module.css";
import { findAppointmentsForm } from "../../network/AppointmentApi";
import * as ClinicsApi from "../../network/ClinicsApi";
import { Clinic, Dentist } from "../../context/SelectedDayContext";
interface FormAppointmentListProps {
  onSubmit: (filter: findAppointmentsForm) => void;
}

interface filterForm {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  startDate: Date;
  endDate: Date;
  clinicId: string;
  dentistId: string;
}

const FormAppointmentList = ({ onSubmit }: FormAppointmentListProps) => {
  const [filter, setFilter] = useState(false);
  const [disableDentist, setDisableDentist] = useState(true);
  const [clinics, setClinics] = useState<Clinic[] | undefined>(undefined);
  const [dentists, setDentists] = useState<Dentist[] | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<filterForm>();
  const changeFilter = () => {
    reset();
    setDisableDentist(true);
    setFilter(!filter);
  };
  useEffect(() => {
    async function fetchClinics() {
      try {
        const clinicsReturn = await ClinicsApi.getClinics();
        setClinics(clinicsReturn);
        setDentists(clinicsReturn?.[0].dentists);
      } catch (error) {}
    }
    fetchClinics();
  }, []);
  useEffect(() => {}, []);
  return (
    <Card>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            {filter ? (
              <RiFilterFill size={25} onClick={() => changeFilter()} />
            ) : (
              <RiFilterLine size={25} onClick={() => changeFilter()} />
            )}
            {filter && (
              <>
                <Row>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="name"
                      label="Nome"
                      type="text"
                      placeholder="Nome"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="email"
                      label="E-mail"
                      type="text"
                      placeholder="E-mail"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="cpf"
                      label="Cpf"
                      type="text"
                      placeholder="Cpf"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="phone"
                      label="Telefone"
                      type="text"
                      placeholder="Telefone"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="startDate"
                      label="Data inicio"
                      type="date"
                      placeholder="Data inicio"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="endDate"
                      label="Data fim"
                      type="date"
                      placeholder="Data fim"
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="clinicId"
                      label="Consultório"
                      options={clinics?.map((clinic) => ({
                        key: clinic.name,
                        value: clinic._id,
                      }))}
                      as="select"
                      placeholder="Selecione uma clinica"
                      hasDefaultValue
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const disable = !e.target.value;
                        setDisableDentist(disable);
                        if (disable) setValue("dentistId", "");
                      }}
                      register={register}
                    />
                  </Col>
                  <Col xs={6} md={4}>
                    <TextInputField
                      name="dentistId"
                      label="Dentista"
                      options={dentists?.map((dentist) => ({
                        key: dentist.username,
                        value: dentist._id,
                      }))}
                      as="select"
                      placeholder="Selecione um dentista"
                      hasDefaultValue
                      disabled={disableDentist}
                      register={register}
                    />
                  </Col>
                </Row>
                <br />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={stylesUtils.width100}
                >
                  Pesquisar
                </Button>
              </>
            )}
          </Container>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormAppointmentList;
