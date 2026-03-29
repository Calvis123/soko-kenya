"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/components/auth/auth-provider";

export function RequireAuth({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { hydrated, isLoggedIn } = useAuth();

  if (!hydrated) {
    return (
      <div className="glass-card rounded-[2rem] p-10 text-center">
        <p className="font-mono text-2xl font-semibold">Loading your session</p>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Just a moment while we check whether you are signed in.
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="glass-card rounded-[2rem] p-10 text-center">
        <p className="font-mono text-2xl font-semibold">Login required</p>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Please sign in before accessing your cart or checkout flow.
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="mt-6 inline-flex rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
