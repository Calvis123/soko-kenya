import { getCurrentUser } from "@/lib/auth-server";
import { PickupPaymentButton } from "@/components/orders/pickup-payment-button";
import { getOrdersByPhone, getOrdersByUserId } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone = "" } = await searchParams;
  const normalizedPhone = phone.trim();
  const currentUser = await getCurrentUser();
  const loggedInCustomer =
    currentUser && currentUser.role === "customer" ? currentUser : null;
  const matchingOrders = normalizedPhone
    ? await getOrdersByPhone(normalizedPhone)
    : loggedInCustomer
      ? await getOrdersByUserId(loggedInCustomer.id)
      : [];
  const showingAutoOrders = normalizedPhone.length === 0 && Boolean(loggedInCustomer);

  return (
    <section className="page-shell flex min-h-[70vh] flex-col py-10">
      <div className="flex flex-col">
        <span className="eyebrow">Order tracking</span>
        <h1 className="section-title mt-4">
          {loggedInCustomer ? "Your recent orders" : "Track by phone number"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          {loggedInCustomer
            ? "Your account orders appear automatically below. You can also search by phone number to find any other matching order."
            : "Enter the phone number used at checkout to view your order progress and payment status."}
        </p>
      </div>

      <form method="GET" className="glass-card mt-8 flex flex-col gap-4 rounded-[2rem] p-6">
        <label className="block">
          <span className="text-sm font-medium">Phone number</span>
          <div className="mt-3 flex items-center gap-3 rounded-[1.35rem] border border-[var(--search-border)] bg-[var(--search-input)] px-4 py-3 shadow-[0_12px_28px_var(--search-ring)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--search-icon-bg)] text-[var(--brand)]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-[18px] w-[18px] fill-none stroke-current stroke-2"
              >
                <path d="M22 22l-4.35-4.35" />
                <circle cx="11" cy="11" r="6.5" />
              </svg>
            </div>
            <input
              name="phone"
              placeholder="Example: 0712345678"
              defaultValue={normalizedPhone}
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--muted)]"
            />
          </div>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--muted)]">
            Use the same number entered during checkout.
          </p>
          <button
            type="submit"
            className="rounded-full bg-[var(--brand)] px-6 py-3 font-semibold text-white"
          >
            Search orders
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-4">
        {normalizedPhone.length === 0 && !loggedInCustomer ? (
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="font-mono text-2xl font-semibold">Ready to track</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Search using your checkout phone number to see matching orders.
            </p>
          </div>
        ) : matchingOrders.length === 0 ? (
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="font-mono text-2xl font-semibold">
              {showingAutoOrders ? "No orders yet" : "No orders found"}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {showingAutoOrders
                ? "You do not have any saved orders on this account yet. Place an order or search using a checkout phone number."
                : (
                  <>
                    We could not find any orders for <strong>{normalizedPhone}</strong>.
                    Double-check the number used at checkout and try again.
                  </>
                )}
            </p>
          </div>
        ) : (
          matchingOrders.map((order) => (
            <article key={order.id} className="glass-card rounded-[2rem] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xl font-semibold">{order.id}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {order.customerName} â€¢ {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[rgba(31,107,87,0.12)] px-3 py-1 text-sm font-semibold capitalize text-[var(--accent)]">
                    {order.status}
                  </span>
                  <span className="rounded-full bg-[rgba(188,90,43,0.12)] px-3 py-1 text-sm font-semibold capitalize text-[var(--brand-dark)]">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
                <p>
                  Payment method:{" "}
                  {order.paymentMethod === "pay_on_pickup" ? "Pay on pickup" : "M-Pesa"}
                </p>
                <p>Phone: {order.customerPhone}</p>
                <p>Address: {order.address}</p>
                <p>Total: {formatCurrency(order.total)}</p>
                {order.mpesaReceipt ? <p>M-Pesa receipt: {order.mpesaReceipt}</p> : null}
              </div>
              {order.paymentMethod === "pay_on_pickup" &&
              order.paymentStatus !== "paid" ? (
                <div className="mt-5 rounded-[1.5rem] bg-[rgba(188,90,43,0.12)] px-4 py-4 text-sm leading-7 text-[var(--brand-dark)]">
                  This pickup order is still awaiting payment. Complete payment
                  here once the customer pays at pickup so the order can move
                  forward.
                  <PickupPaymentButton orderId={order.id} />
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
