import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { getPrisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma?.order?.findUnique || !prisma?.order?.update) {
    return NextResponse.json(
      { error: "Database connection is required for payment completion." },
      { status: 500 },
    );
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      paymentMethod: true,
      paymentStatus: true,
      status: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const isAdmin = currentUser.role === "admin";
  const ownsOrder = currentUser.role === "customer" && order.userId === currentUser.id;
  if (!isAdmin && !ownsOrder) {
    return NextResponse.json({ error: "Not authorized for this order." }, { status: 403 });
  }

  if (order.paymentMethod !== "pay_on_pickup") {
    return NextResponse.json(
      { error: "This order is not a pay-on-pickup order." },
      { status: 400 },
    );
  }

  if (order.paymentStatus === "paid") {
    return NextResponse.json({ item: order });
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: {
      paymentStatus: "paid",
      status: order.status === "pending" ? "processing" : order.status,
    },
  });

  return NextResponse.json({ item: updatedOrder });
}
