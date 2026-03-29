import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import type { ProductFormInput } from "@/lib/types";
import { slugify } from "@/lib/admin-utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for product management." },
      { status: 500 },
    );
  }

  const { id } = await params;
  const body = (await request.json()) as ProductFormInput;
  const slug = slugify(body.slug || body.name);
  const category = await prisma.category.findUnique({
    where: { slug: body.categorySlug },
  });

  if (!category) {
    return NextResponse.json(
      { error: "Select a valid category before saving the product." },
      { status: 400 },
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      price: Number(body.price),
      stock: Number(body.stock),
      featured: Boolean(body.featured),
      tags: body.tags,
      images: body.imageUrls,
      categoryId: category.id,
    },
    include: {
      category: true,
    },
  });

  return NextResponse.json({ item: product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for product management." },
      { status: 500 },
    );
  }

  const { id } = await params;

  await prisma.orderItem.deleteMany({
    where: { productId: id },
  });

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
