import Link from "next/link";
import { ShieldCheck, Store, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductGallery } from "@/components/shop/product-gallery";
import { getProductBySlug } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error(`Failed to render product page for slug "${slug}".`, error);
  }

  if (!product) {
    notFound();
  }

  const safeTags = product.tags.length > 0 ? product.tags : ["Featured"];
  const safeImagesCount = product.images.length;
  const categoryLabel = product.category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const savings = Math.max(Math.round(product.price * 0.12), 150);
  const listPrice = product.price + savings;
  const stockTone =
    product.stock <= 5 ? "Low stock" : product.stock <= 15 ? "Selling fast" : "In stock";

  return (
    <section className="page-shell flex min-h-[70vh] flex-col py-10">
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
        <Link href="/" className="font-medium transition hover:text-[var(--foreground)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/#catalog" className="font-medium transition hover:text-[var(--foreground)]">
          {categoryLabel}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-[var(--foreground)]">{product.name}</span>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-6">
          <ProductGallery images={product.images} name={product.name} />
          <div className="glass-card rounded-[1.8rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                Product highlights
              </p>
              <p className="rounded-full bg-[rgba(31,107,87,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {stockTone}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Gallery
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {safeImagesCount} gallery images
                </p>
              </div>
              <div className="rounded-[1.3rem] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Reviews
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {product.reviewCount} verified ratings
                </p>
              </div>
              <div className="rounded-[1.3rem] bg-[var(--surface-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  Availability
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="glass-card h-fit rounded-[2rem] p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">{categoryLabel}</span>
                <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-dark)]">
                  {safeTags[0] ?? "Top pick"}
                </span>
              </div>

              <h1 className="section-title mt-5 text-[clamp(2rem,2.4vw,3rem)]">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                <p className="font-semibold text-[var(--foreground)]">
                  {product.rating} / 5
                </p>
                <p className="text-[var(--muted)]">{product.reviewCount} ratings</p>
                <p className="text-[var(--accent)]">{stockTone}</p>
              </div>

              <div className="mt-6 rounded-[1.8rem] border border-[var(--line)] bg-[var(--card-strong)] p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-[var(--foreground)]">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <span className="text-[var(--muted)] line-through">
                        {formatCurrency(listPrice)}
                      </span>
                      <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 font-semibold text-[var(--brand-dark)]">
                        Save {formatCurrency(savings)}
                      </span>
                    </div>
                  </div>
                  <p className="rounded-full bg-[rgba(31,107,87,0.12)] px-4 py-2 text-sm font-semibold text-[var(--accent)]">
                    {product.stock} units available
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Delivery
                  </p>
                  <p className="mt-2 text-lg font-semibold">1 - 3 business days</p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Payment
                  </p>
                  <p className="mt-2 text-lg font-semibold">M-Pesa ready</p>
                </div>
                <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Seller
                  </p>
                  <p className="mt-2 text-lg font-semibold">Soko Kenya</p>
                </div>
              </div>

              <div className="mt-8">
                <AddToCartButton product={product} />
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {safeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3 py-1 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="glass-card rounded-[2rem] p-6">
                <p className="font-mono text-2xl font-semibold">Description</p>
                <div className="mt-5 rounded-[1.8rem] border border-[var(--line)] bg-[linear-gradient(145deg,var(--surface-soft),var(--card-strong))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                  <p className="text-base leading-8 text-[var(--foreground)]/88">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-[2rem] p-6">
                <p className="font-mono text-2xl font-semibold">Product details</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Category
                    </p>
                    <p className="mt-2 font-semibold">{categoryLabel}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      SKU
                    </p>
                    <p className="mt-2 font-semibold">{product.slug}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Ratings
                    </p>
                    <p className="mt-2 font-semibold">
                      {product.rating} from {product.reviewCount} shoppers
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                      Stock level
                    </p>
                    <p className="mt-2 font-semibold">{product.stock} units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid h-fit gap-4">
          <div className="glass-card rounded-[2rem] p-6">
            <p className="font-mono text-xl font-semibold">Delivery & returns</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3 rounded-[1.4rem] bg-[var(--surface-soft)] p-4">
                <Truck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Delivery options</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Dispatch from our store with doorstep and pickup-point
                    delivery depending on your area.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-[1.4rem] bg-[var(--surface-soft)] p-4">
                <ShieldCheck size={18} className="mt-1 text-[var(--brand)]" />
                <div>
                  <p className="font-semibold">Buyer assurance</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                    Order tracking, payment updates, and support through the help
                    center.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(188,90,43,0.12)] text-[var(--brand)]">
                <Store size={18} />
              </div>
              <div>
                <p className="font-semibold">Sold by Soko Kenya</p>
                <p className="text-sm text-[var(--muted)]">Trusted storefront seller</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              Browse more items from this collection or continue shopping across
              the full catalog.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/#catalog"
                className="rounded-full border border-[var(--line)] px-4 py-3 text-center text-sm font-semibold"
              >
                Continue shopping
              </Link>
              <Link
                href="/track-order"
                className="rounded-full bg-[var(--brand)] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Track an order
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
