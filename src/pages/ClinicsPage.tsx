import { useEffect, useState } from "react";
import { BiClinic } from "react-icons/bi";
import { FaUserMd } from "react-icons/fa";
import { AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import * as ClinicApi from "../network/ClinicsApi";
import { Clinic, Dentist } from "../context/SelectedDayContext";
import styles from "../styles/ClinicsPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import ClinicEditModal from "../components/Modal/ClinicEditModal";

interface ClinicsPageProps {}

interface ClinicGroupItemProps {
  clinic: Clinic;
  index: number;
}

interface DentistGroupItemProps {
  dentists?: Dentist[];
}

const ClinicsPage = ({}: ClinicsPageProps) => {
  const [clinics, setClinics] = useState<Clinic[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [clinicToEdit, setClinicToEdit] = useState<Clinic | undefined>(
    undefined
  );
  const [showAddDentistDialog, setShowAddDentistDialog] = useState(false);
  useEffect(() => {
    async function findAppointments() {
      try {
        const clinics = await ClinicApi.getClinics();
        setClinics(clinics);
      } catch (error) {
        console.error(error);
      }
    }
    findAppointments();
  }, []);
  const onClick = (index: number) => {
    if (index === selected) return setSelected(null);
    setSelected(index);
  };

  const ClinicGroupItem = ({ clinic, index }: ClinicGroupItemProps) => {
    const active = selected === index;
    return (
      <>
        <ListGroupItem active={active} onClick={() => onClick(index)}>
          <Container>
            <Row>
              <Col>
                <BiClinic className={styles.iconSpacer} size={30} />
                {clinic.name}
              </Col>
              <Col className={stylesUtils.flexEnd}>
                <AiFillPlusCircle
                  onClick={() => setShowAddClinicDialog(true)}
                  className={styles.plusIcon}
                  size={30}
                />
                <AiOutlineEdit
                  onClick={() => setClinicToEdit(clinic)}
                  size={30}
                />
              </Col>
            </Row>
          </Container>
        </ListGroupItem>
        {active && <DentistGroupItem dentists={clinic.dentists} />}
      </>
    );
  };

  const DentistGroupItem = ({ dentists }: DentistGroupItemProps) => {
    return (
      <Container className={styles.dentistGroup}>
        <ListGroup>
          {dentists?.map((dentist, index) => (
            <ListGroupItem key={index}>
              <FaUserMd className={styles.iconSpacer} size={30} />
              {dentist.username}
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
    );
  };

  return (
    <>
      <ListGroup>
        {clinics?.map((clinic, index) => (
          <ClinicGroupItem key={index} clinic={clinic} index={index} />
        ))}
      </ListGroup>
      {showAddClinicDialog && (
        <ClinicEditModal
          onDismiss={() => setShowAddClinicDialog(false)}
          onSaved={(newClinic) => {
            if (clinics === null) setClinics([newClinic]);
            else setClinics([...clinics, newClinic]);
            setShowAddClinicDialog(false);
          }}
        />
      )}
      {clinicToEdit && (
        <ClinicEditModal
          onDismiss={() => setClinicToEdit(undefined)}
          clinicToEdit={clinicToEdit}
          onSaved={(updatedClinic) => {
            setClinics(
              clinics &&
                clinics.map((existingClinic) =>
                  existingClinic._id === updatedClinic._id
                    ? updatedClinic
                    : existingClinic
                )
            );
            setClinicToEdit(undefined);
          }}
        />
      )}
    </>
  );
};

export default ClinicsPage;
