import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface MetricsUpdate {
  type: string;
  data: {
    gpus: any[];
    storage: any[];
    timestamp: string;
  };
}

export function useWebSocket() {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: MetricsUpdate = JSON.parse(event.data);
          
          if (message.type === "metrics_update") {
            queryClient.setQueryData(["/api/gpus"], (oldData: any) => {
              if (JSON.stringify(oldData) === JSON.stringify(message.data.gpus)) {
                return oldData;
              }
              return message.data.gpus;
            });
            
            queryClient.setQueryData(["/api/storage"], (oldData: any) => {
              if (JSON.stringify(oldData) === JSON.stringify(message.data.storage)) {
                return oldData;
              }
              return message.data.storage;
            });
          }
        } catch (error) {
          console.error("WebSocket message parse error:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [queryClient]);

  return { isConnected };
}
