import {
  type Service,
  type InsertService,
  type Gpu,
  type InsertGpu,
  type Storage,
  type InsertStorage,
  type Camera,
  type InsertCamera,
  type Caption,
  type InsertCaption,
  type HomeAssistant,
  type InsertHomeAssistant,
  type Model,
  type InsertModel,
  type Event,
  type InsertEvent,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
  
  getAllGpus(): Promise<Gpu[]>;
  getGpu(id: string): Promise<Gpu | undefined>;
  updateGpu(id: string, updates: Partial<Gpu>): Promise<Gpu | undefined>;
  
  getAllStorage(): Promise<Storage[]>;
  getStorage(id: string): Promise<Storage | undefined>;
  updateStorage(id: string, updates: Partial<Storage>): Promise<Storage | undefined>;
  
  getAllCameras(): Promise<Camera[]>;
  getCamera(id: string): Promise<Camera | undefined>;
  updateCamera(id: string, updates: Partial<Camera>): Promise<Camera | undefined>;
  
  getAllCaptions(): Promise<Caption[]>;
  createCaption(caption: InsertCaption): Promise<Caption>;
  
  getHomeAssistantStats(): Promise<HomeAssistant | undefined>;
  
  getAllModels(): Promise<Model[]>;
  
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
}

export class MemStorage implements IStorage {
  private services: Map<string, Service>;
  private gpus: Map<string, Gpu>;
  private storage: Map<string, Storage>;
  private cameras: Map<string, Camera>;
  private captions: Map<string, Caption>;
  private homeAssistant: HomeAssistant | undefined;
  private models: Map<string, Model>;
  private events: Map<string, Event>;

  constructor() {
    this.services = new Map();
    this.gpus = new Map();
    this.storage = new Map();
    this.cameras = new Map();
    this.captions = new Map();
    this.models = new Map();
    this.events = new Map();
    
    this.seedData();
  }

  private seedData() {
    const services: Service[] = [
      {
        id: "langfuse",
        name: "Langfuse",
        type: "ai",
        status: "operational",
        url: "http://localhost:3001",
        containerId: "langfuse_abc123",
        uptime: 99.8,
        lastChecked: new Date(),
      },
      {
        id: "flowise",
        name: "Flowise",
        type: "ai",
        status: "operational",
        url: "http://localhost:3002",
        containerId: "flowise_def456",
        uptime: 98.5,
        lastChecked: new Date(),
      },
      {
        id: "n8n",
        name: "n8n",
        type: "automation",
        status: "operational",
        url: "http://localhost:5678",
        containerId: "n8n_ghi789",
        uptime: 99.9,
        lastChecked: new Date(),
      },
      {
        id: "ollama",
        name: "Ollama",
        type: "ai",
        status: "operational",
        url: "http://localhost:11434",
        containerId: "ollama_jkl012",
        uptime: 100,
        lastChecked: new Date(),
      },
      {
        id: "supabase",
        name: "Supabase",
        type: "db",
        status: "operational",
        url: "http://localhost:54321",
        containerId: "supabase_mno345",
        uptime: 99.7,
        lastChecked: new Date(),
      },
      {
        id: "qdrant",
        name: "Qdrant",
        type: "db",
        status: "warning",
        url: "http://localhost:6333",
        containerId: "qdrant_pqr678",
        uptime: 95.2,
        lastChecked: new Date(),
      },
      {
        id: "neo4j",
        name: "Neo4j",
        type: "db",
        status: "operational",
        url: "http://localhost:7474",
        containerId: "neo4j_stu901",
        uptime: 98.1,
        lastChecked: new Date(),
      },
      {
        id: "caddy",
        name: "Caddy",
        type: "infra",
        status: "operational",
        url: null,
        containerId: "caddy_vwx234",
        uptime: 99.99,
        lastChecked: new Date(),
      },
    ];

    services.forEach((s) => this.services.set(s.id, s));

    const gpus: Gpu[] = [
      {
        id: "gpu0",
        name: "GPU 0",
        utilization: 0.76,
        vramUsed: 52,
        vramTotal: 80,
        temperature: 72,
        jobsQueued: 3,
        lastUpdated: new Date(),
      },
      {
        id: "gpu1",
        name: "GPU 1",
        utilization: 0.01,
        vramUsed: 4,
        vramTotal: 80,
        temperature: 45,
        jobsQueued: 0,
        lastUpdated: new Date(),
      },
    ];

    gpus.forEach((g) => this.gpus.set(g.id, g));

    const storage: Storage[] = [
      {
        id: "models",
        name: "Models Drive",
        path: "/mnt/models",
        usedGB: 1880,
        totalGB: 2000,
        usagePercent: 94,
        type: "models",
        lastUpdated: new Date(),
      },
      {
        id: "data",
        name: "Data Drive",
        path: "/mnt/data",
        usedGB: 450,
        totalGB: 1000,
        usagePercent: 45,
        type: "data",
        lastUpdated: new Date(),
      },
      {
        id: "system",
        name: "System Drive",
        path: "/",
        usedGB: 180,
        totalGB: 500,
        usagePercent: 36,
        type: "system",
        lastUpdated: new Date(),
      },
    ];

    storage.forEach((s) => this.storage.set(s.id, s));

    const cameras: Camera[] = [
      {
        id: "tracker",
        name: "Tracker Camera",
        enabled: true,
        captionEnabled: true,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: "Person walking towards front door",
        lastCaptionTime: new Date(Date.now() - 300000),
      },
      {
        id: "front_door",
        name: "Front Door",
        enabled: true,
        captionEnabled: false,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
      {
        id: "driveway",
        name: "Driveway",
        enabled: true,
        captionEnabled: false,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
      {
        id: "backyard",
        name: "Backyard",
        enabled: true,
        captionEnabled: false,
        rateLimit: 90,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
      {
        id: "garage",
        name: "Garage",
        enabled: true,
        captionEnabled: false,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
      {
        id: "side_gate",
        name: "Side Gate",
        enabled: false,
        captionEnabled: false,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
      {
        id: "porch",
        name: "Front Porch",
        enabled: true,
        captionEnabled: false,
        rateLimit: 60,
        thumbnailUrl: null,
        lastCaption: null,
        lastCaptionTime: null,
      },
    ];

    cameras.forEach((c) => this.cameras.set(c.id, c));

    const captions: Caption[] = [
      {
        id: randomUUID(),
        cameraId: "tracker",
        cameraName: "Tracker Camera",
        caption: "Person walking towards front door with package",
        timestamp: new Date(Date.now() - 300000),
        snapshotUrl: null,
      },
      {
        id: randomUUID(),
        cameraId: "tracker",
        cameraName: "Tracker Camera",
        caption: "Motion detected near vehicle in driveway",
        timestamp: new Date(Date.now() - 7200000),
        snapshotUrl: null,
      },
      {
        id: randomUUID(),
        cameraId: "tracker",
        cameraName: "Tracker Camera",
        caption: "Cat walking across porch",
        timestamp: new Date(Date.now() - 14400000),
        snapshotUrl: null,
      },
    ];

    captions.forEach((c) => this.captions.set(c.id, c));

    this.homeAssistant = {
      id: "ha_stats",
      totalEntities: 443,
      activeAutomations: 1,
      totalAutomations: 1,
      lastUpdated: new Date(),
    };

    const models: Model[] = [
      {
        id: "llama3_70b",
        name: "Llama 3 70B",
        provider: "Ollama",
        placement: "GPU0",
        vramFootprint: 42,
        typicalLatency: 450,
        isPinned: true,
      },
      {
        id: "mistral_7b",
        name: "Mistral 7B",
        provider: "LMStudio",
        placement: "GPU1",
        vramFootprint: 5.2,
        typicalLatency: 85,
        isPinned: false,
      },
      {
        id: "sd_xl",
        name: "Stable Diffusion XL",
        provider: "LocalAI",
        placement: "GPU0",
        vramFootprint: 12,
        typicalLatency: 2500,
        isPinned: true,
      },
      {
        id: "codellama",
        name: "CodeLlama 34B",
        provider: "Ollama",
        placement: "GPU0",
        vramFootprint: 20,
        typicalLatency: 320,
        isPinned: false,
      },
    ];

    models.forEach((m) => this.models.set(m.id, m));

    const events: Event[] = [
      {
        id: randomUUID(),
        type: "service",
        severity: "info",
        title: "Langfuse service started",
        description: "Service successfully initialized and ready",
        metadata: null,
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: randomUUID(),
        type: "gpu",
        severity: "warning",
        title: "GPU0 high utilization",
        description: "GPU0 has been at 76% utilization for extended period",
        metadata: null,
        timestamp: new Date(Date.now() - 1800000),
      },
      {
        id: randomUUID(),
        type: "storage",
        severity: "error",
        title: "Models drive at 94% capacity",
        description: "Critical storage warning - consider offloading to MinIO",
        metadata: null,
        timestamp: new Date(Date.now() - 900000),
      },
      {
        id: randomUUID(),
        type: "vision",
        severity: "info",
        title: "New caption generated",
        description: "Tracker Camera: Person walking towards front door",
        metadata: null,
        timestamp: new Date(Date.now() - 300000),
      },
    ];

    events.forEach((e) => this.events.set(e.id, e));
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const service: Service = {
      ...insertService,
      lastChecked: new Date(),
    };
    this.services.set(service.id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updated = { ...service, ...updates };
    this.services.set(id, updated);
    return updated;
  }

  async getAllGpus(): Promise<Gpu[]> {
    return Array.from(this.gpus.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getGpu(id: string): Promise<Gpu | undefined> {
    return this.gpus.get(id);
  }

  async updateGpu(id: string, updates: Partial<Gpu>): Promise<Gpu | undefined> {
    const gpu = this.gpus.get(id);
    if (!gpu) return undefined;
    
    const updated = { ...gpu, ...updates, lastUpdated: new Date() };
    this.gpus.set(id, updated);
    return updated;
  }

  async getAllStorage(): Promise<Storage[]> {
    return Array.from(this.storage.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getStorage(id: string): Promise<Storage | undefined> {
    return this.storage.get(id);
  }

  async updateStorage(id: string, updates: Partial<Storage>): Promise<Storage | undefined> {
    const storageItem = this.storage.get(id);
    if (!storageItem) return undefined;
    
    const updated = { ...storageItem, ...updates, lastUpdated: new Date() };
    this.storage.set(id, updated);
    return updated;
  }

  async getAllCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCamera(id: string): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }

  async updateCamera(id: string, updates: Partial<Camera>): Promise<Camera | undefined> {
    const camera = this.cameras.get(id);
    if (!camera) return undefined;
    
    const updated = { ...camera, ...updates };
    this.cameras.set(id, updated);
    return updated;
  }

  async getAllCaptions(): Promise<Caption[]> {
    return Array.from(this.captions.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createCaption(insertCaption: InsertCaption): Promise<Caption> {
    const caption: Caption = {
      id: randomUUID(),
      ...insertCaption,
      timestamp: new Date(),
    };
    this.captions.set(caption.id, caption);
    return caption;
  }

  async getHomeAssistantStats(): Promise<HomeAssistant | undefined> {
    return this.homeAssistant;
  }

  async getAllModels(): Promise<Model[]> {
    return Array.from(this.models.values())
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || a.name.localeCompare(b.name));
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const event: Event = {
      id: randomUUID(),
      ...insertEvent,
      timestamp: new Date(),
    };
    this.events.set(event.id, event);
    return event;
  }
}

export const storage = new MemStorage();
