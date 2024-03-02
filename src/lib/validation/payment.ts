import {
  Expertise,
  PaymentMethod,
  PaymentStatus,
  PaymentTablePreferences,
} from "@prisma/client";
import { isValid, parseISO } from "date-fns";
import { z } from "zod";

const createPaymentSchemaBase = z.object({
  userId: z.string().min(1, "Dentista obrigatório"),
  pacientName: z.string().min(1, "Nome do paciente obrigatório"),
  expertise: z.nativeEnum(Expertise),
  procedure: z.string(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  value: z.number().min(0, "Valor deve ser maior ou igual a 0"),
  cost: z.number().min(0, "Custo (Protético) deve ser maior ou igual a 0"),
  status: z.nativeEnum(PaymentStatus),
  observations: z.string(),
});

const isValidDateString = (value: string): boolean => {
  const parsedDate = parseISO(value);
  return isValid(parsedDate);
};

const dateStringSchema = z.string().refine(
  (value) => {
    return isValidDateString(value);
  },
  { message: "Data de pagamento inválida" },
);

export const createPaymentSchema = z
  .object({
    paymentDate: dateStringSchema.or(
      z.date().refine((date) => !isNaN(date.getTime())),
    ),
  })
  .and(createPaymentSchemaBase)
  .transform((data) => ({
    ...data,
    paymentDate:
      typeof data.paymentDate === "string"
        ? parseISO(data.paymentDate)
        : data.paymentDate,
  }));

export function createPaymentSchemaWithPreferences(
  preferences?: PaymentTablePreferences | null,
) {
  const createPaymentSchemaPreferenceBase = z.object({
    userId: z.string().min(1, "Dentista obrigatório"),
    pacientName: z.string().min(1, "Nome do paciente obrigatório"),
    procedure: z.string(),
    value: z.number().min(0, "Valor deve ser maior ou igual a 0"),
    cost: z.number().min(0, "Custo (Protético) deve ser maior ou igual a 0"),
    status: z.nativeEnum(PaymentStatus),
    observations: z.string(),
    expertise:
      preferences?.hasSpecialty !== false
        ? z.nativeEnum(Expertise)
        : z.nativeEnum(Expertise).optional(),
    paymentMethod:
      preferences?.hasPaymentMethod !== false
        ? z.nativeEnum(PaymentMethod)
        : z.nativeEnum(PaymentMethod).optional(),
  });
  const createPaymentSchema = z
    .object({
      paymentDate: dateStringSchema.or(
        z.date().refine((date) => !isNaN(date.getTime())),
      ),
    })
    .and(createPaymentSchemaPreferenceBase)
    .transform((data) => ({
      ...data,
      paymentDate:
        typeof data.paymentDate === "string"
          ? parseISO(data.paymentDate)
          : data.paymentDate,
    }));
  return createPaymentSchema;
}

const schema = createPaymentSchemaWithPreferences();

export type CreatePaymentSchema = z.infer<typeof schema>;

const paymentIdSchema = z.object({ paymentId: z.string() });

export const updatePaymentSchema = paymentIdSchema.and(schema);

export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;

export const deletePaymentSchema = paymentIdSchema;

export type DeletePaymentSchema = z.infer<typeof deletePaymentSchema>;
