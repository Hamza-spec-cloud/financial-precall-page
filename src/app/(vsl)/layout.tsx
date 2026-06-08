import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Preview text mirrors the hero headline + subheadline so the browser tab, search
// snippet, and link-share cards all read the same promise.
const PAGE_TITLE =
  "We Put 3 Signed Advisory Clients On Your Books Every 90 Days… Or You Don’t Pay";
const PAGE_DESCRIPTION =
  "We rebuild the single thing that decides whether a stranger ever becomes a client. Then we build the demand system around it. Either it puts ready-to-sign advisory retainers on your calendar every 90 days, or you pay nothing.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
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

        {/* Fully warm (DNS + TCP + TLS) the two VTurb hosts that serve bytes on the
            critical path — the player/runtime scripts and the HLS segments — so the
            first request skips the handshake. dns-prefetch kept as a fallback for
            browsers that ignore crossorigin preconnect. */}
        <link rel="preconnect" href="https://scripts.converteai.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.converteai.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://license.vturb.com" />

        {/* Warm the connection to Cal.com so the deferred booking embed loads fast
            once the user reaches the bottom fold. */}
        <link rel="preconnect" href="https://app.cal.com" />
        <link rel="dns-prefetch" href="https://app.cal.com" />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
