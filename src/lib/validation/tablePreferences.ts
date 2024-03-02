import { z } from "zod";

export const tablePreferencesSchema = z.object({
  hasSpecialty: z.boolean().optional().nullable(),
  hasPaymentMethod: z.boolean().optional().nullable(),
  hasPaymentAccount: z.boolean().optional().nullable(),
});

export type TablePreferencesSchema = z.infer<typeof tablePreferencesSchema>;
