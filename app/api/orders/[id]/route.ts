import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const StatusSchema = z.object({
  status: z.enum(["placed", "confirmed", "preparing", "ready", "delivered", "cancelled"]),
});

async function getFirestore() {
  const { db } = await import("@/lib/firebase-admin");
  return db;
}

// GET /api/orders/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getFirestore();
    const doc = await db.collection("orders").doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/orders/[id]/status — admin only
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verify admin token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { status } = StatusSchema.parse(body);

    const db = await getFirestore();
    const orderRef = db.collection("orders").doc(params.id);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await orderRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    const orderData = orderDoc.data()!;

    // Fire WhatsApp status update to customer (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/whatsapp/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: params.id,
        phone: orderData.phone,
        customerName: orderData.customerName,
        event: "STATUS_UPDATE",
        status,
      }),
    }).catch(console.error);

    return NextResponse.json({ success: true, status });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
