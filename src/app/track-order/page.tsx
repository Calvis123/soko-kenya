import { getOrders } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function TrackOrderPage() {
  const sampleOrders = await getOrders();

  return (
    <section className="page-shell py-10">
      <span className="eyebrow">Order tracking</span>
      <h1 className="section-title mt-4">Track by phone number</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        This page demonstrates the customer-facing tracking flow. The live
        version can be connected to your database and SMS or email updates.
      </p>

      <div className="glass-card mt-8 rounded-[2rem] p-6">
        <label className="block">
          <span className="text-sm font-medium">Phone number</span>
          <input
            placeholder="Example: 0712345678"
            className="mt-2 w-full rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none"
            readOnly
            value="0712345678"
          />
        </label>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Demo mode: showing seeded orders below.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {sampleOrders.map((order) => (
          <article key={order.id} className="glass-card rounded-[2rem] p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xl font-semibold">{order.id}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {order.customerName} • {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[rgba(31,107,87,0.12)] px-3 py-1 text-sm font-semibold capitalize text-[var(--accent)]">
                  {order.status}
                </span>
                <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 text-sm font-semibold capitalize text-[var(--brand-dark)]">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              <p>Phone: {order.customerPhone}</p>
              <p>Address: {order.address}</p>
              <p>Total: {formatCurrency(order.total)}</p>
              {order.mpesaReceipt ? <p>M-Pesa receipt: {order.mpesaReceipt}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
