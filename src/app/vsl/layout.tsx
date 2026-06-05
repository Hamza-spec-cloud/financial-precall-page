import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add 3 Premium Advisory Clients This Quarter — Arysn",
  description:
    "How to add 3 premium advisory clients ($45k/mo) this quarter — without chasing referrals, building complicated funnels, or taking a single sales call.",
};

export default function VSLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Warm the connection to Cal.com so the deferred booking embed loads fast
          once the user reaches the bottom fold. */}
      <link rel="preconnect" href="https://app.cal.com" />
      <link rel="dns-prefetch" href="https://app.cal.com" />
      {children}
    </>
  );
}
