export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--footer-bg)] py-12">
      <div className="page-shell grid gap-8 md:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr]">
        <div>
          <p className="text-2xl font-semibold">Soko Kenya</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
            Curated laptops, phone accessories, desk gear, and everyday tech
            essentials designed for a cleaner and more premium shopping experience.
          </p>
        </div>
        <div>
          <p className="font-semibold">Shop</p>
          <p className="mt-3 text-sm text-[var(--muted)]">Laptops</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Accessories</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Desk setup</p>
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
