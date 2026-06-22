"use client";
import React from "react";
import Link from "next/link";
import { menuItems } from "@/lib/menuData";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import styles from "./FeaturedMenu.module.css";

// Handpicked featured items
const FEATURED_IDS = [
  "tc-04", // Hot Coffee
  "bv-01", // Cold Coffee
  "bv-06", // KitKat Shake
  "bg-03", // Veg Cheese Burger
  "sw-04", // Veg Cheese Sandwich
  "mg-08", // Maggi Nirvana
  "bg-05", // Korean Veg Burger
  "pa-04", // White Sauce Pasta
];

export default function FeaturedMenu() {
  const { addItem } = useCart();
  const featured = menuItems.filter((m) => FEATURED_IDS.includes(m.id));

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addItem(item);
    toast.success(`${item.name} added to cart!`, { icon: "✓" });
  };

  const tagClass: Record<string, string> = {
    "Bestseller":    "badge-bestseller",
    "Spicy":         "badge-spicy",
    "New":           "badge-new",
    "Chef's Special":"badge-special",
    "Gluten Free":   "badge-gluten",
  };

  return (
    <section className={styles.section} id="featured-menu">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">Our Specialities</span>
          <h2 className={`text-display section-title`}>
            Customer Favourites 👑
          </h2>
          <p className="section-subtitle">
            Handpicked by our most loyal guests — tried, loved, and ordered again.
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {featured.map((item) => (
            <div key={item.id} className={styles.card}>
              {/* Veg + Tag row */}
              <div className={styles.topRow}>
                <div className={styles.vegIcon}>
                  <div className={styles.vegDot} />
                </div>
                {item.tag && (
                  <span className={`badge ${tagClass[item.tag] || ""}`}>
                    {item.tag}
                  </span>
                )}
              </div>

              {/* Name & Category */}
              <div className={styles.itemName}>{item.name}</div>
              <div className={styles.itemCategory}>{item.category}</div>

              {/* Description if exists */}
              {item.description && (
                <p className={styles.itemDesc}>{item.description}</p>
              )}

              {/* Bottom row */}
              <div className={styles.bottomRow}>
                <span className={styles.price}>
                  ₹{item.price === 0 ? "MRP" : item.price}
                </span>
                <button
                  className={styles.addBtn}
                  onClick={() => handleAdd(item)}
                  aria-label={`Add ${item.name} to cart`}
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link href="/menu" className="btn btn-primary btn-lg">
            View Full Menu →
          </Link>
          <Link href="/order" className="btn btn-gold btn-lg">
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}
