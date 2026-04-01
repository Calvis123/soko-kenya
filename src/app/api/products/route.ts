import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth-server";
import { getPrisma } from "@/lib/prisma";
import { getProducts } from "@/lib/store";
import type { ProductFormInput } from "@/lib/types";
import { slugify } from "@/lib/admin-utils";

export async function GET() {
  const items = await getProducts();

  return NextResponse.json({
    items,
  });
}

export async function POST(request: Request) {
  const adminUser = await requireAdminUser();
  if (!adminUser) {
    return NextResponse.json({ error: "Admin login required." }, { status: 401 });
  }

  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for product management." },
      { status: 500 },
    );
  }

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

  const product = await prisma.product.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      price: Number(body.price),
      stock: Number(body.stock),
      featured: Boolean(body.featured),
      tags: body.tags,
      images: body.imageUrls,
      rating: 4.5,
      reviewCount: 0,
      categoryId: category.id,
    },
    include: {
      category: true,
    },
  });

  return NextResponse.json({ item: product }, { status: 201 });
}
