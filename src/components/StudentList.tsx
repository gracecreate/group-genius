import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User } from "lucide-react";
import { Student } from "@/types/student";

interface StudentListProps {
  students: Student[];
  onRemoveStudent: (id: string) => void;
}

export function StudentList({ students, onRemoveStudent }: StudentListProps) {
  if (students.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No students added yet</p>
          <p className="text-sm text-muted-foreground/70">
            Add students using the form above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Students ({students.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {students.map((student, index) => (
          <div
            key={student.id}
            className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{student.name}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {student.preferences.map((pref, prefIndex) => (
                  <Badge
                    key={pref}
                    variant="secondary"
                    className="text-xs"
                  >
                    {prefIndex + 1}. {pref}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveStudent(student.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
