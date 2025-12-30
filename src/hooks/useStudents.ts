import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching students:", error);
      return;
    }

    setStudents(
      data.map((s) => ({
        id: s.id,
        name: s.name,
        preferences: s.preferences || [],
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();

    const channel = supabase
      .channel("students-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => {
          fetchStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStudents]);

  const addStudent = useCallback(
    async (studentData: Omit<Student, "id">) => {
      const { error } = await supabase.from("students").insert({
        name: studentData.name,
        preferences: studentData.preferences,
      });

      if (error) {
        toast({
          title: "Error adding student",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Student added",
        description: `${studentData.name} has been added to the list.`,
      });
      return true;
    },
    [toast]
  );

  const removeStudent = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);

      if (error) {
        toast({
          title: "Error removing student",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      return true;
    },
    [toast]
  );

  const clearAllStudents = useCallback(async () => {
    const { error } = await supabase.from("students").delete().neq("id", "");

    if (error) {
      toast({
        title: "Error clearing students",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  }, [toast]);

  return {
    students,
    loading,
    addStudent,
    removeStudent,
    clearAllStudents,
  };
}
