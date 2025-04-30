
import React, { useState, useEffect } from "react";
import IdeaForm from "@/components/IdeaForm";
import IdeaCard from "@/components/IdeaCard";
import GamificationPanel from "@/components/GamificationPanel";
import WeeklyProgress from "@/components/WeeklyProgress";
import { loadIdeas, saveIdeas, deleteIdea } from "@/lib/ideaStorage";
import { loadGamification } from "@/lib/gamification";
import { Idea, GamificationState } from "@/types/idea";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const { toast } = useToast();

  // Load data on initial render
  useEffect(() => {
    setIdeas(loadIdeas());
    setGamification(loadGamification());
  }, []);

  // Handle adding a new idea
  const handleAddIdea = (newIdea: Idea) => {
    setIdeas((prev) => [newIdea, ...prev]);
    setGamification(loadGamification());
  };

  // Handle editing an idea
  const handleEditIdea = (updatedIdea: Idea) => {
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === updatedIdea.id ? updatedIdea : idea))
    );
    setGamification(loadGamification());
  };

  // Handle deleting an idea
  const handleDeleteIdea = (id: string) => {
    deleteIdea(id);
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
    toast({
      title: "Idea Deleted",
      description: "Your idea has been removed."
    });
  };

  if (!gamification) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto">
      <header className="mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
          Idea Quest
        </h1>
        <p className="text-muted-foreground">
          Track, manage and level up your creative ideas
        </p>
      </header>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-6">
          <section className="glass-card p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Idea</h2>
            <IdeaForm onSubmit={handleAddIdea} />
          </section>

          <section>
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Ideas</h2>
              <span className="text-sm text-muted-foreground">
                {ideas.length} {ideas.length === 1 ? "idea" : "ideas"}
              </span>
            </header>

            {ideas.length === 0 ? (
              <div className="glass-card p-8 rounded-lg text-center">
                <p className="text-muted-foreground">
                  No ideas yet. Add your first one!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onEdit={handleEditIdea}
                    onDelete={handleDeleteIdea}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-card p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <GamificationPanel gamification={gamification} />
          </section>

          <section>
            <WeeklyProgress gamification={gamification} />
          </section>

          <section className="glass-card p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Ideas</span>
                <span>{gamification.stats.totalIdeas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Edits</span>
                <span>{gamification.stats.totalEdits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Tags</span>
                <span>{gamification.stats.totalTags}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
