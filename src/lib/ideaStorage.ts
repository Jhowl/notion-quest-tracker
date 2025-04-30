
import { Idea } from "../types/idea";

const STORAGE_KEY = "idea_tracker_ideas";

export const loadIdeas = (): Idea[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse stored ideas:", error);
    return [];
  }
};

export const saveIdeas = (ideas: Idea[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
};

export const addIdea = (idea: Omit<Idea, "id" | "created_at">): Idea => {
  const ideas = loadIdeas();
  
  const newIdea: Idea = {
    ...idea,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  
  saveIdeas([newIdea, ...ideas]);
  return newIdea;
};

export const updateIdea = (updatedIdea: Idea): Idea => {
  const ideas = loadIdeas();
  const updatedIdeas = ideas.map((idea) => 
    idea.id === updatedIdea.id ? updatedIdea : idea
  );
  
  saveIdeas(updatedIdeas);
  return updatedIdea;
};

export const deleteIdea = (id: string): void => {
  const ideas = loadIdeas();
  const filteredIdeas = ideas.filter(idea => idea.id !== id);
  saveIdeas(filteredIdeas);
};
