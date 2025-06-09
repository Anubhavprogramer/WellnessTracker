import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Challenge, UserChallenge } from "@/types";
import {
  getChallengeById,
  calculateChallengeProgress,
  getCategoryIcon,
  getDifficultyColor,
} from "@/lib/challenges";
import { loadUserChallenges, saveUserChallenges } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Target,
  Users,
  Trophy,
  CheckCircle,
  Flame,
  Award,
} from "lucide-react";

const ChallengeDetail = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(
    null,
  );
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);

  useEffect(() => {
    if (!challengeId) {
      navigate("/challenges");
      return;
    }

    const challengeData = getChallengeById(challengeId);
    if (!challengeData) {
      navigate("/challenges");
      return;
    }

    setChallenge(challengeData);

    const allUserChallenges = loadUserChallenges();
    const userChallengeData = allUserChallenges.find(
      (uc) => uc.challengeId === challengeId,
    );

    setUserChallenges(allUserChallenges);
    setUserChallenge(userChallengeData || null);
  }, [challengeId, navigate]);

  const joinChallenge = () => {
    if (!challenge) return;

    const newUserChallenge: UserChallenge = {
      challengeId: challenge.id,
      startDate: new Date(),
      progress: [],
      completed: false,
      streak: 0,
    };

    const updatedChallenges = [...userChallenges, newUserChallenge];
    setUserChallenges(updatedChallenges);
    setUserChallenge(newUserChallenge);
    saveUserChallenges(updatedChallenges);
  };

  const updateDayProgress = (dayIndex: number, completed: boolean) => {
    if (!userChallenge || !challenge) return;

    const newProgress = [...userChallenge.progress];

    // Extend progress array if needed
    while (newProgress.length <= dayIndex) {
      newProgress.push(0);
    }

    newProgress[dayIndex] = completed ? 1 : 0;

    // Calculate streak
    let streak = 0;
    for (let i = newProgress.length - 1; i >= 0; i--) {
      if (newProgress[i] === 1) {
        streak++;
      } else {
        break;
      }
    }

    // Check if challenge is completed
    const isCompleted =
      newProgress.length >= challenge.duration &&
      newProgress.reduce((sum, day) => sum + day, 0) >=
        challenge.duration * 0.8; // 80% completion rate

    const updatedUserChallenge: UserChallenge = {
      ...userChallenge,
      progress: newProgress,
      streak,
      completed: isCompleted,
    };

    const updatedChallenges = userChallenges.map((uc) =>
      uc.challengeId === challenge.id ? updatedUserChallenge : uc,
    );

    setUserChallenge(updatedUserChallenge);
    setUserChallenges(updatedChallenges);
    saveUserChallenges(updatedChallenges);
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading challenge...</div>
      </div>
    );
  }

  const isJoined = !!userChallenge;
  const progress = userChallenge
    ? calculateChallengeProgress(userChallenge)
    : 0;
  const currentDay = userChallenge
    ? Math.min(userChallenge.progress.length + 1, challenge.duration)
    : 1;

  const daysCompleted = userChallenge
    ? userChallenge.progress.reduce((sum, day) => sum + day, 0)
    : 0;

  const getDayStatus = (dayIndex: number) => {
    if (!userChallenge) return "future";
    if (dayIndex >= userChallenge.progress.length) return "current";
    return userChallenge.progress[dayIndex] === 1 ? "completed" : "missed";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/challenges")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Challenges
            </Button>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Challenge Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">
                    {getCategoryIcon(challenge.category)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {challenge.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge
                        className={getDifficultyColor(challenge.difficulty)}
                      >
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {challenge.duration} days
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="w-4 h-4" />
                        {challenge.participants.toLocaleString()} participants
                      </div>
                    </div>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                </div>
                {userChallenge?.completed && (
                  <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700">
                      Completed
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">Daily Goal</span>
                  </div>
                  <p className="text-sm text-blue-600">{challenge.dailyGoal}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-700 mb-2">
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">Reward</span>
                  </div>
                  <p className="text-sm text-amber-600">{challenge.reward}</p>
                </div>
                {isJoined && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-700 mb-2">
                      <Flame className="w-4 h-4" />
                      <span className="font-medium">Current Streak</span>
                    </div>
                    <p className="text-sm text-emerald-600">
                      {userChallenge.streak} days
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  {isJoined ? "Your Progress" : "Challenge Overview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isJoined ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {progress}%
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {daysCompleted} of {challenge.duration} days completed
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: challenge.duration }, (_, i) => {
                        const status = getDayStatus(i);
                        const isToday = i === currentDay - 1;

                        return (
                          <div
                            key={i}
                            className={`
                              aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium
                              ${
                                status === "completed"
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                                  : status === "missed"
                                    ? "bg-red-100 border-red-300 text-red-700"
                                    : status === "current"
                                      ? "bg-blue-100 border-blue-300 text-blue-700"
                                      : "bg-gray-50 border-gray-200 text-gray-400"
                              }
                              ${isToday ? "ring-2 ring-blue-400" : ""}
                            `}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>

                    {!userChallenge.completed && (
                      <div className="space-y-3">
                        <div className="font-medium">Today's Goal:</div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <Checkbox
                            checked={
                              getDayStatus(currentDay - 1) === "completed"
                            }
                            onCheckedChange={(checked) =>
                              updateDayProgress(currentDay - 1, !!checked)
                            }
                          />
                          <span className="text-sm">{challenge.dailyGoal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to start?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Join this challenge to track your daily progress and earn
                      rewards
                    </p>
                    <Button onClick={joinChallenge} className="w-full">
                      Join Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats and Community */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{challenge.duration} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulty</span>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">
                    {challenge.participants.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">
                    {challenge.category}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Motivation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Motivation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="font-medium text-purple-900 mb-1">
                      💪 Daily Benefits
                    </div>
                    <div className="text-sm text-purple-700">
                      Build lasting habits that improve your overall wellness
                      score
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <div className="font-medium text-emerald-900 mb-1">
                      🎯 Achievement Unlock
                    </div>
                    <div className="text-sm text-emerald-700">
                      {challenge.reward}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                    <div className="font-medium text-amber-900 mb-1">
                      🌟 Community Impact
                    </div>
                    <div className="text-sm text-amber-700">
                      Join {challenge.participants.toLocaleString()} others on
                      the same journey
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isJoined && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/challenges")}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Browse More Challenges
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/profile")}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View My Progress
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;
