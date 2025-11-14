import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Camera } from "@shared/schema";
import { Camera as CameraIcon } from "lucide-react";

interface CameraGridProps {
  cameras: Camera[];
  onToggleCaption?: (id: string, enabled: boolean) => void;
}

export function CameraGrid({ cameras, onToggleCaption }: CameraGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CameraIcon className="h-5 w-5" />
          Camera Coverage ({cameras.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="border rounded-md p-4 space-y-3 hover-elevate"
              data-testid={`camera-${camera.id}`}
            >
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                {camera.thumbnailUrl ? (
                  <img
                    src={camera.thumbnailUrl}
                    alt={camera.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CameraIcon className="h-8 w-8 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" data-testid={`text-camera-name-${camera.id}`}>
                    {camera.name}
                  </span>
                  <Badge variant={camera.enabled ? "default" : "secondary"} className="text-xs">
                    {camera.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor={`caption-${camera.id}`} className="text-xs text-muted-foreground">
                    Caption API
                  </Label>
                  <Switch
                    id={`caption-${camera.id}`}
                    checked={camera.captionEnabled}
                    onCheckedChange={(checked) => onToggleCaption?.(camera.id, checked)}
                    data-testid={`switch-caption-${camera.id}`}
                  />
                </div>

                {camera.lastCaption && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {camera.lastCaption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
