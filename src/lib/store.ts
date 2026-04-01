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
  const safeName = typeof product.name === "string" && product.name.trim().length > 0
    ? product.name
    : "Untitled product";
  const safeSlug = typeof product.slug === "string" && product.slug.trim().length > 0
    ? product.slug
    : "untitled-product";
  const safeDescription =
    typeof product.description === "string" && product.description.trim().length > 0
      ? product.description
      : "Product details will be updated soon.";
  const safeImages = Array.isArray(product.images)
    ? product.images.filter(
        (image): image is string => typeof image === "string" && image.trim().length > 0,
      )
    : [];
  const safeTags = Array.isArray(product.tags)
    ? product.tags.filter(
        (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
      )
    : [];

  return {
    id: product.id,
    name: safeName,
    slug: safeSlug,
    description: safeDescription,
    price: Number.isFinite(product.price) ? product.price : 0,
    stock: Number.isFinite(product.stock) ? product.stock : 0,
    rating: Number.isFinite(product.rating) ? product.rating : 0,
    reviewCount: Number.isFinite(product.reviewCount) ? product.reviewCount : 0,
    images: safeImages,
    category: product.category?.slug ?? "uncategorized",
    featured: product.featured,
    tags: safeTags,
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
    try {
      const dbCategories = (await prisma.category.findMany({
        orderBy: { name: "asc" },
      })) as typeof categories;

      if (dbCategories.length > 0) {
        return dbCategories;
      }
    } catch (error) {
      console.error("Failed to load categories from database.", error);
    }
  }

  return categories;
}

export async function getProducts() {
  const prisma = await getPrisma();

  if (prisma?.product?.findMany) {
    try {
      const dbProducts = (await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      })) as DbProduct[];

      if (dbProducts.length > 0) {
        return dbProducts.map(mapProduct);
      }
    } catch (error) {
      console.error("Failed to load products from database.", error);
    }
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  const prisma = await getPrisma();

  if (prisma?.product?.findUnique) {
    try {
      const dbProduct = (await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      })) as DbProduct | null;

      if (dbProduct) {
        return mapProduct(dbProduct);
      }
    } catch (error) {
      console.error(`Failed to load product for slug "${slug}".`, error);
    }
  }

  return products.find((product) => product.slug === slug);
}

export async function getOrders() {
  const prisma = await getPrisma();

  if (prisma?.order?.findMany) {
    try {
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
    } catch (error) {
      console.error("Failed to load orders from database.", error);
    }
  }

  return orders;
}

export async function getOrderById(id: string) {
  const prisma = await getPrisma();

  if (prisma?.order?.findUnique) {
    try {
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
    } catch (error) {
      console.error(`Failed to load order "${id}" from database.`, error);
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
    try {
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
    } catch (error) {
      console.error(`Failed to load orders for user "${userId}".`, error);
    }
  }

  return [];
}
