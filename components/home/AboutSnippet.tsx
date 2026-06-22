import React from "react";
import Link from "next/link";
import styles from "./AboutSnippet.module.css";

export default function AboutSnippet() {
  return (
    <section className={styles.section} id="about-snippet">
      <div className="container">
        <div className={styles.layout}>
          {/* Left — Text */}
          <div className={styles.textSide}>
            <span className="section-eyebrow">Our Story</span>
            <h2 className={`text-display ${styles.heading}`}>
              Quality Wears A Crown Here 👑
            </h2>
            <p className={styles.body}>
              Tucked at Bharwara Crossing in the heart of Lucknow, Cafe Crown was
              born from a simple belief — that great food doesn&apos;t have to break
              the bank. Every dish is crafted with care, using fresh ingredients, in
              a cozy space that feels like home.
            </p>
            <p className={styles.body}>
              Whether you&apos;re dropping in solo for a kullhad chai or celebrating a
              birthday with your crew, we make every visit memorable. 100% vegetarian,
              always fresh, always welcoming.
            </p>

            {/* Highlights */}
            <ul className={styles.highlights}>
              {[
                { icon: "🌿", text: "100% Pure Vegetarian Menu" },
                { icon: "💰", text: "Budget-friendly prices (₹15 – ₹120)" },
                { icon: "⏱️", text: "Orders ready in under 10 minutes" },
                { icon: "👨‍👩‍👧‍👦", text: "Perfect for groups, dates & solo visits" },
                { icon: "💳", text: "UPI, Cards & Cash accepted" },
              ].map((h) => (
                <li key={h.text} className={styles.highlight}>
                  <span className={styles.highlightIcon}>{h.icon}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>

            <div className={styles.actions}>
              <Link href="/about" className="btn btn-primary">
                Our Full Story →
              </Link>
              <a href="tel:+919838226066" className="btn btn-outline">
                📞 Call to Book
              </a>
            </div>
          </div>

          {/* Right — Info Cards */}
          <div className={styles.cardSide}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <span className={styles.infoCardIcon}>📍</span>
                <h3 className={styles.infoCardTitle}>Location</h3>
              </div>
              <p className={styles.infoCardText}>
                Bharwara Crossing Rd,<br />Lucknow, Uttar Pradesh 226010
              </p>
              <a
                href="https://maps.app.goo.gl/cafecrown"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoCardLink}
              >
                Get Directions →
              </a>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <span className={styles.infoCardIcon}>🕐</span>
                <h3 className={styles.infoCardTitle}>Opening Hours</h3>
              </div>
              <div className={styles.hoursGrid}>
                {[
                  { day: "Tuesday",   hours: "11 AM – 10 PM" },
                  { day: "Wednesday", hours: "11 AM – 10 PM" },
                  { day: "Thursday",  hours: "11 AM – 10 PM" },
                  { day: "Friday",    hours: "11 AM – 10 PM" },
                  { day: "Saturday",  hours: "11 AM – 10 PM" },
                  { day: "Sunday",    hours: "11 AM – 10 PM" },
                  { day: "Monday",    hours: "CLOSED", closed: true },
                ].map((h) => (
                  <div key={h.day} className={`${styles.hoursRow} ${h.closed ? styles.closed : ""}`}>
                    <span>{h.day}</span>
                    <span className={h.closed ? styles.closedText : styles.openText}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.infoCard} ${styles.ratingCard}`}>
              <div className={styles.ratingBig}>4.8</div>
              <div className={styles.ratingStars}>★★★★★</div>
              <div className={styles.ratingCount}>Based on 23 Google Reviews</div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-outline btn-sm ${styles.reviewBtn}`}
              >
                Leave a Review
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
