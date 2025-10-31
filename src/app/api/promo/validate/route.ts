import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PromoCode from "@/lib/models/PromoCode";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { promoCode } = await request.json();

    if (!promoCode) {
      return NextResponse.json(
        { success: false, error: "Promo code is required." },
        { status: 400 }
      );
    }

    const promo = await PromoCode.findOne({
      code: promoCode.toUpperCase(),
      validUntil: { $gte: new Date() },
      active: true,
    });

    if (!promo) {
      return NextResponse.json(
        { success: false, error: "Invalid promo code." },
        { status: 404 }
      );
    }

    // Check expiration
    if (promo.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: "This promo code has expired." },
        { status: 410 } // Gone
      );
    }

    return NextResponse.json({
      success: true,
      discount: { type: promo.type, value: promo.value },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    return NextResponse.json(
      { success: false, error: "Server error validating promo code." },
      { status: 500 }
    );
  }
}
