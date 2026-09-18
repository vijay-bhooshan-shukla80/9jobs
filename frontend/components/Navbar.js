"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/success-stories", label: "Success Stories" },
  {
    label: "Australian Jobs",
    href: "/jobs",
    isDropdown: true,
    hidden: true,
    dropdownLinks: [
      { href: "/jobs/melbourne", label: "Melbourne" },
      { href: "/jobs/sydney", label: "Sydney NSW" },
      { href: "/jobs/brisbane", label: "Brisbane QLD" },
      { href: "/jobs/perth", label: "Perth WA" },
      { href: "/jobs/adelaide", label: "Adelaide SA" },
      { href: "/jobs/geelong", label: "Geelong VIC" },
      { href: "/jobs/vic", label: "Victoria VIC" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    isDropdown: true,
    dropdownLinks: [
      { href: "/services/resume-writing", label: "Resume Writing" },
      { href: "/services/linkedin-optimization", label: "Linkedin Optimization" },
      { href: "/services/seek-profile-optimization", label: "Seek Profile Optimization" },
      { href: "/services/job-application-automation", label: "Job Sourcing - Applications" },
      { href: "/services/interview-coaching", label: "Interview Coaching" },
      { href: "/blog", label: "Blog" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

function normalizeMenuLabel(label) {
  return label.replace(/[—–‑−]/g, "-");
}

function isActive(pathname, href) {
  return pathname === href;
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

  const visibleLinks = links.filter((link) => !link.hidden);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-nav fj-nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-inner fj-nav-inner">
        <Link className="brand fj-brand" href="/" aria-label="9Jobs home">
          {pathname === "/client-information" || pathname === "/client-information/" ? (
            <img
              src="https://res.cloudinary.com/er2zhu72/image/upload/v1789035479/9jobs-logo-removebg-preview.png"
              width="170"
              height="56"
              style={{ width: '170px', height: '56px', objectFit: 'cover', display: 'block' }}
              alt="9Jobs"
            />
          ) : (
            <>
              <span className="fj-brand-mark" role="presentation">
                <span />
                <span />
              </span>
              <span>9Jobs</span>
            </>
          )}
        </Link>

        <nav className="nav-links fj-nav-links" aria-label="Primary navigation">
          {visibleLinks.map((link) => {
            if (link.isDropdown) {
              const isDropdownOpen = activeDesktopDropdown === link.label;
              return (
                <div
                  key={link.label}
                  className="nav-dropdown-wrapper"
                  onMouseEnter={() => setActiveDesktopDropdown(link.label)}
                  onMouseLeave={() => setActiveDesktopDropdown(null)}
                >
                  <Link href={link.href} className="nav-dropdown-trigger" prefetch={false}>
                    {link.label} <ChevronDown size={14} />
                  </Link>
                  <div
                    className="nav-dropdown-menu"
                    style={{
                      opacity: isDropdownOpen ? 1 : 0,
                      visibility: isDropdownOpen ? "visible" : "hidden",
                      pointerEvents: isDropdownOpen ? "auto" : "none",
                      marginTop: isDropdownOpen ? "12px" : "20px",
                      transition: "opacity 180ms ease, margin-top 180ms ease, visibility 180ms ease"
                    }}
                  >
                    {link.dropdownLinks.map((subLink) => (
                      <Link
                        key={subLink.href}
                        className={`dropdown-link-item${pathname === subLink.href ? " is-active" : ""}`}
                        href={subLink.href}
                        prefetch={false}
                      >
                        {normalizeMenuLabel(subLink.label)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                className={isActive(pathname, link.href) ? "is-active" : undefined}
                href={link.href}
                prefetch={false}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions fj-nav-actions">
          <Link href="/pricing" className="fj-button fj-button--ghost" prefetch={false}>
            2 Days Trial
          </Link>
          <a href="tel:+61422279428" className="fj-button fj-button--dark">
            Book a call <ArrowRight size={17} />
          </a>
        </div>

        <button
          className="mobile-menu-button fj-menu-button"
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <nav
        className={`mobile-drawer fj-mobile-drawer${isOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        {visibleLinks.map((link) => {
          if (link.isDropdown) {
            const isMobileDropdownOpen = activeMobileDropdown === link.label;
            return (
              <div key={link.label} className="mobile-dropdown-container">
                <button
                  className="mobile-dropdown-trigger"
                  type="button"
                  onClick={() => setActiveMobileDropdown((prev) => prev === link.label ? null : link.label)}
                >
                  <span>{link.label}</span>
                  <ChevronDown
                    size={18}
                    style={{
                      transform: isMobileDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
                {isMobileDropdownOpen ? (
                  <div className="mobile-dropdown-links">
                    {link.dropdownLinks.map((subLink) => (
                      <Link
                        key={subLink.href}
                        className={`mobile-dropdown-link-item${pathname === subLink.href ? " is-active" : ""}`}
                        href={subLink.href}
                        prefetch={false}
                        onClick={() => {
                          setIsOpen(false);
                          setActiveMobileDropdown(null);
                        }}
                      >
                        {normalizeMenuLabel(subLink.label)}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <Link
              key={link.href}
              className={isActive(pathname, link.href) ? "is-active" : undefined}
              href={link.href}
              prefetch={false}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          );
        })}
        <Link className="fj-button fj-button--ghost" href="/pricing" prefetch={false} onClick={() => setIsOpen(false)}>
          2 Days Trial
        </Link>
        <a className="fj-button fj-button--dark" href="tel:+61422279428" onClick={() => setIsOpen(false)}>
          Book a call <ArrowRight size={17} />
        </a>
      </nav>
    </header>
  );
}
