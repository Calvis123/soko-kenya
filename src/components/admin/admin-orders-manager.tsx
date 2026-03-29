"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const adminFieldClass =
  "admin-field mt-2 w-full rounded-2xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-3 text-[var(--foreground)] caret-[var(--brand)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--admin-input-focus)]";

const adminFieldStyle = {
  boxShadow: "var(--admin-input-shadow)",
} as const;

export function AdminOrdersManager({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function patchOrderLocal(id: string, updates: Partial<Order>) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    );
  }

  async function updateOrder(order: Order) {
    setSavingId(order.id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: order.status,
          paymentStatus: order.paymentStatus,
          mpesaReceipt: order.mpesaReceipt,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to update order.");
      }

      setMessage(`Order ${order.id} updated.`);
      startTransition(() => {
        router.refresh();
      });
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update order.",
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-[1.5rem] bg-[rgba(31,107,87,0.12)] px-5 py-4 text-sm text-[var(--accent)]">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {orders.map((order) => (
        <article key={order.id} className="glass-card rounded-[2rem] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xl font-semibold">{order.id}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {order.customerName} • {order.customerPhone}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(order.total)}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr_1.2fr_auto]">
            <label className="block">
              <span className="text-sm font-medium">Status</span>
              <select
                value={order.status}
                onChange={(event) =>
                  patchOrderLocal(order.id, {
                    status: event.target.value as OrderStatus,
                  })
                }
                className={adminFieldClass}
                style={adminFieldStyle}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Payment</span>
              <select
                value={order.paymentStatus}
                onChange={(event) =>
                  patchOrderLocal(order.id, {
                    paymentStatus: event.target.value as PaymentStatus,
                  })
                }
                className={adminFieldClass}
                style={adminFieldStyle}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">M-Pesa receipt</span>
              <input
                value={order.mpesaReceipt ?? ""}
                onChange={(event) =>
                  patchOrderLocal(order.id, {
                    mpesaReceipt: event.target.value,
                  })
                }
                className={adminFieldClass}
                style={adminFieldStyle}
              />
            </label>
            <button
              type="button"
              onClick={() => void updateOrder(order)}
              disabled={savingId === order.id}
              className="self-end rounded-full bg-[var(--brand)] px-5 py-4 font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingId === order.id ? "Saving..." : "Save"}
            </button>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-[var(--muted)] md:grid-cols-3">
            <p>
              Status:{" "}
              <span className="font-semibold capitalize text-[var(--foreground)]">
                {order.status}
              </span>
            </p>
            <p>
              Payment:{" "}
              <span className="font-semibold capitalize text-[var(--foreground)]">
                {order.paymentStatus}
              </span>
            </p>
            <p>
              Address:{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {order.address}
              </span>
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
