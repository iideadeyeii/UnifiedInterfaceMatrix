import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Model } from "@shared/schema";
import { Database, Pin } from "lucide-react";

interface ModelRegistryProps {
  models: Model[];
}

export function ModelRegistry({ models }: ModelRegistryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Database className="h-5 w-5" />
          Model Registry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead className="text-right">VRAM</TableHead>
                <TableHead className="text-right">Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No models registered
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow key={model.id} data-testid={`row-model-${model.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {model.isPinned && <Pin className="h-3 w-3 text-primary" />}
                        <span data-testid={`text-model-name-${model.id}`}>{model.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {model.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">
                        {model.placement}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {model.vramFootprint ? `${model.vramFootprint.toFixed(1)} GB` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {model.typicalLatency ? `${model.typicalLatency}ms` : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
