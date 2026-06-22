import React from "react";
import styles from "./Stats.module.css";

const stats = [
  { value: "4.8★",   label: "Google Rating",      icon: "⭐", suffix: "" },
  { value: "23",     label: "Happy Reviews",       icon: "💬", suffix: "+" },
  { value: "₹15",    label: "Starting Price",      icon: "💰", suffix: "" },
  { value: "100%",   label: "Vegetarian Menu",     icon: "🌿", suffix: "" },
  { value: "9",      label: "Food Categories",     icon: "🍽️", suffix: "+" },
  { value: "10",     label: "Min Avg Wait Time",   icon: "⏱️", suffix: " min" },
];

export default function Stats() {
  return (
    <section className={styles.section} aria-label="Cafe highlights">
      <div className="container">
        <div className={styles.grid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.card}>
              <span className={styles.icon}>{s.icon}</span>
              <div>
                <div className={styles.value}>
                  {s.value}<span className={styles.suffix}>{s.suffix}</span>
                </div>
                <div className={styles.label}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
