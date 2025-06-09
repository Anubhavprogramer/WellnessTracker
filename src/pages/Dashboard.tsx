import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HabitsData, ScoreData, UserChallenge, UserProfile } from "@/types";
import {
  loadHabitsData,
  loadScoreData,
  loadUserChallenges,
  loadUserProfile,
  saveUserProfile,
} from "@/lib/storage";
import { calculateTotalScore } from "@/lib/scoring";
import { availableChallenges, getChallengeById } from "@/lib/challenges";
import ScoreDisplay from "@/components/ScoreDisplay";
import ChallengeCard from "@/components/ChallengeCard";
import HabitCard from "@/components/HabitCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Settings,
  User,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [habitsData, setHabitsData] = useState<HabitsData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const habits = loadHabitsData();
    const score = loadScoreData();
    const challenges = loadUserChallenges();
    const profile = loadUserProfile();

    setHabitsData(habits);
    setUserChallenges(challenges);

    if (habits) {
      const calculatedScore = calculateTotalScore(habits);
      setScoreData(calculatedScore);
    } else {
      setScoreData(score);
    }

    if (!profile) {
      const newProfile: UserProfile = {
        name: "Wellness Warrior",
        joinDate: new Date(),
        totalScore: score?.total || 0,
        currentStreak: 0,
        longestStreak: 0,
        badges: [],
        completedChallenges: 0,
      };
      saveUserProfile(newProfile);
      setUserProfile(newProfile);
    } else {
      setUserProfile(profile);
    }

    setIsLoading(false);
  };

  const getHabitCards = () => {
    if (!scoreData) return [];

    return [
      {
        title: "Sleep",
        icon: "😴",
        score: scoreData.breakdown.sleep,
        maxScore: 25,
        description: "Rest & Recovery",
        improvement: "Aim for 7-9 hours of quality sleep",
        color: "blue",
      },
      {
        title: "Exercise",
        icon: "💪",
        score: scoreData.breakdown.exercise,
        maxScore: 25,
        description: "Physical Activity",
        improvement: "Try 30 minutes of activity daily",
        color: "green",
      },
      {
        title: "Nutrition",
        icon: "🥗",
        score: scoreData.breakdown.nutrition,
        maxScore: 25,
        description: "Healthy Eating",
        improvement: "Eat more fruits and vegetables",
        color: "amber",
      },
      {
        title: "Mental Health",
        icon: "🧘",
        score: scoreData.breakdown.mentalHealth,
        maxScore: 15,
        description: "Mindfulness & Stress",
        improvement: "Practice meditation or deep breathing",
        color: "purple",
      },
      {
        title: "Productivity",
        icon: "⚡",
        score: scoreData.breakdown.productivity,
        maxScore: 10,
        description: "Focus & Goals",
        improvement: "Set daily goals and minimize distractions",
        color: "rose",
      },
    ];
  };

  const activeChallenges = userChallenges
    .filter((uc) => !uc.completed)
    .map((uc) => ({
      userChallenge: uc,
      challenge: getChallengeById(uc.challengeId),
    }))
    .filter((item) => item.challenge);

  const recentBadges = userProfile?.badges
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return b.unlockedAt.getTime() - a.unlockedAt.getTime();
    })
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🌟</div>
              <span className="text-xl font-bold text-gray-900">
                WellnessHub
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/challenges"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Challenges
              </Link>
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Profile
              </Link>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                {userProfile?.name}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.name}!
          </h1>
          <p className="text-gray-600">
            Here's your wellness journey overview for today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {scoreData?.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Wellness Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userProfile?.badges.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userProfile?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeChallenges.length}
                  </div>
                  <div className="text-sm text-gray-600">Active Challenges</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Score Display */}
            {scoreData ? (
              <ScoreDisplay score={scoreData} size="lg" />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Start Your Wellness Journey
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete your habits assessment to get your personalized
                    wellness score
                  </p>
                  <Button onClick={() => navigate("/habits-form")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Habits Breakdown */}
            {scoreData && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Habits Overview
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/habits-form")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Update Habits
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getHabitCards().map((habit, index) => (
                    <motion.div
                      key={habit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <HabitCard {...habit} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Challenges */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Active Challenges
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/challenges")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeChallenges.length > 0 ? (
                  <div className="space-y-4">
                    {activeChallenges
                      .slice(0, 2)
                      .map(({ userChallenge, challenge }) => (
                        <div
                          key={userChallenge.challengeId}
                          className="p-3 border rounded-lg"
                        >
                          <div className="font-medium text-sm">
                            {challenge!.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Day{" "}
                            {Math.min(
                              userChallenge.progress.length,
                              challenge!.duration,
                            )}{" "}
                            of {challenge!.duration}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      No active challenges
                    </p>
                    <Button size="sm" onClick={() => navigate("/challenges")}>
                      Browse Challenges
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentBadges && recentBadges.length > 0 ? (
                  <div className="space-y-3">
                    {recentBadges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg"
                      >
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                          <div className="font-medium text-sm">
                            {badge.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            {badge.unlockedAt?.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Complete challenges to earn badges!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/habits-form")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Update Daily Habits
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/challenges")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Join New Challenge
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
