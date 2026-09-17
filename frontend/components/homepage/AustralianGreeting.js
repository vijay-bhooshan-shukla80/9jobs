"use client";

import { useEffect, useState } from "react";
import { getAustralianGreeting } from "./australianGreeting.mjs";

export default function AustralianGreeting() {
  const [greeting, setGreeting] = useState("Welcome!");

  useEffect(() => {
    const update = () => setGreeting(getAustralianGreeting());
    const initialUpdate = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 30_000);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return <strong data-australian-greeting="true">{greeting}</strong>;
}
