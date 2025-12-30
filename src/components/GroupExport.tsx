import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { Group } from "@/types/student";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GroupExportProps {
  groups: Group[];
}

export function GroupExport({ groups }: GroupExportProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateCSV = () => {
    const headers = ["Group", "Student Name", "Common Interests"];
    const rows = groups.flatMap((group, groupIndex) =>
      group.students.map((student, studentIndex) => [
        studentIndex === 0 ? `Group ${groupIndex + 1}` : "",
        student.name,
        studentIndex === 0 ? group.commonPreferences.join("; ") : "",
      ])
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return csvContent;
  };

  const generateText = () => {
    return groups
      .map((group, index) => {
        const studentNames = group.students.map((s) => s.name).join(", ");
        const interests = group.commonPreferences.length > 0
          ? `\n  Common interests: ${group.commonPreferences.join(", ")}`
          : "";
        return `Group ${index + 1}: ${studentNames}${interests}`;
      })
      .join("\n\n");
  };

  const handleExportCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `student-groups-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV exported",
      description: "Groups have been downloaded as a CSV file.",
    });
  };

  const handleCopyToClipboard = async () => {
    const text = generateText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Groups have been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (groups.length === 0) return null;

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleExportCSV}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
        {copied ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
