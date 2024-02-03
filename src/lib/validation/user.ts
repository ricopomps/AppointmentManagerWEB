import { Role } from "@/models/roles";
import { z } from "zod";

export const addUserSchema = z.object({
  userId: z.string(),
  roles: z
    .array(
      z
        .nativeEnum(Role, {
          errorMap: (issue, ctx) => {
            return { message: "Valor inválido" };
          },
        })
        .optional(),
    )
    .refine((data) => data.filter((d) => d).length > 0, {
      message: "Selecione pelo menos uma permisão",
    }),
});

export type AddUserSchema = z.infer<typeof addUserSchema>;
