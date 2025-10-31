"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IExperience, IAvailableDate, ISlot } from "@/types";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";

const ExperienceDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [experience, setExperience] = useState<IExperience | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // keep selection state
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!id) return;

    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/experiences/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch experience");
        }

        setExperience(data.data);
        // for choosing first date and first available slot (if any)
        if (data.data?.availableDates?.length > 0) {
          const firstDate = data.data.availableDates[0];
          setSelectedDateId(firstDate._id ?? firstDate.date);
          const firstSlot = firstDate.slots?.find((s: ISlot) => !s.isBooked) || firstDate.slots?.[0];
          if (firstSlot) setSelectedSlotId(firstSlot._id ?? firstSlot.time);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading experience details...
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error || "Experience not found"}
      </div>
    );
  }

  // helpers
  const findSelectedDate = (): IAvailableDate | undefined =>
    experience.availableDates.find((d) => (d._id ?? d.date) === selectedDateId);

  const findSelectedSlot = (): ISlot | undefined => {
    const date = findSelectedDate();
    return date?.slots.find((s) => (s._id ?? s.time) === selectedSlotId);
  };

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.05); // sample tax calc
  const total = subtotal + taxes;

  const handleConfirm = () => {
    const selDate = findSelectedDate();
    const selSlot = findSelectedSlot();
    if (!selDate || !selSlot) {
      alert("Please choose a date and a time before confirming.");
      return;
    }

    const query = new URLSearchParams({
      experienceId: experience._id,
      date: selDate.date,
      time: selSlot.time,
      qty: String(quantity),
    }).toString();

    router.push(`/checkout?${query}`);
  };

  return (
    <section className="">
      {/* back link */}
      <Link
        href={"/"}
        className="w-[74px] h-5 flex gap-2 relative top-6 left-3 md:left-[124px] items-center text-[#000000]"
      >
        <span className="w-5 h-5">
          <FaArrowLeft />
        </span>
        <span className="w-[46px] h-[18px] font-medium text-[14px] leading-[18px]">
          Details
        </span>
      </Link>

      {/* top image and confirm box (keeps your absolute layout) */}
      <div className="flex md:flex-row flex-col md:relative top-[68px] mt-8 md:mt-0">
        {/* image */}
        <Image
          src={experience.imageUrl}
          alt={experience.title}
          className="w-[765px] px-2 md:px-0 md:h-[381px] md:absolute md:left-[124px] rounded-xl object-cover"
          width={765}
          height={381}
        />

        {/* Confirm Booking box */}
        <div className="bg-[#EFEFEF] w-[387px] h-[303px] md:absolute md:left-[929px] mx-auto mt-5 md:mt-0 md:mx-0 rounded-xl p-6 flex flex-col gap-6">
          <div className="w-[339px] h-[187px] flex flex-col gap-4">
            <div className="w-full h-[130px] grid justify-between grid-cols-2 grid-rows-4 gap-y-5 gap-x-[174px]">
              <span className="w-fit h-5 font-normal text-[16px] leading-5 text-[#656565]">
                Starts at
              </span>
              <span className="w-20 text-right h-[22px] font-normal text-[18px] leading-[22px] text-[#161616]">
                ₹{experience.price}
              </span>

              <span className="w-[45px] h-5 font-normal text-[16px] leading-5 text-[#656565]">
                Quantity
              </span>
              <div className="w-20 text-right h-4 flex justify-between items-center">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-4 h-4 border-[0.4px] border-[#C9C9C9] flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-[#161616] text-[12px] font-normal w-1.5 h-3.5 flex justify-center items-center leading-3.5">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-4 h-4 border-[0.4px] border-[#C9C9C9] flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <span className="w-[45px] h-5 font-normal text-[16px] leading-5 text-[#656565]">
                Subtotal
              </span>
              <span className="w-[34p20 text-right h-5 font-normal text-[14px] leading-5 text-[#161616]">
                ₹{subtotal}
              </span>

              <span className="w-[45px] h-5 font-normal text-[16px] leading-5 text-[#656565]">
                Taxes
              </span>
              <span className="w-[25p20 text-right h-5 font-normal text-[#161616] text-[14px]">
                ₹{taxes}
              </span>
            </div>

            <hr className="w-[339px] h-px bg-[#D9D9D9]" />

            <div className="flex gap-6 w-[339px] h-6 justify-between">
              <span className="w-12 h-6 font-medium text-[20px] leading-6 text-[#161616]">
                Total
              </span>
              <span className="w-[49px] h-6 font-medium text-[20px] leading-6 text-[#161616]">
                ₹{total}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              className="bg-[#FFD643] w-[339px] h-11 py-3 px-5 rounded-lg font-medium text-[16px] leading-5"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      {/* bottom content - title, description, dates, times (all visible) */}
      <div className="md:relative top-[481px] left-[124px] flex flex-col gap-8 w-[765px] px-5 md:px-0 mt-5 md:mt-0">
        <div className="w-[765px] h-20 flex flex-col gap-4">
          <h2 className="w-full h-8 font-medium text-[24px] leading-8 text-[#161616]">
            {experience.title}
          </h2>
          <p className="md:w-full w-screen h-12 font-normal text-[16px] leading-6 text-[#6C6C6C]">
            {experience.description}
          </p>
        </div>

        {/* Dates row (all displayed) */}
        <div className="w-[389px] h-[68px] flex flex-col gap-3">
          <h3 className="w-full h-[22px] font-medium text-[18px] leading-[22px]">
            Choose date
          </h3>

          <div className="w-[389px] h-[34px] flex gap-4 flex-wrap">
            {experience.availableDates.map((d) => {
              const key = d._id ?? d.date;
              const isSelected = key === selectedDateId;
              const displayLabel = new Date(d.date).toLocaleString("en-GB", {
                month: "short",
                day: "numeric",
              }); // e.g., "Oct 22"

              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedDateId(key);
                    // set selected slot to first available of this date if none selected
                    const firstAvailable = d.slots?.find((s) => !s.isBooked) || d.slots?.[0];
                    if (firstAvailable) setSelectedSlotId(firstAvailable._id ?? firstAvailable.time);
                  }}
                  className={`h-[34px] w-[69px] rounded-sm py-2 px-1 text-[14px] leading-[18px] font-normal
                    ${
                      isSelected
                        ? "bg-[#FFD643] text-[#161616] border-[0.6px] border-[#BDBDBD]"
                        : "text-[#838383] border-[0.6px] border-[#BDBDBD] hover:bg-[#FFD643]"
                    }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Times for each date - show them all (grouped by date), highlight selected slot */}
        <div className="w-lg h-auto flex flex-col gap-6">
          <h3 className="text-[#161616] font-medium text-[18px] leading-[22px]">
            Choose time
          </h3>

          <div className="flex flex-col gap-4">
            {experience.availableDates.map((d) => {
              const dateKey = d._id ?? d.date;
              return (
                <div key={dateKey}>
                  <div className="text-sm mb-2 text-[#6C6C6C]">
                    {new Date(d.date).toDateString().slice(0, 10)}
                  </div>
                  <div className="w-full flex gap-3 flex-wrap flex-col md:flex-row">
                    {d.slots.map((slot) => {
                      const slotKey = slot._id ?? slot.time;
                      const isSelected = slotKey === selectedSlotId && dateKey === selectedDateId;
                      return (
                        <button
                          key={slotKey}
                          disabled={slot.isBooked}
                          onClick={() => {
                            setSelectedDateId(dateKey);
                            setSelectedSlotId(slotKey);
                          }}
                          className={`hover:bg-[#FFD643] active:bg-[#FFD643] w-fit h-[34px] rounded-sm border-[0.6px] py-2 px-1 flex gap-1.5 border-[#BDBDBD] justify-center items-center text-[14px]
                            ${
                              slot.isBooked
                                ? "bg-[#CCCCCC] cursor-not-allowed text-[#838383]"
                                : isSelected
                                ? "bg-[#FFD643] text-[#161616]"
                                : "text-[#838383] hover:text-[#161616]"
                            }`}
                        >
                          <span className="w-fit h-[18px] font-normal">{slot.time}</span>
                          {!slot.isBooked && <span className="w-fit h-3 font-medium text-[10px] leading-3 text-[#FF4C0A]">Available</span>}
                          {slot.isBooked && <span className="w-fit flex h-3 font-medium text-[10px] leading-3">Sold out</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="w-lg h-4 text-[#838383] font-normal leading-4 text-[12px]">
            All times are in IST (GMT +5:30)
          </p>
        </div>

        {/* About section (keeps your simple bar look) */}
        <div className="md:w-[765px] h-[66px] flex flex-col gap-3 mb-20">
          <h4 className="md:w-full h-[22px] font-medium text-[18px] leading-[22px] text-[#161616]">About</h4>
          <div className="md:w-full w-[90vw] md:h-8 h-fit rounded-sm px-3 py-2 bg-[#EEEEEE]">
            <span className="m-auto md:w-[380px] h-4 font-normal text-[#838383] text-[12px] leading-4">{experience.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceDetailsPage;
