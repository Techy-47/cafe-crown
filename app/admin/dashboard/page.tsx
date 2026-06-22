'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import styles from './dashboard.module.css';

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */
type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled';

type OrderType = 'dine-in' | 'takeaway' | string;

interface OrderItem {
  name:     string;
  quantity: number;
  price:    number;
}

interface Order {
  id:           string;
  customerName: string;
  phone:        string;
  orderType:    OrderType;
  tableNumber?: string;
  items:        OrderItem[];
  total:        number;
  status:       OrderStatus;
  createdAt:    Timestamp | null;
}

type TabKey = 'orders' | 'menu' | 'analytics' | 'customers' | 'settings';

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */
function shortId(docId: string): string {
  return docId.slice(-6).toUpperCase();
}

function isToday(ts: Timestamp | null): boolean {
  if (!ts) return false;
  const d = ts.toDate();
  const now = new Date();
  return (
    d.getDate()     === now.getDate()    &&
    d.getMonth()    === now.getMonth()   &&
    d.getFullYear() === now.getFullYear()
  );
}

function formatTime(ts: Timestamp | null): string {
  if (!ts) return '—';
  return ts.toDate().toLocaleTimeString('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed:    'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready:     'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const ALL_STATUSES: OrderStatus[] = [
  'placed', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled',
];

/* ──────────────────────────────────────────────────────────
   STATUS BADGE
────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: OrderStatus }) {
  const cls = `${styles.statusBadge} ${styles[`status_${status}`] ?? ''}`;
  return <span className={cls}>{STATUS_LABELS[status] ?? status}</span>;
}

/* ──────────────────────────────────────────────────────────
   NAV ITEMS CONFIG
────────────────────────────────────────────────────────── */
const NAV_ITEMS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'orders',    label: 'Live Orders',      icon: '📋' },
  { key: 'menu',      label: 'Menu Management',  icon: '🍽️' },
  { key: 'analytics', label: 'Analytics',        icon: '📊' },
  { key: 'customers', label: 'Customers',        icon: '👥' },
  { key: 'settings',  label: 'Settings',         icon: '⚙️' },
];

/* ──────────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const router = useRouter();

  const [user,        setUser]        = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab,   setActiveTab]   = useState<TabKey>('orders');
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updatingIds,   setUpdatingIds]   = useState<Set<string>>(new Set());
  const [sidebarOpen,   setSidebarOpen]   = useState(false);

  const unsubOrdersRef = useRef<(() => void) | null>(null);

  /* ── Auth guard ───────────────────────────────────────── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace('/admin');
      } else {
        setUser(u);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [router]);

  /* ── Real-time orders subscription ───────────────────── */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
    );

    setOrdersLoading(true);
    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs: Order[] = snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const d = doc.data();
          return {
            id:           doc.id,
            customerName: d.customerName ?? d.name ?? 'Guest',
            phone:        d.phone        ?? d.customerPhone ?? '—',
            orderType:    d.orderType    ?? d.type          ?? 'takeaway',
            tableNumber:  d.tableNumber,
            items:        Array.isArray(d.items) ? d.items  : [],
            total:        d.total        ?? d.totalAmount   ?? 0,
            status:       d.status       ?? 'placed',
            createdAt:    d.createdAt    ?? null,
          };
        });
        setOrders(docs);
        setOrdersLoading(false);
      },
      (err) => {
        console.error('Firestore snapshot error:', err);
        toast.error('Failed to load orders. Check Firestore rules.');
        setOrdersLoading(false);
      },
    );

    unsubOrdersRef.current = unsub;
    return () => unsub();
  }, [user]);

  /* ── Status update ────────────────────────────────────── */
  async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
    if (!user) return;

    setUpdatingIds((prev) => new Set(prev).add(orderId));
    try {
      const token = await user.getIdToken();
      const res   = await fetch(`/api/orders/${orderId}`, {
        method:  'PATCH',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      toast.success(`Order #${shortId(orderId)} → ${STATUS_LABELS[newStatus]}`, {
        style: {
          background: '#2D5A3D',
          color:      '#F5F0E8',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '600',
        },
        iconTheme: { primary: '#E8A040', secondary: '#2D5A3D' },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      toast.error(`Could not update order: ${msg}`);
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  }

  /* ── Sign out ─────────────────────────────────────────── */
  async function handleSignOut() {
    await signOut(auth);
    router.replace('/admin');
  }

  /* ── Stats ────────────────────────────────────────────── */
  const todayOrders   = orders.filter((o) => isToday(o.createdAt));
  const todayRevenue  = todayOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders   = orders.length;
  const pendingOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing'].includes(o.status),
  ).length;

  /* ── Loading screen ───────────────────────────────────── */
  if (authLoading) {
    return (
      <div className={styles.loadingWrap} style={{ height: '100vh' }}>
        <span className={styles.loadingSpinner} />
        Authenticating…
      </div>
    );
  }

  if (!user) return null;

  /* ── RENDER ───────────────────────────────────────────── */
  return (
    <>
      <Toaster position="top-right" />

      <div className={styles.layout}>
        {/* ── SIDEBAR ───────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className={styles.mobileOverlay}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
          {/* Logo */}
          <div className={styles.sidebarLogo}>
            <span className={styles.sidebarCrown} aria-hidden="true">♛</span>
            <div className={styles.sidebarBrand}>
              <span className={styles.sidebarBrandName}>Cafe Crown</span>
              <span className={styles.sidebarBrandSub}>Admin</span>
            </div>
          </div>

          {/* Nav */}
          <nav className={styles.nav} aria-label="Admin navigation">
            <span className={styles.navSection}>Management</span>
            {NAV_ITEMS.map(({ key, label, icon }) => (
              <button
                key={key}
                id={`nav-${key}`}
                className={`${styles.navItem} ${activeTab === key ? styles.active : ''}`}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                aria-current={activeTab === key ? 'page' : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">{icon}</span>
                {label}
              </button>
            ))}
          </nav>

          {/* Sign out */}
          <button
            id="admin-signout-btn"
            className={styles.navSignOut}
            onClick={handleSignOut}
          >
            <span className={styles.navIcon} aria-hidden="true">🚪</span>
            Sign Out
          </button>
        </aside>

        {/* ── MAIN ──────────────────────────────────────── */}
        <div className={styles.main}>
          {/* Top bar */}
          <header className={styles.topBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                className={styles.hamburger}
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label="Open sidebar"
                id="hamburger-btn"
              >
                <span /><span /><span />
              </button>
              <div className={styles.topBarLeft}>
                <h1 className={styles.topBarTitle}>
                  {NAV_ITEMS.find((n) => n.key === activeTab)?.label ?? 'Dashboard'}
                </h1>
                <p className={styles.topBarSub}>
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year:    'numeric',
                    month:   'long',
                    day:     'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className={styles.topBarRight}>
              <span className={styles.liveIndicator}>
                <span className={styles.liveDot} />
                Live
              </span>
            </div>
          </header>

          {/* Scrollable content */}
          <main className={styles.content} id="main-content">

            {/* ── ORDERS TAB ────────────────────────────── */}
            {activeTab === 'orders' && (
              <>
                {/* Stats row */}
                <div className={styles.statsRow}>
                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.gold}`}>📦</div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{todayOrders.length}</span>
                      <span className={styles.statLabel}>Today&apos;s Orders</span>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.green}`}>💰</div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>
                        ₹{todayRevenue.toLocaleString('en-IN')}
                      </span>
                      <span className={styles.statLabel}>Today&apos;s Revenue</span>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.blue}`}>📊</div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{totalOrders}</span>
                      <span className={styles.statLabel}>Total Orders</span>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div className={`${styles.statIcon} ${styles.orange}`}>⏳</div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{pendingOrders}</span>
                      <span className={styles.statLabel}>Pending Orders</span>
                    </div>
                  </div>
                </div>

                {/* Orders list */}
                <div className={styles.ordersHeader}>
                  <h2 className={styles.ordersTitle}>Live Orders</h2>
                  <span className={styles.ordersCount}>
                    {ordersLoading ? 'Loading…' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
                  </span>
                </div>

                {ordersLoading ? (
                  <div className={styles.loadingWrap}>
                    <span className={styles.loadingSpinner} />
                    Loading orders…
                  </div>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🍽️</div>
                    <p className={styles.emptyTitle}>No orders yet</p>
                    <p className={styles.emptySubtitle}>
                      New orders will appear here in real-time
                    </p>
                  </div>
                ) : (
                  <div className={styles.ordersGrid}>
                    {orders.map((order) => (
                      <article key={order.id} className={styles.orderCard}>
                        {/* Card top row */}
                        <div className={styles.orderCardTop}>
                          <div className={styles.orderMeta}>
                            <span className={styles.orderId}>
                              #{shortId(order.id)} · {formatTime(order.createdAt)}
                            </span>
                            <span className={styles.customerName}>{order.customerName}</span>
                            <span className={styles.customerPhone}>{order.phone}</span>
                          </div>

                          <div className={styles.orderBadges}>
                            {/* Order type badge */}
                            <span
                              className={`${styles.typeBadge} ${
                                order.orderType === 'dine-in'
                                  ? styles.dineIn
                                  : styles.takeaway
                              }`}
                            >
                              {order.orderType === 'dine-in' ? '🍴' : '🛍️'}{' '}
                              {order.orderType === 'dine-in' ? `Dine-in (${order.tableNumber || 'No Table'})` : 'Takeaway'}
                            </span>

                            {/* Current status badge */}
                            <StatusBadge status={order.status as OrderStatus} />
                          </div>
                        </div>

                        <div className={styles.orderDivider} />

                        {/* Items */}
                        <div className={styles.itemsList}>
                          {order.items.map((item, idx) => (
                            <div key={idx} className={styles.itemRow}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemQtyPrice}>
                                ×{item.quantity} · ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer: total + status update */}
                        <div className={styles.orderFooter}>
                          <div>
                            <p className={styles.totalLabel}>Total</p>
                            <p className={styles.totalAmount}>
                              ₹{order.total.toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor={`status-${order.id}`}
                              className="sr-only"
                            >
                              Update status for order #{shortId(order.id)}
                            </label>
                            <select
                              id={`status-${order.id}`}
                              className={styles.statusSelect}
                              value={order.status}
                              disabled={updatingIds.has(order.id)}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {updatingIds.has(order.id) && s === order.status
                                    ? 'Updating…'
                                    : STATUS_LABELS[s]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── PLACEHOLDER TABS ──────────────────────── */}
            {activeTab !== 'orders' && (
              <div className={styles.comingSoon}>
                <div className={styles.comingSoonIcon}>
                  {NAV_ITEMS.find((n) => n.key === activeTab)?.icon}
                </div>
                <h2 className={styles.comingSoonTitle}>
                  {NAV_ITEMS.find((n) => n.key === activeTab)?.label}
                </h2>
                <p className={styles.comingSoonSub}>This section is coming soon.</p>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
