import Image from "next/image";
import Link from "next/link";
import { FALLBACK_CATEGORY_IMAGE, getSafeImageUrl } from "@/lib/safe-images";
import type { Category } from "@/lib/types";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const primaryCategories = categories.slice(0, 3);

  return (
    <section className="page-shell py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Category edit</span>
          <h2 className="section-title mt-4">Shop your routine</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          Start with the category you reach for most, then browse the full
          collection below.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href="#catalog"
            className="rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-soft-hover)]"
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {primaryCategories.map((category, index) => (
          <article
            key={category.id}
            className="group glass-card overflow-hidden rounded-[2rem] transition hover:-translate-y-1"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="relative h-72 overflow-hidden">
              <Image
                src={getSafeImageUrl(category.image, FALLBACK_CATEGORY_IMAGE)}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1280px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-white/75">
                  Collection
                </p>
                <p className="mt-2 text-3xl font-semibold">{category.name}</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                {category.description}
              </p>
              <Link
                href="#catalog"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]"
              >
                Explore {category.name}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
