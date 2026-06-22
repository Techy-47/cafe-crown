import React from "react";
import Link from "next/link";
import { reviews } from "@/lib/menuData";
import styles from "./ReviewsPreview.module.css";

const AVATAR_COLORS = [
  "#2D5A3D", "#E8A040", "#D44A3A", "#6B3FA0", "#1565C0",
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars}>
      {"★".repeat(rating)}{"☆".repeat(5 - rating)}
    </span>
  );
}

export default function ReviewsPreview() {
  const preview = reviews.slice(0, 3);

  return (
    <section className={styles.section} id="reviews-preview">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">Customer Love</span>
          <h2 className="text-display section-title">
            What Our Guests Say ❤️
          </h2>
          <p className="section-subtitle">
            Over 23 five-star experiences and counting. Join our happy community.
          </p>
        </div>

        {/* Overall rating */}
        <div className={styles.overallRating}>
          <div className={styles.ratingBig}>
            <span className={styles.ratingNum}>4.8</span>
            <div>
              <div className={styles.bigStars}>★★★★★</div>
              <div className={styles.ratingMeta}>23 reviews on Google Maps</div>
            </div>
          </div>
          <div className={styles.ratingBars}>
            {[
              { stars: 5, count: 19, pct: 83 },
              { stars: 4, count: 3,  pct: 13 },
              { stars: 3, count: 1,  pct: 4  },
              { stars: 2, count: 0,  pct: 0  },
              { stars: 1, count: 0,  pct: 0  },
            ].map((r) => (
              <div key={r.stars} className={styles.barRow}>
                <span className={styles.barLabel}>{r.stars}★</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${r.pct}%` }} />
                </div>
                <span className={styles.barCount}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className={styles.grid}>
          {preview.map((rev, i) => (
            <div key={rev.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div
                  className={styles.avatar}
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className={styles.reviewerName}>{rev.name}</div>
                  {"badge" in rev && rev.badge && (
                    <div className={styles.badge}>🏅 {rev.badge}</div>
                  )}
                </div>
                <div className={styles.cardMeta}>
                  <Stars rating={rev.rating} />
                  <span className={styles.date}>{rev.date}</span>
                </div>
              </div>
              <p className={styles.reviewText}>{rev.text}</p>
              <div className={styles.tags}>
                {rev.tags.map((t) => (
                  <span key={t} className={styles.tagChip}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link href="/reviews" className="btn btn-outline">
            Read All Reviews
          </Link>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            Leave a Review ★
          </a>
        </div>
      </div>
    </section>
  );
}
