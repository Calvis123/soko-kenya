import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getCategories } from "@/lib/store";
import type { CategoryFormInput } from "@/lib/types";
import { slugify } from "@/lib/admin-utils";

export async function GET() {
  const items = await getCategories();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const prisma = await getPrisma();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database connection is required for category management." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as CategoryFormInput;
  const slug = slugify(body.slug || body.name);

  const category = await prisma.category.create({
    data: {
      name: body.name.trim(),
      slug,
      description: body.description.trim(),
      image: body.image.trim(),
    },
  });

  return NextResponse.json({ item: category }, { status: 201 });
}
