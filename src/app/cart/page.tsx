import { RequireAuth } from "@/components/auth/require-auth";
import { CartView } from "@/components/cart/cart-view";

export default function CartPage() {
  return (
    <section className="page-shell flex min-h-[70vh] flex-col py-10">
      <span className="eyebrow">Shopping cart</span>
      <h1 className="section-title mt-4">Review your items</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        Quantity controls and totals are fully interactive and persisted in the
        browser so customers can return to their cart.
      </p>

      <div className="mt-8 flex-1">
        <RequireAuth>
          <CartView />
        </RequireAuth>
      </div>
    </section>
  );
}
