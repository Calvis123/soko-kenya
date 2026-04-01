import { Mail, MessageCircleMore, PackageSearch, Phone, ShieldCheck } from "lucide-react";

const helpTopics = [
  {
    title: "Track an order",
    description: "Use your phone number or order ID to check delivery progress and payment status.",
    icon: PackageSearch,
  },
  {
    title: "Payments and checkout",
    description: "Get help with M-Pesa confirmation, checkout issues, or payment follow-up.",
    icon: ShieldCheck,
  },
  {
    title: "Returns and support",
    description: "Reach support for product questions, changes, or after-purchase assistance.",
    icon: MessageCircleMore,
  },
];

export default function HelpCenterPage() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col py-10 sm:py-14">
      <section className="glass-card rounded-[2.4rem] p-6 sm:p-8 lg:p-10">
        <span className="eyebrow">Help center</span>
        <h1 className="section-title mt-5 max-w-3xl">
          Support for orders, payments, delivery, and shopping questions.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Find quick answers or contact the store team directly when you need help.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {helpTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article key={topic.title} className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card-strong)]/80 p-5">
                <div className="inline-flex rounded-2xl bg-[rgba(188,90,43,0.12)] p-3 text-[var(--brand-dark)]">
                  <Icon size={20} />
                </div>
                <h2 className="mt-4 font-mono text-xl font-semibold">{topic.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{topic.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid flex-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Quick answers
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-[1.4rem] border border-[var(--line)] p-4">
              <p className="font-semibold">How do I track my order?</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Visit the Track Order page and enter your order ID or the phone number used at checkout.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--line)] p-4">
              <p className="font-semibold">Why is my payment still pending?</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                M-Pesa confirmations can take a short moment. If it stays pending, contact support with your order details.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--line)] p-4">
              <p className="font-semibold">Can I change my delivery details?</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                Yes, contact customer care quickly after ordering and we will help if the order has not shipped yet.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Contact us
          </p>
          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
              <Phone size={18} className="mt-1 text-[var(--brand)]" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="mt-1 text-sm text-[var(--muted)]">+254 700 123 456</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[1.4rem] border border-[var(--line)] p-4">
              <Mail size={18} className="mt-1 text-[var(--brand)]" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="mt-1 text-sm text-[var(--muted)]">support@sokokenya.co.ke</p>
              </div>
            </div>
            <div className="rounded-[1.4rem] bg-[var(--accent)] p-5 text-white">
              <p className="font-semibold">Support hours</p>
              <p className="mt-2 text-sm text-white/80">Mon - Sat, 8:00 AM - 8:00 PM</p>
              <p className="mt-1 text-sm text-white/80">Nairobi, Kenya</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
