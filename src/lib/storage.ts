import {
  HabitsData,
  ScoreData,
  UserChallenge,
  WeeklyLog,
  Badge,
  UserProfile,
} from "@/types";

const STORAGE_KEYS = {
  HABITS: "wellness_habits",
  SCORE: "wellness_score",
  USER_CHALLENGES: "wellness_user_challenges",
  WEEKLY_LOGS: "wellness_weekly_logs",
  USER_PROFILE: "wellness_user_profile",
  LAST_UPDATED: "wellness_last_updated",
} as const;

export function saveHabitsData(data: HabitsData): void {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(data));
  localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
}

export function loadHabitsData(): HabitsData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveScoreData(data: ScoreData): void {
  localStorage.setItem(STORAGE_KEYS.SCORE, JSON.stringify(data));
}

export function loadScoreData(): ScoreData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCORE);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      lastUpdated: new Date(parsed.lastUpdated),
    };
  } catch {
    return null;
  }
}

export function saveUserChallenges(challenges: UserChallenge[]): void {
  const serialized = challenges.map((challenge) => ({
    ...challenge,
    startDate: challenge.startDate.toISOString(),
  }));
  localStorage.setItem(
    STORAGE_KEYS.USER_CHALLENGES,
    JSON.stringify(serialized),
  );
}

export function loadUserChallenges(): UserChallenge[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_CHALLENGES);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((challenge: any) => ({
      ...challenge,
      startDate: new Date(challenge.startDate),
    }));
  } catch {
    return [];
  }
}

export function saveWeeklyLogs(logs: WeeklyLog[]): void {
  const serialized = logs.map((log) => ({
    ...log,
    challenges: log.challenges.map((challenge) => ({
      ...challenge,
      startDate: challenge.startDate.toISOString(),
    })),
  }));
  localStorage.setItem(STORAGE_KEYS.WEEKLY_LOGS, JSON.stringify(serialized));
}

export function loadWeeklyLogs(): WeeklyLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WEEKLY_LOGS);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((log: any) => ({
      ...log,
      challenges: log.challenges.map((challenge: any) => ({
        ...challenge,
        startDate: new Date(challenge.startDate),
      })),
    }));
  } catch {
    return [];
  }
}

export function saveUserProfile(profile: UserProfile): void {
  const serialized = {
    ...profile,
    joinDate: profile.joinDate.toISOString(),
    badges: profile.badges.map((badge) => ({
      ...badge,
      unlockedAt: badge.unlockedAt?.toISOString(),
    })),
  };
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(serialized));
}

export function loadUserProfile(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      joinDate: new Date(parsed.joinDate),
      badges: parsed.badges.map((badge: any) => ({
        ...badge,
        unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
      })),
    };
  } catch {
    return null;
  }
}

export function getWeekKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${year}-${weekNumber.toString().padStart(2, "0")}`;
}

export function isDataStale(hours: number = 24): boolean {
  const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
  if (!lastUpdated) return true;

  const lastUpdate = new Date(lastUpdated);
  const now = new Date();
  const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);

  return diffHours >= hours;
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
