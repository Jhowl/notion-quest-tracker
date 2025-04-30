
import React from "react";
import { GamificationState } from "@/types/idea";
import { Star, Award, Badge } from "lucide-react";

interface GamificationPanelProps {
  gamification: GamificationState;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ gamification }) => {
  const { points, badges, streak } = gamification;
  
  const earnedBadges = Object.entries(badges).filter(([_, earned]) => earned);

  const getBadgeEmoji = (badgeKey: string) => {
    switch (badgeKey) {
      case "firstSpark":
        return "✨";
      case "ideaMachine":
        return "🧠";
      case "refiner":
        return "🔨";
      default:
        return "🏆";
    }
  };

  const getBadgeTitle = (badgeKey: string) => {
    switch (badgeKey) {
      case "firstSpark":
        return "First Spark";
      case "ideaMachine":
        return "Idea Machine";
      case "refiner":
        return "Refiner";
      default:
        return badgeKey;
    }
  };

  return (
    <div className="flex flex-wrap gap-6 md:gap-10 items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center shadow-md">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Points</p>
          <p className="text-2xl font-bold text-gradient">{points}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center shadow-md">
          <Award className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Badges</p>
          <div className="flex gap-1">
            {earnedBadges.length > 0 ? (
              earnedBadges.map(([key]) => (
                <div 
                  key={key} 
                  className="text-2xl" 
                  title={getBadgeTitle(key)}
                >
                  {getBadgeEmoji(key)}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No badges yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md">
          <Badge className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold">
            {streak.current} {streak.current === 1 ? "day" : "days"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;
