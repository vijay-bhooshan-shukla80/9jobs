"use client";

import { CreditCard } from "lucide-react";

export default function PricingCheckoutButton({ plan, className, style }) {
  const handleCheckout = async () => {
    try {
      if (plan?.action === "contact") {
        window.location.href = plan.href || "/contact";
        return;
      }

      const endpoint = plan?.checkoutEndpoint || "/api/billing/one-time-checkout";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName: plan.name,
          token: plan.token,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error || "Network response was not ok");
      }

      const session = await response.json();

      if (!session.url) {
        throw new Error("Stripe checkout URL was not returned");
      }

      window.location.href = session.url;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  return (
    <button onClick={handleCheckout} className={className} style={style}>
      {plan?.ctaLabel || "Pay Now"} <CreditCard size={17} style={{ marginLeft: '8px' }} />
    </button>
  );
}
