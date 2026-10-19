"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
];

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

function getScrolled() {
  return window.scrollY > 40;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, () => false);

  useEffect(() => {
    if (!menuOpen) return;

    const lockScroll = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("wheel", lockScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchmove", lockScroll, {
      passive: false,
      capture: true,
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("wheel", lockScroll, { capture: true });
      document.removeEventListener("touchmove", lockScroll, { capture: true });
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const linkClassName =
    "relative text-muted transition-colors hover:text-text after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 after:ease-out hover:after:w-full";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-5 ${
          scrolled
            ? "border-b border-border bg-bg/80 backdrop-blur-md"
            : "border-b border-transparent"
        }`}
      >
        <Link
          href="/"
          data-cursor="hover"
          onClick={closeMenu}
          className="font-sans font-semibold text-text"
        >
          Ilham Ammar
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                href={link.href}
                data-cursor="hover"
                className={linkClassName}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                data-cursor="hover"
                className={linkClassName}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <button
          type="button"
          data-cursor="hover"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex flex-col gap-1.5 md:hidden"
        >
          <span className="block h-px w-6 bg-text" />
          <span className="block h-px w-6 bg-text" />
          <span className="block h-px w-6 bg-text" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-bg md:hidden">
          <button
            type="button"
            data-cursor="hover"
            aria-label="Close menu"
            onClick={closeMenu}
            className="absolute right-8 top-5 p-1"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-text"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                href={link.href}
                data-cursor="hover"
                onClick={closeMenu}
                className="text-[40px] text-text"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                data-cursor="hover"
                onClick={closeMenu}
                className="text-[40px] text-text"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      )}
    </>
  );
}
