"use client";

import { Children, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Plain markup is visible on the server; the public observer enhances it after mount.
export function Reveal({
  as: Tag = "div", children, className, style,
  delay = 0, direction = "up", distance: _distance, duration: _duration,
  once: _once, amount: _amount, ...props
}) {
  return <Tag className={className} style={style} data-public-reveal={direction} data-public-delay={Math.min(delay * 1000, 240)} {...props}>{children}</Tag>;
}

export function StaggerContainer({
  as: Tag = "div", children, className, stagger = 0.08,
  delayChildren: _delayChildren, once: _once, amount: _amount, ...props
}) {
  return <Tag className={className} data-public-stagger={Math.max(70, Math.min(stagger * 1000, 120))} {...props}>{children}</Tag>;
}

export function StaggerItem({
  as: Tag = "div", children, className, direction = "up",
  distance: _distance, duration: _duration, ...props
}) {
  return <Tag className={className} data-public-reveal={direction} {...props}>{children}</Tag>;
}

export function FloatingCard({
  children,
  className,
  depth = 18,
  floatRange = 10,
  duration = 6.8,
  delay = 0,
  style,
  ...props
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
  const parallaxSpring = useSpring(parallaxY, {
    stiffness: 90,
    damping: 18,
    mass: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: reduceMotion ? 0 : parallaxSpring, willChange: "transform", ...style }}
      {...props}
    >
      <motion.div
        style={{ willChange: "transform" }}
        animate={
          reduceMotion
            ? undefined
            : {
                y: [0, -floatRange, 0],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration,
                delay,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 1.25,
  prefix = "",
  suffix = "",
  className,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.55 });
  const [display, setDisplay] = useState(() => value.toFixed(decimals));

  useEffect(() => {
    if (!isInView) return undefined;

    let frameId = 0;
    const startedAt = performance.now();
    const finalValue = value.toFixed(decimals);

    if (reduceMotion) {
      frameId = window.requestAnimationFrame(() => setDisplay(finalValue));
      return () => window.cancelAnimationFrame(frameId);
    }

    function tick(now) {
      const progress = Math.min((now - startedAt) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((value * eased).toFixed(decimals));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [decimals, duration, isInView, reduceMotion, value]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function Marquee({
  children,
  className,
  itemClassName,
  speed = "34s",
  mobileStatic = false,
  ariaLabel,
}) {
  const items = Children.toArray(children);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`fj-motion-marquee${mobileStatic ? " is-mobile-static" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--marquee-duration": speed }}
      aria-label={ariaLabel}
    >
      <div className="fj-motion-marquee__fade fj-motion-marquee__fade--left" aria-hidden="true" />
      <div className="fj-motion-marquee__fade fj-motion-marquee__fade--right" aria-hidden="true" />
      <div className={`fj-motion-marquee__track${reduceMotion ? " is-reduced" : ""}`}>
        {[...items, ...items].map((child, index) => (
          <div className={itemClassName} key={`marquee-item-${index}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScrollProgressLine({ className }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 35%"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.2,
  });

  return (
    <div ref={ref} className={`fj-progress-line-shell${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="fj-progress-line-base" />
      <motion.span
        className="fj-progress-line-fill"
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
      />
    </div>
  );
}

export function HoverCard({ children, className, style, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.25, ease: EASE }}
      style={{ willChange: "transform", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedAccordion({ question, answer, isOpen, onToggle }) {
  return (
    <div className={`fj-faq-panel${isOpen ? " is-open" : ""}`} style={{ overflow: "hidden" }}>
      <button
        className="fj-faq-trigger"
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span>{question}</span>
        <motion.span
          className="fj-faq-icon"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.36, ease: EASE }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 26px 24px" }}>
              <p>{answer}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function PageTransition({ children, style }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: EASE }}
      style={{ willChange: "transform, opacity", ...style }}
    >
      {children}
    </motion.div>
  );
}

export function GradientBlob({ className, style, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`fj-home-orb ${className || ""}`}
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.08, 0.96, 1.04, 1],
              rotate: [0, 20, -15, 30, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 14,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }
      }
      style={{ willChange: "transform", ...style }}
      {...props}
    />
  );
}
