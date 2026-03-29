import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { initiateStkPush } from "@/lib/mpesa";
import { getPrisma } from "@/lib/prisma";
import type { CheckoutPayload } from "@/lib/types";
import { formatPhoneForMpesa } from "@/lib/utils";

export async function GET() {
  const prisma = await getPrisma();
  const items =
    prisma?.order?.findMany
      ? await prisma.order.findMany({
          include: {
            items: true,
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  return NextResponse.json({
    items,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutPayload;
  const prisma = await getPrisma();
  const currentUser = await getCurrentUser();
  const orderId = `ORD-${Date.now()}`;
  const orderTotal = body.items.reduce(
    (total, item) => total + item.price * item.quantity,
    350,
  );

  const stkPush = await initiateStkPush({
    amount: orderTotal,
    phoneNumber: formatPhoneForMpesa(body.customerPhone),
    accountReference: orderId,
    transactionDesc: `Order ${orderId}`,
  });

  if (prisma?.order?.create) {
    await prisma.order.create({
      data: {
        id: orderId,
        userId: currentUser?.role === "customer" ? currentUser.id : null,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail || null,
        address: body.address,
        notes: body.notes || null,
        total: orderTotal,
        status: "pending",
        paymentStatus: "pending",
        items: {
          create: body.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }

  return NextResponse.json({
    orderId,
    total: orderTotal,
    payment: stkPush,
  });
}
