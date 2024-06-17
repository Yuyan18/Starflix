"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { describeImagePrompt, describePlanetPrompt } from "@/ai/prompts";
import Animation from "@/components/Animation";
import { getGroqCompletion } from "@/ai/groq";
import { updateLeaderboard } from "@/utils/leaderboard";

export default function TimelapsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TimelapseContent />
    </Suspense>
  );
}

function TimelapseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationName = searchParams.get("location") || "";
  const [year, setYear] = useState<number>(2024);
  const [animateImages, setAnimateImages] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [planetDescription, setPlanetDescription] = useState<string>("");
  const [trophyCount, setTrophyCount] = useState<number>(0);

  useEffect(() => {
    const generatePlanetDescription = async () => {
      if (locationName) {
        const description = await getGroqCompletion(
          locationName,
          64,
          describePlanetPrompt
        );
        setPlanetDescription(description);
        countTrophies(description);
      }
    };

    generatePlanetDescription();
  }, [locationName]);

  function countTrophies(description: string) {
    const count = (description.match(/a/gi) || []).length;
    setTrophyCount(count);
  }

  function handleLeaderboard() {
    const playerName = localStorage.getItem("playerName");
    if (playerName) {
      updateLeaderboard(playerName, trophyCount);
      router.push("/leaderboard");
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between">
            <button
              className={`m-2 p-2 w-full bg-white text-black rounded-lg hover:shadow ${
                animateImages && "bg-red-600"
              }`}
              onClick={() => setAnimateImages(!animateImages)}
            >
              {animateImages ? "Stop" : "Play"} (year: {year.toString()})
            </button>
            <button
              className={`m-2 p-2 bg-white text-black rounded-lg hover:shadow`}
              onClick={() => setFullscreen(!fullscreen)}
            >
              {fullscreen ? "Boxed" : "Fullscreen"}
            </button>
          </div>
          <span className="text-xl mb-4">{planetDescription}</span>
          <Animation
            prompt={`${locationName}, year ${year.toString()}`}
            systemPrompt={describeImagePrompt}
            imageSize="landscape_16_9"
            animate={animateImages ? 5000 : 0}
            fullscreen={fullscreen}
            onChange={(url) => setYear((year) => year + 5)}
          />
          {!fullscreen && (
            <button
              className="p-4 mt-4 self-end bg-white text-black rounded-lg hover:shadow"
              onClick={handleLeaderboard}
            >
              Leaderboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
}