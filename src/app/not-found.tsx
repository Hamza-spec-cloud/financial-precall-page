import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found — Arysn",
};

// With multiple root layouts (the (home) and (vsl) route groups each own their
// own <html>/<body>), an unmatched URL has no group layout to fall back to, so
// this top-level not-found must render its own document shell.
export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121212",
          color: "#e0e0e0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.025em" }}>
            404 — Page not found
          </h1>
        </main>
      </body>
    </html>
  );
}
