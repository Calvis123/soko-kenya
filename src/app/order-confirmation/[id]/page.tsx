import Link from "next/link";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section className="page-shell py-16">
      <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-12">
        <span className="eyebrow">Order received</span>
        <h1 className="section-title mt-5">Thank you for your order</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">
          Your order reference is <strong>{id}</strong>. In this MVP, orders are
          created successfully and the next production step is wiring live
          M-Pesa callbacks and database persistence.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/track-order"
            className="rounded-full bg-[var(--brand)] px-6 py-4 font-semibold text-white"
          >
            Track an order
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] px-6 py-4 font-semibold"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
