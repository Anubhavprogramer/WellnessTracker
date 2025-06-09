import { ScoreData } from "@/types";
import { getScoreColor, getScoreGradient } from "@/lib/scoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, Award, Target } from "lucide-react";

interface ScoreDisplayProps {
  score: ScoreData;
  showBreakdown?: boolean;
  size?: "sm" | "md" | "lg";
}

const ScoreDisplay = ({
  score,
  showBreakdown = true,
  size = "md",
}: ScoreDisplayProps) => {
  const levelColors = {
    beginner: "bg-slate-100 text-slate-700",
    intermediate: "bg-amber-100 text-amber-700",
    advanced: "bg-blue-100 text-blue-700",
    expert: "bg-emerald-100 text-emerald-700",
  };

  const ScoreCircle = () => (
    <div
      className={`relative ${size === "lg" ? "w-32 h-32" : size === "md" ? "w-24 h-24" : "w-16 h-16"}`}
    >
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-200"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
          animate={{
            strokeDashoffset:
              2 * Math.PI * 45 - (score.total / 100) * 2 * Math.PI * 45,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient
            id="scoreGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              className={`stop-color-current ${getScoreColor(score.total)}`}
            />
            <stop
              offset="100%"
              className={`stop-color-current ${getScoreColor(score.total)}`}
            />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className={`${size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-lg"} font-bold ${getScoreColor(score.total)}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score.total}
          </motion.div>
          <div
            className={`${size === "lg" ? "text-sm" : "text-xs"} text-gray-500`}
          >
            / 100
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Wellness Score
            </CardTitle>
            <Badge className={levelColors[score.level]}>{score.level}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <ScoreCircle />
          </div>

          {showBreakdown && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <TrendingUp className="w-4 h-4" />
                Score Breakdown
              </div>

              <div className="space-y-3">
                {Object.entries(score.breakdown).map(([category, value]) => (
                  <motion.div
                    key={category}
                    className="space-y-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay:
                        0.1 * Object.keys(score.breakdown).indexOf(category),
                    }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{category}</span>
                      <span className="text-gray-600">{value}/25</span>
                    </div>
                    <Progress value={(value / 25) * 100} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Last updated</span>
              <span>{score.lastUpdated.toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScoreDisplay;
