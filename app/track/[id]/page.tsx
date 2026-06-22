"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import Link from "next/link";

const STATUS_STEPS = [
  { key: "placed",    label: "Order Placed",      icon: "🛍️",  desc: "We received your order" },
  { key: "confirmed", label: "Order Confirmed",   icon: "✅",  desc: "The cafe confirmed it" },
  { key: "preparing", label: "Being Prepared",    icon: "👨‍🍳", desc: "Our kitchen is on it!" },
  { key: "ready",     label: "Ready",             icon: "🔔",  desc: "Come collect your order" },
  { key: "delivered", label: "Delivered",         icon: "🎉",  desc: "Enjoy your meal!" },
];

interface Order {
  customerName: string;
  orderType: string;
  tableNumber?: string;
  status: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  createdAt: string;
}

export default function TrackPage({ params }: { params: { id: string } }) {
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    const orderRef = doc(db, "orders", params.id);

    const unsubscribe = onSnapshot(
      orderRef,
      (snap) => {
        if (!snap.exists()) {
          setError("Order not found. Please check your Order ID.");
          setLoading(false);
          return;
        }
        setOrder(snap.data() as Order);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load order. Try again.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [params.id]);

  const currentStep = STATUS_STEPS.findIndex((s) => s.key === order?.status);

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF7", paddingTop: "80px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "spin 1s linear infinite" }}>👑</div>
          <p style={{ fontFamily: "'Outfit', sans-serif", color: "#6B8578" }}>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAF7", paddingTop: "80px" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1A2E22", marginBottom: "0.75rem" }}>{error}</p>
          <Link href="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", background: "#FAFAF7", paddingTop: "80px" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1A2E22, #2D5A3D)", padding: "3rem 0 2rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 900, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Order Tracking
          </h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(245,240,232,0.7)" }}>
            Order #{params.id.slice(-6).toUpperCase()} · {order?.customerName}
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingBlock: "2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "2.5rem", alignItems: "start" }}>
          {/* Status Tracker */}
          <div>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(45,90,61,0.08)", borderRadius: "1.25rem", padding: "2rem", boxShadow: "0 2px 8px rgba(26,46,34,0.06)", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1A2E22", marginBottom: "1.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(45,90,61,0.08)" }}>
                Order Status
              </h2>

              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent   = i === currentStep;
                const isLast      = i === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", position: "relative", paddingBottom: isLast ? 0 : "1.5rem" }}>
                    {/* Line */}
                    {!isLast && (
                      <div style={{
                        position: "absolute",
                        left: "20px",
                        top: "44px",
                        width: "2px",
                        height: "calc(100% - 20px)",
                        background: isCompleted ? "linear-gradient(180deg, #2D5A3D, #E8A040)" : "#E0E0E0",
                        transition: "background 0.5s",
                      }} />
                    )}

                    {/* Icon */}
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: isCompleted ? "linear-gradient(135deg, #2D5A3D, #3D7A55)" : "#F0F0F0",
                      border: isCurrent ? "3px solid #E8A040" : "2px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                      boxShadow: isCurrent ? "0 0 0 4px rgba(232,160,64,0.2)" : "none",
                      transition: "all 0.4s",
                      zIndex: 1,
                    }}>
                      {step.icon}
                    </div>

                    {/* Text */}
                    <div style={{ paddingTop: "0.5rem" }}>
                      <div style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: isCompleted ? "#1A2E22" : "#9E9E9E",
                        transition: "color 0.3s",
                      }}>
                        {step.label}
                        {isCurrent && (
                          <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", background: "#E8A040", color: "#1A2E22", padding: "2px 8px", borderRadius: "9999px", fontWeight: 700 }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125rem", color: isCompleted ? "#6B8578" : "#BDBDBD", marginTop: "2px" }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact */}
            <div style={{ background: "linear-gradient(135deg, #1A2E22, #2D5A3D)", borderRadius: "1rem", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.25rem" }}>Have a question?</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "rgba(245,240,232,0.65)" }}>Call or WhatsApp us</div>
              </div>
              <a href="tel:+919838226066" className="btn btn-gold btn-sm">
                📞 098382 26066
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <aside>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(45,90,61,0.08)", borderRadius: "1.25rem", padding: "1.5rem", boxShadow: "0 2px 8px rgba(26,46,34,0.06)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.25rem", color: "#1A2E22", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(45,90,61,0.08)" }}>
                Order Summary
              </h2>

              <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem" }}>
                {order?.items.map((item, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#4A6553", paddingBottom: "0.5rem", borderBottom: "1px dashed rgba(45,90,61,0.08)" }}>
                    <span>{item.name} × {item.qty}</span>
                    <span style={{ fontWeight: 600, color: "#1A2E22" }}>₹{item.price * item.qty}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Outfit', sans-serif", fontSize: "1.0625rem", fontWeight: 800, color: "#1A2E22", paddingTop: "0.75rem", borderTop: "2px solid rgba(45,90,61,0.15)" }}>
                <span>Total</span>
                <span style={{ color: "#2D5A3D" }}>₹{order?.total}</span>
              </div>

              <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#F0F7F2", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>🍽️</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875rem", color: "#2D5A3D", fontWeight: 500 }}>
                  {order?.orderType === "dine-in"
                    ? `Dine-in${order?.tableNumber ? ` (Table ${order.tableNumber})` : ""}`
                    : "Takeaway"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
