"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import styles from "./order.module.css";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

type OrderType = "dine-in" | "takeaway";

interface OrderForm {
  name: string;
  email: string;
  phone: string;
  orderType: OrderType;
  tableNumber: string;
  specialInstructions: string;
  paymentMethod: "razorpay" | "cash";
  honeypot: string; // Anti-spam
}

export default function OrderPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<OrderForm>({
    name: "",
    email: "",
    phone: "",
    orderType: "dine-in",
    tableNumber: "",
    specialInstructions: "",
    paymentMethod: "razorpay",
    honeypot: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // OTP flow
  const [otpStep, setOtpStep] = useState<"form" | "verify">("form");
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // Tables
  const [tables, setTables] = useState<{ id: string }[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);

  const platformFee = 0;
  const total = subtotal + platformFee;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const q = query(collection(db, "tables"), where("isVacant", "==", true));
        const snapshot = await getDocs(q);
        const fetchedTables = snapshot.docs.map(doc => ({ id: doc.id }));
        // Sort table-1, table-2 properly
        fetchedTables.sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, "")) || 0;
          const numB = parseInt(b.id.replace(/\D/g, "")) || 0;
          return numA - numB;
        });
        setTables(fetchedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): boolean => {
    if (form.honeypot) return false; // Spam bot detected
    if (!form.name.trim()) { toast.error("Please enter your name"); return false; }
    if (!form.email.trim() || !form.email.includes("@")) { toast.error("Enter a valid email"); return false; }
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number"); return false;
    }
    if (form.orderType === "dine-in" && !form.tableNumber.trim()) {
      toast.error("Please select a vacant table"); return false;
    }
    if (items.length === 0) { toast.error("Your cart is empty"); return false; }
    return true;
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      toast.success("OTP sent to your email!");
      setOtpStep("verify");
    } catch (err: any) {
      toast.error(err.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndProceed = async () => {
    if (!otpValue || otpValue.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: otpValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      // OTP verified, now process payment & order
      await processOrder();
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
      setOtpLoading(false);
    }
  };

  const processOrder = async () => {
    try {
      if (form.paymentMethod === "cash") {
        const newOrderId = await placeOrderApi();
        clearCart();
        setOrderId(newOrderId);
        setSubmitted(true);
        toast.success("Order placed successfully!");
      } else {
        // Razorpay flow
        const createRes = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        const { razorpayOrderId, amount } = await createRes.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: "INR",
          name: "Cafe Crown",
          description: `Order for ${form.name}`,
          order_id: razorpayOrderId,
          handler: async (response: Record<string, string>) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) { toast.error("Payment verification failed"); return; }

            const newOrderId = await placeOrderApi(response.razorpay_payment_id);
            clearCart();
            setOrderId(newOrderId);
            setSubmitted(true);
            toast.success("Payment successful! Order placed.");
          },
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#2D5A3D" },
          modal: { ondismiss: () => { setOtpLoading(false); setOtpStep("form"); } },
        };

        if (!(window as unknown as Record<string, unknown>).Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Razorpay script failed"));
            document.head.appendChild(script);
          });
        }

        const rzp = new ((window as unknown as Record<string, unknown>).Razorpay as new (opts: unknown) => { open: () => void })(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
      setOtpLoading(false);
      setOtpStep("form");
    }
  };

  const placeOrderApi = async (paymentId?: string) => {
    const orderData = {
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      orderType: form.orderType,
      tableNumber: form.tableNumber || null,
      specialInstructions: form.specialInstructions,
      paymentMethod: form.paymentMethod,
      paymentId: paymentId || null,
      items: items.map((i) => ({
        id: i.id, name: i.name, qty: i.quantity, price: i.price,
      })),
      subtotal,
      total,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error("Failed to place order");
    const { orderId: newOrderId } = await res.json();
    return newOrderId;
  };

  // ── SUCCESS STATE ────────────────────────────────────────────────
  if (submitted && orderId) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Order Placed! 🎉</h1>
          <p className={styles.successText}>
            Thank you, {form.name}! Your order has been received and our team
            is preparing it for you.
          </p>
          <div className={styles.orderIdBox}>
            <span className={styles.orderIdLabel}>Order ID</span>
            <span className={styles.orderIdValue}>#{orderId.slice(-6).toUpperCase()}</span>
          </div>
          <div className={styles.successDetails}>
            <div className={styles.detailRow}>
              <span>Order Type</span>
              <span>{form.orderType === "dine-in" ? `Dine-in (${form.tableNumber})` : "Takeaway"}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Total</span>
              <span className={styles.totalValue}>₹{total}</span>
            </div>
            <div className={styles.detailRow}>
              <span>Payment</span>
              <span>{form.paymentMethod === "cash" ? "Cash on Delivery" : "Paid Online ✓"}</span>
            </div>
          </div>
          <p className={styles.whatsappNote}>
            📱 You'll receive a WhatsApp & Email confirmation shortly
          </p>
          <Link href="/menu" className={`btn btn-primary ${styles.backBtn}`}>
            ← Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN ORDER FORM ──────────────────────────────────────────────
  return (
    <main className={styles.page}>
      {/* OTP Modal */}
      {otpStep === "verify" && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.sectionTitle}>Verify Email</h2>
            <p className={styles.typeDesc} style={{ marginBottom: "1.5rem" }}>
              We've sent a 6-digit code to <strong>{form.email}</strong>.
            </p>
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="000000"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.25em" }}
              />
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => setOtpStep("form")}
                disabled={otpLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-gold" 
                style={{ flex: 1 }}
                onClick={verifyOTPAndProceed}
                disabled={otpLoading || otpValue.length !== 6}
              >
                {otpLoading ? <span className={styles.spinner} /> : "Verify & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link> › <Link href="/menu">Menu</Link> › <span>Order</span>
          </nav>
          <h1 className={styles.heroTitle}>Place Your Order</h1>
          <p className={styles.heroSub}>Dine-in or Takeaway — tell us how you'd like it</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* ── ORDER FORM ── */}
          <form className={styles.form} onSubmit={requestOTP} id="order-form" noValidate>
            
            {/* Honeypot */}
            <div style={{ display: "none" }} aria-hidden="true">
              <input type="text" name="honeypot" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={handleChange} />
            </div>

            {/* Order Type */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>How would you like your order?</h2>
              <div className={styles.orderTypeGrid}>
                {(["dine-in", "takeaway"] as OrderType[]).map((type) => (
                  <label
                    key={type}
                    className={`${styles.orderTypeCard} ${form.orderType === type ? styles.activeType : ""}`}
                    htmlFor={`type-${type}`}
                  >
                    <input
                      type="radio"
                      id={`type-${type}`}
                      name="orderType"
                      value={type}
                      checked={form.orderType === type}
                      onChange={handleChange}
                      className={styles.hiddenRadio}
                    />
                    <span className={styles.typeIcon}>{type === "dine-in" ? "🍽️" : "🛍️"}</span>
                    <span className={styles.typeLabel}>
                      {type === "dine-in" ? "Dine-in" : "Takeaway"}
                    </span>
                    <span className={styles.typeDesc}>
                      {type === "dine-in" ? "Eat at the cafe" : "Take it home"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Your Details</h2>
              <div className={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="For receipt & OTP verification"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">WhatsApp Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>
                {form.orderType === "dine-in" && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="tableNumber">Table Number *</label>
                    <select
                      id="tableNumber"
                      name="tableNumber"
                      className="form-input"
                      value={form.tableNumber}
                      onChange={handleChange}
                      required
                      disabled={loadingTables}
                    >
                      <option value="">Select an available table</option>
                      {tables.map(t => (
                        <option key={t.id} value={t.id}>{t.id.replace("-", " ").toUpperCase()}</option>
                      ))}
                    </select>
                    {tables.length === 0 && !loadingTables && (
                      <span className={styles.typeDesc} style={{color: "var(--crown-red)", marginTop: "4px"}}>No tables currently vacant.</span>
                    )}
                  </div>
                )}
              </div>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label" htmlFor="specialInstructions">Special Instructions</label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  className={`form-input ${styles.textarea}`}
                  placeholder="Any allergies, preferences, or special requests?"
                  value={form.specialInstructions}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>

            {/* Payment */}
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Payment Method</h2>
              <div className={styles.paymentGrid}>
                <label
                  className={`${styles.paymentCard} ${form.paymentMethod === "razorpay" ? styles.activePayment : ""}`}
                  htmlFor="pay-razorpay"
                >
                  <input
                    type="radio"
                    id="pay-razorpay"
                    name="paymentMethod"
                    value="razorpay"
                    checked={form.paymentMethod === "razorpay"}
                    onChange={handleChange}
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.payIcon}>💳</span>
                  <div>
                    <div className={styles.payLabel}>Pay Online</div>
                    <div className={styles.payDesc}>UPI · Cards · Wallets</div>
                  </div>
                  <span className={styles.payBadge}>Recommended</span>
                </label>
                <label
                  className={`${styles.paymentCard} ${form.paymentMethod === "cash" ? styles.activePayment : ""}`}
                  htmlFor="pay-cash"
                >
                  <input
                    type="radio"
                    id="pay-cash"
                    name="paymentMethod"
                    value="cash"
                    checked={form.paymentMethod === "cash"}
                    onChange={handleChange}
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.payIcon}>💵</span>
                  <div>
                    <div className={styles.payLabel}>Pay at Cafe</div>
                    <div className={styles.payDesc}>Cash on arrival</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`btn btn-gold btn-lg ${styles.submitBtn}`}
              disabled={loading || items.length === 0 || (form.orderType === 'dine-in' && tables.length === 0)}
              id="place-order-btn"
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Checkout & Verify Email →
                </>
              )}
            </button>

            {items.length === 0 && (
              <p className={styles.emptyCartNote}>
                ← <Link href="/menu" style={{ color: "var(--crown-forest)", fontWeight: 600 }}>Add items to your cart</Link> first
              </p>
            )}
          </form>

          {/* ── ORDER SUMMARY ── */}
          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              {items.length === 0 ? (
                <div className={styles.summaryEmpty}>
                  <p>Your cart is empty.</p>
                  <Link href="/menu" className="btn btn-primary btn-sm">Browse Menu</Link>
                </div>
              ) : (
                <>
                  <ul className={styles.summaryItems}>
                    {items.map((item) => (
                      <li key={item.id} className={styles.summaryItem}>
                        <span className={styles.summaryItemName}>
                          {item.name} × {item.quantity}
                        </span>
                        <span className={styles.summaryItemPrice}>
                          ₹{item.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.summaryTotals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <div className={styles.vegBadge}>
                    🌿 100% Vegetarian Order
                  </div>
                </>
              )}
            </div>

            {/* Info */}
            <div className={styles.infoBox}>
              <div className={styles.infoItem}>
                <span>⏱️</span>
                <span>Ready in <strong>10–20 minutes</strong></span>
              </div>
              <div className={styles.infoItem}>
                <span>✉️</span>
                <span>Email receipt provided</span>
              </div>
              <div className={styles.infoItem}>
                <span>🔒</span>
                <span>Secure Razorpay payment</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
