"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ResultPage = () => {
  const searchParams = useSearchParams();
  const refId = searchParams.get("ref") || "N/A";

  return (
    <section className="w-screen flex flex-col relative top-20 items-center m-auto gap-3">
      {/* success icon */}
      <div className="w-20 h-20">
        <Image
          src="/success-check.svg" 
          alt="success"
          width={80}
          height={80}
        />
      </div>

      {/* confirmation Text */}
      <h2 className="w-fit h-10 font-medium text-[32px] leading-10 text-[#161616]">
        Booking Confirmed
      </h2>
      <p className="w-fit h-6 font-normal text-[20px] leading-6 text-[#656565]">
        Ref ID: {refId}
      </p>

      {/* back to Home button */}
      <Link
        href="/"
        className="w-[138px] h-9 rounded-sm px-4 py-2 bg-[#E3E3E3] text-[#656565] font-normal text-[16px] leading-5"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default ResultPage;
