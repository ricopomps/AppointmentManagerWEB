import { UserContext } from "@/context/UserProvider";
import { AddUserSchema, addUserSchema } from "@/lib/validation/user";
import { Role } from "@/models/roles";
import { findUsersNotInClinic } from "@/network/api/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingButton from "../LoadingButton";
import SelectSearch, { Option } from "../SelectSearch";

interface AddUserModalProps {
  onClose: () => void;
  onAccept: () => void;
}

export default function AddUserModal({ onClose, onAccept }: AddUserModalProps) {
  const { clinic } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddUserSchema>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { roles: [] },
  });

  const isValidRole = (value: string | undefined): value is Role => {
    return Object.values(Role).includes(value as Role);
  };

  const onFetchUsers = async (search: string, take: number = 0) => {
    try {
      if (!clinic) return [];
      const users = await findUsersNotInClinic(clinic.id, search, take);
      const options: Option[] = users.map((user) => ({
        label: `${user.firstName} ${user.lastName}` ?? "",
        value: user.id,
      }));

      return options;
    } catch (error) {
      return [];
    }
  };

  const convertToRoleEnum = (input: (string | undefined)[]): Role[] => {
    const result: Role[] = [];

    input.forEach((value) => {
      if (isValidRole(value)) {
        result.push(value);
      }
    });

    return result;
  };

  const onSubmit = (data: AddUserSchema) => {
    const roleArray: Role[] = convertToRoleEnum(data.roles);

    console.log({ ...data, roles: roleArray });
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box md:max-w-7xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 m-2"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-bold">Adicionar usuário</h3>
          <div className="mb-3 flex flex-col-reverse items-center justify-between gap-3 md:flex-row md:items-baseline lg:gap-0">
            <div className="w-full md:w-[50%]">
              <SelectSearch
                onFetchOptions={onFetchUsers}
                control={control}
                name="userId"
              />
            </div>
            <div className="card max-w-96 bg-primary p-1 shadow-xl">
              <div className="max-w-86 card min-w-[280px] bg-neutral text-primary shadow-xl md:min-w-[350px]">
                <div className="card-body">
                  <h2 className="card-title text-primary">Permissões</h2>
                  {Object.values(Role).map((role, index) => (
                    <div key={role} className="mb-2 flex items-center">
                      <Controller
                        control={control}
                        name={`roles.${index}`}
                        render={({ field: { value, onChange, ...field } }) => {
                          return (
                            <div className="flex flex-col">
                              <div className="flex">
                                <input
                                  {...field}
                                  onChange={() => {
                                    if (value === role) {
                                      onChange(undefined);
                                    } else {
                                      onChange(role);
                                    }
                                  }}
                                  type="checkbox"
                                  id={role}
                                  className={"checkbox-primary checkbox"}
                                />
                                <label htmlFor={role} className="ml-2">
                                  {role}
                                </label>
                              </div>
                              {errors &&
                                errors.roles &&
                                errors.roles[index] && (
                                  <p className="mb-1 text-error">
                                    {errors.roles[index]?.message}
                                  </p>
                                )}
                            </div>
                          );
                        }}
                      />
                    </div>
                  ))}
                  {errors.roles && (
                    <p className="mb-1 text-error">
                      {errors.roles.root?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <LoadingButton loading={false}>Adicionar</LoadingButton>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default" onClick={onClose} />
      </form>
    </dialog>
  );
}
