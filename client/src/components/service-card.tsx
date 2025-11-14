import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "./status-indicator";
import { Service } from "@shared/schema";
import {
  Database,
  Cpu,
  Camera,
  Network,
  Server,
  MoreVertical,
  ExternalLink,
  Terminal,
  RotateCw,
} from "lucide-react";

const serviceIcons: Record<string, typeof Database> = {
  ai: Cpu,
  db: Database,
  automation: Network,
  vision: Camera,
  infra: Server,
};

interface ServiceCardProps {
  service: Service;
  onOpenUrl?: (url: string) => void;
  onViewLogs?: (id: string) => void;
  onRestart?: (id: string) => void;
}

export function ServiceCard({ service, onOpenUrl, onViewLogs, onRestart }: ServiceCardProps) {
  const Icon = serviceIcons[service.type] || Server;
  
  return (
    <Card className="hover-elevate transition-all duration-200 backdrop-blur-sm" data-testid={`card-service-${service.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0 shadow-[0_0_15px_rgba(0,100,255,0.15)]">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <CardTitle className="text-lg font-semibold truncate mb-2" data-testid={`text-service-name-${service.id}`}>
              {service.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <StatusIndicator status={service.status} live={service.status === "operational"} />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {service.status}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0" data-testid={`button-menu-${service.id}`}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {service.url && (
              <DropdownMenuItem onClick={() => onOpenUrl?.(service.url!)} data-testid={`button-open-${service.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Service
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onViewLogs?.(service.id)} data-testid={`button-logs-${service.id}`}>
              <Terminal className="mr-2 h-4 w-4" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRestart?.(service.id)} data-testid={`button-restart-${service.id}`}>
              <RotateCw className="mr-2 h-4 w-4" />
              Restart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted-foreground font-medium">Type</span>
          <Badge variant="secondary" className="uppercase font-semibold px-3 shadow-[0_0_10px_rgba(0,255,100,0.2)]">
            {service.type}
          </Badge>
        </div>
        {service.uptime !== null && service.uptime !== undefined && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground font-medium">Uptime</span>
            <span className="font-mono font-semibold text-base text-foreground">{service.uptime.toFixed(1)}%</span>
          </div>
        )}
        {service.containerId && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground font-medium">Container</span>
            <span className="font-mono text-sm text-muted-foreground truncate max-w-[140px]">
              {service.containerId.substring(0, 12)}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-4 border-t border-border/50">
        Last checked: {service.lastChecked ? new Date(service.lastChecked).toLocaleTimeString() : "Never"}
      </CardFooter>
    </Card>
  );
}
