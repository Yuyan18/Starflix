"use client";

import { getLeaderboard } from "@/utils/leaderboard";

export default function LeaderboardPage() {
  const leaderboard = getLeaderboard();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Leaderboard</h1>
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-2">Player</th>
              <th className="p-2">Trophies</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td className="p-2">{entry.player}</td>
                <td className="p-2">{entry.trophies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}