import { prisma } from "@/lib/db/prisma";
import { hasRole } from "@/lib/utils";
import {
  createPaymentSchemaWithPreferences,
  deletePaymentSchema,
  updatePaymentSchema,
} from "@/lib/validation/payment";
import { Role } from "@/models/roles";
import { currentUser } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (!user?.id) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const body = await req.json();

    const paymentTablePreferences =
      await prisma.paymentTablePreferences.findUnique({ where: { clinicId } });

    const parseResult = createPaymentSchemaWithPreferences(
      paymentTablePreferences,
    ).safeParse(body);

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
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const dentistId = searchParams.get("dentistId");

    const whereClause: {
      clinicId: string;
      paymentDate?: {
        gte?: Date;
        lte?: Date;
      };
      userId?: string;
    } = {
      clinicId,
    };

    if (startDate) {
      whereClause.paymentDate = {
        ...(whereClause.paymentDate || {}),
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      whereClause.paymentDate = {
        ...(whereClause.paymentDate || {}),
        lte: new Date(endDate),
      };
    }

    if (dentistId) {
      whereClause.userId = dentistId;
    }

    const payments = await prisma.payment.findMany({ where: whereClause });

    if (!payments) {
      return Response.json({ error: `Payments not found` }, { status: 404 });
    }

    return Response.json(payments, { status: 200 });
  } catch (error) {
    console.error("Error finding Payments:", error);

    return Response.json({ error: `Error finding Payments` }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (
      !user?.id ||
      !hasRole(user, clinicId, [
        Role.managment,
        Role.doctor,
        Role.admin,
        Role.creator,
      ])
    ) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const body = await req.json();

    const parseResult = updatePaymentSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const {
      paymentId,
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

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
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

    return Response.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error("Error updating payment:", error);

    return Response.json({ error: `Error updating payment` }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (!user?.id || !hasRole(user, clinicId, [Role.admin, Role.creator])) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const body = await req.json();

    const parseResult = deletePaymentSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { paymentId } = parseResult.data;

    await prisma.payment.delete({
      where: { id: paymentId },
    });

    return Response.json({ message: "Payment deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting payment:", error);

    return Response.json({ error: `Error deleting payment` }, { status: 500 });
  }
}
