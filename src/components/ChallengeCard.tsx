import { Challenge, UserChallenge } from "@/types";
import {
  getCategoryIcon,
  getDifficultyColor,
  calculateChallengeProgress,
} from "@/lib/challenges";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Users, Calendar, Trophy, CheckCircle } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  userChallenge?: UserChallenge;
  onJoinChallenge?: (challengeId: string) => void;
  onViewChallenge?: (challengeId: string) => void;
  className?: string;
}

const ChallengeCard = ({
  challenge,
  userChallenge,
  onJoinChallenge,
  onViewChallenge,
  className = "",
}: ChallengeCardProps) => {
  const isJoined = !!userChallenge;
  const progress = userChallenge
    ? calculateChallengeProgress(userChallenge)
    : 0;
  const isCompleted = userChallenge?.completed || false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="h-full flex flex-col relative overflow-hidden">
        {isCompleted && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-emerald-100 rounded-full p-1">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {getCategoryIcon(challenge.category)}
              </div>
              <div>
                <CardTitle className="text-lg leading-tight">
                  {challenge.title}
                </CardTitle>
                <Badge
                  className={`mt-1 ${getDifficultyColor(challenge.difficulty)}`}
                >
                  {challenge.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {challenge.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{challenge.duration} days</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>
                {challenge.participants.toLocaleString()} participants
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Trophy className="w-4 h-4" />
              <span>{challenge.reward}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-900 mb-1">
              Daily Goal:
            </div>
            <div className="text-sm text-blue-700">{challenge.dailyGoal}</div>
          </div>

          {isJoined && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-gray-600">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {userChallenge && userChallenge.streak > 0 && (
                <div className="text-sm text-amber-600 font-medium">
                  🔥 {userChallenge.streak} day streak!
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4">
          {!isJoined ? (
            <Button
              onClick={() => onJoinChallenge?.(challenge.id)}
              className="w-full"
              size="sm"
            >
              Join Challenge
            </Button>
          ) : (
            <Button
              onClick={() => onViewChallenge?.(challenge.id)}
              variant={isCompleted ? "secondary" : "default"}
              className="w-full"
              size="sm"
            >
              {isCompleted ? "View Results" : "Continue Challenge"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChallengeCard;
