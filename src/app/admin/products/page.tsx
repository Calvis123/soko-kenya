import { AdminProductsManager } from "@/components/admin/admin-products-manager";
import { getCategories, getProducts } from "@/lib/store";

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <section className="space-y-8">
      <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--admin-hero-bg)] p-6 sm:p-8">
        <span className="eyebrow">Admin products</span>
        <h1 className="section-title mt-4">Professional product operations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Manage inventory, categories, pricing, and featured products from one polished control surface.
        </p>
      </div>

      <div>
        <AdminProductsManager
          initialProducts={products}
          initialCategories={categories}
        />
      </div>
    </section>
  );
}
