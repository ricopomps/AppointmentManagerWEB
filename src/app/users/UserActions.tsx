import AddUserModal from "@/components/Modal/AddUserModal";
import AlertModal from "@/components/Modal/AlertModal";
import { UserContext } from "@/context/UserProvider";
import useFindUsers from "@/hooks/useFindUsersByClinic";
import { handleError } from "@/lib/utils";
import { removeFromClinic } from "@/network/api/user";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { SquarePen, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

interface UserActionsProps {
  user: User;
}

export default function UserActions({ user }: UserActionsProps) {
  const { user: loggedUser } = useUser();
  const { clinic } = useContext(UserContext);
  const { users, mutateUsers } = useFindUsers();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);

  async function deleteUser() {
    try {
      console.log("deleteUser", { userId: user.id, clinicId: clinic?.id });
      if (!clinic) throw new Error("No clinic");
      await removeFromClinic({ userId: user.id, clinicId: clinic.id });
      mutateUsers(users.filter((existingUser) => existingUser.id !== user.id));
      toast.warning("Usuário removido com sucesso!");
    } catch (error) {
      handleError(error);
    }
  }

  function updateUser(updatedUser: User) {
    mutateUsers(
      users.map((existingUser) =>
        existingUser.id === user.id ? updatedUser : existingUser,
      ),
    );
    setOpenEditUserModal(false);
    toast.success("Usuário editado com sucesso!");
  }

  return (
    <div>
      <div className="dropdown dropdown-end dropdown-top">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
          Ações
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1] w-fit rounded-box bg-secondary p-2 shadow"
        >
          <div className="flex items-center justify-between gap-6">
            <div className="tooltip" data-tip="Editar usuário">
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setOpenEditUserModal(true)}
              >
                <SquarePen size={16} />
              </button>
            </div>
            <div className="tooltip" data-tip="Remover usuário">
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setOpenAlertModal(true)}
                disabled={loggedUser?.id === user.id}
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </ul>
      </div>
      <AlertModal
        isOpen={openAlertModal}
        title="Excluir usuário"
        description="Deseja excluir esse usuário? Essa ação não pode ser revertida"
        acceptButtonText="Excluir"
        cancelButtonText="Cancelar"
        acceptButtonClassName="btn-error"
        cancelButtonClassName="btn-ghost"
        onClose={() => {
          setOpenAlertModal(false);
        }}
        onAccept={async () => {
          await deleteUser();
          setOpenAlertModal(false);
        }}
      />
      {openEditUserModal && (
        <AddUserModal
          userToEdit={user}
          onAccept={updateUser}
          onClose={() => setOpenEditUserModal(false)}
        />
      )}
    </div>
  );
}
