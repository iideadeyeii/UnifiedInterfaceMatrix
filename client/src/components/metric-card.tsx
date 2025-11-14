import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  trendValue,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("hover-elevate transition-all duration-200 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 gap-2">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(0,100,255,0.1)]">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-mono text-foreground mb-1" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {(subtitle || trendValue) && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
            {trendValue && (
              <span className={cn(
                "font-semibold text-sm",
                trend === "up" && "text-secondary",
                trend === "down" && "text-destructive"
              )}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
            )}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
