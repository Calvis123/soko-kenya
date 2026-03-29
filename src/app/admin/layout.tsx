import type { ReactNode } from "react";
import Link from "next/link";
import { Store } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-[var(--admin-shell-bg)] px-4 py-6 lg:px-6 lg:py-8">
      <div className="mx-auto grid w-full max-w-[1440px] gap-6 lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[310px_minmax(0,1fr)]">
        <AdminSidebar />
        <div className="min-w-0">
          <div className="mb-6 flex justify-end">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--admin-sidebar-panel)] px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]"
            >
              <Store size={16} />
              View storefront
            </Link>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
