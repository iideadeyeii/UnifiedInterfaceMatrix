import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "operational" | "warning" | "critical" | "offline";
  live?: boolean;
  className?: string;
}

export function StatusIndicator({ status, live = false, className }: StatusIndicatorProps) {
  const colors = {
    operational: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    offline: "bg-gray-400",
  };

  return (
    <div className={cn("relative", className)}>
      <div className={cn("h-2 w-2 rounded-full", colors[status])} />
      {live && status === "operational" && (
        <div className={cn(
          "absolute inset-0 h-2 w-2 rounded-full animate-ping",
          colors[status],
          "opacity-75"
        )} />
      )}
    </div>
  );
}
