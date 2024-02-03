import { Expertise, PaymentMethod, PaymentStatus } from "@prisma/client";
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

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
