import { Role } from "@/models/roles";
import { z } from "zod";

export const addUserFormSchema = z.object({
  userId: z.string(),
  roles: z
    .array(
      z
        .nativeEnum(Role, {
          errorMap: (issue, ctx) => {
            return { message: "Valor inválido" };
          },
        })
        .nullable(),
    )
    .refine((data) => data.filter((d) => d).length > 0, {
      message: "Selecione pelo menos uma permisão",
    }),
});

export type AddUserFormSchema = z.infer<typeof addUserFormSchema>;

export const addUserSchema = z
  .object({
    clinicId: z.string(),
  })
  .and(addUserFormSchema);

export type AddUserSchema = z.infer<typeof addUserSchema>;

export const removeUserSchema = z.object({
  userId: z.string(),
  clinicId: z.string(),
});

export type RemoveUserSchema = z.infer<typeof removeUserSchema>;
