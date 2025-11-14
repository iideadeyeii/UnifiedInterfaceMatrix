# Unified Dash - Infrastructure Control Plane

## Overview

Unified Dash is an AI-native infrastructure control plane designed for monitoring and orchestrating distributed computing resources, containers, and automation systems. The application provides real-time visibility into GPU compute clusters, storage capacity, container services, camera vision systems, and Home Assistant automations. It emphasizes data-first design with maximum information density for operational efficiency.

The system auto-discovers services via Docker and MCP (Model Context Protocol), monitors compute resources across multiple GPU nodes, tracks storage utilization with automated offloading capabilities, and integrates with home automation and vision processing pipelines.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: shadcn/ui with Radix UI primitives
- All UI components follow the "New York" style variant
- Tailwind CSS for styling with custom design system
- Components are located in `client/src/components/ui/`

**State Management**: TanStack Query (React Query) for server state
- Query client configured with no automatic refetching
- Infinite stale time - updates driven by WebSocket events
- Located in `client/src/lib/queryClient.ts`

**Real-time Updates**: WebSocket connection for live metrics
- Connects to `/ws` endpoint
- Receives GPU and storage metrics every 5 seconds
- Custom hook `useWebSocket` in `client/src/hooks/use-websocket.ts`

**Routing**: Wouter for client-side routing
- Lightweight alternative to React Router
- Single route configuration in `client/src/App.tsx`

**Design System**: Data-centric dashboard approach inspired by Linear, Grafana, and Carbon Design
- Typography: Inter for UI, JetBrains Mono for metrics/code
- Spacing primitives: Tailwind units (2, 4, 6, 8)
- 12-column grid system for responsive layouts
- Design guidelines documented in `design_guidelines.md`

### Backend Architecture

**Runtime**: Node.js with Express.js
- TypeScript with ES modules
- Entry point: `server/index.ts`

**API Structure**: RESTful endpoints with WebSocket support
- Service discovery: `/api/services`
- GPU monitoring: `/api/gpus`
- Storage monitoring: `/api/storage`
- Camera management: `/api/cameras`
- Vision captions: `/api/captions`
- Home Assistant stats: `/api/home-assistant`
- AI command processing: `/api/ai/command`
- WebSocket: `/ws` for real-time metric updates

**Data Storage**: In-memory storage implementation
- Interface defined in `server/storage.ts` as `IStorage`
- Current implementation: `MemStorage` class with in-memory arrays
- Designed to be swappable with database-backed implementation
- All entities use UUID-based identification

**Data Models** (defined in `shared/schema.ts`):
- Services: Docker containers/services with auto-discovery metadata
- GPUs: Utilization, VRAM, temperature, job queues
- Storage: Capacity tracking with usage thresholds (85% warning, 95% critical)
- Cameras: Reolink camera integrations with vision API
- Captions: Vision processing results with timestamps
- Home Assistant: Entity and automation statistics
- Models: AI model registry with placement and performance data
- Events: System event timeline with severity levels

**Request Logging**: Custom middleware for API request tracking
- Logs method, path, status code, duration
- Captures and logs JSON responses
- Truncates logs over 80 characters

### Data Storage Solutions

**Current Implementation**: In-memory storage using TypeScript arrays
- No persistence between restarts
- Fast read/write operations
- Suitable for real-time dashboard data

**Planned Implementation**: PostgreSQL with Drizzle ORM
- Configuration present in `drizzle.config.ts`
- Schema definitions use Drizzle's pg-core types
- Neon Database serverless driver (`@neondatabase/serverless`)
- Migration system configured to output to `./migrations`
- Schema location: `shared/schema.ts`

**Schema Validation**: Zod schemas generated from Drizzle definitions
- `createInsertSchema` from `drizzle-zod` for type-safe inserts
- Shared between frontend and backend via `shared/` directory

### Authentication and Authorization

**Current State**: No authentication implemented
- Open access to all endpoints
- Session management dependencies present (`connect-pg-simple`)
- Express session middleware not configured

**Intended Design**: Session-based authentication
- PostgreSQL session store via `connect-pg-simple`
- Sessions stored in database for persistence
- Cookie-based session tracking

### External Dependencies

**AI Services**:
- OpenAI API integration via Replit AI Integrations service
- Environment variables: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
- Used for natural language command processing in AI command bar
- Located in `server/routes.ts`

**Infrastructure Monitoring**:
- Docker API for container discovery and management
- MCP (Model Context Protocol) on mini-sparx for service status
- Expected endpoints: `/api/system/status`, `/api/docker/containers`

**Service Integrations** (auto-discovered):
- **AI Services**: Flowise, n8n (workflow automation), Ollama, LocalAI
- **Observability**: Langfuse (LLM tracing)
- **Databases**: Supabase, Qdrant (vector DB), Neo4j (graph DB)
- **Storage**: MinIO (object storage on mini-sparx)
- **Vision**: Custom Vision Caption API for camera processing
- **Web Server**: Caddy reverse proxy

**Home Automation**:
- Home Assistant API integration
- 7 Reolink cameras
- 443 total entities
- Motion detection and automation triggers

**Hardware Resources**:
- **Big-box machine**: Dual GPU setup (GPU0 at ~76% util, GPU1 at ~1% util)
- **mini-sparx**: 101 GB free RAM, hosts MCP server
- **Models drive**: 94% full, primary storage concern

**Development Tools**:
- Replit-specific Vite plugins for development environment
- Runtime error overlay
- Cartographer and dev banner (dev mode only)
- Source maps support via `@jridgewell/trace-mapping`

**Key Architectural Decisions**:

1. **Shared Schema Pattern**: Single source of truth in `shared/schema.ts` ensures type safety across frontend and backend
2. **WebSocket-Driven Updates**: Metrics pushed every 5 seconds to minimize polling overhead
3. **Service Auto-Discovery**: Docker labels and MCP integration eliminate manual service registration
4. **GPU Queue Routing**: Explicit GPU0/GPU1 job placement based on utilization and VRAM availability
5. **Storage Offloading**: Automated MinIO migration when local storage exceeds 85% threshold
6. **Theme System**: Dark mode as default with localStorage persistence
7. **Component Isolation**: Feature-specific components (GPU monitor, camera grid, etc.) as standalone modules
8. **Zero-Config Development**: Vite handles all bundling, HMR, and dev server configuration

## Deployment

### Production Deployment (Docker)

The application is packaged for deployment to mini-sparx (192.168.1.12) using Docker containers.

**Quick Start**:
```bash
# 1. Transfer files to mini-sparx
scp -r . mini-sparx:/opt/unified-dash/

# 2. SSH into mini-sparx
ssh mini-sparx
cd /opt/unified-dash

# 3. Configure environment
cp .env.example .env
nano .env  # Add tokens and keys

# 4. Deploy
./deploy.sh
```

**Access**: http://192.168.1.12:5050

**Key Files**:
- `Dockerfile` - Multi-stage container build
- `docker-compose.yml` - Service orchestration
- `.env.example` - Configuration template
- `deploy.sh` - Automated deployment script
- `DEPLOYMENT.md` - Complete deployment guide

**Environment Variables**:
- `SESSION_SECRET` - Session encryption key
- `HOME_ASSISTANT_TOKEN` - HA long-lived access token
- `OPENAI_API_KEY` - Optional, for AI command bar
- `BIG_BOX_HOST` - big-box IP (default: 192.168.1.232)
- `MINI_SPARX_HOST` - mini-sparx IP (default: 192.168.1.12)
- `HOME_ASSISTANT_HOST` - HA IP (default: 192.168.1.34)
- `MCP_SERVER_URL` - MCP endpoint (default: http://192.168.1.12:8888)
- `VISION_API_URL` - Vision API endpoint (default: http://192.168.1.232:5005)
- `LM_STUDIO_URL` - LM Studio endpoint (default: http://192.168.1.232:1234)

**Integration Points**:
- Monitors 36+ services across mini-sparx, big-box, and Home Assistant
- Real-time GPU metrics from big-box (2x RTX 6000 Blackwell)
- Storage monitoring across 19.3 TB infrastructure
- Camera feeds from 7 Reolink cameras
- Home Assistant entity statistics (443 entities)
- Vision Caption API integration
- MCP server communication for container management

**Resource Requirements**:
- CPU: ~0.5-1 core
- RAM: ~256-512 MB
- Storage: ~200 MB (container image)
- Network: Access to all infrastructure nodes

See `DEPLOYMENT.md` for complete instructions, troubleshooting, and advanced configuration.