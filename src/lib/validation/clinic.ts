import { z } from "zod";

export const createClinicSchema = z.object({
  name: z.string().min(1, "Nome da clínica obrigatório"),
});

export type CreateClinicSchema = z.infer<typeof createClinicSchema>;
