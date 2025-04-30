
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addIdea, updateIdea } from "@/lib/ideaStorage";
import { awardNewIdea, awardEdit, awardTags } from "@/lib/gamification";
import { Idea } from "@/types/idea";
import { useToast } from "@/hooks/use-toast";

interface IdeaFormProps {
  idea?: Idea;
  onSubmit: (newIdea: Idea) => void;
  onCancel?: () => void;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ idea, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(idea?.title || "");
  const [description, setDescription] = useState(idea?.description || "");
  const [tagsInput, setTagsInput] = useState(idea?.tags?.join(", ") || "");
  const { toast } = useToast();

  const isEditMode = !!idea;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your idea.",
        variant: "destructive",
      });
      return;
    }
    
    // Process tags
    let tags: string[] = [];
    if (tagsInput.trim()) {
      tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    }
    
    let newIdea: Idea;
    
    if (isEditMode && idea) {
      newIdea = updateIdea({
        ...idea,
        title,
        description,
        tags,
      });
      awardEdit();
      
      // Check if tags were added
      const originalTagCount = idea.tags?.length || 0;
      const newTagCount = tags.length;
      
      if (newTagCount > originalTagCount) {
        awardTags(newTagCount - originalTagCount);
      }
      
      toast({
        title: "Idea Updated",
        description: "Your idea has been successfully updated.",
      });
    } else {
      newIdea = addIdea({
        title,
        description,
        tags,
      });
      awardNewIdea();
      
      if (tags.length > 0) {
        awardTags(tags.length);
      }
      
      toast({
        title: "Idea Added",
        description: "Your idea has been successfully added.",
      });
      
      // Clear the form
      setTitle("");
      setDescription("");
      setTagsInput("");
    }
    
    onSubmit(newIdea);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Idea Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-secondary/50 border-none focus:ring-1 focus:ring-accent"
        />
      </div>
      
      <div>
        <Textarea
          placeholder="Describe your idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="bg-secondary/50 border-none focus:ring-1 focus:ring-accent resize-none"
        />
      </div>
      
      <div>
        <Input
          placeholder="Tags (comma separated, e.g. project, inspiration)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="bg-secondary/50 border-none focus:ring-1 focus:ring-accent"
        />
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" className="bg-primary hover:bg-primary/80">
          {isEditMode ? "Update Idea" : "Add Idea"}
        </Button>
        
        {isEditMode && onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default IdeaForm;
