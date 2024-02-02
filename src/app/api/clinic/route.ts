import { prisma } from "@/lib/db/prisma";
import { createClinicSchema } from "@/lib/validation/clinic";
import { Roles } from "@/models/roles";
import { clerkClient, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createClinicSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { name } = parseResult.data;

    const user = await currentUser();

    if (!user?.id) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const createdClinic = await prisma.clinic.create({
      data: { name, users: [user.id] },
    });

    clerkClient.users.updateUser(user.id, {
      publicMetadata: {
        clinics: [
          ...(user.publicMetadata.clinics || []),
          { clinicId: createdClinic.id, roles: [Roles.creator, Roles.admin] },
        ],
      },
    });

    return Response.json(createdClinic, { status: 201 });
  } catch (error) {
    console.error("Error creating Clinic:", error);

    return Response.json({ error: `Error creating Clinic` }, { status: 500 });
  }
}
