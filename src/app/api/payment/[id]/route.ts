import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    await prisma.payment.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "ok",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting payment:", error);

    return NextResponse.json(
      { error: `Error creating payment:  "Unknown error"` },
      { status: 500 }
    );
  }
}
