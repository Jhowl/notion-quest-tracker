
export interface Idea {
  id: string;
  title: string;
  description: string;
  created_at: string;
  tags?: string[];
}

export interface GamificationState {
  points: number;
  badges: {
    firstSpark: boolean;
    ideaMachine: boolean;
    refiner: boolean;
  };
  streak: {
    current: number;
    lastSubmission: string | null;
  };
  weeklyGoal: {
    target: number;
    current: number;
    startDate: string;
  };
  stats: {
    totalIdeas: number;
    totalEdits: number;
    totalTags: number;
  };
}
