import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, BookOpen } from "lucide-react";

interface CaseManagerProps {
  cases: string[];
  onAddCase: (caseName: string) => void;
  onRemoveCase: (caseName: string) => void;
}

export function CaseManager({ cases, onAddCase, onRemoveCase }: CaseManagerProps) {
  const [newCase, setNewCase] = useState("");

  const handleAddCase = () => {
    if (newCase.trim() && !cases.includes(newCase.trim())) {
      onAddCase(newCase.trim());
      setNewCase("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCase();
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Available Cases
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newCase}
            onChange={(e) => setNewCase(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter case name"
            className="flex-1"
          />
          <Button onClick={handleAddCase} disabled={!newCase.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {cases.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {cases.map((caseName) => (
              <Badge
                key={caseName}
                variant="secondary"
                className="pl-3 pr-1 py-1.5 flex items-center gap-1 animate-scale-in"
              >
                {caseName}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCase(caseName)}
                  className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 hover:text-destructive rounded-full"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Add cases that students can choose from
          </p>
        )}
      </CardContent>
    </Card>
  );
}
