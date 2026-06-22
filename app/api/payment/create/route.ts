import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";

const CreatePaymentSchema = z.object({
  amount: z.number().int().min(1), // amount in rupees
});

const VerifyPaymentSchema = z.object({
  razorpay_order_id:   z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature:  z.string(),
});

// POST /api/payment/create
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (req.url.includes("/create")) {
      const { amount } = CreatePaymentSchema.parse(body);

      // Dynamically import Razorpay only on the server
      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const order = await razorpay.orders.create({
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      return NextResponse.json({
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // Verify
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      VerifyPaymentSchema.parse(body);

    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    console.error("Payment error:", err);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
