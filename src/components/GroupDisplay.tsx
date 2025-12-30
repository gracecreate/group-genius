import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles } from "lucide-react";
import { Group } from "@/types/student";
import { GroupExport } from "./GroupExport";

interface GroupDisplayProps {
  groups: Group[];
}

const groupColors = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
  "from-success/20 to-success/5",
  "from-warning/20 to-warning/5",
  "from-secondary to-secondary/50",
];

export function GroupDisplay({ groups }: GroupDisplayProps) {
  if (groups.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No groups generated yet</p>
          <p className="text-sm text-muted-foreground/70">
            Add students and click "Generate Groups"
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Generated Groups ({groups.length})
        </h2>
        <GroupExport groups={groups} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, index) => (
          <Card
            key={group.id}
            className={`animate-slide-up bg-gradient-to-br ${groupColors[index % groupColors.length]} border-0`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Group {index + 1}</span>
                <Badge variant="secondary" className="text-xs">
                  {group.students.length} students
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {group.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-2 p-2 bg-card/80 backdrop-blur-sm rounded-md"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{student.name}</span>
                  </div>
                ))}
              </div>

              {group.commonPreferences.length > 0 && (
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-1">
                    Common interests:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.commonPreferences.slice(0, 3).map((pref) => (
                      <Badge
                        key={pref}
                        variant="outline"
                        className="text-xs bg-card/50"
                      >
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
