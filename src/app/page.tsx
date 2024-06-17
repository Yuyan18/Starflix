"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>("");

  function handleConfirm() {
    if (playerName) {
      localStorage.setItem("playerName", playerName);
      router.push("/movieenthusiast");
    }
  }

  function handleLeaderboard() {
    router.push("/leaderboard");
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24"
      style={{
        backgroundImage: 'url("https://i.postimg.cc/xT0PKrhz/a19190e0fd86cea5ecbc028bd382299c.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-white">Starflix</h1>
        <div className="flex items-center mb-8">
          <span className="mr-4 text-white">G&apos;day</span>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="p-2 rounded-lg mr-4"
          />
          <button
            className="p-2 bg-white rounded-lg hover:shadow"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
        <Link href="/movieenthusiast" className="text-white">
          Movie Enthusiast Demo
        </Link>
        <button
          className="p-4 mt-4 self-end bg-white rounded-lg hover:shadow"
          onClick={handleLeaderboard}
        >
          Leaderboard
        </button>
      </div>
    </main>
  );
}