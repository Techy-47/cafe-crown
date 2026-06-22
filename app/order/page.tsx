"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import styles from "./order.module.css";

type OrderType = "dine-in" | "takeaway";

interface OrderForm {
  name: string;
  phone: string;
  orderType: OrderType;
  tableNumber: string;
  specialInstructions: string;
  paymentMethod: "razorpay" | "cash";
}

export default function OrderPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<OrderForm>({
    name: "",
    phone: "",
    orderType: "dine-in",
    tableNumber: "",
    specialInstructions: "",
    paymentMethod: "razorpay",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const platformFee = 0;
  const total = subtotal + platformFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): boolean => {
    if (!form.name.trim()) { toast.error("Please enter your name"); return false; }
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number"); return false;
    }
    if (form.orderType === "dine-in" && !form.tableNumber.trim()) {
      toast.error("Please enter your table number"); return false;
    }
    if (items.length === 0) { toast.error("Your cart is empty"); return false; }
    return true;
  };

  const placeOrder = async (paymentId?: string) => {
    const orderData = {
      customerName: form.name,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      if (form.paymentMethod === "cash") {
        const newOrderId = await placeOrder();
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
            // Verify payment
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

            const newOrderId = await placeOrder(response.razorpay_payment_id);
            clearCart();
            setOrderId(newOrderId);
            setSubmitted(true);
            toast.success("Payment successful! Order placed.");
          },
          prefill: { name: form.name, contact: form.phone },
          theme: { color: "#2D5A3D" },
          modal: { ondismiss: () => { setLoading(false); } },
        };

        // Load Razorpay script dynamically
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
        return; // Don't set loading false — Razorpay handler will do it
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <span>{form.orderType === "dine-in" ? `Dine-in (Table ${form.tableNumber})` : "Takeaway"}</span>
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
            📱 You&apos;ll receive a WhatsApp confirmation on {form.phone}
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
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link> › <Link href="/menu">Menu</Link> › <span>Order</span>
          </nav>
          <h1 className={styles.heroTitle}>Place Your Order</h1>
          <p className={styles.heroSub}>Dine-in or Takeaway — tell us how you&apos;d like it</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          {/* ── ORDER FORM ── */}
          <form className={styles.form} onSubmit={handleSubmit} id="order-form" noValidate>
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
                    <input
                      id="tableNumber"
                      name="tableNumber"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Table 5"
                      value={form.tableNumber}
                      onChange={handleChange}
                    />
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
                    <div className={styles.payDesc}>UPI · Cards · Wallets · NFC</div>
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
              disabled={loading || items.length === 0}
              id="place-order-btn"
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  {form.paymentMethod === "razorpay" ? "Pay & Place Order" : "Place Order"} →
                </>
              )}
            </button>

            {items.length === 0 && (
              <p className={styles.emptyCartNote}>
                ← <Link href="/menu" style={{ color: "#2D5A3D", fontWeight: 600 }}>Add items to your cart</Link> first
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
                <span>📱</span>
                <span>WhatsApp confirmation sent</span>
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
