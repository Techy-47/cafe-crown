import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendOTP } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const otpRef = adminDb.collection("otps").doc(email);
    const doc = await otpRef.get();

    // Rate Limiting: 1 OTP per minute
    if (doc.exists) {
      const data = doc.data();
      const lastSent = data?.createdAt?.toDate();
      if (lastSent && new Date().getTime() - lastSent.getTime() < 60000) {
        return NextResponse.json({ error: "Please wait 60 seconds before requesting another OTP." }, { status: 429 });
      }
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins

    await otpRef.set({
      otp,
      createdAt: new Date(),
      expiresAt,
    });

    // Send email
    await sendOTP(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
