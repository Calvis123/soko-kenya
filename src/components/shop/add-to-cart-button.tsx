"use client";

import { ShoppingBag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        if (!isLoggedIn) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        addItem(product);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cta-solid)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--cta-solid-hover)] hover:text-white"
    >
      <ShoppingBag size={18} />
      Add to cart
    </button>
  );
}
