import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    return Response.json(clinic, { status: 200 });
  } catch (error) {
    console.error("Error finding Clinic:", error);

    return Response.json({ error: `Error finding Clinic` }, { status: 500 });
  }
}
