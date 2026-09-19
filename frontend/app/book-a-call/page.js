import Link from "next/link";

import CalendlyBooking from "@/components/CalendlyBooking";

import styles from "./page.module.css";

export const metadata = {
  title: "Connect with Founder",
  description: "Book a 15-minute Google Meet call with the 9Jobs founder.",
};

export default function BookACallPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/" aria-label="Back to 9Jobs">
        ←
      </Link>
      <div className={styles.scaledStage}>
        <CalendlyBooking />
      </div>
    </main>
  );
}
