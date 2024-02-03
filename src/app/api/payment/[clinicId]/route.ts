import { prisma } from "@/lib/db/prisma";
import { createPaymentSchema } from "@/lib/validation/payment";
import { currentUser } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const body = await req.json();

    const parseResult = createPaymentSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const {
      value,
      cost,
      expertise,
      observations,
      pacientName,
      paymentDate,
      paymentMethod,
      procedure,
      status,
      userId,
    } = parseResult.data;

    const user = await currentUser();

    if (!user?.id) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const createdPayment = await prisma.payment.create({
      data: {
        clinicId,
        value,
        cost,
        expertise,
        observations,
        pacientName,
        paymentDate,
        paymentMethod,
        procedure,
        status,
        userId,
      },
    });

    return Response.json(createdPayment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);

    return Response.json({ error: `Error creating payment` }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const payments = await prisma.payment.findMany({ where: { clinicId } });

    if (!payments) {
      return Response.json({ error: `Payments not found` }, { status: 404 });
    }

    return Response.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error finding Payments:", error);

    return Response.json({ error: `Error finding Payments` }, { status: 500 });
  }
}
