import { prisma } from "@/lib/db/prisma";
import { hasRole } from "@/lib/utils";
import { Roles } from "@/models/roles";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const user = await currentUser();

    if (!user?.id || !hasRole(user, clinicId, [Roles.creator, Roles.admin])) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const users = await clerkClient.users.getUserList({
      userId: clinic.users,
      //paginate and filter later
    });

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Error finding Clinic:", error);

    return Response.json({ error: `Error finding Clinic` }, { status: 500 });
  }
}
