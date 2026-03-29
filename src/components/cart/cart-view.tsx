"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-[2rem] p-10 text-center">
        <p className="font-mono text-2xl font-semibold">Your cart is empty</p>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Add a few products from the storefront to test the full checkout flow.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--foreground)] px-6 py-3 font-semibold text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="glass-card grid gap-4 rounded-[2rem] p-4 md:grid-cols-[160px_1fr]"
          >
            <div className="relative h-40 overflow-hidden rounded-[1.5rem]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 160px"
              />
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xl font-semibold">{item.name}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {formatCurrency(item.price)} each
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)]"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-2 py-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-8 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <p className="text-lg font-semibold">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="glass-card h-fit rounded-[2rem] p-6">
        <p className="font-mono text-2xl font-semibold">Order summary</p>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Delivery estimate</span>
            <span>{formatCurrency(350)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-base font-semibold">
            <span>Total</span>
            <span>{formatCurrency(subtotal + 350)}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-8 inline-flex w-full justify-center rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
