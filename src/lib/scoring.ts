import { HabitsData, ScoreData } from "@/types";

export function calculateSleepScore(sleep: HabitsData["sleep"]): number {
  const { hours, quality } = sleep;

  // Optimal sleep: 7-9 hours
  let hoursScore = 0;
  if (hours >= 7 && hours <= 9) {
    hoursScore = 15;
  } else if (hours >= 6 && hours <= 10) {
    hoursScore = 12;
  } else if (hours >= 5 && hours <= 11) {
    hoursScore = 8;
  } else {
    hoursScore = 4;
  }

  // Quality score
  const qualityScores = { poor: 2, fair: 5, good: 8, excellent: 10 };

  return hoursScore + qualityScores[quality];
}

export function calculateExerciseScore(
  exercise: HabitsData["exercise"],
): number {
  const { frequency, intensity, duration } = exercise;

  // Frequency score (0-15)
  const frequencyScore = Math.min(frequency * 2.5, 15);

  // Intensity score (0-5)
  const intensityScores = { light: 2, moderate: 4, vigorous: 5 };

  // Duration score (0-5)
  const durationScore = Math.min(duration / 12, 5);

  return frequencyScore + intensityScores[intensity] + durationScore;
}

export function calculateNutritionScore(
  nutrition: HabitsData["nutrition"],
): number {
  const { mealsPerDay, waterGlasses, fruits, vegetables } = nutrition;

  // Meals score (0-8)
  const mealsScore = mealsPerDay >= 3 ? 8 : mealsPerDay * 2.67;

  // Water score (0-8)
  const waterScore = Math.min(waterGlasses, 8);

  // Fruits and vegetables (0-9)
  const produceScore = Math.min((fruits + vegetables) * 1.5, 9);

  return mealsScore + waterScore + produceScore;
}

export function calculateMentalHealthScore(
  mentalHealth: HabitsData["mentalHealth"],
): number {
  const { stressLevel, mindfulnessMinutes, socialConnections } = mentalHealth;

  // Stress score (0-6) - lower stress is better
  const stressScore = Math.max(0, 6 - (stressLevel - 1) * 0.67);

  // Mindfulness score (0-5)
  const mindfulnessScore = Math.min(mindfulnessMinutes / 6, 5);

  // Social connections score (0-4)
  const socialScore = Math.min(socialConnections * 0.5, 4);

  return stressScore + mindfulnessScore + socialScore;
}

export function calculateProductivityScore(
  productivity: HabitsData["productivity"],
): number {
  const { focusHours, goalsCompleted, screenTimeHours } = productivity;

  // Focus hours score (0-5)
  const focusScore = Math.min(focusHours * 0.5, 5);

  // Goals completed score (0-3)
  const goalsScore = Math.min(goalsCompleted, 3);

  // Screen time penalty (0-2) - less screen time is better
  const screenPenalty =
    screenTimeHours > 8 ? 0 : Math.min(2, (8 - screenTimeHours) * 0.25);

  return focusScore + goalsScore + screenPenalty;
}

export function calculateTotalScore(habits: HabitsData): ScoreData {
  const sleepScore = calculateSleepScore(habits.sleep);
  const exerciseScore = calculateExerciseScore(habits.exercise);
  const nutritionScore = calculateNutritionScore(habits.nutrition);
  const mentalHealthScore = calculateMentalHealthScore(habits.mentalHealth);
  const productivityScore = calculateProductivityScore(habits.productivity);

  const total =
    sleepScore +
    exerciseScore +
    nutritionScore +
    mentalHealthScore +
    productivityScore;

  let level: ScoreData["level"] = "beginner";
  if (total >= 85) level = "expert";
  else if (total >= 70) level = "advanced";
  else if (total >= 55) level = "intermediate";

  return {
    total: Math.round(total),
    breakdown: {
      sleep: Math.round(sleepScore),
      exercise: Math.round(exerciseScore),
      nutrition: Math.round(nutritionScore),
      mentalHealth: Math.round(mentalHealthScore),
      productivity: Math.round(productivityScore),
    },
    level,
    lastUpdated: new Date(),
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-blue-600";
  if (score >= 55) return "text-amber-600";
  return "text-rose-600";
}

export function getScoreGradient(score: number): string {
  if (score >= 85) return "from-emerald-500 to-teal-600";
  if (score >= 70) return "from-blue-500 to-indigo-600";
  if (score >= 55) return "from-amber-500 to-orange-600";
  return "from-rose-500 to-pink-600";
}
