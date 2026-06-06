import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Add 3 Premium Advisory Clients This Quarter — Arysn",
  description:
    "How to add 3 premium advisory clients ($45k/mo) this quarter — without chasing referrals, building complicated funnels, or taking a single sales call.",
};

export default function VSLRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* VTurb perf marker — records the navigation start as early as possible so
            the player can attribute load timing accurately. Must run before player.js. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);',
          }}
        />

        {/* Preload the player runtime + first HLS manifest so the VSL starts faster. */}
        <link
          rel="preload"
          href="https://scripts.converteai.net/81abe951-051c-413a-ab78-e030a918b967/players/6a23575fa85d6b55026ec3be/v4/player.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://cdn.converteai.net/81abe951-051c-413a-ab78-e030a918b967/6a2356ccf53a385af30b739e/main.m3u8"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* Resolve VTurb hostnames ahead of first byte. */}
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://license.vturb.com" />

        {/* Warm the connection to Cal.com so the deferred booking embed loads fast
            once the user reaches the bottom fold. */}
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
