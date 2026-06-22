import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topBand}>
        <div className="container">
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <span className={styles.crownIcon}>👑</span>
                <div>
                  <div className={styles.logoMain}>Cafe Crown</div>
                  <div className={styles.logoTagline}>Where Every Flavour Tells A Story</div>
                </div>
              </div>
              <p className={styles.brandDesc}>
                A cozy vegetarian cafe in Lucknow serving quality food at budget-friendly prices.
                Rated 4.8★ by our happy customers.
              </p>
              <div className={styles.rating}>
                <span className={styles.stars}>★★★★★</span>
                <span>4.8 / 5 · 23 reviews</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={styles.colTitle}>Quick Links</h3>
              <ul className={styles.linkList}>
                {[
                  { href: "/",        label: "Home" },
                  { href: "/menu",    label: "Menu" },
                  { href: "/order",   label: "Order Online" },
                  { href: "/reviews", label: "Reviews" },
                  { href: "/about",   label: "About Us" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={styles.footerLink}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className={styles.colTitle}>Contact Us</h3>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactIcon}>📞</span>
                  <a href="tel:+919838226066" className={styles.footerLink}>098382 26066</a>
                </li>
                <li>
                  <span className={styles.contactIcon}>📍</span>
                  <address className={styles.address}>
                    Bharwara Crossing Rd,<br />Lucknow, UP 226010
                  </address>
                </li>
                <li>
                  <span className={styles.contactIcon}>🕐</span>
                  <div>
                    <div className={styles.hours}>11:00 AM – 10:00 PM</div>
                    <div className={styles.hoursNote}>Closed on Mondays</div>
                  </div>
                </li>
                <li>
                  <span className={styles.contactIcon}>💳</span>
                  <span className={styles.footerText}>UPI · Cards · Cash</span>
                </li>
              </ul>
            </div>

            {/* Map */}
            <div>
              <h3 className={styles.colTitle}>Find Us</h3>
              <div className={styles.mapWrapper}>
                <iframe
                  title="Cafe Crown Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d80.9!3d26.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfda9a6c9d1a5%3A0x6a8f2e0b1c8e3f4d!2sCafe%20Crown!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="160"
                  style={{ border: 0, borderRadius: "0.75rem" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/cafecrown"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-outline-light btn-sm ${styles.directionsBtn}`}
              >
                Get Directions →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBand}>
        <div className="container">
          <p className={styles.copyright}>
            © {year} Cafe Crown, Lucknow. All rights reserved.
          </p>
          <p className={styles.tagline}>🌿 100% Pure Vegetarian · Quality Wears A Crown Here 👑</p>
        </div>
      </div>
    </footer>
  );
}
