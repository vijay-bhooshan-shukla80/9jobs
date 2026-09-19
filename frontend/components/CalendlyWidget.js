"use client";

import Link from "next/link";

const BOOKING_PATH = "/book-a-call";

export function CalendlyLoader() {
  return null;
}

export function CalendlyLink({ children, className, onClick }) {
  return (
    <Link
      className={className}
      href={BOOKING_PATH}
      onClick={onClick}
      prefetch={false}
    >
      {children}
    </Link>
  );
}
