import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface HabitCardProps {
  title: string;
  icon: string;
  score: number;
  maxScore: number;
  description: string;
  improvement?: string;
  color?: string;
}

const HabitCard = ({
  title,
  icon,
  score,
  maxScore,
  description,
  improvement,
  color = "blue",
}: HabitCardProps) => {
  const percentage = (score / maxScore) * 100;

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50/50",
    green: "border-emerald-200 bg-emerald-50/50",
    amber: "border-amber-200 bg-amber-50/50",
    purple: "border-purple-200 bg-purple-50/50",
    rose: "border-rose-200 bg-rose-50/50",
  };

  const progressColors = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    rose: "bg-rose-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`${colorClasses[color as keyof typeof colorClasses]} border-2 hover:shadow-md transition-shadow`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <span className="text-2xl">{icon}</span>
            <div>
              <div>{title}</div>
              <div className="text-sm font-normal text-gray-600">
                {description}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{score}</span>
            <span className="text-sm text-gray-500">/ {maxScore}</span>
          </div>

          <Progress value={percentage} className="h-3" />

          {improvement && (
            <motion.div
              className="p-3 bg-white/70 rounded-lg border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm font-medium text-gray-700 mb-1">
                💡 Tip:
              </div>
              <div className="text-sm text-gray-600">{improvement}</div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HabitCard;
