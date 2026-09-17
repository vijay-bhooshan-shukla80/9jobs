"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate } from "framer-motion/dom/mini";
import videoStyles from "./homepage/HomeVideoSection.module.css";
import creditStyles from "./homepage/ApplicationCreditsSection.module.css";

// AppChrome is the only caller. Select public roots, never document-wide content.
const rules = [
  [".fj-announcement", "down"],
  [".fj-hero h1, .fj-page-hero h1", "up", 80],
  [".fj-hero-subheading, .fj-page-hero p", "up", 160],
  [".fj-actions", "up", 240],
  [".fj-hero-dashboard-shell, .fj-image-card, .fj-comparison-card", "scale"],
  [".fj-hero-floating-card--resume", "left"],
  [".fj-hero-floating-card--applied", "right"],
  [".fj-section-head > *, .fj-copy-block > h2, .fj-copy-block > p, .fj-copy-block > .fj-label", "up"],
  [".fj-feature-card, .fj-plan-card, .fj-pricing-card, .fj-blog-card, .fj-mini-item, .fj-stat-card, .fj-faq-item, .fj-location-card", "up"],
  [".fj-activity-card", "left"],
  [".fj-role-card", "right"],
  [".fj-cta-card > *, .fj-final-cta > *, .fj-footer-grid > *", "up"],
  [`.${videoStyles.headerWrapper} > :not([aria-hidden]), .${videoStyles.videoCard}, .${videoStyles.benefitItem}`, "up"],
  [`.${creditStyles.headerWrapper} > *, .${creditStyles.leftCard}`, "up"],
  [`.${creditStyles.rightCard}`, "right"],
];

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname === "/admin" || pathname.startsWith("/admin/")) return;
    const roots = [...document.querySelectorAll("main.site-main, main.fj-page, .site-footer")];
    if (!roots.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const html = document.documentElement;
    const previousScroll = html.style.getPropertyValue("scroll-behavior");
    const previousPriority = html.style.getPropertyPriority("scroll-behavior");
    const seen = new WeakSet();
    const pending = new Map();
    const active = new Map();
    let disposed = false;

    function finish(element) {
      active.get(element)?.();
    }

    function reveal(element, { direction = "up", delay = 0 } = {}) {
      if (disposed || reduced.matches || element.contains(document.activeElement)) return;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return;
      const homepage = element.closest(".fj-homepage");
      const distance = homepage ? (mobile.matches ? 15 : 24) : (mobile.matches ? 18 : 28);
      const base = style.transform === "none" ? "" : style.transform;
      const offset = {
        up: `translateY(${distance}px)`, down: `translateY(-${distance}px)`,
        left: `translateX(-${distance}px)`, right: `translateX(${distance}px)`,
        scale: `translateY(${mobile.matches ? 18 : 20}px) scale(${homepage ? 0.97 : 0.98})`,
      }[direction] || `translateY(${distance}px)`;
      const original = ["opacity", "transform"].map(key => [key, element.style.getPropertyValue(key), element.style.getPropertyPriority(key)]);
      let control;
      const restore = () => {
        active.delete(element);
        control?.cancel();
        original.forEach(([key, value, priority]) => value ? element.style.setProperty(key, value, priority) : element.style.removeProperty(key));
      };
      active.set(element, restore);
      try {
        // No hidden waiting state: SSR, failed JS and unobserved content stay readable.
        control = animate(element, {
          opacity: [0, Number(style.opacity)],
          transform: [`${base} ${offset}`.trim(), style.transform],
        }, { duration: homepage ? .7 : (direction === "scale" ? 0.6 : 0.48), delay: Math.min(delay, 240) / 1000, ease: [0.22, 1, 0.36, 1] });
        // Motion commits its final styles after onComplete; restore after that commit.
        control.then(() => { if (active.get(element) === restore) restore(); });
      } catch {
        restore();
      }
    }

    const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const options = pending.get(entry.target);
        pending.delete(entry.target);
        observer.unobserve(entry.target);
        reveal(entry.target, options);
      });
    }, { threshold: 0.12 }) : null;

    function setup() {
      if (!observer || reduced.matches) return;
      roots.forEach(root => {
        const candidates = new Map();
        root.querySelectorAll("[data-public-reveal]").forEach(element => {
          candidates.set(element, { direction: element.dataset.publicReveal, delay: Number(element.dataset.publicDelay || 0) });
        });
        rules.forEach(([selector, direction, delay]) => {
          root.querySelectorAll(selector).forEach(element => {
            if (!candidates.has(element)) candidates.set(element, { direction, delay });
          });
        });
        const elements = [...candidates.keys()];
        const groups = new Map();
        candidates.forEach((options, element) => {
          // Select the smallest units, avoiding nested reveals and whole sections.
          if (elements.some(child => child !== element && element.contains(child))) return;
          if (seen.has(element)) return;
          seen.add(element);
          const group = element.closest("[data-public-stagger]") || element.parentElement;
          const index = groups.get(group) || 0;
          groups.set(group, index + 1);
          const stagger = Number(group.dataset.publicStagger || 80);
          pending.set(element, { ...options, delay: options.delay || Math.min(index, 3) * stagger });
          observer.observe(element);
        });
      });
    }

    function motionPreference() {
      html.style.setProperty("scroll-behavior", reduced.matches ? "auto" : "smooth", "important");
      if (reduced.matches) {
        observer?.disconnect();
        pending.clear();
        [...active.keys()].forEach(finish);
      } else setup();
    }
    function onFocus(event) {
      // Keyboard users never wait for an entrance effect.
      [...active.keys()].forEach(element => {
        if (element.contains(event.target)) finish(element);
      });
    }
    motionPreference();
    const mutations = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1))) setup();
    });
    roots.forEach(root => mutations.observe(root, { childList: true, subtree: true }));
    reduced.addEventListener("change", motionPreference);
    document.addEventListener("focusin", onFocus);

    return () => {
      disposed = true;
      observer?.disconnect();
      mutations.disconnect();
      reduced.removeEventListener("change", motionPreference);
      document.removeEventListener("focusin", onFocus);
      [...active.keys()].forEach(finish);
      if (previousScroll) html.style.setProperty("scroll-behavior", previousScroll, previousPriority);
      else html.style.removeProperty("scroll-behavior");
    };
  }, [pathname]);

  return null;
}

