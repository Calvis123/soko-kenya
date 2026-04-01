"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import type { CheckoutPayload, PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
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
      paymentMethod: String(
        formData.get("paymentMethod") ?? "mpesa",
      ) as PaymentMethod,
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

      const data = (await response.json()) as { orderId?: string; error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            data.error ?? "Your session has expired. Please log in again before checkout.",
          );
        }

        throw new Error(data.error ?? "Unable to create the order.");
      }

      clearCart();

      startTransition(() => {
        router.push(`/order-confirmation/${data.orderId}`);
      });
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Checkout failed. Please try again.";

      setError(message);

      if (message.toLowerCase().includes("log in again")) {
        startTransition(() => {
          router.push("/login");
        });
      }
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
          <div className="sm:col-span-2">
            <span className="text-sm font-medium">Payment option</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label
                className={`cursor-pointer rounded-[1.5rem] border p-4 transition ${
                  paymentMethod === "mpesa"
                    ? "border-[var(--brand)] bg-[rgba(188,90,43,0.1)] shadow-[0_14px_30px_rgba(188,90,43,0.12)]"
                    : "border-[var(--line)] bg-[var(--surface-soft)] hover:bg-[var(--surface-soft-hover)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === "mpesa"}
                  onChange={() => setPaymentMethod("mpesa")}
                  className="sr-only"
                />
                <p className="font-semibold">Pay with M-Pesa</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Place the order and trigger M-Pesa checkout immediately.
                </p>
              </label>
              <label
                className={`cursor-pointer rounded-[1.5rem] border p-4 transition ${
                  paymentMethod === "pay_on_pickup"
                    ? "border-[var(--brand)] bg-[rgba(188,90,43,0.1)] shadow-[0_14px_30px_rgba(188,90,43,0.12)]"
                    : "border-[var(--line)] bg-[var(--surface-soft)] hover:bg-[var(--surface-soft-hover)]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay_on_pickup"
                  checked={paymentMethod === "pay_on_pickup"}
                  onChange={() => setPaymentMethod("pay_on_pickup")}
                  className="sr-only"
                />
                <p className="font-semibold">Pay on pickup</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                  Your order is placed now, but goods stay unreleased until
                  payment is completed at pickup.
                </p>
              </label>
            </div>
          </div>
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
          {loading
            ? "Placing order..."
            : paymentMethod === "pay_on_pickup"
              ? "Place pickup order"
              : "Place order"}
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
          {paymentMethod === "mpesa"
            ? "M-Pesa note: the backend route includes mock STK push scaffolding. Add your Daraja credentials in `.env` to connect real payments next."
            : "Pickup note: the order will be created with payment pending. Release should only happen after the customer completes payment at pickup."}
        </div>
      </aside>
    </div>
  );
}
