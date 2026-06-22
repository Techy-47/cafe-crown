import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const NotifySchema = z.object({
  orderId:      z.string(),
  phone:        z.string(),
  customerName: z.string(),
  event:        z.enum(["ORDER_PLACED", "STATUS_UPDATE"]),
  orderType:    z.enum(["dine-in", "takeaway"]).optional(),
  items:        z.array(z.object({ name: z.string(), qty: z.number(), price: z.number() })).optional(),
  total:        z.number().optional(),
  status:       z.string().optional(),
});

function buildCustomerMessage(data: z.infer<typeof NotifySchema>): string {
  const shortId = data.orderId.slice(-6).toUpperCase();

  if (data.event === "ORDER_PLACED") {
    const itemLines = (data.items || [])
      .map((i) => `  • ${i.name} x${i.qty} — ₹${i.price * i.qty}`)
      .join("\n");
    return (
      `👑 *Cafe Crown* — Order Confirmed!\n\n` +
      `Hi ${data.customerName}! Your order #${shortId} has been received.\n\n` +
      `📋 *Items:*\n${itemLines}\n\n` +
      `💰 *Total:* ₹${data.total}\n` +
      `🍽️ *Type:* ${data.orderType === "dine-in" ? "Dine-in" : "Takeaway"}\n\n` +
      `⏱️ Expected in 10–20 mins. We'll update you when it's ready!\n\n` +
      `📞 Questions? Call us: 098382 26066`
    );
  }

  // Status Update
  const statusMessages: Record<string, string> = {
    confirmed:  "✅ Your order has been *confirmed*! We're preparing it now.",
    preparing:  "👨‍🍳 Your order is *being prepared*! Shouldn't be long.",
    ready:      "🔔 Your order is *READY*! Please collect it.",
    delivered:  "🎉 Enjoy your food! Thank you for visiting Cafe Crown 👑",
    cancelled:  "❌ Your order has been cancelled. Please call us: 098382 26066",
  };

  return (
    `👑 *Cafe Crown* — Order Update\n\n` +
    `Hi ${data.customerName}! Order #${shortId} update:\n\n` +
    (statusMessages[data.status || ""] || `Status: ${data.status}`) +
    `\n\n📞 Questions? Call: 098382 26066`
  );
}

function buildOwnerMessage(data: z.infer<typeof NotifySchema>): string {
  const shortId = data.orderId.slice(-6).toUpperCase();
  const itemLines = (data.items || [])
    .map((i) => `  • ${i.name} x${i.qty} — ₹${i.price * i.qty}`)
    .join("\n");

  return (
    `🔔 *NEW ORDER #${shortId}*\n\n` +
    `👤 Customer: ${data.customerName}\n` +
    `📱 Phone: ${data.phone}\n` +
    `🍽️ Type: ${data.orderType === "dine-in" ? "Dine-in" : "Takeaway"}\n\n` +
    `📋 *Items:*\n${itemLines}\n\n` +
    `💰 *Total: ₹${data.total}*\n\n` +
    `⏰ ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
  );
}

async function sendWATI(phone: string, message: string): Promise<void> {
  const endpoint = process.env.WATI_API_ENDPOINT;
  const token = process.env.WATI_API_TOKEN;

  if (!endpoint || !token) {
    console.warn("WATI credentials not configured — skipping WhatsApp notification");
    return;
  }

  // Format: 91XXXXXXXXXX (no + sign)
  const formattedPhone = phone.startsWith("91") ? phone : `91${phone}`;

  const res = await fetch(`${endpoint}/api/v1/sendSessionMessage/${formattedPhone}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messageText: message }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`WATI API error: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = NotifySchema.parse(body);

    const customerMsg = buildCustomerMessage(data);
    const promises: Promise<void>[] = [sendWATI(data.phone, customerMsg)];

    // Also notify owner for new orders
    if (data.event === "ORDER_PLACED") {
      const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER;
      if (ownerPhone) {
        const ownerMsg = buildOwnerMessage(data);
        promises.push(sendWATI(ownerPhone, ownerMsg));
      }
    }

    await Promise.allSettled(promises);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid notification data" }, { status: 400 });
    }
    console.error("WhatsApp notify error:", err);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}
