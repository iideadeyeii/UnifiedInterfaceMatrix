import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HomeAssistant } from "@shared/schema";
import { Home, Lightbulb } from "lucide-react";

interface HaPanelProps {
  stats: HomeAssistant;
  onViewGaps?: () => void;
}

export function HaPanel({ stats, onViewGaps }: HaPanelProps) {
  const coveragePercent = stats.totalEntities > 0 
    ? (stats.activeAutomations / stats.totalEntities) * 100 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Home className="h-5 w-5" />
          Home Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold font-mono" data-testid="text-total-entities">
              {stats.totalEntities}
            </div>
            <div className="text-xs text-muted-foreground">Total Entities</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold font-mono" data-testid="text-active-automations">
              {stats.activeAutomations}
            </div>
            <div className="text-xs text-muted-foreground">Active Automations</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Automation Coverage</span>
            <span className="font-mono font-medium">
              {coveragePercent.toFixed(1)}%
            </span>
          </div>
          <Progress value={coveragePercent} className="h-2" />
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={onViewGaps}
            data-testid="button-view-gaps"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            View Coverage Gaps & Suggestions
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : "Never"}
        </div>
      </CardContent>
    </Card>
  );
}
