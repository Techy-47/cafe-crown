"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/",        label: "Home" },
    { href: "/menu",    label: "Menu" },
    { href: "/order",   label: "Order Online" },
    { href: "/reviews", label: "Reviews" },
    { href: "/about",   label: "About" },
  ];

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Cafe Crown Home">
            <span className={styles.crownIcon}>👑</span>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>Cafe Crown</span>
              <span className={styles.logoTagline}>Where Every Flavour Tells A Story</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.navLink}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/order" className={`btn btn-gold btn-sm ${styles.orderBtn}`}>
              Order Online
            </Link>

            <button
              id="cart-toggle-btn"
              className={styles.cartBtn}
              onClick={toggleCart}
              aria-label={`Open cart, ${totalItems} items`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className={styles.cartBadge}>{totalItems}</span>
              )}
            </button>

            {/* Hamburger */}
            <button
              id="mobile-menu-btn"
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={menuOpen}
            >
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={`${styles.mobileNav} ${menuOpen ? styles.mobileNavOpen : ""}`} aria-hidden={!menuOpen}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/order" className={`btn btn-gold ${styles.mobileCta}`} onClick={() => setMenuOpen(false)}>
            Order Online
          </Link>
          <div className={styles.mobileContact}>
            <a href="tel:+919838226066">📞 098382 26066</a>
            <span>11 AM – 10 PM</span>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
