export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="page-shell grid gap-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-mono text-2xl font-semibold">Soko Kenya</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
            MVP e-commerce storefront for the Kenyan market with cart,
            checkout, order tracking, and M-Pesa-ready backend scaffolding.
          </p>
        </div>
        <div>
          <p className="font-semibold">Customer care</p>
          <p className="mt-3 text-sm text-[var(--muted)]">support@sokokenya.co.ke</p>
          <p className="mt-1 text-sm text-[var(--muted)]">+254 700 123 456</p>
        </div>
        <div>
          <p className="font-semibold">Hours</p>
          <p className="mt-3 text-sm text-[var(--muted)]">Mon - Sat, 8:00 AM - 8:00 PM</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
}
