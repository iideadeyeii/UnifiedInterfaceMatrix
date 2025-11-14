import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Gpu } from "@shared/schema";
import { Cpu, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";

interface GpuMonitorProps {
  gpus: Gpu[];
}

export function GpuMonitor({ gpus }: GpuMonitorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          GPU Compute
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gpus.map((gpu) => {
          const utilizationPercent = gpu.utilization * 100;
          const vramPercent = (gpu.vramUsed / gpu.vramTotal) * 100;
          const vramFree = gpu.vramTotal - gpu.vramUsed;

          return (
            <div key={gpu.id} className="space-y-3" data-testid={`gpu-${gpu.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{gpu.name}</span>
                  {gpu.jobsQueued > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {gpu.jobsQueued} queued
                    </Badge>
                  )}
                </div>
                {gpu.temperature && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Thermometer className="h-3 w-3" />
                    <span className="font-mono">{gpu.temperature}°C</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-mono font-medium" data-testid={`text-util-${gpu.id}`}>
                    {utilizationPercent.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={utilizationPercent} 
                  className={cn(
                    "h-2",
                    utilizationPercent > 90 && "[&>div]:bg-red-500",
                    utilizationPercent > 70 && utilizationPercent <= 90 && "[&>div]:bg-yellow-500"
                  )}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">VRAM</span>
                  <span className="font-mono font-medium" data-testid={`text-vram-${gpu.id}`}>
                    {gpu.vramUsed.toFixed(1)} / {gpu.vramTotal.toFixed(1)} GB
                    <span className="text-muted-foreground ml-1">({vramFree.toFixed(1)} GB free)</span>
                  </span>
                </div>
                <Progress 
                  value={vramPercent} 
                  className={cn(
                    "h-2",
                    vramPercent > 90 && "[&>div]:bg-red-500",
                    vramPercent > 70 && vramPercent <= 90 && "[&>div]:bg-yellow-500"
                  )}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
