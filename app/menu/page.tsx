'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { menuItems, menuCategories, categoryIcons, MenuItem } from '@/lib/menuData';
import { useCart } from '@/context/CartContext';
import styles from './menu.module.css';

// ── BADGE HELPER ──────────────────────────────────────────────
function getTagBadgeClass(tag: string): string {
  switch (tag) {
    case 'Bestseller':    return styles.badgeBestseller;
    case 'Spicy':         return styles.badgeSpicy;
    case 'New':           return styles.badgeNew;
    case "Chef's Special":return styles.badgeSpecial;
    case 'Gluten Free':   return styles.badgeGluten;
    default:              return '';
  }
}

function getTagEmoji(tag: string): string {
  switch (tag) {
    case 'Bestseller':    return '⭐';
    case 'Spicy':         return '🌶️';
    case 'New':           return '✨';
    case "Chef's Special":return '👨‍🍳';
    case 'Gluten Free':   return '🌿';
    default:              return '';
  }
}

// ── ITEM CARD ─────────────────────────────────────────────────
function ItemCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  function handleAdd() {
    addItem(item);
    toast.success(`${item.name} added to cart! 🛒`);
  }

  return (
    <article className={styles.itemCard}>
      {/* Top row: veg icon + badge */}
      <div className={styles.cardTop}>
        <div className={styles.vegIcon} aria-label="Vegetarian">
          <div className={styles.vegDot} />
        </div>
        {item.tag && (
          <span className={`${styles.badge} ${getTagBadgeClass(item.tag)}`}>
            {getTagEmoji(item.tag)} {item.tag}
          </span>
        )}
      </div>

      {/* Item name */}
      <h3 className={styles.itemName}>{item.name}</h3>

      {/* Description (optional) */}
      {item.description && (
        <p className={styles.itemDesc}>{item.description}</p>
      )}

      {/* Bottom row: price + add button */}
      <div className={styles.cardBottom}>
        <div>
          {item.price === 0 ? (
            <span className={styles.itemPriceMrp}>As per MRP</span>
          ) : (
            <span className={styles.itemPrice}>₹{item.price}</span>
          )}
        </div>
        <button
          className={styles.addBtn}
          onClick={handleAdd}
          id={`add-${item.id}`}
          aria-label={`Add ${item.name} to cart`}
        >
          + Add
        </button>
      </div>
    </article>
  );
}

// ── CATEGORY SECTION ──────────────────────────────────────────
function CategorySection({ category }: { category: string }) {
  const items = menuItems.filter(
    (item) => item.category === category && item.isAvailable
  );
  if (items.length === 0) return null;

  const icon = categoryIcons[category as keyof typeof categoryIcons];

  return (
    <section
      className={styles.categorySection}
      id={`category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
    >
      <div className="container">
        {/* Section header */}
        <div className={styles.categoryHeader}>
          <span className={styles.categoryIcon} aria-hidden="true">{icon}</span>
          <h2 className={styles.categoryTitle}>{category}</h2>
          <span className={styles.categoryCount}>{items.length} items</span>
        </div>

        {/* Item grid */}
        <div className={styles.itemGrid}>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const tabBarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Scroll active tab into view
  const scrollTabIntoView = useCallback((category: string) => {
    if (!tabBarRef.current) return;
    const tabEl = tabBarRef.current.querySelector(
      `[data-tab="${category}"]`
    ) as HTMLElement | null;
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, []);

  // Intersection observer: highlight active tab on scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const categoryEls = menuCategories.map((cat) => {
      const id = `category-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      return document.getElementById(id);
    });

    categoryEls.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const cat = menuCategories[i];
              setActiveCategory(cat);
              scrollTabIntoView(cat);
            }
          });
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [scrollTabIntoView]);

  // Click tab → smooth scroll to section
  function handleTabClick(category: string) {
    setActiveCategory(category);
    const id = `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const el = document.getElementById(id);
    if (el) {
      // Account for sticky nav height (~57px) + page navbar (~64px)
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    scrollTabIntoView(category);
  }

  const displayedCategories =
    activeCategory === 'All' ? [...menuCategories] : [activeCategory as typeof menuCategories[number]];

  return (
    <>
      {/* SEO */}
      <title>Menu — Cafe Crown | 100% Vegetarian Food in Lucknow</title>

      {/* ── HERO ── */}
      <section className={styles.hero} aria-label="Menu hero">
        <div className={styles.heroPattern} aria-hidden="true" />
        <span className={styles.heroDecor} aria-hidden="true">🌿</span>

        {/* 100% Veg Banner */}
        <div className={styles.vegBanner}>
          <span className={styles.vegBannerDot} aria-hidden="true" />
          100% Pure Vegetarian
        </div>

        <h1 className={styles.heroTitle}>
          Our Menu
          <span className={styles.heroTitleAccent}>Quality Wears A Crown Here</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Fresh ingredients · Generous portions · Budget-friendly prices
        </p>

        <span className={styles.heroDecor} aria-hidden="true">👑</span>
      </section>

      {/* ── STICKY CATEGORY TAB BAR ── */}
      <nav className={styles.stickyNav} aria-label="Menu categories">
        <div className={styles.tabBar} ref={tabBarRef} role="tablist">
          {menuCategories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              data-tab={cat}
              id={`tab-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
              onClick={() => handleTabClick(cat)}
            >
              <span className={styles.tabIcon} aria-hidden="true">
                {categoryIcons[cat]}
              </span>
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* ── MENU CONTENT ── */}
      <main className={styles.pageContent} id="menu-content">
        {menuCategories.map((cat) => (
          <CategorySection key={cat} category={cat} />
        ))}
      </main>
    </>
  );
}
