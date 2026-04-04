"use client";

import Link from "next/link";
import { Menu, ShoppingBag, UserRound } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const { itemCount, subtotal, hydrated: cartHydrated } = useCart();
  const { user, hydrated, isLoggedIn, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const showCustomerCart = hydrated && cartHydrated && isLoggedIn && !isAdmin;

  function isActiveLink(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

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

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleScroll() {
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--header-bg)]/96 backdrop-blur-2xl">
      <div className="border-b border-[var(--line)] bg-[image:var(--promo-strip)] py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-dark)]">
        Free express shipping on orders above KSh 10,000 | Same-day Nairobi tech delivery
      </div>
      <div className="page-shell py-4">
        <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-[var(--line)] bg-[var(--surface-elevated)]/98 px-4 py-3 shadow-[var(--shadow)] sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] text-lg font-semibold text-white shadow-[0_18px_34px_rgba(37,99,235,0.24)]">
              SK
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-[0.01em] sm:text-xl">
                Soko Kenya
              </p>
              <p className="hidden text-sm text-[var(--muted)] sm:block">
                Laptops, accessories, and smart everyday tech
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--nav-pill)] p-2 shadow-[var(--nav-pill-shadow)] md:flex">
            {storefrontLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                  isActiveLink(link.href)
                    ? "border-[var(--line)] bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-[var(--nav-pill-shadow)]"
                    : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-4 text-sm font-semibold shadow-[var(--nav-pill-shadow)]" />

          {showCustomerCart ? (
            <>
              <button
                type="button"
                onClick={openCart}
                className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-4 py-2.5 text-right shadow-[var(--nav-pill-shadow)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Cart
                </p>
                <p className="text-sm font-semibold">{formatCurrency(subtotal)}</p>
              </button>
              <button
                type="button"
                onClick={openCart}
                className="flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] px-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.2)]"
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
                  className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-5 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)] transition hover:bg-[var(--surface-elevated)]"
                >
                  Back to admin
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-[var(--line)] bg-[var(--nav-pill)] px-5 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)] transition hover:bg-[var(--surface-elevated)]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:brightness-105"
            >
              <UserRound size={16} />
              Login
            </Link>
          )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--nav-pill)] shadow-[var(--nav-pill-shadow)] md:hidden"
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "page-shell overflow-hidden transition-[max-height,padding] duration-300 md:hidden",
          open ? "max-h-[32rem] pb-4" : "max-h-0 pb-0",
        )}
      >
        <div className="glass-card rounded-[2rem] border border-[var(--line)] bg-[var(--surface-elevated)]/95 p-4">
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
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-semibold shadow-[var(--nav-pill-shadow)]",
                  isActiveLink(link.href)
                    ? "border-[var(--line)] bg-[var(--nav-pill)] text-[var(--foreground)]"
                    : "border-[var(--line)] bg-transparent text-[var(--muted)] hover:bg-[var(--nav-pill)]",
                )}
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
                className="rounded-2xl bg-[linear-gradient(145deg,var(--brand),var(--brand-dark))] px-4 py-3 text-sm font-semibold text-white"
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
