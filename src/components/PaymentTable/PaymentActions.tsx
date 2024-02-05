import AddPaymentModal from "@/components/Modal/AddPaymentModal";
import AlertModal from "@/components/Modal/AlertModal";
import { UserContext } from "@/context/UserProvider";
import useFindPayments from "@/hooks/useFindPayments";
import { handleError, hasRole } from "@/lib/utils";
import { Role } from "@/models/roles";
import { deletePayment } from "@/network/api/payment";
import { useUser } from "@clerk/nextjs";
import { Payment } from "@prisma/client";
import { SquarePen, Trash } from "lucide-react";
import { useContext, useState } from "react";

interface PaymentActionsProps {
  payment: Payment;
}

export default function PaymentActions({ payment }: PaymentActionsProps) {
  const { clinic } = useContext(UserContext);
  const { user } = useUser();
  const { payments, mutatePayments } = useFindPayments();
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [openEditPaymentModal, setOpenEditPaymentModal] = useState(false);

  async function handleDeletePayment() {
    try {
      if (!clinic) throw new Error("No clinic");
      await deletePayment({ paymentId: payment.id }, clinic.id);
      mutatePayments(
        payments.filter((existingPayment) => existingPayment.id !== payment.id),
      );
    } catch (error) {
      handleError(error);
    }
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
            <div className="tooltip" data-tip="Editar pagamento">
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setOpenEditPaymentModal(true)}
              >
                <SquarePen size={16} />
              </button>
            </div>
            {user &&
              clinic &&
              hasRole(user, clinic.id, [Role.admin, Role.creator]) && (
                <div className="tooltip" data-tip="Remover pagamento">
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setOpenAlertModal(true)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              )}
          </div>
        </ul>
      </div>
      <AlertModal
        isOpen={openAlertModal}
        title="Excluir pagamento"
        description="Deseja excluir esse pagamento? Essa ação não pode ser revertida"
        acceptButtonText="Excluir"
        cancelButtonText="Cancelar"
        acceptButtonClassName="btn-error"
        cancelButtonClassName="btn-ghost"
        onClose={() => {
          setOpenAlertModal(false);
        }}
        onAccept={async () => {
          await handleDeletePayment();
          setOpenAlertModal(false);
        }}
      />
      {openEditPaymentModal && (
        <AddPaymentModal
          paymentToEdit={payment}
          onAccept={() => {
            setOpenEditPaymentModal(false);
          }}
          onClose={() => setOpenEditPaymentModal(false)}
        />
      )}
    </div>
  );
}
