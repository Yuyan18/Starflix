"use client";

import Chart, { Location } from "@/components/Chart";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

//Demo of generating a map of coordinates that can be selected
export default function MapPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieName = searchParams.get("movie");
  const [mapDescription, setMapDescription] = useState<string>(movieName || "");
  const [mapPrompt, setMapPrompt] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    if (movieName) {
      setMapPrompt(movieName);
    }
  }, [movieName]);

  function handleLocationClick(location: Location) {
    router.push(`/timelapse?location=${encodeURIComponent(location.description)}`);
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{
        backgroundImage: 'url("https://i.postimg.cc/bY0TDYCP/DALL-E-2024-05-02-15-42-44-A-breathtaking-view-of-the-universe-featuring-a-vast-expanse-of-space.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col items-center">
          <input
            className="p-2 rounded-lg w-full text-center"
            type="text"
            value={mapDescription}
            onChange={(e) => setMapDescription(e.target.value)}
            placeholder="What do you want to do?"
          />
          <button className="p-4 bg-white rounded-lg hover:shadow mt-4" onClick={() => setMapPrompt(mapDescription)}>
            Create Map
          </button>
          <span className="text-xl text-white">{selectedLocation?.description}</span>
          <Chart
            prompt={mapPrompt}
            onSelect={handleLocationClick}
          />
        </div>
      </div>
    </main>
  );
}