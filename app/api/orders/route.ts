import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const OrderItemSchema = z.object({
  id:    z.string(),
  name:  z.string(),
  qty:   z.number().int().min(1).max(20),
  price: z.number().min(0),
});

const CreateOrderSchema = z.object({
  customerName:       z.string().min(1).max(80),
  phone:              z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  orderType:          z.enum(["dine-in", "takeaway"]),
  tableNumber:        z.string().nullable().optional(),
  specialInstructions:z.string().max(500).optional(),
  paymentMethod:      z.enum(["razorpay", "cash"]),
  paymentId:          z.string().nullable().optional(),
  items:              z.array(OrderItemSchema).min(1).max(30),
  subtotal:           z.number().min(1),
  total:              z.number().min(1),
});

// Lazy-load Firebase Admin to avoid build errors without credentials
async function getFirestore() {
  const { db } = await import("@/lib/firebase-admin");
  return db;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = CreateOrderSchema.parse(body);

    const db = await getFirestore();
    const ordersRef = db.collection("orders");

    const newOrder = {
      ...data,
      status: "placed" as const,
      paymentStatus: data.paymentMethod === "razorpay" && data.paymentId
        ? "paid"
        : "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await ordersRef.add(newOrder);

    // Fire WhatsApp notification (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/whatsapp/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: docRef.id,
        phone: data.phone,
        customerName: data.customerName,
        orderType: data.orderType,
        items: data.items,
        total: data.total,
        event: "ORDER_PLACED",
      }),
    }).catch(console.error);

    return NextResponse.json({ orderId: docRef.id }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid order data", details: err.errors },
        { status: 400 }
      );
    }
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Admin only — verify Firebase ID token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getFirestore();
    const snapshot = await db
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
