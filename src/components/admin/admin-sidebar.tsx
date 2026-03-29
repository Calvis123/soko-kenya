"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Overview",
    description: "Sales and stock summary",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    description: "Inventory and categories",
    icon: Boxes,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    description: "Fulfillment and payments",
    icon: ReceiptText,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="glass-card h-fit rounded-[2rem] border border-[var(--line)] bg-[var(--admin-sidebar-card)] p-4 sm:p-5 lg:sticky lg:top-8">
      <div className="rounded-[1.75rem] bg-[linear-gradient(150deg,#0f151a_0%,#1f3e45_24%,#8f4620_64%,#d87843_100%)] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.26)]">
        <p className="text-xs uppercase tracking-[0.22em] text-white/70">
          Admin console
        </p>
        <p className="mt-3 font-mono text-2xl font-semibold">Soko Kenya Ops</p>
        <p className="mt-2 text-sm leading-7 text-white/80">
          Move across products, orders, and store operations without jumping
          back into the storefront.
        </p>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] px-4 py-4 shadow-[var(--nav-pill-shadow)]">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Signed in as
        </p>
        <p className="mt-2 font-semibold">{user?.name ?? "Store Admin"}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {user?.email ?? "admin@sokokenya.co.ke"}
        </p>
      </div>

      <ThemeToggle className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[1.2rem] border border-[var(--line)] bg-[var(--admin-sidebar-panel)] px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]" />

      <nav className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-[1.5rem] border px-4 py-4 transition",
                active
                  ? "border-transparent bg-[var(--admin-sidebar-active)] text-white shadow-[0_18px_40px_rgba(0,0,0,0.26)]"
                  : "border-[var(--line)] bg-[var(--admin-sidebar-link)] hover:bg-[var(--admin-sidebar-link-hover)]",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    active
                      ? "bg-white/12"
                      : "bg-[rgba(188,90,43,0.12)] text-[var(--brand-dark)]",
                  )}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p
                    className={cn(
                      "hidden text-xs sm:block lg:block",
                      active ? "text-[var(--admin-sidebar-active-muted)]" : "text-[var(--muted)]",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                size={16}
                className={cn(
                  "hidden lg:block",
                  active ? "text-[var(--admin-sidebar-active-muted)]" : "text-[var(--muted)]",
                )}
              />
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--admin-sidebar-panel)] px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
