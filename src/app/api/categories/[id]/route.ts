import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import type { CategoryFormInput } from "@/lib/types";
import { slugify } from "@/lib/admin-utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for category management." },
      { status: 500 },
    );
  }

  const { id } = await params;
  const body = (await request.json()) as CategoryFormInput;
  const slug = slugify(body.slug || body.name);

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      image: body.image.trim(),
    },
  });

  return NextResponse.json({ item: category });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for category management." },
      { status: 500 },
    );
  }

  const { id } = await params;
  const products = await prisma.product.findMany({
    where: { categoryId: id },
    select: { id: true },
    take: 1,
  });

  if (products.length > 0) {
    return NextResponse.json(
      { error: "Move or delete products in this category first." },
      { status: 400 },
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
