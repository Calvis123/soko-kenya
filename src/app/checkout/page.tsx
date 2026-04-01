import { RequireAuth } from "@/components/auth/require-auth";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default function CheckoutPage() {
  return (
    <section className="page-shell flex min-h-[70vh] flex-col py-10">
      <span className="eyebrow">Checkout flow</span>
      <h1 className="section-title mt-4">Customer info and payment handoff</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
        The form creates an order through the API route and then redirects to a
        confirmation screen, ready for M-Pesa STK push wiring.
      </p>
      <div className="mt-8 flex-1">
        <RequireAuth>
          <CheckoutForm />
        </RequireAuth>
      </div>
    </section>
  );
}
