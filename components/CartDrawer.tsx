"use client";
import React from "react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/context/CartContext";
import Link from "next/link";
import toast from "react-hot-toast";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { isOpen, items, closeCart, removeItem, updateQty, subtotal, clearCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={closeCart} aria-hidden="true" />}

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.open : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Your Order</h2>
            <span className={styles.itemCount}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
          </div>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🛒</div>
              <p className={styles.emptyTitle}>Your cart is empty</p>
              <p className={styles.emptyText}>Add items from our menu to get started</p>
              <button className={`btn btn-primary ${styles.browseBtn}`} onClick={closeCart}>
                Browse Menu
              </button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map((item: CartItem) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <div className={styles.vegIcon}>
                      <div className={styles.vegDot} />
                    </div>
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>₹{item.price} each</p>
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.qtyControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <p className={styles.itemTotal}>₹{item.price * item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <span className={styles.subtotal}>₹{subtotal}</span>
            </div>
            <p className={styles.taxNote}>+ applicable taxes at checkout</p>
            <Link
              href="/order"
              className={`btn btn-gold w-full ${styles.checkoutBtn}`}
              onClick={closeCart}
            >
              Proceed to Order →
            </Link>
            <button
              className={styles.clearBtn}
              onClick={() => {
                clearCart();
                toast("Cart cleared", { icon: "🗑️" });
              }}
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
