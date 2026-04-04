import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { AppShell } from "@/components/layout/app-shell";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { getCurrentUser } from "@/lib/auth-server";

export const metadata: Metadata = {
  title: {
    default: "Soko Kenya",
    template: "%s | Soko Kenya",
  },
  description:
    "A mobile-first Kenyan e-commerce storefront with curated products, M-Pesa-ready checkout scaffolding, and a polished shopping experience.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      data-theme="light"
    >
      <body className="min-h-full">
        <ThemeProvider>
          <AuthProvider initialUser={currentUser}>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
