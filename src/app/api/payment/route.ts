import { prisma } from "@/lib/db/prisma";
import { parseISO } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Assuming formData is defined somewhere in your code
    const formData = await req.json();
    console.log(formData);
    if (!formData)
      return NextResponse.json(
        {
          error: `Error`,
        },
        { status: 500 }
      );
    // Validate formData if needed

    // Create a payment using Prisma
    const createdPayment = await prisma.payment.create({
      data: {
        ...formData,
        value: formData.value ? +formData.value : formData.value,
        cost: formData.cost ? +formData.cost : formData.cost,
        createdAt: parseISO(formData.createdAt),
      },
    });

    return NextResponse.json(
      {
        message: "Revalidation successful",
        payment: createdPayment, // Optionally, include the created payment in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);

    return NextResponse.json(
      { error: `Error creating payment:  "Unknown error"` },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const payments = await prisma.payment.findMany();
    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `Error ` }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    // Assuming formData is defined somewhere in your code
    const formData = await req.json();
    console.log(formData);
    if (!formData)
      return NextResponse.json(
        {
          error: `Error`,
        },
        { status: 500 }
      );
    // Validate formData if needed

    // Create a payment using Prisma
    const { id, ...data } = formData;
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        ...data,
        value: data.value ? +data.value : data.value,
        cost: data.cost ? +data.cost : data.cost,
        createdAt: parseISO(data.createdAt),
      },
    });

    return NextResponse.json(
      {
        message: "Revalidation successful",
        payment: updatedPayment, // Optionally, include the created payment in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating payment:", error);

    return NextResponse.json(
      { error: `Error creating payment:  "Unknown error"` },
      { status: 500 }
    );
  }
}

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
