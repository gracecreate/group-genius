import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, GripVertical } from "lucide-react";
import { Student } from "@/types/student";

interface StudentFormProps {
  availableCases: string[];
  onAddStudent: (student: Omit<Student, "id">) => void;
}

export function StudentForm({ availableCases, onAddStudent }: StudentFormProps) {
  const [name, setName] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const handleAddPreference = (caseName: string) => {
    if (!selectedPreferences.includes(caseName)) {
      setSelectedPreferences([...selectedPreferences, caseName]);
    }
  };

  const handleRemovePreference = (caseName: string) => {
    setSelectedPreferences(selectedPreferences.filter((p) => p !== caseName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedPreferences.length > 0) {
      onAddStudent({
        name: name.trim(),
        preferences: selectedPreferences,
      });
      setName("");
      setSelectedPreferences([]);
    }
  };

  const availableToAdd = availableCases.filter(
    (c) => !selectedPreferences.includes(c)
  );

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Case Preferences (drag to reorder)</Label>
            
            {selectedPreferences.length > 0 && (
              <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
                {selectedPreferences.map((pref, index) => (
                  <div
                    key={pref}
                    className="flex items-center gap-2 bg-card p-2 rounded-md shadow-sm animate-scale-in"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm font-medium">
                      {index + 1}. {pref}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePreference(pref)}
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {availableToAdd.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {availableToAdd.map((caseName) => (
                  <Button
                    key={caseName}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPreference(caseName)}
                    className="text-xs transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {caseName}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || selectedPreferences.length === 0}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
