import { prisma } from "@/lib/db/prisma";
import { hasRole } from "@/lib/utils";
import { addUserSchema, removeUserSchema } from "@/lib/validation/user";
import { Role } from "@/models/roles";
import { currentUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId");
    const search = searchParams.get("search");
    const take = searchParams.get("take");

    if (
      !user?.id ||
      !clinicId ||
      !hasRole(user, clinicId, [Role.creator, Role.admin])
    ) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const users = await clerkClient.users.getUserList({
      query: search ?? undefined,
    });

    const userNotInThisClinic = users.filter(
      (user) => !hasRole(user, clinicId, Object.values(Role)),
    );

    let slicedUsers = userNotInThisClinic;

    if (take) {
      const takeAsNumber = parseInt(take);

      if (!isNaN(takeAsNumber) && takeAsNumber > 0) {
        slicedUsers = userNotInThisClinic.slice(0, takeAsNumber);
      }
    }

    return Response.json(slicedUsers, { status: 200 });
  } catch (error) {
    console.error("Error finding Users:", error);

    return Response.json({ error: `Error finding Users` }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const parseResult = addUserSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { userId, roles, clinicId } = parseResult.data;

    if (
      !user?.id ||
      !clinicId ||
      !hasRole(user, clinicId, [Role.creator, Role.admin])
    ) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const userToAdd = await clerkClient.users.getUser(userId);

    if (!userToAdd) {
      return Response.json({ error: `User not found` }, { status: 404 });
    }

    await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        users: {
          push: userToAdd.id,
        },
      },
    });

    await clerkClient.users.updateUser(userToAdd.id, {
      publicMetadata: {
        clinics: [...(user.publicMetadata.clinics || []), { clinicId, roles }],
      },
    });

    return Response.json(userToAdd, { status: 200 });
  } catch (error) {
    console.error("Error finding Users:", error);

    return Response.json({ error: `Error finding Users` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const parseResult = addUserSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { userId, roles, clinicId } = parseResult.data;

    if (
      !user?.id ||
      !clinicId ||
      !hasRole(user, clinicId, [Role.creator, Role.admin])
    ) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const userToAdd = await clerkClient.users.getUser(userId);

    if (!userToAdd) {
      return Response.json({ error: `User not found` }, { status: 404 });
    }

    await clerkClient.users.updateUser(userToAdd.id, {
      publicMetadata: {
        clinics: user.publicMetadata.clinics?.map((clinic) =>
          clinic.clinicId === clinicId ? { clinicId, roles } : clinic,
        ),
      },
    });

    return Response.json(userToAdd, { status: 200 });
  } catch (error) {
    console.error("Error finding Users:", error);

    return Response.json({ error: `Error finding Users` }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await currentUser();

    const body = await req.json();

    const parseResult = removeUserSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid input", parseResult.error);

      return Response.json({ error: `Invalid input` }, { status: 400 });
    }

    const { userId, clinicId } = parseResult.data;

    if (
      !user?.id ||
      !clinicId ||
      !hasRole(user, clinicId, [Role.creator, Role.admin])
    ) {
      return Response.json({ error: `Unauthorized` }, { status: 401 });
    }

    if (user.id === userId) {
      return Response.json({ error: `Can't remove self` }, { status: 400 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });

    if (!clinic) {
      return Response.json({ error: `Clinic not found` }, { status: 404 });
    }

    const userToRemove = await clerkClient.users.getUser(userId);

    if (!userToRemove) {
      return Response.json({ error: `User not found` }, { status: 404 });
    }

    await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        users: clinic.users.filter((user) => user !== userToRemove.id),
      },
    });

    await clerkClient.users.updateUser(userToRemove.id, {
      publicMetadata: {
        clinics: user.publicMetadata.clinics?.filter(
          (clinic) => clinic.clinicId !== clinicId,
        ),
      },
    });

    return Response.json(
      { message: "User removed from clinic" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing User:", error);

    return Response.json({ error: `Error removing User` }, { status: 500 });
  }
}
