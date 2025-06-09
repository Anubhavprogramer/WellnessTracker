import { Badge as BadgeType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

interface BadgeComponentProps {
  badge: BadgeType;
  unlocked?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const BadgeComponent = ({
  badge,
  unlocked = true,
  size = "md",
  onClick,
}: BadgeComponentProps) => {
  const sizeClasses = {
    sm: "w-16 h-20",
    md: "w-20 h-24",
    lg: "w-24 h-28",
  };

  const iconSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={sizeClasses[size]}
      onClick={onClick}
    >
      <Card
        className={`h-full flex flex-col items-center justify-center p-2 cursor-pointer transition-all
        ${
          unlocked
            ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300"
            : "bg-gray-50 border-gray-200 opacity-60"
        }`}
      >
        <CardContent className="p-0 text-center space-y-1">
          {unlocked ? (
            <div className={iconSizes[size]}>{badge.icon}</div>
          ) : (
            <Lock
              className={`w-6 h-6 text-gray-400 ${size === "lg" ? "w-8 h-8" : ""}`}
            />
          )}

          <div
            className={`font-semibold leading-tight ${textSizes[size]} ${unlocked ? "text-gray-800" : "text-gray-500"}`}
          >
            {badge.title}
          </div>

          {size === "lg" && (
            <div className="text-xs text-gray-600 leading-tight px-1">
              {badge.description}
            </div>
          )}

          {unlocked && badge.unlockedAt && size !== "sm" && (
            <div className="text-xs text-amber-600 font-medium">
              {badge.unlockedAt.toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeComponent;
