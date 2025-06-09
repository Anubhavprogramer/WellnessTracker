export interface HabitsData {
  sleep: {
    hours: number;
    quality: "poor" | "fair" | "good" | "excellent";
  };
  exercise: {
    frequency: number; // days per week
    intensity: "light" | "moderate" | "vigorous";
    duration: number; // minutes per session
  };
  nutrition: {
    mealsPerDay: number;
    waterGlasses: number;
    fruits: number;
    vegetables: number;
  };
  mentalHealth: {
    stressLevel: number; // 1-10 scale
    mindfulnessMinutes: number;
    socialConnections: number; // interactions per week
  };
  productivity: {
    focusHours: number;
    goalsCompleted: number;
    screenTimeHours: number;
  };
}

export interface ScoreData {
  total: number;
  breakdown: {
    sleep: number;
    exercise: number;
    nutrition: number;
    mentalHealth: number;
    productivity: number;
  };
  level: "beginner" | "intermediate" | "advanced" | "expert";
  lastUpdated: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  difficulty: "easy" | "medium" | "hard";
  category: "hydration" | "exercise" | "mindfulness" | "productivity";
  dailyGoal: string;
  reward: string;
  participants: number;
}

export interface UserChallenge {
  challengeId: string;
  startDate: Date;
  progress: number[]; // daily completion (0-1)
  completed: boolean;
  streak: number;
}

export interface WeeklyLog {
  week: string; // YYYY-WW format
  score: number;
  habits: HabitsData;
  challenges: UserChallenge[];
  notes: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: "streak" | "score" | "challenge" | "milestone";
}

export interface UserProfile {
  name: string;
  joinDate: Date;
  totalScore: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  completedChallenges: number;
}
