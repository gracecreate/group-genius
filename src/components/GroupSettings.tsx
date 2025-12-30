import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

interface GroupSettingsProps {
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
}

export function GroupSettings({ groupSize, onGroupSizeChange }: GroupSettingsProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Group Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Students per group</Label>
            <span className="text-sm font-medium bg-secondary px-2 py-1 rounded">
              {groupSize}
            </span>
          </div>
          <Slider
            value={[groupSize]}
            onValueChange={(value) => onGroupSizeChange(value[0])}
            min={2}
            max={6}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2</span>
            <span>6</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
