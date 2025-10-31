"use client";
import ExperienceCard from "@/components/ExperienceCard";
import React, { useEffect, useState } from "react";
import { IExperience } from "@/types";
import { useSearchParams } from "next/navigation";

const Home = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [filteredExperiences, setFilteredExperiences] = useState<IExperience[]>(
    []
  );

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/experiences");

        if (!response.ok) {
          throw new Error("Failed to fetch experiences from API");
        }

        const data = await response.json();

        if (data.success) {
          setExperiences(data.data); // store the array of experiences in state
        } else {
          throw new Error(data.error || "API returned an error");
        }
      } catch (err) {
        setError((err as Error).message); // store any error message
      } finally {
        setIsLoading(false); // stop loading, whether we succeeded or failed
      }
    };

    fetchExperiences();
  }, []); 

  // filter whenever the search query or experiences change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredExperiences(experiences);
    } else {
      const filtered = experiences.filter((exp) =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExperiences(filtered);
    }
  }, [searchQuery, experiences]);

  // handle the loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-neutral-600">Loading experiences...</p>
      </div>
    );
  }

  // handle the error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* show search query if active */}
      {searchQuery && (
        <p className="text-neutral-600 mb-4">
          Showing results for{" "}
          <span className="font-semibold">&quot;{searchQuery}&quot;</span>
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExperiences.length > 0 ? (
          filteredExperiences.map((experience) => (
            <ExperienceCard key={experience._id} experience={experience} />
          ))
        ) : (
          <p className="col-span-full text-center text-neutral-600">
            No experiences found 😕
          </p>
        )}
      </div>
    </section>
  );
};

export default Home;
