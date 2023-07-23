import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as ClinicsApi from "../../network/ClinicsApi";
import TextInputField from "../Form/TextInputField";
import { Clinic } from "../../context/SelectedDayContext";

interface ClinicEditModalProps {
  clinicToEdit?: Clinic;
  onDismiss: () => void;
  onSaved: (clinic: Clinic) => void;
}

const ClinicEditModal = ({
  clinicToEdit,
  onDismiss,
  onSaved,
}: ClinicEditModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Clinic>({
    defaultValues: {
      name: clinicToEdit?.name || "",
    },
  });

  async function onSubmit(input: Clinic) {
    try {
      let clinicResponse: Clinic;
      if (clinicToEdit) {
        clinicResponse = await ClinicsApi.updateClinic(clinicToEdit._id, input);
      } else {
        clinicResponse = await ClinicsApi.createClinic(input);
      }
      onSaved(clinicResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {clinicToEdit ? "Editar " : "Adicionar "}Clínica
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditClinicForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="name"
            label="Nome"
            type="text"
            placeholder="Nome"
            register={register}
            registerOptions={{ required: "Campo obrigatório" }}
            error={errors.name}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditClinicForm" disabled={isSubmitting}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClinicEditModal;
