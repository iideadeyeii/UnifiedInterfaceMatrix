import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MetricCard } from "@/components/metric-card";
import { ServiceCard } from "@/components/service-card";
import { GpuMonitor } from "@/components/gpu-monitor";
import { StorageMonitor } from "@/components/storage-monitor";
import { CameraGrid } from "@/components/camera-grid";
import { CaptionTimeline } from "@/components/caption-timeline";
import { HaPanel } from "@/components/ha-panel";
import { AiCommandBar } from "@/components/ai-command-bar";
import { ModelRegistry } from "@/components/model-registry";
import { EventTimeline } from "@/components/event-timeline";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Sparkles,
  Command,
} from "lucide-react";
import type {
  Service,
  Gpu,
  Storage,
  Camera,
  Caption,
  HomeAssistant,
  Model,
  Event,
  AiCommandResponse,
} from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { toast } = useToast();
  const { isConnected } = useWebSocket();
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [commandLoading, setCommandLoading] = useState(false);
  const [commandResult, setCommandResult] = useState<AiCommandResponse | null>(null);

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: gpus = [], isLoading: gpusLoading } = useQuery<Gpu[]>({
    queryKey: ["/api/gpus"],
  });

  const { data: storage = [], isLoading: storageLoading } = useQuery<Storage[]>({
    queryKey: ["/api/storage"],
  });

  const { data: cameras = [], isLoading: camerasLoading } = useQuery<Camera[]>({
    queryKey: ["/api/cameras"],
  });

  const { data: captions = [], isLoading: captionsLoading } = useQuery<Caption[]>({
    queryKey: ["/api/captions"],
  });

  const { data: haStats, isLoading: haLoading } = useQuery<HomeAssistant>({
    queryKey: ["/api/home-assistant"],
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery<Model[]>({
    queryKey: ["/api/models"],
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  useEffect(() => {
    if (commandBarOpen) {
      setCommandResult(null);
    }
  }, [commandBarOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandBarOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isLoading = servicesLoading || gpusLoading || storageLoading || camerasLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const operationalServices = services.filter((s) => s.status === "operational").length;
  const totalServices = services.length;
  const avgGpuUtil = gpus.length > 0
    ? gpus.reduce((acc, gpu) => acc + gpu.utilization, 0) / gpus.length
    : 0;
  const criticalStorage = storage.filter((s) => s.usagePercent >= 85).length;

  const handleOpenUrl = (url: string) => {
    window.open(url, "_blank");
  };

  const handleViewLogs = (id: string) => {
    toast({
      title: "View Logs",
      description: `Opening logs for service ${id}...`,
    });
  };

  const handleRestart = (id: string) => {
    toast({
      title: "Restart Service",
      description: `Restarting service ${id}...`,
    });
  };

  const handleToggleCaption = async (id: string, enabled: boolean) => {
    try {
      await apiRequest("PATCH", `/api/cameras/${id}`, { captionEnabled: enabled });
      queryClient.invalidateQueries({ queryKey: ["/api/cameras"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Caption Toggle",
        description: `Caption ${enabled ? "enabled" : "disabled"} for camera`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle caption",
        variant: "destructive",
      });
    }
  };

  const handleOffload = async (id: string) => {
    try {
      const result = await apiRequest<{ success: boolean; message: string; freedGB: number }>(
        "POST",
        "/api/storage/offload",
        { storageId: id }
      );
      queryClient.invalidateQueries({ queryKey: ["/api/storage"] });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({
        title: "Offload Completed",
        description: `Freed ${result.freedGB} GB from storage`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate storage offload",
        variant: "destructive",
      });
    }
  };

  const handleViewGaps = () => {
    toast({
      title: "Coverage Gaps",
      description: "Analyzing automation opportunities...",
    });
  };

  const handleCommandSubmit = async (command: string) => {
    setCommandLoading(true);
    setCommandResult(null);
    
    try {
      const result = await apiRequest<AiCommandResponse>("POST", "/api/ai/command", { command });
      setCommandResult(result);
      
      if (result.intent === "open_service" && result.serviceId) {
        const service = services.find((s) => s.id === result.serviceId);
        if (service?.url) {
          setTimeout(() => {
            handleOpenUrl(service.url!);
            setCommandBarOpen(false);
            setCommandResult(null);
          }, 1000);
        }
      }
    } catch (error) {
      toast({
        title: "Command Failed",
        description: "Could not process your command",
        variant: "destructive",
      });
    } finally {
      setCommandLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Server className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold" data-testid="text-app-title">
                Unified Dash
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandBarOpen(true)}
                data-testid="button-open-command"
                className="gap-2"
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">AI Command</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-medium">System Overview</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Services Online"
                  value={`${operationalServices}/${totalServices}`}
                  icon={Server}
                  subtitle="operational"
                />
                <MetricCard
                  title="Avg GPU Utilization"
                  value={`${(avgGpuUtil * 100).toFixed(1)}%`}
                  icon={Cpu}
                />
                <MetricCard
                  title="Storage Alerts"
                  value={criticalStorage}
                  icon={HardDrive}
                  subtitle={criticalStorage > 0 ? "volumes at capacity" : "all volumes healthy"}
                />
                <MetricCard
                  title="Active Cameras"
                  value={cameras.filter((c) => c.captionEnabled).length}
                  icon={Sparkles}
                  subtitle={`of ${cameras.length} total`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Service Discovery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onOpenUrl={handleOpenUrl}
                      onViewLogs={handleViewLogs}
                      onRestart={handleRestart}
                    />
                  ))}
                </div>
              </div>

              <CameraGrid cameras={cameras} onToggleCaption={handleToggleCaption} />

              <CaptionTimeline captions={captions} />

              <ModelRegistry models={models} />
            </div>

            <div className="space-y-6">
              <GpuMonitor gpus={gpus} />
              
              <StorageMonitor storage={storage} onOffload={handleOffload} />

              {haStats && <HaPanel stats={haStats} onViewGaps={handleViewGaps} />}

              <EventTimeline events={events} />
            </div>
          </div>
        </div>
      </main>

      <AiCommandBar
        open={commandBarOpen}
        onOpenChange={setCommandBarOpen}
        onSubmit={handleCommandSubmit}
        isLoading={commandLoading}
        result={commandResult}
      />
    </div>
  );
}
