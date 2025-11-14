import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Storage } from "@shared/schema";
import { HardDrive, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageMonitorProps {
  storage: Storage[];
  onOffload?: (id: string) => void;
}

export function StorageMonitor({ storage, onOffload }: StorageMonitorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Capacity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {storage.map((drive) => {
          const isWarning = drive.usagePercent >= 85;
          const isCritical = drive.usagePercent >= 95;

          return (
            <div key={drive.id} className="space-y-3" data-testid={`storage-${drive.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{drive.name}</span>
                  <Badge variant="secondary" className="text-xs uppercase">
                    {drive.type}
                  </Badge>
                  {isWarning && (
                    <AlertTriangle className={cn(
                      "h-4 w-4",
                      isCritical ? "text-red-500" : "text-yellow-500"
                    )} />
                  )}
                </div>
                {isWarning && onOffload && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOffload(drive.id)}
                    data-testid={`button-offload-${drive.id}`}
                    className="h-7 text-xs"
                  >
                    Offload to MinIO
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="font-mono font-medium" data-testid={`text-usage-${drive.id}`}>
                    {drive.usedGB.toFixed(1)} / {drive.totalGB.toFixed(1)} GB ({drive.usagePercent.toFixed(1)}%)
                  </span>
                </div>
                <Progress 
                  value={drive.usagePercent} 
                  className={cn(
                    "h-2",
                    isCritical && "[&>div]:bg-red-500",
                    isWarning && !isCritical && "[&>div]:bg-yellow-500"
                  )}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-mono">{drive.path}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
