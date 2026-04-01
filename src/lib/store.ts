import { categories, orders, products } from "@/lib/data";
import { getPrisma } from "@/lib/prisma";
import type { Order, Product } from "@/lib/types";
import { normalizePhoneForLookup } from "@/lib/utils";

type DbCategory = {
  name: string;
  slug: string;
};

type DbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  featured: boolean;
  tags: string[];
  category?: DbCategory;
};

type DbOrderItem = {
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
  };
};

type DbOrder = {
  id: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  mpesaReceipt: string | null;
  createdAt: Date;
  items: DbOrderItem[];
};

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    rating: product.rating,
    reviewCount: product.reviewCount,
    images: product.images,
    category: product.category?.slug ?? "uncategorized",
    featured: product.featured,
    tags: product.tags,
  };
}

function mapOrder(order: DbOrder): Order {
  return {
    id: order.id,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail ?? undefined,
    address: order.address,
    total: order.total,
    status: order.status as Order["status"],
    paymentStatus: order.paymentStatus as Order["paymentStatus"],
    paymentMethod: (order.paymentMethod as Order["paymentMethod"]) ?? "mpesa",
    mpesaReceipt: order.mpesaReceipt ?? undefined,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.product?.name ?? "Product",
      quantity: item.quantity,
      price: item.price,
    })),
  };
}

export async function getCategories() {
  const prisma = await getPrisma();

  if (prisma?.category?.findMany) {
    const dbCategories = (await prisma.category.findMany({
      orderBy: { name: "asc" },
    })) as typeof categories;

    if (dbCategories.length > 0) {
      return dbCategories;
    }
  }

  return categories;
}

export async function getProducts() {
  const prisma = await getPrisma();

  if (prisma?.product?.findMany) {
    const dbProducts = (await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    })) as DbProduct[];

    if (dbProducts.length > 0) {
      return dbProducts.map(mapProduct);
    }
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  const prisma = await getPrisma();

  if (prisma?.product?.findUnique) {
    const dbProduct = (await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })) as DbProduct | null;

    if (dbProduct) {
      return mapProduct(dbProduct);
    }
  }

  return products.find((product) => product.slug === slug);
}

export async function getOrders() {
  const prisma = await getPrisma();

  if (prisma?.order?.findMany) {
    const dbOrders = (await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })) as DbOrder[];

    if (dbOrders.length > 0) {
      return dbOrders.map(mapOrder);
    }
  }

  return orders;
}

export async function getOrderById(id: string) {
  const prisma = await getPrisma();

  if (prisma?.order?.findUnique) {
    const dbOrder = (await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    })) as DbOrder | null;

    if (dbOrder) {
      return mapOrder(dbOrder);
    }
  }

  return orders.find((order) => order.id === id);
}

export async function getOrdersByPhone(phone: string) {
  const allOrders = await getOrders();
  const normalizedPhone = normalizePhoneForLookup(phone);

  return allOrders.filter(
    (order) =>
      normalizePhoneForLookup(order.customerPhone) === normalizedPhone,
  );
}

export async function getOrdersByUserId(userId: string) {
  const prisma = await getPrisma();

  if (prisma?.order?.findMany) {
    const dbOrders = (await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })) as DbOrder[];

    if (dbOrders.length > 0) {
      return dbOrders.map(mapOrder);
    }
  }

  return [];
}
