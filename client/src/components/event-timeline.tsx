import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event } from "@shared/schema";
import { Activity, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  events: Event[];
}

const severityIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const severityColors = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  error: "text-red-500",
};

export function EventTimeline({ events }: EventTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent events
              </div>
            ) : (
              events.map((event) => {
                const Icon = severityIcons[event.severity as keyof typeof severityIcons] || Info;
                
                return (
                  <div
                    key={event.id}
                    className="flex gap-3 p-3 border rounded-md hover-elevate"
                    data-testid={`event-${event.id}`}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      <Icon className={cn(
                        "h-4 w-4",
                        severityColors[event.severity as keyof typeof severityColors]
                      )} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" data-testid={`text-event-title-${event.id}`}>
                          {event.title}
                        </span>
                        <Badge variant="secondary" className="text-xs uppercase">
                          {event.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
