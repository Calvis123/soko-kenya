"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

export function PickupPaymentButton({
  orderId,
}: {
  orderId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function completePickupPayment() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}/pay-on-pickup`, {
        method: "POST",
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to complete payment.");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Unable to complete payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => void completePickupPayment()}
        disabled={loading}
        className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Completing payment..." : "Complete pickup payment"}
      </button>
      {error ? (
        <p className="mt-3 rounded-[1rem] bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
