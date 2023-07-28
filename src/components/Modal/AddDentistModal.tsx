import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../Form/TextInputField";
import { Clinic, Dentist } from "../../context/SelectedDayContext";
import * as UsersApi from "../../network/usersApi";
import * as ClinicsApi from "../../network/clinicsApi";
import { useEffect, useState } from "react";
import { User } from "../../models/user";
import { toast } from "react-toastify";

interface AddDentistModalProps {
  clinicId: string;
  onDismiss: () => void;
  onSaved: (clinic: Clinic) => void;
}

const AddDentistModal = ({
  clinicId,
  onDismiss,
  onSaved,
}: AddDentistModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Dentist>({
    defaultValues: {},
  });

  const [dentists, setDentists] = useState<User[] | null>(null);

  useEffect(() => {
    async function fetchDentists() {
      try {
        const users = await UsersApi.getDentists();
        setDentists(users);
      } catch (error) {}
    }
    fetchDentists();
  }, []);

  async function onSubmit(input: Dentist) {
    try {
      if (!input._id) throw Error("Selecione um usuário");
      const updatedClinic = await ClinicsApi.addUserToClinic(
        clinicId,
        input._id
      );
      onSaved(updatedClinic);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.error);
      //   alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Adicionar Dentista</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditDentistForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="_id"
            label="Dentista"
            type="text"
            as="select"
            options={dentists?.map((d) => {
              return { key: d.username, value: d._id! };
            })}
            hasDefaultValue
            placeholder="Selecione um dentista"
            register={register}
            registerOptions={{ required: "Campo obrigatório" }}
            error={errors._id}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditDentistForm" disabled={isSubmitting}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDentistModal;
