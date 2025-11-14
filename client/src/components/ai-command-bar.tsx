import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Sparkles } from "lucide-react";

interface AiCommandBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (command: string) => Promise<void>;
  isLoading?: boolean;
  result?: {
    intent: string;
    message: string;
    confidence: number;
  } | null;
}

export function AiCommandBar({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  result = null,
}: AiCommandBarProps) {
  const [command, setCommand] = useState("");

  useEffect(() => {
    if (!open) {
      setCommand("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isLoading) return;
    
    await onSubmit(command);
    setCommand("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Command Center
          </DialogTitle>
          <DialogDescription>
            Use natural language to control services, query status, or view information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder='Try "open Langfuse" or "show GPU status"...'
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isLoading}
              data-testid="input-ai-command"
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!command.trim() || isLoading}
              data-testid="button-submit-command"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {result && (
            <div className="border rounded-md p-4 space-y-2 bg-muted/50">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="uppercase text-xs">
                  {result.intent.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-sm" data-testid="text-ai-response">
                {result.message}
              </p>
            </div>
          )}
        </form>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="font-medium">Example commands:</div>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>open [service name]</li>
            <li>show logs for [service]</li>
            <li>restart [service]</li>
            <li>what's the GPU status?</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
