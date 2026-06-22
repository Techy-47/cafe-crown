'use client';

import { useEffect, useRef } from 'react';
import { reviews } from '@/lib/menuData';
import styles from './reviews.module.css';

// ── CONSTANTS ─────────────────────────────────────────────────
const GOOGLE_MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Cafe+Crown+Lucknow';

const OVERALL_RATING  = 4.8;
const TOTAL_REVIEWS   = 23;

// Rating distribution (5→1 stars), count of reviews per star level
const RATING_DISTRIBUTION = [
  { stars: 5, count: 18, pct: 78 },
  { stars: 4, count: 4,  pct: 17 },
  { stars: 3, count: 1,  pct: 4  },
  { stars: 2, count: 0,  pct: 0  },
  { stars: 1, count: 0,  pct: 0  },
];

// Stable avatar colors keyed by first letter
const AVATAR_COLORS: Record<string, string> = {
  A: '#2D5A3D', B: '#1565C0', C: '#6A1B9A', D: '#AD1457', E: '#00838F',
  F: '#4E342E', G: '#37474F', H: '#558B2F', I: '#E65100', J: '#283593',
  K: '#880E4F', L: '#1B5E20', M: '#4A148C', N: '#006064', O: '#BF360C',
  P: '#1A237E', Q: '#33691E', R: '#37474F', S: '#D84315', T: '#0D47A1',
  U: '#1B5E20', V: '#4A148C', W: '#006064', X: '#BF360C', Y: '#880E4F',
  Z: '#2D5A3D',
};

function getAvatarColor(name: string): string {
  const letter = name.charAt(0).toUpperCase();
  return AVATAR_COLORS[letter] ?? '#2D5A3D';
}

// ── STAR ROW ─────────────────────────────────────────────────
function StarRow({
  rating,
  filled = styles.reviewStarFilled,
  empty  = styles.reviewStarEmpty,
}: {
  rating: number;
  filled?: string;
  empty?: string;
}) {
  return (
    <span className={styles.reviewStars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? filled : empty} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

// ── ANIMATED RATING BAR ────────────────────────────────────────
function RatingBar({
  stars,
  count,
  pct,
}: {
  stars: number;
  count: number;
  pct: number;
}) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    // Trigger animation after mount (brief delay for stagger effect)
    const delay = (5 - stars) * 120;
    const timer = setTimeout(() => {
      el.style.animationDelay = '0ms';
      el.style.animationPlayState = 'running';
    }, delay);
    return () => clearTimeout(timer);
  }, [stars]);

  return (
    <div className={styles.ratingBarRow}>
      <span className={styles.ratingBarLabel}>{stars} ★</span>
      <div
        className={styles.ratingBarTrack}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${stars} stars: ${pct}%`}
      >
        <div
          ref={fillRef}
          className={styles.ratingBarFill}
          style={{
            width: `${pct}%`,
            animationPlayState: 'paused',
            animationDelay: `${(5 - stars) * 120}ms`,
          }}
        />
      </div>
      <span className={styles.ratingBarCount}>{count}</span>
    </div>
  );
}

// ── REVIEW CARD ────────────────────────────────────────────────
function ReviewCard({
  review,
}: {
  review: (typeof reviews)[number];
}) {
  const initial   = review.name.charAt(0).toUpperCase();
  const bgColor   = getAvatarColor(review.name);

  return (
    <article className={styles.reviewCard} aria-label={`Review by ${review.name}`}>
      {/* Reviewer row: avatar + name + badge */}
      <div className={styles.reviewerRow}>
        <div
          className={styles.reviewerAvatar}
          style={{ backgroundColor: bgColor }}
          aria-label={`${review.name} avatar`}
        >
          {initial}
        </div>
        <div className={styles.reviewerInfo}>
          <p className={styles.reviewerName}>{review.name}</p>
          <div className={styles.reviewerMeta}>
            {'badge' in review && review.badge === 'Local Guide' && (
              <span className={styles.localGuideBadge}>
                🗺️ Local Guide
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stars + date */}
      <div className={styles.reviewStarsRow}>
        <StarRow rating={review.rating} />
        <span className={styles.reviewDate}>{review.date}</span>
      </div>

      {/* Review text */}
      <p className={styles.reviewText}>{review.text}</p>

      {/* Tag chips */}
      {review.tags && review.tags.length > 0 && (
        <div className={styles.tagChips}>
          {review.tags.map((tag) => (
            <span key={tag} className={styles.tagChip}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function ReviewsPage() {
  const fullStars  = Math.floor(OVERALL_RATING);
  const hasHalf    = OVERALL_RATING % 1 >= 0.5;

  return (
    <>
      {/* SEO */}
      <title>Customer Reviews — Cafe Crown Lucknow | 4.8★ on Google</title>
      <meta
        name="description"
        content="See what customers love about Cafe Crown — 4.8 stars on Google Maps, 23 reviews. Premium vegetarian food in Lucknow at budget-friendly prices."
      />

      {/* ── HERO ── */}
      <section className={styles.hero} aria-label="Reviews hero">
        {/* Floating stars decoration */}
        <div className={styles.heroStars} aria-hidden="true">
          {['★', '★', '★', '★', '★', '★'].map((s, i) => (
            <span key={i} className={styles.heroStarFloat}>{s}</span>
          ))}
        </div>

        <p className={styles.heroEyebrow}>⭐ Google Reviews</p>
        <h1 className={styles.heroTitle}>
          What Our{' '}
          <span className={styles.heroTitleAccent}>Customers Say</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Real stories from real food lovers — every cup, every bite, every smile.
        </p>
      </section>

      {/* ── RATING OVERVIEW ── */}
      <section className={styles.overviewSection} aria-label="Overall rating">
        <div className={styles.overviewCard}>
          {/* Left: big number */}
          <div className={styles.ratingLeft}>
            <div
              className={styles.ratingBigNumber}
              aria-label={`Overall rating: ${OVERALL_RATING} out of 5`}
            >
              {OVERALL_RATING}
            </div>
            <div className={styles.ratingStars} aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={n <= fullStars ? styles.starFilled : styles.starEmpty}
                >
                  ★
                </span>
              ))}
            </div>
            <p className={styles.ratingSource}>
              {TOTAL_REVIEWS} reviews on{' '}
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ratingSourceLink}
              >
                Google Maps ↗
              </a>
            </p>
          </div>

          {/* Right: bar chart */}
          <div className={styles.ratingRight}>
            <p className={styles.ratingBarTitle}>Rating Breakdown</p>
            {RATING_DISTRIBUTION.map((row) => (
              <RatingBar
                key={row.stars}
                stars={row.stars}
                count={row.count}
                pct={row.pct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS GRID ── */}
      <section className={styles.reviewsSection} aria-label="Customer reviews">
        <div className={styles.reviewsSectionHeader}>
          <p className={styles.reviewsSectionEyebrow}>✦ Verified Reviews</p>
          <h2 className={styles.reviewsSectionTitle}>
            Voices From Our Community
          </h2>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className={styles.ctaSection} aria-label="Leave a review">
        <div className={styles.ctaContent}>
          <span className={styles.ctaIcon} aria-hidden="true">⭐</span>
          <h2 className={styles.ctaTitle}>Enjoyed Your Visit?</h2>
          <p className={styles.ctaSubtitle}>
            Share your experience and help other food lovers discover Cafe Crown.
            Your words mean the world to us! 👑
          </p>
          <a
            href={GOOGLE_MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
            id="leave-review-btn"
            aria-label="Leave a review on Google Maps"
          >
            ⭐ Leave a Review on Google Maps
          </a>
        </div>
      </section>
    </>
  );
}
