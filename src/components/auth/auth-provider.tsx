"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type UserRole = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  hydrated: boolean;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const TAB_AUTH_KEY = "soko-kenya-tab-auth";

function subscribeToTabAuth(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener("soko-tab-auth-change", handler);

  return () => {
    window.removeEventListener("soko-tab-auth-change", handler);
  };
}

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const hasTabSession = useSyncExternalStore(
    subscribeToTabAuth,
    () => {
      if (typeof window === "undefined") {
        return false;
      }

      return window.sessionStorage.getItem(TAB_AUTH_KEY) === "active";
    },
    () => false,
  );
  const requiresTabSession = user?.role === "admin";
  const effectiveUser =
    requiresTabSession && !hasTabSession ? null : user;

  useEffect(() => {
    if (!hydrated || !user || !requiresTabSession || hasTabSession) {
      return;
    }

    let cancelled = false;

    void fetch("/api/auth/logout", {
      method: "POST",
    }).finally(() => {
      if (!cancelled) {
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [hasTabSession, hydrated, requiresTabSession, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: effectiveUser,
      hydrated,
      isLoggedIn: Boolean(effectiveUser),
      login: (nextUser) => {
        if (typeof window !== "undefined") {
          if (nextUser.role === "admin") {
            window.sessionStorage.setItem(TAB_AUTH_KEY, "active");
          } else {
            window.sessionStorage.removeItem(TAB_AUTH_KEY);
          }
          window.dispatchEvent(new Event("soko-tab-auth-change"));
        }
        setUser(nextUser);
      },
      refreshUser: async () => {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const data = (await response.json()) as { user: AuthUser | null };
        setUser(data.user);
      },
      logout: async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
        });
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(TAB_AUTH_KEY);
          window.dispatchEvent(new Event("soko-tab-auth-change"));
        }
        setUser(null);
      },
    }),
    [effectiveUser, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
