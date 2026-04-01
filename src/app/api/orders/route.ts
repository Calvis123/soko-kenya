import { NextResponse } from "next/server";
import { getCurrentUser, requireAdminUser } from "@/lib/auth-server";
import { initiateStkPush } from "@/lib/mpesa";
import { getPrisma } from "@/lib/prisma";
import type { CheckoutPayload } from "@/lib/types";
import { formatPhoneForMpesa } from "@/lib/utils";

export async function GET() {
  const adminUser = await requireAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }

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

  const paymentMethod = body.paymentMethod ?? "mpesa";
  const normalizedPhone = formatPhoneForMpesa(body.customerPhone);
  const stkPush =
    paymentMethod === "mpesa"
      ? await initiateStkPush({
          amount: orderTotal,
          phoneNumber: normalizedPhone,
          accountReference: orderId,
          transactionDesc: `Order ${orderId}`,
        })
      : null;

  if (prisma?.order?.create) {
    await prisma.order.create({
      data: {
        id: orderId,
        customerName: body.customerName,
        customerPhone: normalizedPhone,
        customerEmail: body.customerEmail || null,
        address: body.address,
        notes: body.notes || null,
        total: orderTotal,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        ...(currentUser?.role === "customer"
          ? {
              user: {
                connect: {
                  id: currentUser.id,
                },
              },
            }
          : {}),
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
    paymentMethod,
    payment: stkPush,
  });
}
