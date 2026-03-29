"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
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

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated: true,
      isLoggedIn: Boolean(user),
      login: (nextUser) => {
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
        setUser(null);
      },
    }),
    [user],
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
