import { AdminOverview } from "@/components/admin/admin-overview";

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8">
      <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--admin-hero-bg)] p-6 sm:p-8">
        <span className="eyebrow">Admin dashboard</span>
        <h1 className="section-title mt-4">Store operations at a glance</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          A polished operations workspace for stock visibility, orders, and daily store decisions.
        </p>
      </div>
      <div>
        <AdminOverview />
      </div>
    </section>
  );
}
