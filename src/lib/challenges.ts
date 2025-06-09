import { Challenge, UserChallenge, Badge } from "@/types";

export const availableChallenges: Challenge[] = [
  {
    id: "hydration-7-day",
    title: "7-Day Hydration Challenge",
    description:
      "Drink 8 glasses of water every day for a week to build a healthy hydration habit.",
    duration: 7,
    difficulty: "easy",
    category: "hydration",
    dailyGoal: "Drink 8 glasses of water",
    reward: "Hydration Master badge + 50 bonus points",
    participants: 1247,
  },
  {
    id: "morning-routine-30-day",
    title: "30-Day Morning Routine",
    description:
      "Complete your morning routine 6 out of 7 days each week for a month.",
    duration: 30,
    difficulty: "medium",
    category: "productivity",
    dailyGoal: "Complete morning routine before 9 AM",
    reward: "Early Bird badge + 100 bonus points",
    participants: 892,
  },
  {
    id: "mindfulness-14-day",
    title: "14-Day Mindfulness Journey",
    description:
      "Practice mindfulness meditation for at least 10 minutes daily.",
    duration: 14,
    difficulty: "easy",
    category: "mindfulness",
    dailyGoal: "Meditate for 10+ minutes",
    reward: "Zen Master badge + 75 bonus points",
    participants: 654,
  },
  {
    id: "movement-21-day",
    title: "21-Day Movement Challenge",
    description:
      "Get your body moving with at least 30 minutes of physical activity daily.",
    duration: 21,
    difficulty: "medium",
    category: "exercise",
    dailyGoal: "30 minutes of physical activity",
    reward: "Active Lifestyle badge + 90 bonus points",
    participants: 1156,
  },
];

export const allBadges: Badge[] = [
  {
    id: "first-week",
    title: "First Week",
    description: "Completed your first week of tracking",
    icon: "🌟",
    category: "milestone",
  },
  {
    id: "hydration-master",
    title: "Hydration Master",
    description: "Completed the 7-Day Hydration Challenge",
    icon: "💧",
    category: "challenge",
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Completed the 30-Day Morning Routine Challenge",
    icon: "🌅",
    category: "challenge",
  },
  {
    id: "zen-master",
    title: "Zen Master",
    description: "Completed the 14-Day Mindfulness Challenge",
    icon: "🧘",
    category: "challenge",
  },
  {
    id: "active-lifestyle",
    title: "Active Lifestyle",
    description: "Completed the 21-Day Movement Challenge",
    icon: "🏃",
    category: "challenge",
  },
  {
    id: "score-explorer",
    title: "Score Explorer",
    description: "Reached a wellness score of 50+",
    icon: "🎯",
    category: "score",
  },
  {
    id: "wellness-warrior",
    title: "Wellness Warrior",
    description: "Reached a wellness score of 70+",
    icon: "⚔️",
    category: "score",
  },
  {
    id: "perfect-balance",
    title: "Perfect Balance",
    description: "Reached a wellness score of 90+",
    icon: "⚖️",
    category: "score",
  },
  {
    id: "streak-starter",
    title: "Streak Starter",
    description: "Maintained a 7-day streak",
    icon: "🔥",
    category: "streak",
  },
  {
    id: "streak-champion",
    title: "Streak Champion",
    description: "Maintained a 30-day streak",
    icon: "🏆",
    category: "streak",
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return availableChallenges.find((challenge) => challenge.id === id);
}

export function calculateChallengeProgress(
  userChallenge: UserChallenge,
): number {
  if (userChallenge.progress.length === 0) return 0;
  const completedDays = userChallenge.progress.reduce(
    (sum, day) => sum + day,
    0,
  );
  return Math.round((completedDays / userChallenge.progress.length) * 100);
}

export function getDifficultyColor(
  difficulty: Challenge["difficulty"],
): string {
  switch (difficulty) {
    case "easy":
      return "text-green-600 bg-green-50";
    case "medium":
      return "text-amber-600 bg-amber-50";
    case "hard":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getCategoryIcon(category: Challenge["category"]): string {
  switch (category) {
    case "hydration":
      return "💧";
    case "exercise":
      return "🏃";
    case "mindfulness":
      return "🧘";
    case "productivity":
      return "⚡";
    default:
      return "🎯";
  }
}

export function checkForNewBadges(
  currentScore: number,
  streak: number,
  completedChallenges: string[],
  existingBadges: Badge[],
): Badge[] {
  const newBadges: Badge[] = [];
  const existingBadgeIds = existingBadges.map((b) => b.id);

  // Score-based badges
  if (currentScore >= 90 && !existingBadgeIds.includes("perfect-balance")) {
    const badge = allBadges.find((b) => b.id === "perfect-balance");
    if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
  } else if (
    currentScore >= 70 &&
    !existingBadgeIds.includes("wellness-warrior")
  ) {
    const badge = allBadges.find((b) => b.id === "wellness-warrior");
    if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
  } else if (
    currentScore >= 50 &&
    !existingBadgeIds.includes("score-explorer")
  ) {
    const badge = allBadges.find((b) => b.id === "score-explorer");
    if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
  }

  // Streak-based badges
  if (streak >= 30 && !existingBadgeIds.includes("streak-champion")) {
    const badge = allBadges.find((b) => b.id === "streak-champion");
    if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
  } else if (streak >= 7 && !existingBadgeIds.includes("streak-starter")) {
    const badge = allBadges.find((b) => b.id === "streak-starter");
    if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
  }

  // Challenge-based badges
  const challengeBadgeMap: Record<string, string> = {
    "hydration-7-day": "hydration-master",
    "morning-routine-30-day": "early-bird",
    "mindfulness-14-day": "zen-master",
    "movement-21-day": "active-lifestyle",
  };

  completedChallenges.forEach((challengeId) => {
    const badgeId = challengeBadgeMap[challengeId];
    if (badgeId && !existingBadgeIds.includes(badgeId)) {
      const badge = allBadges.find((b) => b.id === badgeId);
      if (badge) newBadges.push({ ...badge, unlockedAt: new Date() });
    }
  });

  return newBadges;
}
