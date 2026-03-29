import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="page-shell py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow">Top categories</span>
          <h2 className="section-title mt-4">Shop by department</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
          Jump into the sections customers usually look for first.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <article
            key={category.id}
            className="group glass-card overflow-hidden rounded-[2rem]"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="relative h-72 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1280px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="font-mono text-2xl font-semibold">{category.name}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/85">
                  {category.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-medium text-[var(--muted)]">
                Explore collection
              </span>
              <Link href="#catalog" className="text-sm font-semibold">
                View products
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
