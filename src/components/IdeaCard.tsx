
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Idea } from "@/types/idea";
import IdeaForm from "./IdeaForm";
import { formatDistanceToNow } from "date-fns";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdate = (updatedIdea: Idea) => {
    onEdit(updatedIdea);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  if (isEditing) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Edit Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <IdeaForm idea={idea} onSubmit={handleUpdate} onCancel={handleCancel} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold">{idea.title}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {formatDate(idea.created_at)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
          {idea.description}
        </p>
        
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {idea.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-accent/10">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-end gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(idea.id)}
          className="h-8 px-2 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IdeaCard;
