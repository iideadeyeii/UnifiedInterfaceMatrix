import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Service Discovery
export const services = pgTable("services", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // ai, db, automation, vision, infra
  status: text("status").notNull(), // operational, warning, critical, offline
  url: text("url"),
  containerId: text("container_id"),
  uptime: real("uptime"), // percentage
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const insertServiceSchema = createInsertSchema(services).omit({ lastChecked: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// GPU Monitoring
export const gpus = pgTable("gpus", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  utilization: real("utilization").notNull(), // 0-1
  vramUsed: real("vram_used").notNull(), // GB
  vramTotal: real("vram_total").notNull(), // GB
  temperature: integer("temperature"),
  jobsQueued: integer("jobs_queued").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertGpuSchema = createInsertSchema(gpus).omit({ lastUpdated: true });
export type InsertGpu = z.infer<typeof insertGpuSchema>;
export type Gpu = typeof gpus.$inferSelect;

// Storage Monitoring
export const storage = pgTable("storage", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  path: text("path").notNull(),
  usedGB: real("used_gb").notNull(),
  totalGB: real("total_gb").notNull(),
  usagePercent: real("usage_percent").notNull(),
  type: text("type").notNull(), // models, data, system
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertStorageSchema = createInsertSchema(storage).omit({ lastUpdated: true });
export type InsertStorage = z.infer<typeof insertStorageSchema>;
export type Storage = typeof storage.$inferSelect;

// Camera Management
export const cameras = pgTable("cameras", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  enabled: boolean("enabled").default(true),
  captionEnabled: boolean("caption_enabled").default(false),
  rateLimit: integer("rate_limit").default(60), // seconds
  thumbnailUrl: text("thumbnail_url"),
  lastCaption: text("last_caption"),
  lastCaptionTime: timestamp("last_caption_time"),
});

export const insertCameraSchema = createInsertSchema(cameras).omit({ lastCaptionTime: true });
export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;

// Caption History
export const captions = pgTable("captions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cameraId: varchar("camera_id").notNull(),
  cameraName: text("camera_name").notNull(),
  caption: text("caption").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  snapshotUrl: text("snapshot_url"),
});

export const insertCaptionSchema = createInsertSchema(captions).omit({ id: true, timestamp: true });
export type InsertCaption = z.infer<typeof insertCaptionSchema>;
export type Caption = typeof captions.$inferSelect;

// Home Assistant
export const homeAssistant = pgTable("home_assistant", {
  id: varchar("id").primaryKey().default("ha_stats"),
  totalEntities: integer("total_entities").notNull(),
  activeAutomations: integer("active_automations").notNull(),
  totalAutomations: integer("total_automations").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertHomeAssistantSchema = createInsertSchema(homeAssistant).omit({ id: true, lastUpdated: true });
export type InsertHomeAssistant = z.infer<typeof insertHomeAssistantSchema>;
export type HomeAssistant = typeof homeAssistant.$inferSelect;

// Model Registry
export const models = pgTable("models", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // LMStudio, Ollama, LocalAI
  placement: text("placement").notNull(), // GPU0, GPU1, CPU
  vramFootprint: real("vram_footprint"), // GB
  typicalLatency: integer("typical_latency"), // ms
  isPinned: boolean("is_pinned").default(false),
});

export const insertModelSchema = createInsertSchema(models);
export type InsertModel = z.infer<typeof insertModelSchema>;
export type Model = typeof models.$inferSelect;

// System Events
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // service, container, gpu, storage, automation, vision
  severity: text("severity").notNull(), // info, warning, error
  title: text("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, timestamp: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// AI Command
export const aiCommandSchema = z.object({
  command: z.string().min(1),
});

export type AiCommand = z.infer<typeof aiCommandSchema>;

export const aiCommandResponseSchema = z.object({
  intent: z.enum(["open_service", "view_logs", "restart_service", "query_status", "unknown"]),
  confidence: z.number(),
  serviceId: z.string().optional(),
  message: z.string(),
  requiresConfirmation: z.boolean(),
});

export type AiCommandResponse = z.infer<typeof aiCommandResponseSchema>;
