import { prisma } from "@/lib/db/prisma";
import { getMonthAndYear } from "@/lib/utils";

export async function GET(
  req: Request,
  { params: { clinicId } }: { params: { clinicId: string } },
) {
  try {
    const payments = await prisma.payment.findMany({
      where: { clinicId: clinicId },
      select: { paymentDate: true },
    });

    const uniqueMonths = Array.from(
      new Set(payments.map((payment) => getMonthAndYear(payment.paymentDate))),
    );

    return Response.json(uniqueMonths, { status: 200 });
  } catch (error) {
    console.error("Error finding Payments:", error);

    return Response.json({ error: `Error finding Payments` }, { status: 500 });
  }
}
