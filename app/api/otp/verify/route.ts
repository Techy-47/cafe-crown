import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const otpRef = adminDb.collection("otps").doc(email);
    const doc = await otpRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "No OTP found for this email" }, { status: 404 });
    }

    const data = doc.data();
    const expiresAt = data?.expiresAt?.toDate();

    if (expiresAt && new Date() > expiresAt) {
      await otpRef.delete();
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    if (data?.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // If valid, delete the OTP to prevent reuse
    await otpRef.delete();

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
