import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import type { OrderUpdateInput } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma?.order?.update) {
    return NextResponse.json(
      { error: "Database connection is required for order updates." },
      { status: 500 },
    );
  }

  const { id } = await params;
  const body = (await request.json()) as OrderUpdateInput;

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
      mpesaReceipt: body.mpesaReceipt?.trim() || null,
    },
  });

  return NextResponse.json({ item: order });
}
