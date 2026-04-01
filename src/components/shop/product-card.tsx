"use client";

import Image from "next/image";
import { ShoppingBag, Star } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import { FALLBACK_PRODUCT_IMAGE, getSafeImageUrl } from "@/lib/safe-images";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const categoryLabel = product.category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  const productHref = `/product/${product.slug}`;
  const coverImage = getSafeImageUrl(product.images[0], FALLBACK_PRODUCT_IMAGE);

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(productHref)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(productHref);
        }
      }}
      className="glass-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-transparent bg-[var(--product-card-bg)] transition duration-300 hover:-translate-y-1 hover:border-[var(--line)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
    >
      <div className={`relative overflow-hidden ${compact ? "h-44" : "h-52 sm:h-56"}`}>
        <Image
          src={coverImage}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-80" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border bg-[var(--product-tag-bg)] px-3 py-1 text-xs font-semibold text-[var(--product-tag-text)] shadow-[var(--product-tag-shadow)] backdrop-blur-md"
              style={{ borderColor: "var(--product-tag-border)" }}
            >
              {tag}
            </span>
          ))}
        </div>
        {product.images.length > 1 ? (
          <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            +{product.images.length - 1} more
          </div>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[var(--product-chip-bg)] px-3 py-1 text-xs font-semibold text-[var(--brand-dark)]">
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-sm text-[var(--muted)]">
            <Star size={14} className="fill-current text-amber-500" />
            {product.rating}
          </span>
        </div>
        <p className={`font-semibold tracking-tight ${compact ? "text-base" : "text-xl"}`}>
          {product.name}
        </p>
        <p className={`mt-3 flex-1 text-sm leading-6 text-[var(--muted)] ${compact ? "line-clamp-2" : "line-clamp-2"}`}>
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
          <p>{product.reviewCount} reviews</p>
          <p>{product.stock} in stock</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
              Price
            </p>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)] sm:inline">
              View details
            </span>
            <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (!isLoggedIn) {
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
              }

              addItem(product);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--cta-solid)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--cta-solid-hover)] hover:text-white"
          >
            <ShoppingBag size={16} />
              {compact ? "Add" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
