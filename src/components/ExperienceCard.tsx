import React from "react";
import Image from "next/image"; // Use Next.js Image for optimization
import Link from "next/link"; // Use Next.js Link for navigation
import { IExperience } from "@/types"; // Import our data "shape"

// Define the shape of the props this component expects
interface Props {
  experience: IExperience; // It must receive one 'experience' object
}

// Create the component, typed with React.FC<Props>
const ExperienceCard: React.FC<Props> = ({ experience }) => {
  // Return null if experience data is missing (safety check)
  if (!experience) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl overflow-hidden bg-[#EDEDED] shadow-md hover:shadow-lg transition-shadow duration-300 md:w-[280px] h-[312px]">
      {/* 1. Image container */}
      <div className="relative md:w-[280px] h-[170px]">
        {" "}
        {/* Fixed height for the image */}
        <Image
          src={experience.imageUrl}
          alt={experience.title}
          fill // Use 'fill' to make the image cover the container
          className="object-cover" // Ensures the image covers the area without distortion
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps Next.js optimize image loading
        />
      </div>

      {/* 2. Card Content Area */}
      <div className="flex flex-col md:w-[280px] h-[142px] py-3 px-4 gap-6">
        {" "}
        {/* Standard padding */}
        <div className="flex flex-col justify-between items-center gap-5 md:w-[248px] h-[68px]">
          <div className="flex justify-between items-center h-6 w-full md:w-[248px]">
            {/* 3. Title */}
            <h3 className="min-w-[70px] h-5 font-medium text-[16px] leading-5">
              {experience.title}
            </h3>
            {/* 4. Location Tag */}
            <span className="w-fit h-6 py-1 px-2 bg-[#D6D6D6] text-[11px] rounded-sm flex justify-center items-center">
              {experience.location}
            </span>
          </div>

          {/* 5. Description */}
          <p className="md:w-[248px] h-8 font-normal text-[12px] text-[#6C6C6C] leading-4">
            {" "}
            {/* Fixed height for description */}
            {/* Limit description length */}
            {experience.description.substring(0, 100)}
            {experience.description.length > 40 ? "..." : ""}
          </p>
        </div>


        {/* 6. Price & Button */}
        <div className="flex justify-between items-center md:w-[248px] h-[30px]">
          {/* 7. Price Section */}
          <p className="w-[85px] h-6 flex gap-1.5 items-center">
            <span className="h-4 w-[29px] text-[12px] leading-4 text-[#161616] font-normal">From</span>
            {/* Assuming price is in INR based on your location */}
            <span className="w-[50px] h-6 font-medium text-[20px] leading-6 text-[#161616]">₹{experience.price}</span>
          </p>

          {/* 8. View Details Button */}
          <Link href={`/experience/${experience._id}`} className="w-[99px] h-[30px] font-medium rounded-sm py-1.5 px-2 bg-[#FFD643] text-[#161616] text-[14px] leading-[18px]">
            {" "}
            {/* Yellow color from screenshot */}
            View Details
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ExperienceCard;
