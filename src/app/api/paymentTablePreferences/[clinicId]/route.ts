import { prisma } from "@/lib/db/prisma";
import { hasRole } from "@/lib/utils";
import { tablePreferencesSchema } from "@/lib/validation/tablePreferences";
import { Role } from "@/models/roles";
import { currentUser } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (!user?.id || !hasRole(user, clinicId, [Role.creator, Role.admin])) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }
    const paymentTablePreferences =
      await prisma.paymentTablePreferences.findUnique({ where: { clinicId } });

    return Response.json(paymentTablePreferences, { status: 200 });
  } catch (error) {
    console.error("Error finding Payment table preferences:", error);

    return Response.json(
      { error: `Error finding Payment table preferences` },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (!user?.id || !hasRole(user, clinicId, [Role.creator, Role.admin])) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const body = await req.json();

    const parseResult = tablePreferencesSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { hasPaymentAccount, hasPaymentMethod, hasSpecialty } =
      parseResult.data;

    const paymentTablePreferencesExists =
      await prisma.paymentTablePreferences.findUnique({ where: { clinicId } });

    if (!paymentTablePreferencesExists) {
      const paymentTablePreferences =
        await prisma.paymentTablePreferences.create({
          data: { clinicId, hasPaymentAccount, hasPaymentMethod, hasSpecialty },
        });
      return Response.json(paymentTablePreferences, { status: 200 });
    } else {
      const paymentTablePreferences =
        await prisma.paymentTablePreferences.update({
          where: { clinicId },
          data: { clinicId, hasPaymentAccount, hasPaymentMethod, hasSpecialty },
        });
      return Response.json(paymentTablePreferences, { status: 200 });
    }
  } catch (error) {
    console.error("Error finding Payment table preferences:", error);

    return Response.json(
      { error: `Error finding Payment table preferences` },
      { status: 500 },
    );
  }
}
