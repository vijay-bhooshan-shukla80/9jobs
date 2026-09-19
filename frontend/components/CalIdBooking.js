"use client";

import { useEffect, useRef } from "react";

const CAL_ID_ORIGIN = "https://cal.id";
const CAL_ID_EVENT = "krishna-chaitanya/connect-with-founder?duration=15";
const CAL_NAMESPACE = "ninejobs-founder-call";

function getCalApi() {
  if (window.Cal) return window.Cal;

  const push = (queue, args) => queue.q.push(args);
  const documentRef = window.document;

  window.Cal = function calQueue() {
    const cal = window.Cal;
    const args = arguments;

    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = documentRef.createElement("script");
      script.src = `${CAL_ID_ORIGIN}/embed-link/embed.js`;
      script.async = true;
      documentRef.head.appendChild(script);
      cal.loaded = true;
    }

    if (args[0] === "init") {
      const namespace = args[1];
      const namespacedQueue = function namespacedCalQueue() {
        push(namespacedQueue, arguments);
      };
      namespacedQueue.q = namespacedQueue.q || [];
      cal.ns[namespace] = cal.ns[namespace] || namespacedQueue;
      push(cal.ns[namespace], args);
      push(cal, ["initNamespace", namespace]);
      return;
    }

    push(cal, args);
  };

  return window.Cal;
}

export default function CalIdBooking() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.initialized === "true") return;

    container.dataset.initialized = "true";
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const Cal = getCalApi();
    Cal("init", CAL_NAMESPACE, { origin: CAL_ID_ORIGIN });
    Cal.ns[CAL_NAMESPACE]("ui", {
      theme: "light",
      layout: "month_view",
      cssVarsPerTheme: {
        light: { "cal-brand": "#0b87f7" },
        dark: { "cal-brand": "#0b87f7" },
      },
    });
    Cal.ns[CAL_NAMESPACE]("inline", {
      elementOrSelector: "#ninejobs-cal-id-booking",
      calLink: CAL_ID_EVENT,
      config: { layout: "month_view" },
    });

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <div
      id="ninejobs-cal-id-booking"
      ref={containerRef}
      className="cal-id-booking-container"
      aria-label="Book a 15-minute call with the 9Jobs founder"
    />
  );
}
