# Unified Dash - Deployment Guide

## Overview

Unified Dash is an AI-native infrastructure control plane designed to monitor and orchestrate your distributed infrastructure. This guide covers deployment to your mini-sparx Docker environment.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Local Network                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  big-box (.232)          mini-sparx (.12)                │
│  ┌──────────────┐        ┌────────────────┐             │
│  │ LMStudio     │◄───────┤ Unified Dash   │             │
│  │ Vision API   │        │ :5050          │             │
│  │ ComfyUI      │        │                │             │
│  │ MQTT         │        │ Docker         │             │
│  └──────────────┘        │ Container      │             │
│         ▲                └────────┬───────┘             │
│         │                         │                      │
│         │                    Monitors                    │
│         │                         │                      │
│         └─────────────────────────┘                      │
│                                                           │
│                    Home Assistant (.34)                  │
│                    ┌─────────────────┐                   │
│                    │ 443 Entities    │                   │
│                    │ 7 Cameras       │                   │
│                    │ Automations     │                   │
│                    └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

### On mini-sparx (192.168.1.12)

- Docker Engine installed
- Docker Compose v2+
- Network access to:
  - big-box (192.168.1.232)
  - Home Assistant (192.168.1.34)
  - MCP Server on mini-sparx (port 8888)

### Required Tokens/Keys

1. **Home Assistant Long-Lived Access Token**
   - Navigate to: Profile → Long-Lived Access Tokens
   - Create new token
   - Save securely

2. **OpenAI API Key** (optional - for AI command bar)
   - Get from: https://platform.openai.com/api-keys
   - Can skip if not using AI command features

3. **Session Secret**
   - Generate with: `openssl rand -base64 32`

## Deployment Steps

### 1. Transfer Files to mini-sparx

```bash
# On your development machine
git clone <this-repo>
cd unified-dash

# Transfer to mini-sparx
scp -r . mini-sparx:/opt/unified-dash/
```

### 2. Configure Environment

```bash
# SSH into mini-sparx
ssh mini-sparx
cd /opt/unified-dash

# Create environment file
cp .env.example .env
nano .env
```

Edit `.env` with your values:

```bash
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
OPENAI_API_KEY=sk-your-key-here
HOME_ASSISTANT_TOKEN=<your-ha-token>

# Verify these match your network
BIG_BOX_HOST=192.168.1.232
MINI_SPARX_HOST=192.168.1.12
HOME_ASSISTANT_HOST=192.168.1.34

# Service URLs
MCP_SERVER_URL=http://192.168.1.12:8888
VISION_API_URL=http://192.168.1.232:5005
LM_STUDIO_URL=http://192.168.1.232:1234
```

### 3. Build and Deploy

```bash
# Build the container
docker compose build

# Start the service
docker compose up -d

# Verify it's running
docker compose ps
docker compose logs -f unified-dash
```

### 4. Access the Dashboard

Open your browser and navigate to:

```
http://192.168.1.12:5050
```

Or access via Caddy reverse proxy (if configured):

```
http://mini-sparx/dash
```

## Verification Checklist

After deployment, verify:

- [ ] Dashboard loads at http://192.168.1.12:5050
- [ ] Service cards display (Caddy, Flowise, n8n, etc.)
- [ ] GPU metrics show from big-box
- [ ] Storage metrics display
- [ ] Camera grid loads
- [ ] Home Assistant stats appear
- [ ] WebSocket connection established (real-time updates)
- [ ] AI command bar responds (if OpenAI key configured)

## Integration with Existing Services

### Caddy Reverse Proxy

Add to your Caddy configuration on mini-sparx:

```caddyfile
# /etc/caddy/Caddyfile or via docker labels
mini-sparx {
    handle /dash* {
        reverse_proxy unified-dash:5000
    }
}
```

Then reload Caddy:
```bash
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

### Watchtower Auto-Updates

The container is labeled for Watchtower. If you have Watchtower running:

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --label-enable \
  --interval 300
```

Unified Dash will auto-update when you push new builds.

## Monitoring & Logs

### View Logs

```bash
# Follow live logs
docker compose logs -f unified-dash

# Last 100 lines
docker compose logs --tail=100 unified-dash

# Logs since timestamp
docker compose logs --since 2025-11-14T10:00:00 unified-dash
```

### Check Container Health

```bash
# Container status
docker compose ps

# Resource usage
docker stats unified-dash

# Inspect container
docker inspect unified-dash
```

## Updating the Dashboard

### Method 1: Git Pull (Recommended)

```bash
cd /opt/unified-dash
git pull origin main
docker compose build
docker compose up -d
```

### Method 2: Manual File Transfer

```bash
# From development machine
scp -r ./client ./server ./shared mini-sparx:/opt/unified-dash/

# On mini-sparx
cd /opt/unified-dash
docker compose build
docker compose up -d
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs for errors
docker compose logs unified-dash

# Common issues:
# 1. Missing .env file
cp .env.example .env && nano .env

# 2. Port 5050 already in use
docker compose down
sudo lsof -i :5050
# Kill conflicting process or change port in docker-compose.yml

# 3. Build errors
docker compose build --no-cache
```

### WebSocket Connection Fails

Check that port 5050 is accessible:

```bash
# On mini-sparx
curl http://localhost:5050/api/services

# From another machine
curl http://192.168.1.12:5050/api/services
```

### No Data Showing

Verify backend services are accessible:

```bash
# Test MCP Server
curl http://192.168.1.12:8888/api/system/status

# Test Vision API
curl http://192.168.1.232:5005/health

# Test LM Studio
curl http://192.168.1.232:1234/v1/models
```

### Home Assistant Integration

If HA stats don't load:

1. Verify token is valid (test with curl):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://192.168.1.34:8123/api/states
```

2. Check HA is accessible from mini-sparx:
```bash
ping 192.168.1.34
```

## Performance Optimization

### Resource Allocation

The container uses minimal resources (~200MB RAM). To limit:

```yaml
# Add to docker-compose.yml under unified-dash service:
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      memory: 256M
```

### Network Optimization

For faster WebSocket updates, ensure low-latency network:

```bash
# Test latency from mini-sparx to big-box
ping -c 10 192.168.1.232

# Should be <1ms on local network
```

## Security Considerations

1. **Session Secret**: Use a strong random value, never commit to git
2. **API Keys**: Store in .env file only, never in code
3. **Network Access**: Dashboard exposes infrastructure metrics
   - Consider running behind authentication (Caddy + auth portal)
   - Use firewall rules if exposing beyond local network
4. **HTTPS**: Use Caddy reverse proxy with automatic TLS for production

## Backup & Recovery

### Backup Configuration

```bash
# Backup .env file (contains secrets)
cp /opt/unified-dash/.env /opt/backups/unified-dash.env.$(date +%Y%m%d)

# Backup entire directory
tar -czf unified-dash-backup-$(date +%Y%m%d).tar.gz /opt/unified-dash
```

### Disaster Recovery

```bash
# Stop container
docker compose down

# Restore from backup
tar -xzf unified-dash-backup-YYYYMMDD.tar.gz -C /

# Restart
docker compose up -d
```

## Advanced Configuration

### Custom Port

Edit `docker-compose.yml`:

```yaml
ports:
  - "8080:5000"  # Change 5050 to your preferred port
```

### Multiple Dashboards

Run multiple instances with different configs:

```bash
# Dashboard for production
cd /opt/unified-dash-prod
docker compose -p unified-dash-prod up -d

# Dashboard for development/testing
cd /opt/unified-dash-dev
docker compose -p unified-dash-dev -f docker-compose.dev.yml up -d
```

## Support & Development

- Issues: Open GitHub issue
- Logs: Always include `docker compose logs` output
- Network diagram: Attach topology if custom setup

## Next Steps

After successful deployment:

1. Configure Caddy reverse proxy for clean URLs
2. Set up SSL certificates (Caddy handles automatically)
3. Create bookmark/shortcut for quick access
4. Integrate with Home Assistant dashboard
5. Set up automated backups
6. Configure monitoring alerts (optional)

---

**Deployment completed!** Your Unified Dash is now monitoring your infrastructure in real-time. 🚀
