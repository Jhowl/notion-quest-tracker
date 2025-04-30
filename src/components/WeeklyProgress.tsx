
import React from "react";
import { Progress } from "@/components/ui/progress";
import { GamificationState } from "@/types/idea";

interface WeeklyProgressProps {
  gamification: GamificationState;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ gamification }) => {
  const { weeklyGoal } = gamification;
  const progress = Math.min(100, (weeklyGoal.current / weeklyGoal.target) * 100);
  
  const getStartDateFormatted = () => {
    try {
      const date = new Date(weeklyGoal.startDate);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return "this week";
    }
  };
  
  const getEndDateFormatted = () => {
    try {
      const startDate = new Date(weeklyGoal.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      return endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return "";
    }
  };
  
  return (
    <div className="bg-secondary/30 rounded-lg p-3 shadow-md">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-medium">Weekly Goal</h4>
        <span className="text-xs text-muted-foreground">
          {getStartDateFormatted()} - {getEndDateFormatted()}
        </span>
      </div>
      
      <Progress
        value={progress}
        className="h-2 bg-background"
      />
      
      <div className="mt-2 flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {weeklyGoal.current} of {weeklyGoal.target} ideas
        </p>
        <p className="text-xs font-medium">
          {progress >= 100 ? (
            <span className="text-emerald-400">Goal Reached! 🎉</span>
          ) : (
            <span>{Math.floor(progress)}%</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default WeeklyProgress;
