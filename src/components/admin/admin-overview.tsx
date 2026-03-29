import Link from "next/link";
import { getOrders, getProducts } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function AdminOverview() {
  const products = await getProducts();
  const orders = await getOrders();
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const lowStockProducts = products.filter((product) => product.stock <= 10);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass-card rounded-[1.75rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Products
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">{products.length}</p>
        </article>
        <article className="glass-card rounded-[1.75rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Orders
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">{orders.length}</p>
        </article>
        <article className="glass-card rounded-[1.75rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">
            Revenue
          </p>
          <p className="mt-3 font-mono text-4xl font-bold">
            {formatCurrency(revenue)}
          </p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-2xl font-semibold">Recent orders</p>
            <Link href="/admin/orders" className="text-sm font-semibold">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--admin-sidebar-link)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] p-6">
          <div className="flex items-center justify-between">
            <p className="font-mono text-2xl font-semibold">Low stock alerts</p>
            <Link href="/admin/products" className="text-sm font-semibold">
              Manage inventory
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--admin-sidebar-link)] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-semibold">{product.stock} left</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">All products healthy.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
