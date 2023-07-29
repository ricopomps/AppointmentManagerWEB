import { useEffect, useState } from "react";
import { BiClinic } from "react-icons/bi";
import { FaUserMd } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AiFillPlusCircle, AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import * as ClinicApi from "../network/clinicsApi";
import { Clinic, Dentist } from "../context/SelectedDayContext";
import styles from "../styles/ClinicsPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import ClinicEditModal from "../components/Modal/ClinicEditModal";
import AddDentistModal from "../components/Modal/AddDentistModal";
import AlertModal from "../components/Modal/AlertModal";

interface ClinicsPageProps {}

interface ClinicGroupItemProps {
  clinic: Clinic;
  index: number;
}

interface DentistGroupProps {
  dentists?: Dentist[];
  clinic: Clinic;
}
interface DentistGroupItemProps {
  dentist: Dentist;
  clinic: Clinic;
}
const ClinicsPage = ({}: ClinicsPageProps) => {
  const [clinics, setClinics] = useState<Clinic[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAddClinicDialog, setShowAddClinicDialog] = useState(false);
  const [clinicToEdit, setClinicToEdit] = useState<Clinic | undefined>(
    undefined
  );
  const [showAddDentistDialog, setShowAddDentistDialog] = useState(false);
  const [clinicId, setClinicId] = useState<string>("");

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
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelected(index);
                    setClinicId(clinicId);
                    setShowAddDentistDialog(true);
                  }}
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
        {active && <DentistGroup dentists={clinic.dentists} clinic={clinic} />}
        {showAddDentistDialog && active && (
          <AddDentistModal
            clinicId={clinic._id}
            onDismiss={() => setShowAddDentistDialog(false)}
            onSaved={(updatedClinic) => {
              setClinics(
                clinics &&
                  clinics.map((existingClinic) =>
                    existingClinic._id === updatedClinic._id
                      ? updatedClinic
                      : existingClinic
                  )
              );
              setShowAddDentistDialog(false);
              toast.success("Dentista adicionado com sucesso");
            }}
          />
        )}
      </>
    );
  };

  const DentistGroup = ({ dentists, clinic }: DentistGroupProps) => {
    return (
      <Container className={styles.dentistGroup}>
        <ListGroup>
          {dentists?.map((dentist, index) => (
            <DentistGroupItem dentist={dentist} clinic={clinic} key={index} />
          ))}
        </ListGroup>
      </Container>
    );
  };

  const DentistGroupItem = ({ dentist, clinic }: DentistGroupItemProps) => {
    const [showRemoveDentistDialog, setShowRemoveDentistDialog] =
      useState(false);

    async function onRemoveDentistSucess(clinicId: string, dentistId: string) {
      try {
        if (!dentistId) throw Error("Selecione um usuário");
        const updatedClinic = await ClinicApi.removeUserFromClinic(
          clinicId,
          dentistId
        );
        setClinics(
          clinics &&
            clinics.map((existingClinic) =>
              existingClinic._id === updatedClinic._id
                ? updatedClinic
                : existingClinic
            )
        );
        setShowRemoveDentistDialog(false);
        toast.success("Dentista removido com sucesso");
      } catch (error: any) {
        console.error(error);
        toast.error(error.response.data.error);
      }
    }
    return (
      <ListGroupItem>
        <Container>
          <Row>
            <Col>
              <FaUserMd className={styles.iconSpacer} size={30} />
              {dentist.username}
            </Col>
            <Col className={stylesUtils.flexEnd}>
              <MdOutlineDelete
                className={stylesUtils.dangerColor}
                onClick={() => setShowRemoveDentistDialog(true)}
                size={30}
              />
            </Col>
            {showRemoveDentistDialog && (
              <AlertModal
                title="Remover dentista"
                message={`Tem certeza que deseja remover o dentista "${dentist.username}" da clínica "${clinic.name}"?`}
                acceptText="Remover"
                dismissText="Cancelar"
                acceptButtonVariant="danger"
                onAccepted={async () => {
                  await onRemoveDentistSucess(clinic._id, dentist._id);
                }}
                onDismiss={() => setShowRemoveDentistDialog(false)}
              />
            )}
          </Row>
        </Container>
      </ListGroupItem>
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
            toast.success("Clínica adicionada com sucesso");
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
            toast.success("Clínica alterada com sucesso");
          }}
        />
      )}
    </>
  );
};

export default ClinicsPage;
