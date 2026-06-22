"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className={styles.hero} id="hero">
      {/* Animated background */}
      <div className={styles.bg}>
        <div className={styles.bgGradient} />
        <div className={styles.bgPattern} />
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          <span>Lucknow&apos;s Finest Vegetarian Cafe</span>
          <span className={styles.eyebrowDot} />
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Where Every</span>
          <span className={styles.titleLine2}>
            Flavour Tells{" "}
            <span className={styles.titleAccent}>A Story</span>
          </span>
        </h1>

        <p className={styles.subtitle}>
          Premium vegetarian food at budget-friendly prices. Cold coffees, 
          burgers, maggi, pasta & more — all under ₹120.
        </p>

        {/* Rating Bar */}
        <div className={styles.ratingBar}>
          <div className={styles.stars}>★★★★★</div>
          <div className={styles.ratingInfo}>
            <span className={styles.ratingNum}>4.8</span>
            <span className={styles.ratingLabel}>/ 5 · 23 Google Reviews</span>
          </div>
          <div className={styles.ratingDivider} />
          <div className={styles.ratingTags}>
            <span className={styles.tag}>🍃 100% Veg</span>
            <span className={styles.tag}>₹15–₹120</span>
            <span className={styles.tag}>11 AM–10 PM</span>
          </div>
        </div>

        {/* CTAs */}
        <div className={styles.ctas}>
          <Link href="/order" className={`btn btn-gold btn-lg ${styles.ctaPrimary}`} id="hero-order-btn">
            <span>Order Online</span>
            <span>→</span>
          </Link>
          <Link href="/menu" className={`btn btn-outline-light btn-lg ${styles.ctaSecondary}`} id="hero-menu-btn">
            View Menu
          </Link>
          <a href="tel:+919838226066" className={`btn ${styles.ctaPhone}`} id="hero-call-btn">
            📞 Call Us
          </a>
        </div>
      </div>

      {/* Floating food cards */}
      <div className={styles.floatingCards}>
        {[
          { emoji: "☕", name: "Cold Coffee", price: "₹59", delay: "0s" },
          { emoji: "🍔", name: "Cheese Burger", price: "₹79", delay: "0.4s" },
          { emoji: "🍜", name: "Maggi Nirvana", price: "₹99", delay: "0.8s" },
          { emoji: "🥤", name: "KitKat Shake", price: "₹99", delay: "1.2s" },
        ].map((card) => (
          <div key={card.name} className={styles.floatingCard} style={{ animationDelay: card.delay }}>
            <span className={styles.cardEmoji}>{card.emoji}</span>
            <div className={styles.cardInfo}>
              <span className={styles.cardName}>{card.name}</span>
              <span className={styles.cardPrice}>{card.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollMouse}>
          <div className={styles.scrollWheel} />
        </div>
      </div>
    </section>
  );
}
