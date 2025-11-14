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
    <Card className="group relative overflow-visible card-glow transition-all duration-300 backdrop-blur-md border-2 border-primary/40 hover:border-primary/80 hover:shadow-[0_0_40px_rgba(0,100,255,0.5)] animate-in fade-in slide-in-from-bottom-4" data-testid={`card-service-${service.id}`}>
      <div className="scan-lines absolute inset-0 pointer-events-none"></div>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4 relative z-10">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex-shrink-0 icon-pulse group-hover:scale-110 transition-transform duration-300">
            <Icon className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(0,100,255,0.8)]" />
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
      <CardContent className="space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/30 border border-border/30">
          <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Type</span>
          <Badge variant="secondary" className="uppercase font-bold px-3 py-1 shadow-[0_0_15px_rgba(0,255,100,0.4)] animate-pulse">
            {service.type}
          </Badge>
        </div>
        {service.uptime !== null && service.uptime !== undefined && (
          <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/30 border border-border/30">
            <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Uptime</span>
            <span className="font-mono font-bold text-xl text-primary drop-shadow-[0_0_6px_rgba(0,100,255,0.6)]">{service.uptime.toFixed(1)}%</span>
          </div>
        )}
        {service.containerId && (
          <div className="flex items-center justify-between gap-3 p-2 rounded-md bg-muted/30 border border-border/30">
            <span className="text-sm text-muted-foreground font-semibold uppercase tracking-wide">Container</span>
            <span className="font-mono text-sm text-muted-foreground/80 truncate max-w-[140px]">
              {service.containerId.substring(0, 12)}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground/70 pt-4 border-t border-primary/20 bg-gradient-to-b from-transparent to-primary/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_rgba(0,255,100,0.8)]"></div>
          Last checked: {service.lastChecked ? new Date(service.lastChecked).toLocaleTimeString() : "Never"}
        </div>
      </CardFooter>
    </Card>
  );
}
