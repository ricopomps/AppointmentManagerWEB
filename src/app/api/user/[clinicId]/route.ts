import { prisma } from "@/lib/db/prisma";
import { hasRole } from "@/lib/utils";
import { Role } from "@/models/roles";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

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

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const skip = searchParams.get("skip");
    const take = searchParams.get("take");

    const whereCondition = {
      userId: clinic.users,
      query: search ?? "",
      ...(skip && { offset: +skip }),
      ...(take && { limit: +take }),
    };
    const [users, totalUsers] = await Promise.all([
      clerkClient.users.getUserList(whereCondition),
      clerkClient.users.getCount(whereCondition),
    ]);

    if (role) {
      //validate if it is actually a role
      //maybe change to a different route
      const usersByRole = users.filter((user) =>
        hasRole(user, clinicId, [role as Role]),
      );
      return Response.json(usersByRole, { status: 200 });
    }

    return Response.json({ users, totalUsers }, { status: 200 });
  } catch (error) {
    console.error("Error finding Users:", error);

    return Response.json({ error: `Error finding Users` }, { status: 500 });
  }
}
