"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn, formatCurrency } from "@/lib/utils";

const storefrontLinks = [
  { href: "/", label: "Shop" },
  { href: "/track-order", label: "Track Order" },
  { href: "/help-center", label: "Help Center" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, subtotal } = useCart();
  const { user, hydrated, isLoggedIn, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const showCustomerCart = hydrated && isLoggedIn && !isAdmin;

  function openCart() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent("/cart")}`);
      return;
    }

    router.push("/cart");
  }

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)] font-mono text-lg font-bold text-white">
            SK
          </div>
          <div>
            <p className="font-mono text-xl font-semibold tracking-tight">
              Soko Kenya
            </p>
            <p className="text-sm text-[var(--muted)]">Mobile-first online storefront</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {storefrontLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]" />

          {showCustomerCart ? (
            <>
              <button
                type="button"
                onClick={openCart}
                className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-2 text-right shadow-[var(--nav-pill-shadow)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Cart
                </p>
                <p className="text-sm font-semibold">{formatCurrency(subtotal)}</p>
              </button>
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white"
              >
                <ShoppingBag size={18} />
                {itemCount} items
              </button>
            </>
          ) : null}

          {hydrated && isLoggedIn ? (
            <>
              <div className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-sm shadow-[var(--nav-pill-shadow)]">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Signed in
                </p>
              </div>
              {isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-5 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]"
                >
                  Back to admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-5 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white"
            >
              <UserRound size={16} />
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--nav-pill)] shadow-[var(--nav-pill-shadow)] md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      <div
        className={cn(
          "page-shell overflow-hidden transition-[max-height,padding] duration-300 md:hidden",
          open ? "max-h-[32rem] pb-4" : "max-h-0 pb-0",
        )}
        >
          <div className="glass-card rounded-[2rem] p-4">
          {showCustomerCart ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openCart();
              }}
              className="mb-4 flex w-full items-center justify-between rounded-2xl bg-[var(--nav-pill)] px-4 py-3 shadow-[var(--nav-pill-shadow)]"
            >
              <span className="text-sm text-[var(--muted)]">Current cart</span>
              <span className="font-semibold">{formatCurrency(subtotal)}</span>
            </button>
          ) : null}

          <div className="flex flex-col gap-3">
            <ThemeToggle className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]" />

            {storefrontLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-sm font-medium shadow-[var(--nav-pill-shadow)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {hydrated && isLoggedIn ? (
              <>
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 shadow-[var(--nav-pill-shadow)]">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                    Signed in
                  </p>
                </div>
                {isAdmin ? (
                  <Link
                    href="/admin/dashboard"
                    className="rounded-2xl border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-sm font-medium shadow-[var(--nav-pill-shadow)]"
                    onClick={() => setOpen(false)}
                  >
                    Back to admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    setOpen(false);
                    await handleLogout();
                  }}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-3 text-left text-sm font-medium shadow-[var(--nav-pill-shadow)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href={`/login?redirect=${encodeURIComponent(pathname)}`}
                className="rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
