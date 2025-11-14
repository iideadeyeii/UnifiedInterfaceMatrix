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
    <Card className={cn("group relative overflow-visible card-glow transition-all duration-300 backdrop-blur-md border-2 border-primary/40 hover:border-primary/80 hover:shadow-[0_0_40px_rgba(0,100,255,0.5)]", className)}>
      <div className="scan-lines absolute inset-0 pointer-events-none"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 gap-2 relative z-10">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary/90">{title}</CardTitle>
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 icon-pulse group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-5 w-5 text-primary drop-shadow-[0_0_8px_rgba(0,100,255,0.8)]" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-4xl font-black font-mono text-primary mb-1 drop-shadow-[0_0_10px_rgba(0,100,255,0.6)]" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
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
