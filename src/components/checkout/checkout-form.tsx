"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import type { CheckoutPayload } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const deliveryFee = 350;

  async function handleSubmit(formData: FormData) {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    const payload: CheckoutPayload = {
      customerName: String(formData.get("customerName") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      address: String(formData.get("address") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      items,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to create the order.");
      }

      const data = (await response.json()) as { orderId: string };
      clearCart();

      startTransition(() => {
        router.push(`/order-confirmation/${data.orderId}`);
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Checkout failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        action={handleSubmit}
        className="glass-card rounded-[2rem] p-6 sm:p-8"
      >
        <p className="font-mono text-2xl font-semibold">Customer details</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input
              name="customerName"
              required
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Phone number</span>
            <input
              name="customerPhone"
              required
              placeholder="07XXXXXXXX"
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium">Email address</span>
            <input
              name="customerEmail"
              type="email"
              placeholder="Optional"
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium">Delivery address</span>
            <textarea
              name="address"
              required
              rows={4}
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium">Order notes</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Optional delivery notes"
              className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 inline-flex rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="glass-card h-fit rounded-[2rem] p-6">
        <p className="font-mono text-2xl font-semibold">Checkout summary</p>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-[var(--muted)]">
                  Qty {item.quantity}
                </p>
              </div>
              <span className="font-semibold">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Items total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted)]">Delivery</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total due</span>
            <span>{formatCurrency(subtotal + deliveryFee)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-[rgba(31,107,87,0.11)] p-4 text-sm leading-7 text-[var(--foreground)]">
          M-Pesa note: the backend route includes mock STK push scaffolding. Add
          your Daraja credentials in `.env` to connect real payments next.
        </div>
      </aside>
    </div>
  );
}
