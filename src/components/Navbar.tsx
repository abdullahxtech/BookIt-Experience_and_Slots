"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <header className="w-full">
      <nav
        className="
          bg-[#F9F9F9] shadow-sm border-b border-neutral-200
          px-4 sm:px-8 md:px-16 lg:px-[124px] py-4
          flex flex-col md:flex-row justify-between items-center
          gap-4 md:gap-0
        "
      >
        {/* logo */}
        <Link
          href={"/"}
          className="hover:cursor-pointer w-[100px] h-[55px] flex justify-center items-center"
        >
          <Image
            src={"/logo.svg"}
            alt="logo"
            className="w-full h-auto"
            width={100}
            height={55}
          />
        </Link>

        {/* search bar */}
        <div
          className="
            flex flex-col sm:flex-row gap-3 sm:gap-4
            w-full sm:w-auto justify-center items-center
          "
        >
          <input
            type="search"
            className="
              w-full sm:w-[280px] md:w-[340px] h-[42px]
              rounded-lg bg-[#EDEDED] px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-[#FFD643]
            "
            placeholder="Search experiences"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="
              bg-[#FFD643] rounded-lg
              w-full sm:w-[87px] h-[42px]
              px-3 py-2 flex justify-center items-center font-medium
            "
          >
            Search
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
