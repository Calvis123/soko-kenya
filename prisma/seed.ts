import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const categories = [
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Street-ready looks for Nairobi days and weekend escapes.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-home",
    name: "Home Living",
    slug: "home-living",
    description: "Warm interiors, practical storage, and everyday home upgrades.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-tech",
    name: "Tech",
    slug: "tech",
    description: "Smart accessories and essentials for hustle, study, and travel.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cat-beauty",
    name: "Beauty",
    slug: "beauty",
    description: "Self-care essentials curated for gifting and daily routines.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
];

const products = [
  {
    id: "prod-kitenge-bag",
    slug: "kitenge-weekender-bag",
    name: "Kitenge Weekender Bag",
    description:
      "A carry-all duffel with bold Kenyan print panels, interior pockets, and reinforced handles for trips across town or upcountry.",
    price: 4850,
    stock: 18,
    rating: 4.8,
    reviewCount: 36,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-fashion",
    featured: true,
    tags: ["Travel", "New"],
  },
  {
    id: "prod-lamp",
    slug: "woven-sisal-floor-lamp",
    name: "Woven Sisal Floor Lamp",
    description:
      "A sculptural floor lamp with a woven shade that softens living rooms, studios, and calm bedroom corners.",
    price: 6900,
    stock: 9,
    rating: 4.7,
    reviewCount: 21,
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-home",
    featured: true,
    tags: ["Best Seller"],
  },
  {
    id: "prod-earbuds",
    slug: "swiftbuds-wireless-earbuds",
    name: "SwiftBuds Wireless Earbuds",
    description:
      "Noise-reducing Bluetooth earbuds built for commute calls, gym sessions, and long battery life through the workday.",
    price: 3200,
    stock: 34,
    rating: 4.5,
    reviewCount: 58,
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-tech",
    featured: true,
    tags: ["Popular"],
  },
  {
    id: "prod-serum",
    slug: "baobab-glow-serum",
    name: "Baobab Glow Serum",
    description:
      "A lightweight face serum with baobab oil and niacinamide for an easy, everyday glow routine.",
    price: 2150,
    stock: 42,
    rating: 4.9,
    reviewCount: 87,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-beauty",
    featured: false,
    tags: ["Organic"],
  },
  {
    id: "prod-chair",
    slug: "accent-lounge-chair",
    name: "Accent Lounge Chair",
    description:
      "A textured accent chair designed for compact apartments, home offices, and reading corners.",
    price: 12400,
    stock: 4,
    rating: 4.6,
    reviewCount: 14,
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-home",
    featured: false,
    tags: ["Limited"],
  },
  {
    id: "prod-watch",
    slug: "city-runner-smart-watch",
    name: "City Runner Smart Watch",
    description:
      "A slim smartwatch with fitness tracking, message previews, and all-day battery for active schedules.",
    price: 8450,
    stock: 15,
    rating: 4.4,
    reviewCount: 32,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=1200&q=80",
    ],
    categoryId: "cat-tech",
    featured: false,
    tags: ["Fitness"],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
