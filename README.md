# Unified Dash

**AI-Native Infrastructure Control Plane**

Unified Dash is a futuristic, real-time monitoring and orchestration dashboard for distributed AI/ML infrastructure. Designed to complement multi-system setups with GPU clusters, microservices platforms, and home automation systems.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

## Features

### 🎯 Real-Time Monitoring

- **GPU Metrics**: Live utilization, VRAM, temperature across multiple GPUs
- **Storage Tracking**: Capacity monitoring with threshold alerts (85% warning, 95% critical)
- **Service Discovery**: Auto-discovers Docker containers and microservices
- **Camera Feeds**: Integration with Reolink camera systems
- **Home Assistant**: Entity and automation statistics

### 🚀 AI-Powered

- **Natural Language Commands**: AI command bar for infrastructure control
- **Vision Processing**: Integration with Vision Caption API for camera analysis
- **LLM Integration**: OpenAI-powered command interpretation and routing

### 🎨 Futuristic Interface

- **Sci-Fi Aesthetic**: Electric blue (240° hue) and neon-green color scheme
- **Dynamic Animations**: Pulsing glows, scan lines, gradient effects
- **Real-Time Updates**: WebSocket-driven live metrics (5-second refresh)
- **Information Density**: Data-first design for operational efficiency

### 📊 Comprehensive Coverage

Monitors across your infrastructure:
- GPU compute clusters
- Container orchestration (Docker)
- Storage systems (local + network)
- Vision/camera systems
- Home automation platforms
- AI/ML services (Flowise, n8n, Ollama, LocalAI)
- Databases (PostgreSQL, Qdrant, Neo4j, Redis)

## Quick Start

### Prerequisites

- Docker Engine + Docker Compose v2+
- Node.js 20+ (for development)
- Network access to your infrastructure

### Deployment

**Option 1: Docker (Recommended for Production)**

```bash
# Clone repository
git clone <repo-url>
cd unified-dash

# Configure environment
cp .env.example .env
nano .env  # Add your tokens/keys

# Deploy with single command
./deploy.sh
```

Access at: `http://<your-server>:5050`

**Option 2: Development Mode**

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env

# Start development server
npm run dev
```

Access at: `http://localhost:5000`

## Configuration

### Required Environment Variables

```bash
# Security
SESSION_SECRET=<generate-with-openssl-rand-base64-32>

# Home Assistant Integration
HOME_ASSISTANT_HOST=192.168.1.34
HOME_ASSISTANT_TOKEN=<your-long-lived-access-token>

# Infrastructure Endpoints
BIG_BOX_HOST=192.168.1.232
MINI_SPARX_HOST=192.168.1.12
MCP_SERVER_URL=http://192.168.1.12:8888
VISION_API_URL=http://192.168.1.232:5005
LM_STUDIO_URL=http://192.168.1.232:1234
```

### Optional Variables

```bash
# OpenAI API (for AI command bar)
OPENAI_API_KEY=sk-your-key-here
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Unified Dash                        │
│         (mini-sparx:5050)                        │
├─────────────────────────────────────────────────┤
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  GPU     │  │ Storage  │  │ Services │      │
│  │ Monitor  │  │ Monitor  │  │Discovery │      │
│  └─────┬────┘  └────┬─────┘  └────┬─────┘      │
│        │            │             │              │
│        └────────────┴─────────────┘              │
│                     │                             │
│            WebSocket Updates                      │
│                     │                             │
└─────────────────────┼─────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼────┐               ┌───▼────┐
    │big-box  │               │  Home  │
    │ GPUs    │               │Assistant│
    │ Vision  │               │ Cameras │
    │ LLMs    │               │ Entities│
    └─────────┘               └────────┘
```

## Technology Stack

**Frontend**:
- React 18 + TypeScript
- Vite (build tool)
- TanStack Query (server state)
- shadcn/ui + Radix UI
- Tailwind CSS
- Wouter (routing)
- Framer Motion (animations)

**Backend**:
- Node.js + Express
- TypeScript
- WebSocket (ws)
- In-memory storage (swappable to PostgreSQL)

**Deployment**:
- Docker + Docker Compose
- Multi-stage builds
- Alpine Linux base

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[design_guidelines.md](design_guidelines.md)** - UI/UX design system
- **[replit.md](replit.md)** - Technical architecture documentation

## Development

### Project Structure

```
unified-dash/
├── client/               # Frontend (React)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
│   └── index.html
├── server/              # Backend (Express)
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data layer
│   └── vite.ts         # Dev server
├── shared/             # Shared types
│   └── schema.ts       # Data models
├── Dockerfile          # Container build
├── docker-compose.yml  # Service orchestration
└── deploy.sh          # Deployment script
```

### Build Commands

```bash
# Development
npm run dev           # Start dev server (localhost:5000)

# Production
npm run build        # Build frontend + backend
npm run start        # Start production server

# Docker
docker compose build # Build container
docker compose up -d # Run detached
docker compose logs  # View logs
```

## Integration Examples

### Home Assistant

```yaml
# configuration.yaml
rest:
  - resource: "http://192.168.1.12:5050/api/services"
    sensor:
      - name: "Infrastructure Services"
        value_template: "{{ value_json | length }}"
```

### Caddy Reverse Proxy

```caddyfile
mini-sparx {
    handle /dash* {
        reverse_proxy unified-dash:5000
    }
}
```

## Monitoring Capabilities

| Category | Metrics | Source |
|----------|---------|--------|
| GPUs | Utilization, VRAM, Temperature, Jobs | big-box NVIDIA GPUs |
| Storage | Capacity, Usage %, Free Space | NVMe + HDD drives |
| Services | Status, Uptime, Container Health | Docker API + MCP |
| Cameras | Live feeds, Motion, Vision captions | Reolink + Vision API |
| Home Automation | Entity count, Automation status | Home Assistant API |
| Models | Loaded models, Performance, Placement | LM Studio + Ollama |

## Infrastructure Requirements

Designed for environments with:
- Multiple compute nodes (CPU + GPU)
- Container orchestration (Docker)
- Home automation systems (Home Assistant)
- Network-accessible services
- Vision/camera systems

**Tested Configuration**:
- big-box: 24-core Threadripper, 125GB RAM, 2x RTX 6000 (194GB VRAM)
- mini-sparx: 119GB RAM, 3.7TB storage, 36 Docker containers
- Home Assistant: Raspberry Pi, 443 entities, 7 cameras

## Troubleshooting

### Container Won't Start
```bash
docker compose logs unified-dash
docker compose down && docker compose up -d
```

### No Data Showing
```bash
# Test backend connectivity
curl http://localhost:5050/api/services

# Check WebSocket
docker compose logs -f unified-dash | grep -i websocket
```

### Common Issues

1. **Missing .env file**: Copy from `.env.example`
2. **Port 5050 in use**: Change in `docker-compose.yml`
3. **No Home Assistant data**: Verify `HOME_ASSISTANT_TOKEN`
4. **WebSocket disconnects**: Check network firewall rules

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete troubleshooting guide.

## Contributing

This project is designed for personal infrastructure monitoring. Feel free to fork and adapt for your environment.

## License

MIT License - see LICENSE file for details

## Support

- Documentation: See `/docs` folder
- Issues: Open GitHub issue with logs
- Network diagram: Include your topology if custom

---

**Status**: Production-ready • **Version**: 1.0.0 • **Platform**: Docker + Node.js 20

Built for monitoring distributed AI/ML infrastructure with real-time visibility and futuristic aesthetics. 🚀
