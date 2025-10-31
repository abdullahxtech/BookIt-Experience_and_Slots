"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IExperience } from "@/types";
import { FaArrowLeft } from "react-icons/fa6";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const experienceId = searchParams.get("experienceId");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const qty = Number(searchParams.get("qty") || 1);

  const finalDate = formatDate(String(date));

  const [experience, setExperience] = useState<IExperience | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const subtotal = (experience?.price || 0) * qty;
  const discountAmount = subtotal * discount;
  const taxes = Math.round((subtotal - discountAmount) * 0.05);
  const total = subtotal - discountAmount + taxes;

  useEffect(() => {
    if (!experienceId) return;
    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/experiences/${experienceId}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch experience");
        setExperience(data.data);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchExperience();
  }, [experienceId]);

  function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const cutoffDate = new Date("2025-10-30");
    if (date > cutoffDate) return "2025-10-30";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  const handleApplyPromo = async () => {
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCode }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.discount.type === "percent") {
          setDiscount(data.discount.value / 100);
          alert(`Promo code applied! ${data.discount.value}% discount`);
        } else if (data.discount.type === "flat") {
          setDiscount(data.discount.value);
          alert(`Promo code applied! ₹${data.discount.value} off`);
        }
      } else {
        setDiscount(0);
        alert(data.error || "Invalid promo code");
      }
    } catch {
      setDiscount(0);
      alert("Something went wrong while applying promo code.");
    }
  };

  const handleConfirm = async () => {
    if (!userName || !userEmail) {
      alert("Please fill out your name and email.");
      return;
    }
    if (!agreed) {
      alert("You must agree to the terms before proceeding.");
      return;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: experienceId,
          date,
          slot: time,
          userName,
          userEmail,
          promoCode,
          totalPrice: total,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const bookingRef = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();
        router.push(`/result?ref=${bookingRef}`);
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch {
      alert("Something went wrong during booking. Please try again.");
    }
  };

  if (error || !experience) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error || "Experience not found"}</div>;
  }

  return (
    <section className="">
      <div className="h-5 w-[93px] relative top-6 md:left-[150px] left-8 flex gap-2 items-center text-[#000000]" onClick={() => router.back()}>
        <span className="w-5 h-5"><FaArrowLeft /></span>
        <span className="w-[65px] h-[18px] font-medium text-[14px] leading-[18px]">Checkout</span>
      </div>

      <div className="flex md:flex-row flex-col md:gap-0 gap-5 mt-[68px] justify-between md:mx-[150px] px-3 mb-10 md:px-0 md:mb-0">
        {/* LEFT FORM */}
        <div className="md:w-[739px] md:h-[198px] rounded-xl px-6 py-5 bg-[#EFEFEF] flex flex-col">
          <div className="flex md:flex-row flex-col md:w-[691px] m-auto md:h-[68px] gap-6">
            <div className="flex flex-col md:w-[333.5px] w-full h-[68px] gap-2">
              <label className="text-[#5B5B5B] text-[14px]">Full name</label>
              <input type="text" placeholder="Your name" value={userName} onChange={(e) => setUserName(e.target.value)} className="bg-[#DDDDDD] md:w-[333.5px] w-[85vw] h-[42px] rounded-md px-4 py-3 text-[14px] text-[#727272]" />
            </div>
            <div className="flex flex-col md:w-[333.5px] w-full h-[68px] gap-2">
              <label className="text-[#5B5B5B] text-[14px]">Email</label>
              <input type="email" placeholder="Your email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="bg-[#DDDDDD] md:w-[333.5px] w-[85vw] h-[42px] rounded-md px-4 py-3 text-[14px] text-[#727272]" />
            </div>
          </div>

          <div className="md:w-[691px] w-[85vw] h-[42px] flex md:gap-4 justify-between mx-auto md:mx-0 mt-3">
            <input type="text" placeholder="Enter promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="md:w-[604px] h-[42px] rounded-md py-3 px-4 bg-[#DDDDDD] text-[14px] text-[#727272]" />
            <button onClick={handleApplyPromo} className="w-[71px] h-[42px] rounded-lg px-4 py-3 bg-[#161616] font-medium text-[14px] text-[#F9F9F9]">Apply</button>
          </div>

          <div className="w-fit h-4 flex gap-2 mt-2">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4" />
            <span className="text-[12px] text-[#5B5B5B]">I agree to the terms and safety policy</span>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-[387px] p-6 flex flex-col gap-6 rounded-xl bg-[#EFEFEF]">
          <div className="h-[209px] w-[339px] grid grid-cols-2 gap-y-2.5 text-sm">
            <span className="text-[#656565]">Experience</span><span className="text-right text-[#161616]">{experience.title}</span>
            <span className="text-[#656565]">Date</span><span className="text-right text-[#656565]">{finalDate}</span>
            <span className="text-[#656565]">Time</span><span className="text-right text-[#656565]">{time}</span>
            <span className="text-[#656565]">Qty</span><span className="text-right text-[#656565]">{qty}</span>
            <span className="text-[#656565]">Subtotal</span><span className="text-right text-[#161616]">₹{subtotal}</span>

            {discount > 0 && (
              <>
                <span className="text-[#656565]">Discount</span>
                <span className="text-[#16A34A] text-right">-₹{discountAmount}</span>
              </>
            )}

            <span className="text-[#656565]">Taxes</span>
            <span className="text-right text-[#161616]">₹{taxes}</span>
          </div>

          <hr className="border-[#D9D9D9]" />

          <div className="flex justify-between">
            <span className="font-medium text-[20px] text-[#161616]">Total</span>
            <span className="font-medium text-[20px] text-[#161616]">₹{total}</span>
          </div>

          <button onClick={handleConfirm} className="w-[339px] h-11 rounded-lg px-5 py-3 bg-[#FFD643]">
            Pay and Confirm
          </button>
        </div>
      </div>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
