import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Caption } from "@shared/schema";
import { Image, Search } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface CaptionTimelineProps {
  captions: Caption[];
}

export function CaptionTimeline({ captions }: CaptionTimelineProps) {
  const [search, setSearch] = useState("");

  const filtered = captions.filter((caption) =>
    caption.caption.toLowerCase().includes(search.toLowerCase()) ||
    caption.cameraName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Image className="h-5 w-5" />
            Caption Stream
          </CardTitle>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search captions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
              data-testid="input-search-captions"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {search ? "No captions match your search" : "No captions yet"}
            </div>
          ) : (
            filtered.map((caption) => (
              <div
                key={caption.id}
                className="flex gap-3 p-3 border rounded-md hover-elevate"
                data-testid={`caption-${caption.id}`}
              >
                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                  {caption.snapshotUrl ? (
                    <img
                      src={caption.snapshotUrl}
                      alt="Snapshot"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {caption.cameraName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(caption.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm" data-testid={`text-caption-${caption.id}`}>
                    {caption.caption}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
