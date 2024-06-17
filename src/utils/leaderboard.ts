type LeaderboardEntry = {
    player: string;
    trophies: number;
  };
  
  const leaderboard: LeaderboardEntry[] = [];
  
  export function updateLeaderboard(player: string, trophies: number) {
    const existingEntry = leaderboard.find((entry) => entry.player === player);
    if (existingEntry) {
      existingEntry.trophies = Math.max(existingEntry.trophies, trophies);
    } else {
      leaderboard.push({ player, trophies });
    }
    leaderboard.sort((a, b) => b.trophies - a.trophies);
    if (leaderboard.length > 10) {
      leaderboard.pop();
    }
  }
  
  export function getLeaderboard() {
    return leaderboard;
  }