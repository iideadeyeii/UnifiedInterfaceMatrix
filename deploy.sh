#!/bin/bash

# Unified Dash - Quick Deployment Script
# For mini-sparx (192.168.1.12)

set -e

echo "🚀 Unified Dash Deployment Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "⚡ Please edit .env with your configuration:"
    echo "   - SESSION_SECRET (generate with: openssl rand -base64 32)"
    echo "   - HOME_ASSISTANT_TOKEN (from HA profile)"
    echo "   - OPENAI_API_KEY (optional)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ .env file found"
echo ""

# Check Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "   Start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Build the container
echo "🏗️  Building container..."
docker compose build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build complete"
echo ""

# Stop existing container (if running)
echo "🛑 Stopping existing container (if any)..."
docker compose down 2>/dev/null || true
echo ""

# Start the service
echo "▶️  Starting Unified Dash..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start service!"
    exit 1
fi

echo "✅ Service started"
echo ""

# Wait for container to be healthy
echo "⏳ Waiting for service to be ready..."
sleep 5

# Check if container is running
if docker compose ps | grep -q "Up"; then
    echo "✅ Container is running"
else
    echo "❌ Container failed to start"
    echo ""
    echo "📋 Logs:"
    docker compose logs --tail=50
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Deployment complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Dashboard URL: http://$(hostname -I | awk '{print $1}'):5050"
echo "   (or http://192.168.1.12:5050)"
echo ""
echo "📊 View logs:     docker compose logs -f"
echo "🔄 Restart:       docker compose restart"
echo "🛑 Stop:          docker compose down"
echo ""
echo "📚 Full documentation: DEPLOYMENT.md"
echo ""
