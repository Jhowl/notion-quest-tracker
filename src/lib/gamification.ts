
import { GamificationState } from "../types/idea";

const STORAGE_KEY = "idea_tracker_gamification";
const POINTS_NEW_IDEA = 10;
const POINTS_EDIT_IDEA = 5;
const POINTS_TAG = 2;
const WEEKLY_GOAL = 5;

// Milestone thresholds
const MILESTONE_IDEA_MACHINE = 10;
const MILESTONE_REFINER = 5;

export const loadGamification = (): GamificationState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  
  if (!saved) {
    return initGamification();
  }
  
  try {
    const state = JSON.parse(saved) as GamificationState;
    
    // Check if we need to reset the weekly goal
    const startDate = new Date(state.weeklyGoal.startDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Reset weekly goal if more than 7 days have passed
    if (diffDays >= 7) {
      state.weeklyGoal = {
        target: WEEKLY_GOAL,
        current: 0,
        startDate: new Date().toISOString(),
      };
    }
    
    // Check streak
    updateStreak(state);
    
    return state;
  } catch (error) {
    console.error("Failed to parse stored gamification state:", error);
    return initGamification();
  }
};

export const saveGamification = (state: GamificationState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const awardPoints = (
  points: number,
  reason: "new" | "edit" | "tag"
): GamificationState => {
  const state = loadGamification();
  state.points += points;
  
  // Update stats
  switch (reason) {
    case "new":
      state.stats.totalIdeas++;
      state.weeklyGoal.current++;
      updateStreak(state, true);
      break;
    case "edit":
      state.stats.totalEdits++;
      break;
    case "tag":
      state.stats.totalTags++;
      break;
  }
  
  // Check for badges
  updateBadges(state);
  
  saveGamification(state);
  return state;
};

export const awardNewIdea = (): GamificationState => {
  return awardPoints(POINTS_NEW_IDEA, "new");
};

export const awardEdit = (): GamificationState => {
  return awardPoints(POINTS_EDIT_IDEA, "edit");
};

export const awardTags = (count: number): GamificationState => {
  return awardPoints(POINTS_TAG * count, "tag");
};

// Private helper functions
const initGamification = (): GamificationState => {
  const initialState: GamificationState = {
    points: 0,
    badges: {
      firstSpark: false,
      ideaMachine: false,
      refiner: false,
    },
    streak: {
      current: 0,
      lastSubmission: null,
    },
    weeklyGoal: {
      target: WEEKLY_GOAL,
      current: 0,
      startDate: new Date().toISOString(),
    },
    stats: {
      totalIdeas: 0,
      totalEdits: 0,
      totalTags: 0,
    },
  };
  
  saveGamification(initialState);
  return initialState;
};

const updateBadges = (state: GamificationState): void => {
  // First spark - first idea
  if (state.stats.totalIdeas >= 1) {
    state.badges.firstSpark = true;
  }
  
  // Idea Machine - 10 ideas
  if (state.stats.totalIdeas >= MILESTONE_IDEA_MACHINE) {
    state.badges.ideaMachine = true;
  }
  
  // Refiner - 5 edits
  if (state.stats.totalEdits >= MILESTONE_REFINER) {
    state.badges.refiner = true;
  }
};

const updateStreak = (state: GamificationState, newSubmission = false): void => {
  const today = new Date().toISOString().split("T")[0];
  
  if (!state.streak.lastSubmission) {
    if (newSubmission) {
      state.streak.current = 1;
      state.streak.lastSubmission = today;
    }
    return;
  }
  
  const lastDate = state.streak.lastSubmission.split("T")[0];
  
  if (newSubmission && today !== lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];
    
    if (lastDate === yesterdayString) {
      // Consecutive day
      state.streak.current++;
    } else {
      // Streak broken
      state.streak.current = 1;
    }
    
    state.streak.lastSubmission = today;
  } else if (!newSubmission) {
    // Check if streak is broken
    const lastSubmissionDate = new Date(state.streak.lastSubmission);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    if (lastSubmissionDate < twoDaysAgo) {
      // Streak broken - more than a day missed
      state.streak.current = 0;
    }
  }
};
