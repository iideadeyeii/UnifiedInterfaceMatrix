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
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold font-mono" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {(subtitle || trendValue) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trendValue && (
              <span className={cn(
                "font-medium",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500"
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
