"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion/dom/mini";

export default function HeroVisualMotion({ children, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine)");
    const controls = new Map();
    let entered = false, visible = false, frame = 0, pointerX = 0, pointerY = 0;
    const reset = () => ["--pointer-x", "--pointer-y", "--scroll-y"].forEach(key => root.style.setProperty(key, "0px"));
    const paint = () => {
      frame = 0;
      if (reduced.matches || !visible) return;
      const box = root.getBoundingClientRect();
      const travel = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height)));
      root.style.setProperty("--scroll-y", `${travel * (desktop.matches ? 18 : 8)}px`);
      root.style.setProperty("--pointer-x", `${desktop.matches ? pointerX : 0}px`);
      root.style.setProperty("--pointer-y", `${desktop.matches ? pointerY : 0}px`);
    };
    const schedule = () => { if (!frame && visible && !reduced.matches) frame = requestAnimationFrame(paint); };
    const enter = () => {
      if (entered || reduced.matches) return;
      entered = true;
      root.dataset.motionReady = "true";
      const layers = [...root.querySelectorAll('[data-hero-layer="laptop"], [data-hero-layer="card"]'), root.querySelector('[data-hero-layer="decoration"]')];
      layers.filter(Boolean).forEach((el, index) => {
        const base = getComputedStyle(el).transform;
        const original = ["transform", "opacity"].map(key => [key, el.style.getPropertyValue(key)]);
        const control = animate(el, {
          opacity: [0, 1],
          transform: [`${base === "none" ? "" : base} translateY(20px) scale(${index ? .95 : .97})`, base],
        }, { duration: .6, delay: index * .085, ease: [.22, 1, .36, 1] });
        controls.set(control, () => { control.cancel(); original.forEach(([key, value]) => value ? el.style.setProperty(key, value) : el.style.removeProperty(key)); });
        control.then(() => { controls.get(control)?.(); controls.delete(control); });
      });
    };
    const state = () => {
      root.dataset.motionActive = String(visible && !document.hidden && !reduced.matches);
      if (reduced.matches) { controls.forEach(restore => restore()); controls.clear(); reset(); }
      else if (visible) { enter(); schedule(); }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; state(); }, { threshold: .08 });
    observer.observe(root);
    const move = event => {
      if (!desktop.matches || reduced.matches) return;
      const box = root.getBoundingClientRect();
      pointerX = Math.max(-4, Math.min(4, ((event.clientX - box.left) / box.width - .5) * 8));
      pointerY = Math.max(-3, Math.min(3, ((event.clientY - box.top) / box.height - .5) * 6));
      schedule();
    };
    const leave = () => { pointerX = pointerY = 0; schedule(); };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    desktop.addEventListener("change", leave);
    reduced.addEventListener("change", state);
    document.addEventListener("visibilitychange", state);
    return () => {
      observer.disconnect(); controls.forEach(restore => restore()); cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule); desktop.removeEventListener("change", leave);
      reduced.removeEventListener("change", state); document.removeEventListener("visibilitychange", state); reset();
    };
  }, []);
  return <div ref={ref} className={className} data-hero-motion="true">{children}</div>;
}

