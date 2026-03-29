import { AdminOrdersManager } from "@/components/admin/admin-orders-manager";
import { getOrders } from "@/lib/store";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <section className="space-y-8">
      <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--admin-hero-bg)] p-6 sm:p-8">
        <span className="eyebrow">Admin orders</span>
        <h1 className="section-title mt-4">Track fulfillment and payments</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Stay on top of delivery stages, payment progress, and order follow-up without leaving the console.
        </p>
      </div>

      <div>
        <AdminOrdersManager initialOrders={orders} />
      </div>
    </section>
  );
}
