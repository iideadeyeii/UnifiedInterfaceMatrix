import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiCommandSchema } from "@shared/schema";
import OpenAI from "openai";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    const interval = setInterval(async () => {
      if (ws.readyState === WebSocket.OPEN) {
        const gpus = await storage.getAllGpus();
        const storageData = await storage.getAllStorage();
        
        ws.send(JSON.stringify({
          type: 'metrics_update',
          data: {
            gpus,
            storage: storageData,
            timestamp: new Date().toISOString(),
          },
        }));
      }
    }, 5000);

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clearInterval(interval);
    });
  });

  // Services endpoints
  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  // GPU endpoints
  app.get("/api/gpus", async (_req, res) => {
    try {
      const gpus = await storage.getAllGpus();
      res.json(gpus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GPUs" });
    }
  });

  app.get("/api/gpus/:id", async (req, res) => {
    try {
      const gpu = await storage.getGpu(req.params.id);
      if (!gpu) {
        return res.status(404).json({ error: "GPU not found" });
      }
      res.json(gpu);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch GPU" });
    }
  });

  // Storage endpoints
  app.get("/api/storage", async (_req, res) => {
    try {
      const storageData = await storage.getAllStorage();
      res.json(storageData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch storage" });
    }
  });

  app.get("/api/storage/:id", async (req, res) => {
    try {
      const storageItem = await storage.getStorage(req.params.id);
      if (!storageItem) {
        return res.status(404).json({ error: "Storage not found" });
      }
      res.json(storageItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch storage" });
    }
  });

  // Camera endpoints
  app.get("/api/cameras", async (_req, res) => {
    try {
      const cameras = await storage.getAllCameras();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cameras" });
    }
  });

  app.get("/api/cameras/:id", async (req, res) => {
    try {
      const camera = await storage.getCamera(req.params.id);
      if (!camera) {
        return res.status(404).json({ error: "Camera not found" });
      }
      res.json(camera);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch camera" });
    }
  });

  app.patch("/api/cameras/:id", async (req, res) => {
    try {
      const camera = await storage.getCamera(req.params.id);
      if (!camera) {
        return res.status(404).json({ error: "Camera not found" });
      }

      const updated = await storage.updateCamera(req.params.id, req.body);
      
      if (req.body.captionEnabled !== undefined) {
        await storage.createEvent({
          type: "vision",
          severity: "info",
          title: `Caption ${req.body.captionEnabled ? "enabled" : "disabled"} for ${camera.name}`,
          description: `Vision Caption API toggled for camera`,
          metadata: { cameraId: req.params.id },
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update camera" });
    }
  });

  // Caption endpoints
  app.get("/api/captions", async (_req, res) => {
    try {
      const captions = await storage.getAllCaptions();
      res.json(captions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch captions" });
    }
  });

  // Home Assistant endpoints
  app.get("/api/home-assistant", async (_req, res) => {
    try {
      const stats = await storage.getHomeAssistantStats();
      if (!stats) {
        return res.status(404).json({ error: "Home Assistant stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Home Assistant stats" });
    }
  });

  // Model endpoints
  app.get("/api/models", async (_req, res) => {
    try {
      const models = await storage.getAllModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  // Event endpoints
  app.get("/api/events", async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Storage offload endpoint
  app.post("/api/storage/offload", async (req, res) => {
    try {
      const { storageId } = req.body;
      if (!storageId) {
        return res.status(400).json({ error: "Storage ID is required" });
      }

      const storageItem = await storage.getStorage(storageId);
      if (!storageItem) {
        return res.status(404).json({ error: "Storage not found" });
      }

      const freedGB = 200;
      const newUsedGB = Math.max(0, storageItem.usedGB - freedGB);
      const newUsagePercent = (newUsedGB / storageItem.totalGB) * 100;

      await storage.updateStorage(storageId, {
        usedGB: newUsedGB,
        usagePercent: newUsagePercent,
      });

      await storage.createEvent({
        type: "storage",
        severity: "info",
        title: `MinIO offload completed for ${storageItem.name}`,
        description: `Freed ${freedGB} GB - usage now at ${newUsagePercent.toFixed(1)}%`,
        metadata: { storageId, freedGB },
      });

      res.json({ success: true, message: "Offload completed", freedGB });
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate offload" });
    }
  });

  // AI Command endpoint
  app.post("/api/ai/command", async (req, res) => {
    try {
      const result = aiCommandSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          intent: "unknown",
          confidence: 0,
          message: "Invalid command format",
          requiresConfirmation: false,
        });
      }

      const { command } = result.data;

      if (!process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
        console.warn("AI Integration credentials not configured");
        
        const lowerCommand = command.toLowerCase();
        const services = await storage.getAllServices();
        
        let intent = "unknown";
        let serviceId = undefined;
        let message = "AI features are not configured. I can help you with basic commands.";
        
        const openMatch = lowerCommand.match(/open\s+(\w+)/i);
        if (openMatch) {
          const serviceName = openMatch[1];
          const service = services.find(s => 
            s.name.toLowerCase().includes(serviceName.toLowerCase()) ||
            s.id.toLowerCase().includes(serviceName.toLowerCase())
          );
          if (service) {
            intent = "open_service";
            serviceId = service.id;
            message = service.url 
              ? `Opening ${service.name} in a new tab...`
              : `${service.name} doesn't have a URL configured.`;
          }
        }
        
        return res.json({
          intent,
          confidence: 0.7,
          serviceId,
          message,
          requiresConfirmation: false,
        });
      }

      const services = await storage.getAllServices();
      const serviceList = services.map(s => `${s.id}: ${s.name} (${s.type})`).join(", ");

      const systemPrompt = `You are an AI assistant for the Unified Dash infrastructure control plane. 
Parse user commands and return structured JSON responses.

Available services: ${serviceList}

Respond with:
- intent: one of "open_service", "view_logs", "restart_service", "query_status", "unknown"
- confidence: 0-1 score
- serviceId: the service ID if applicable (match loosely by name)
- message: friendly response to the user
- requiresConfirmation: true for destructive actions`;

      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: command }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 500,
      });

      const aiResponse = JSON.parse(completion.choices[0]?.message?.content || "{}");

      const response = {
        intent: aiResponse.intent || "unknown",
        confidence: aiResponse.confidence || 0.5,
        serviceId: aiResponse.serviceId || undefined,
        message: aiResponse.message || "I'm not sure what you want to do.",
        requiresConfirmation: aiResponse.requiresConfirmation || false,
      };

      if (response.intent === "open_service" && response.serviceId) {
        const service = await storage.getService(response.serviceId);
        if (service?.url) {
          response.message = `Opening ${service.name} in a new tab...`;
        } else {
          response.message = `${service?.name || "Service"} doesn't have a URL configured.`;
          response.intent = "unknown";
        }
      }

      res.json(response);
    } catch (error) {
      console.error("AI command error:", error);
      res.status(500).json({ 
        intent: "unknown",
        confidence: 0,
        message: "Sorry, I encountered an error processing your command.",
        requiresConfirmation: false,
      });
    }
  });

  return httpServer;
}
