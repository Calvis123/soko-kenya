import Link from "next/link";
import { PickupPaymentButton } from "@/components/orders/pickup-payment-button";
import { getOrderById } from "@/lib/store";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  const isPickupPayment = order?.paymentMethod === "pay_on_pickup";

  return (
    <section className="page-shell flex min-h-[70vh] flex-col py-16">
      <div className="glass-card mx-auto max-w-2xl rounded-[2rem] p-8 text-center sm:p-12">
        <span className="eyebrow">Order received</span>
        <h1 className="section-title mt-5">Thank you for your order</h1>
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">
          Your order reference is <strong>{id}</strong>.{" "}
          {isPickupPayment
            ? "This order has been placed with pay on pickup. Keep payment pending until the customer completes payment at collection, then release the goods."
            : "Your order has been placed and the payment status will update as the M-Pesa flow completes."}
        </p>
        {isPickupPayment ? (
          <div className="mt-6 rounded-[1.5rem] bg-[rgba(188,90,43,0.12)] px-5 py-4 text-sm leading-7 text-[var(--brand-dark)]">
            Pickup orders remain on hold until payment is completed on pickup.
            {order?.paymentStatus !== "paid" ? (
              <PickupPaymentButton orderId={id} />
            ) : null}
          </div>
        ) : null}
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
