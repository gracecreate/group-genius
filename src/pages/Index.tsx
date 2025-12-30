import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { StudentForm } from "@/components/StudentForm";
import { StudentList } from "@/components/StudentList";
import { CaseManager } from "@/components/CaseManager";
import { GroupDisplay } from "@/components/GroupDisplay";
import { GroupSettings } from "@/components/GroupSettings";
import { groupStudentsByPreferences } from "@/utils/groupingAlgorithm";
import { Student, Group } from "@/types/student";
import { Shuffle, RotateCcw, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_CASES = [
  "Marketing Strategy",
  "Financial Analysis",
  "Operations Management",
  "Product Launch",
  "Sustainability Initiative",
];

const Index = () => {
  const [cases, setCases] = useState<string[]>(DEFAULT_CASES);
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupSize, setGroupSize] = useState(3);
  const { toast } = useToast();

  const handleAddCase = useCallback((caseName: string) => {
    setCases((prev) => [...prev, caseName]);
  }, []);

  const handleRemoveCase = useCallback((caseName: string) => {
    setCases((prev) => prev.filter((c) => c !== caseName));
  }, []);

  const handleAddStudent = useCallback((studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
    toast({
      title: "Student added",
      description: `${studentData.name} has been added to the list.`,
    });
  }, [toast]);

  const handleRemoveStudent = useCallback((id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleGenerateGroups = useCallback(() => {
    if (students.length < 2) {
      toast({
        title: "Not enough students",
        description: "Add at least 2 students to generate groups.",
        variant: "destructive",
      });
      return;
    }

    const generatedGroups = groupStudentsByPreferences(students, groupSize);
    setGroups(generatedGroups);
    toast({
      title: "Groups generated!",
      description: `Created ${generatedGroups.length} groups based on preferences.`,
    });
  }, [students, groupSize, toast]);

  const handleReset = useCallback(() => {
    setStudents([]);
    setGroups([]);
    toast({
      title: "Reset complete",
      description: "All students and groups have been cleared.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Student Grouper</h1>
                <p className="text-sm text-muted-foreground">
                  Group students by case preferences
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={students.length === 0 && groups.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleGenerateGroups}
                disabled={students.length < 2}
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Groups
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Setup */}
          <div className="lg:col-span-1 space-y-6">
            <CaseManager
              cases={cases}
              onAddCase={handleAddCase}
              onRemoveCase={handleRemoveCase}
            />
            <GroupSettings
              groupSize={groupSize}
              onGroupSizeChange={setGroupSize}
            />
            <StudentForm
              availableCases={cases}
              onAddStudent={handleAddStudent}
            />
          </div>

          {/* Right Column - Students & Groups */}
          <div className="lg:col-span-2 space-y-6">
            <StudentList
              students={students}
              onRemoveStudent={handleRemoveStudent}
            />
            <GroupDisplay groups={groups} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
