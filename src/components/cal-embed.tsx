// Mounts the Cal.com inline embed for the Constraint Review calendar.
// Snippet (origin + namespace + calLink + brand color) supplied by user — preserved verbatim.
// React-StrictMode-safe: a module-level guard prevents the bootstrap script from being
// appended twice. Subsequent mounts only re-run the inline + ui calls so the calendar
// renders into our container.

"use client";
import { useEffect, useRef } from "react";

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalFn>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

let bootstrapped = false;

function bootstrap() {
  if (bootstrapped || typeof window === "undefined") return;
  bootstrapped = true;

  // Verbatim bootstrap from the user-supplied Cal.com embed snippet.
  (function (C: Window, A: string, L: string) {
    const p = function (a: CalFn, ar: IArguments | unknown[]) {
      a.q = a.q || [];
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function (...args: unknown[]) {
        const cal = C.Cal as CalFn;
        // eslint-disable-next-line prefer-rest-params
        const ar: IArguments = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).setAttribute("src", A);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function (...inner: unknown[]) {
            p(api as CalFn, inner);
          } as CalFn;
          const namespace = ar[1] as string;
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns = cal.ns || {};
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace] as unknown[]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
        void args;
      };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  window.Cal!("init", "constraint-review", { origin: "https://app.cal.com" });
}

export function CalEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Defer the embed.js bootstrap until the booking fold (bottom of /vsl) is near
    // the viewport, so the third-party script never competes with initial load. The
    // container reserves a fixed height upstream, so this causes no layout shift.
    let done = false;
    const init = () => {
      if (done) return;
      done = true;

      bootstrap();
      const Cal = window.Cal;
      if (!Cal || !Cal.ns) return;
      const ns = Cal.ns["constraint-review"];
      if (!ns) return;

      ns("inline", {
        elementOrSelector: "#my-cal-inline-constraint-review",
        config: {
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "auto",
        },
        calLink: "ryan-el-ghoul-houo4g/constraint-review",
      });

      ns("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#B8365A" },
          dark: { "cal-brand": "#B8365A" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          init();
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id="my-cal-inline-constraint-review"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
    />
  );
}
