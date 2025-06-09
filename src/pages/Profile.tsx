import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserProfile, WeeklyLog, Badge as BadgeType } from "@/types";
import {
  loadUserProfile,
  loadWeeklyLogs,
  loadScoreData,
  getWeekKey,
} from "@/lib/storage";
import { allBadges } from "@/lib/challenges";
import BadgeComponent from "@/components/BadgeComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  User,
  Award,
  TrendingUp,
  Calendar,
  Target,
  Flame,
  Clock,
  BarChart3,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLog[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const profile = loadUserProfile();
    const logs = loadWeeklyLogs();
    const score = loadScoreData();

    setUserProfile(profile);
    setWeeklyLogs(logs);
    setCurrentScore(score?.total || 0);
  }, []);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const unlockedBadges = userProfile.badges;
  const lockedBadges = allBadges.filter(
    (badge) => !unlockedBadges.some((ub) => ub.id === badge.id),
  );

  const recentLogs = weeklyLogs
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 8);

  const stats = {
    totalBadges: unlockedBadges.length,
    totalPossible: allBadges.length,
    currentStreak: userProfile.currentStreak,
    longestStreak: userProfile.longestStreak,
    completedChallenges: userProfile.completedChallenges,
    memberSince: userProfile.joinDate,
  };

  const badgeCategories = [
    { id: "score", name: "Score", icon: "🎯" },
    { id: "streak", name: "Streak", icon: "🔥" },
    { id: "challenge", name: "Challenge", icon: "🏆" },
    { id: "milestone", name: "Milestone", icon: "🌟" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-4">
              <Link
                to="/challenges"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Challenges
              </Link>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="font-semibold text-gray-900">
                  {userProfile.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">
                    {userProfile.name}
                  </h1>
                  <p className="text-indigo-100 mb-4">
                    Member since{" "}
                    {userProfile.joinDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{currentScore}</div>
                      <div className="text-sm text-indigo-200">
                        Current Score
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalBadges}
                      </div>
                      <div className="text-sm text-indigo-200">
                        Badges Earned
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.currentStreak}
                      </div>
                      <div className="text-sm text-indigo-200">Day Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.completedChallenges}
                      </div>
                      <div className="text-sm text-indigo-200">
                        Challenges Done
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      (stats.totalBadges / stats.totalPossible) * 100,
                    )}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Badge Collection</div>
                  <Progress
                    value={(stats.totalBadges / stats.totalPossible) * 100}
                    className="mt-2 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Flame className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.longestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Current: {stats.currentStreak} days
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.completedChallenges}
                  </div>
                  <div className="text-sm text-gray-600">
                    Challenges Completed
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Keep up the great work!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Content */}
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="badges">
              Badges ({stats.totalBadges})
            </TabsTrigger>
            <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="badges" className="space-y-6">
            {/* Badge Categories */}
            {badgeCategories.map((category) => {
              const categoryBadges = allBadges.filter(
                (badge) => badge.category === category.id,
              );
              const unlockedCategoryBadges = categoryBadges.filter((badge) =>
                unlockedBadges.some((ub) => ub.id === badge.id),
              );

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay:
                      0.1 *
                      badgeCategories.findIndex((c) => c.id === category.id),
                  }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <div>{category.name} Badges</div>
                          <div className="text-sm font-normal text-gray-600">
                            {unlockedCategoryBadges.length} of{" "}
                            {categoryBadges.length} unlocked
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {categoryBadges.map((badge) => {
                          const isUnlocked = unlockedBadges.some(
                            (ub) => ub.id === badge.id,
                          );
                          const unlockedBadge = unlockedBadges.find(
                            (ub) => ub.id === badge.id,
                          );

                          return (
                            <BadgeComponent
                              key={badge.id}
                              badge={unlockedBadge || badge}
                              unlocked={isUnlocked}
                              size="md"
                            />
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentLogs.length > 0 ? (
                    <div className="space-y-4">
                      {recentLogs.map((log, index) => (
                        <motion.div
                          key={log.week}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <div className="font-medium">Week {log.week}</div>
                              <div className="text-sm text-gray-600">
                                {log.notes || "No notes"}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {log.score}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No weekly logs yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Complete your habits assessment to start tracking weekly
                        progress
                      </p>
                      <Button onClick={() => navigate("/habits-form")}>
                        Update Habits
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>First Assessment</span>
                    <Badge variant="secondary">✓ Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>First Week</span>
                    <Badge
                      variant={
                        stats.currentStreak >= 7 ? "secondary" : "outline"
                      }
                    >
                      {stats.currentStreak >= 7 ? "✓ Complete" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>First Challenge</span>
                    <Badge
                      variant={
                        stats.completedChallenges > 0 ? "secondary" : "outline"
                      }
                    >
                      {stats.completedChallenges > 0 ? "✓ Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Score Expert (90+)</span>
                    <Badge
                      variant={currentScore >= 90 ? "secondary" : "outline"}
                    >
                      {currentScore >= 90 ? "✓ Complete" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {unlockedBadges.length > 0 ? (
                    <div className="space-y-3">
                      {unlockedBadges
                        .sort((a, b) => {
                          if (!a.unlockedAt || !b.unlockedAt) return 0;
                          return (
                            b.unlockedAt.getTime() - a.unlockedAt.getTime()
                          );
                        })
                        .slice(0, 5)
                        .map((badge) => (
                          <div
                            key={badge.id}
                            className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg"
                          >
                            <div className="text-xl">{badge.icon}</div>
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
                        No badges earned yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
