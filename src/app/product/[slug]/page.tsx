import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { getProductBySlug } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return [];
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="page-shell py-10">
      <Link href="/" className="text-sm font-medium text-[var(--muted)]">
        Back to shop
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="grid gap-4">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {product.images.slice(1).map((image) => (
              <div
                key={image}
                className="relative h-56 overflow-hidden rounded-[1.5rem]"
              >
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card h-fit rounded-[2rem] p-8">
          <span className="eyebrow">{product.category}</span>
          <h1 className="section-title mt-5">{product.name}</h1>
          <p className="mt-5 text-base leading-8 text-[var(--muted)]">
            {product.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] bg-[var(--card-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Price
              </p>
              <p className="mt-2 text-lg font-semibold">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Stock
              </p>
              <p className="mt-2 text-lg font-semibold">{product.stock} units</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--card-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Reviews
              </p>
              <p className="mt-2 text-lg font-semibold">
                {product.rating} / 5
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
