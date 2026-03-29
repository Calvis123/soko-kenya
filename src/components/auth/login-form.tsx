"use client";

import { startTransition, useState } from "react";
import Link from "next/link";
import { LockKeyhole, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, type UserRole } from "@/components/auth/auth-provider";

type CustomerMode = "signin" | "signup";

export function LoginForm({ redirectTarget }: { redirectTarget?: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("customer");
  const [customerMode, setCustomerMode] = useState<CustomerMode>("signin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const nextRole = String(formData.get("role") ?? "customer") as UserRole;
    const mode = String(formData.get("customerMode") ?? "signin") as CustomerMode;
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    try {
      if (nextRole === "admin") {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "admin",
            password,
          }),
        });

        const data = (await response.json()) as {
          error?: string;
          user?: { id: string; name: string; email: string; role: UserRole };
        };

        if (!response.ok || !data.user) {
          throw new Error(data.error ?? "Admin password is incorrect.");
        }

        login(data.user);
      } else {
        if (mode === "signup" && password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const endpoint =
          mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "customer",
            name,
            email,
            password,
          }),
        });

        const data = (await response.json()) as {
          error?: string;
          user?: { id: string; name: string; email: string; role: UserRole };
        };

        if (!response.ok || !data.user) {
          throw new Error(data.error ?? "Unable to continue.");
        }

        login(data.user);
      }

      const destination =
        redirectTarget || (nextRole === "admin" ? "/admin/dashboard" : "/");

      startTransition(() => {
        router.push(destination);
        router.refresh();
      });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  const customerCopy =
    customerMode === "signin"
      ? "Sign in to continue shopping, access your cart, and place orders."
      : "Create your customer account to save your cart and complete checkout faster.";

  const benefits = [
    {
      title: "Protected checkout",
      text: "Save your cart and complete orders faster.",
      icon: ShoppingBag,
    },
    {
      title: "Secure access",
      text: "Customer accounts and admin access stay separated.",
      icon: LockKeyhole,
    },
    {
      title: "Smooth returns",
      text: "Track orders and manage support from one account.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="page-shell py-12 lg:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-[var(--auth-hero-border)] bg-[var(--auth-hero-bg)] p-6 shadow-[var(--auth-hero-shadow)] sm:p-8 lg:min-h-[740px] lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(188,90,43,0.08),transparent_26%)]" />
          <div className="relative">
            <span className="inline-flex rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]" style={{ borderColor: "var(--auth-hero-chip-border)", background: "var(--auth-hero-chip-bg)", color: "var(--auth-hero-chip-text)" }}>
              Soko Kenya access
            </span>
            <h1 className="mt-6 font-mono text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl" style={{ color: "var(--auth-hero-text)" }}>
              Sign in with confidence and keep shopping moving.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8" style={{ color: "var(--auth-hero-muted)" }}>
              A cleaner account experience for customers, plus secure admin access
              behind the same polished entry point.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-[1.5rem] border p-4 backdrop-blur-md"
                    style={{
                      borderColor: "var(--auth-hero-chip-border)",
                      background: "var(--auth-muted-card)",
                    }}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "var(--auth-hero-chip-bg)", color: "var(--auth-hero-chip-text)" }}>
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 font-semibold" style={{ color: "var(--auth-hero-text)" }}>{benefit.title}</p>
                    <p className="mt-2 text-sm leading-7" style={{ color: "var(--auth-hero-muted)" }}>
                      {benefit.text}
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              className="mt-6 rounded-[1.6rem] border p-5 backdrop-blur-md"
              style={{
                borderColor: "var(--auth-hero-chip-border)",
                background: "var(--auth-muted-card)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "var(--auth-hero-chip-bg)", color: "var(--auth-hero-chip-text)" }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: "var(--auth-hero-text)" }}>Quick note</p>
                  <p className="text-sm" style={{ color: "var(--auth-hero-muted)" }}>
                    Customers use email and password. Admins use the protected dashboard password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.4rem] border border-[var(--auth-input-border)] bg-[var(--auth-panel-bg)] p-6 shadow-[var(--auth-panel-shadow)] sm:p-8 lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Account access
              </p>
              <h2 className="mt-3 font-mono text-3xl font-semibold tracking-tight">
                {role === "admin"
                  ? "Admin sign in"
                  : customerMode === "signup"
                    ? "Create your account"
                    : "Welcome back"}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
                {role === "admin"
                  ? "Enter the admin password to access the dashboard."
                  : customerCopy}
              </p>
            </div>
            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[var(--search-icon-bg)] text-[var(--brand)] sm:flex">
              <LockKeyhole size={20} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                role === "customer"
                  ? "bg-[var(--cta-solid)] text-white"
                  : "border border-[var(--auth-input-border)] bg-[var(--auth-pill-bg)]"
              }`}
            >
              Customer account
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`rounded-full px-5 py-3 text-sm font-semibold ${
                role === "admin"
                  ? "bg-[var(--cta-solid)] text-white"
                  : "border border-[var(--auth-input-border)] bg-[var(--auth-pill-bg)]"
              }`}
            >
              Admin login
            </button>
          </div>

          {role === "customer" ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setCustomerMode("signin")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  customerMode === "signin"
                    ? "bg-[var(--brand)] text-white"
                    : "border border-[var(--auth-input-border)] bg-[var(--auth-pill-bg)]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setCustomerMode("signup")}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  customerMode === "signup"
                    ? "bg-[var(--brand)] text-white"
                    : "border border-[var(--auth-input-border)] bg-[var(--auth-pill-bg)]"
                }`}
              >
                Create account
              </button>
            </div>
          ) : null}

          <form action={handleSubmit} className="mt-8 space-y-5">
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="customerMode" value={customerMode} />

            {role === "customer" ? (
              <>
                <label className="block">
                  <span className="text-sm font-medium">Full name</span>
                  <input
                    name="name"
                    required={customerMode === "signup"}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-2xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-4 py-3 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--auth-input-focus)]"
                    style={{ boxShadow: "var(--auth-input-shadow)" }}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Email address</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-4 py-3 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--auth-input-focus)]"
                    style={{ boxShadow: "var(--auth-input-shadow)" }}
                  />
                </label>
              </>
            ) : null}

            <label className="block">
              <span className="text-sm font-medium">
                {role === "admin" ? "Admin password" : "Password"}
              </span>
              <input
                name="password"
                type="password"
                required
                placeholder={
                  role === "admin"
                    ? "Enter admin password"
                    : "Enter your account password"
                }
                className="mt-2 w-full rounded-2xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-4 py-3 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--auth-input-focus)]"
                style={{ boxShadow: "var(--auth-input-shadow)" }}
              />
            </label>

            {role === "customer" && customerMode === "signup" ? (
              <label className="block">
                <span className="text-sm font-medium">Confirm password</span>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className="mt-2 w-full rounded-2xl border border-[var(--auth-input-border)] bg-[var(--auth-input-bg)] px-4 py-3 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--auth-input-focus)]"
                  style={{ boxShadow: "var(--auth-input-shadow)" }}
                />
              </label>
            ) : null}

            {error ? (
              <p className="rounded-2xl border border-red-200/60 bg-red-50/90 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--brand-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading
                  ? "Please wait..."
                  : role === "admin"
                    ? "Login"
                    : customerMode === "signup"
                      ? "Create account"
                      : "Sign in"}
              </button>
              <Link href="/" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
                Back to storefront
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
