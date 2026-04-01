"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const safeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1fr)]">
      <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(index)}
            className={`relative overflow-hidden rounded-[1.35rem] border transition ${
              activeImage === index
                ? "border-[var(--brand)] ring-2 ring-[var(--search-ring)]"
                : "border-[var(--line)]"
            }`}
          >
            <div className="relative h-20 w-full">
              <Image
                src={image}
                alt={`${name} preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
            </div>
          </button>
        ))}
      </div>

      <div className="order-1 glass-card overflow-hidden rounded-[2rem] p-3 lg:order-2">
        <div className="relative h-[360px] overflow-hidden rounded-[1.6rem] sm:h-[430px]">
          <Image
            src={safeImages[activeImage]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 px-1">
          <p className="text-sm text-[var(--muted)]">
            Image {activeImage + 1} of {safeImages.length}
          </p>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            Multiple views
          </p>
        </div>
      </div>
    </div>
  );
}
