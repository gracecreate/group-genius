import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_CASES = [
  "Marketing Strategy",
  "Financial Analysis",
  "Operations Management",
  "Product Launch",
  "Sustainability Initiative",
];

export function useCases() {
  const [cases, setCases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCases = useCallback(async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching cases:", error);
      setLoading(false);
      return;
    }

    if (data.length === 0) {
      // Initialize with default cases
      for (const caseName of DEFAULT_CASES) {
        await supabase.from("cases").insert({ name: caseName });
      }
      setCases(DEFAULT_CASES);
    } else {
      setCases(data.map((c) => c.name));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCases();

    const channel = supabase
      .channel("cases-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cases" },
        () => {
          fetchCases();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCases]);

  const addCase = useCallback(
    async (caseName: string) => {
      const { error } = await supabase.from("cases").insert({ name: caseName });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Case already exists",
            description: `"${caseName}" is already in the list.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error adding case",
            description: error.message,
            variant: "destructive",
          });
        }
        return false;
      }
      return true;
    },
    [toast]
  );

  const removeCase = useCallback(
    async (caseName: string) => {
      const { error } = await supabase
        .from("cases")
        .delete()
        .eq("name", caseName);

      if (error) {
        toast({
          title: "Error removing case",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      return true;
    },
    [toast]
  );

  return {
    cases,
    loading,
    addCase,
    removeCase,
  };
}
