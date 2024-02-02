import AlertModal from "@/components/Modal/AlertModal";
import { Mail, Trash } from "lucide-react";
import { useState } from "react";

interface UserActionsProps {
  userId: string;
  removeUser: (userId: string) => void;
}

export default function UserActions({ userId, removeUser }: UserActionsProps) {
  const [openAlertModal, setOpenAlertModal] = useState(false);

  async function deleteUser() {}

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
            <div className="tooltip" data-tip="Excluir usuário">
              <button
                className="group btn btn-ghost btn-xs"
                onClick={() => setOpenAlertModal(true)}
              >
                <Trash size={16} className="group-hover:fill-red-500" />
              </button>
            </div>
            <div className="tooltip" data-tip="Re-enviar e-mail">
              <button className="btn btn-ghost btn-xs">
                <Mail size={16} />
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
    </div>
  );
}
