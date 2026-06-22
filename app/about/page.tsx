import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Cafe Crown, Lucknow",
  description:
    "Learn about Cafe Crown — a premium vegetarian cafe in Lucknow at Bharwara Crossing. Our story, values, and contact info.",
};

export default function AboutPage() {
  return (
    <main style={{ paddingTop: "80px" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #1A2E22, #2D5A3D)",
          padding: "5rem 0 3rem",
          textAlign: "center",
        }}
      >
        <div className="container">
          <span className="section-eyebrow" style={{ marginBottom: "1rem" }}>
            Our Story
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 900,
              color: "#FFFFFF",
              marginBottom: "1rem",
            }}
          >
            About Cafe Crown 👑
          </h1>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.125rem",
              color: "rgba(245,240,232,0.7)",
              maxWidth: "560px",
              marginInline: "auto",
            }}
          >
            Where every flavour tells a story — Lucknow&apos;s coziest vegetarian cafe.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div>
              <span className="section-eyebrow">Who We Are</span>
              <h2 className="text-heading" style={{ color: "#1A2E22", marginBottom: "1.25rem", marginTop: "0.5rem" }}>
                Quality Wears A Crown Here
              </h2>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "#4A6553", marginBottom: "1rem" }}>
                Cafe Crown was born from a simple passion — to serve delicious, 
                quality food that everyone can afford. Tucked at the Bharwara 
                Crossing in Lucknow, we&apos;ve become a beloved spot for students, 
                families, and food lovers alike.
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "#4A6553", marginBottom: "1rem" }}>
                Our menu is 100% vegetarian, crafted with fresh ingredients 
                every single day. From our signature Kullhad Tea and Cold Coffee 
                to loaded Maggi bowls and Korean Veg Burgers — every item is made 
                with love and care.
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", lineHeight: 1.75, color: "#4A6553" }}>
                Rated 4.8★ by over 23 happy customers on Google Maps, we&apos;re 
                proud to be Lucknow&apos;s go-to cafe for great food, cozy ambience, 
                and polite service — all at prices that won&apos;t hurt your pocket.
              </p>
            </div>

            {/* Info Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                { icon: "📍", title: "Location", content: "Bharwara Crossing Rd, Lucknow, Uttar Pradesh 226010" },
                { icon: "📞", title: "Phone", content: "098382 26066", href: "tel:+919838226066" },
                { icon: "🕐", title: "Hours", content: "11:00 AM – 10:00 PM (Closed Mondays)" },
                { icon: "🌿", title: "Menu", content: "100% Pure Vegetarian · 9 Categories · ₹15 – ₹119" },
                { icon: "💳", title: "Payments", content: "UPI · Credit/Debit Cards · NFC · Cash" },
                { icon: "🅿️", title: "Parking", content: "Free street parking available" },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "#FAFAF7",
                    border: "1px solid rgba(45,90,61,0.1)",
                    borderRadius: "0.875rem",
                    transition: "all 0.25s",
                  }}
                >
                  <span style={{ fontSize: "1.375rem" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2D5A3D", marginBottom: "0.25rem" }}>
                      {item.title}
                    </div>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9375rem", color: "#1A2E22", fontWeight: 600 }}>
                        {item.content}
                      </a>
                    ) : (
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9375rem", color: "#4A6553" }}>
                        {item.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "linear-gradient(180deg, #F0EDE4, #FAFAF7)" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What We Stand For</span>
            <h2 className="text-display section-title">Our Values</h2>
          </div>
          <div className="grid-3" style={{ gap: "1.5rem" }}>
            {[
              { icon: "🌿", title: "100% Pure Veg", desc: "Every item on our menu is vegetarian — no exceptions. We believe great food doesn't need meat." },
              { icon: "💰", title: "Always Affordable", desc: "Premium taste without the premium price. Most items are under ₹100, because good food is for everyone." },
              { icon: "⚡", title: "Quick Service", desc: "We respect your time. Most orders are ready in under 10 minutes, so you spend more time enjoying than waiting." },
              { icon: "🧹", title: "Clean Ambience", desc: "A spotless, fresh environment every single day. We take hygiene as seriously as we take flavour." },
              { icon: "😊", title: "Polite Staff", desc: "Our team treats every guest like family. Warm smiles and attentive service are part of every visit." },
              { icon: "❤️", title: "Made With Love", desc: "Each dish is prepared fresh, with quality ingredients and genuine care — because that's the Cafe Crown way." },
            ].map((v) => (
              <div key={v.title} className="card" style={{ padding: "1.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.875rem" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#1A2E22", marginBottom: "0.625rem" }}>
                  {v.title}
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#6B8578", lineHeight: 1.65 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section" style={{ background: "#FFFFFF" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Find Us</span>
            <h2 className="text-display section-title">We&apos;re Right Here</h2>
            <p className="section-subtitle">Bharwara Crossing Rd, Lucknow — just look for the crown! 👑</p>
          </div>
          <div style={{ borderRadius: "1.25rem", overflow: "hidden", border: "1px solid rgba(45,90,61,0.1)", boxShadow: "0 4px 20px rgba(26,46,34,0.1)" }}>
            <iframe
              title="Cafe Crown on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d80.9!3d26.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfda9a6c9d1a5%3A0x6a8f2e0b1c8e3f4d!2sCafe%20Crown!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="450"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <a
              href="https://maps.app.goo.gl/cafecrown"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Get Directions →
            </a>
            <a href="tel:+919838226066" className="btn btn-outline">
              📞 Call Us
            </a>
            <Link href="/order" className="btn btn-gold">
              Order Online
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
