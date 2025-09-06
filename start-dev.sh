#!/bin/bash

# Računko - Smart Invoice Management System
# Startup script for development environment

echo "🚀 Starting Računko development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start PostgreSQL database
echo "📦 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd packages/db
npm run db:generate
cd ../..

# Run database migrations
echo "🗄️ Running database migrations..."
cd packages/db
npm run db:push
cd ../..

# Seed the database
echo "🌱 Seeding database..."
cd packages/db
npm run db:seed
cd ../..

echo "✅ Development environment is ready!"
echo ""
echo "To start the services:"
echo "  • Web app: npm run dev:web"
echo "  • API server: cd packages/api && npm run dev"
echo "  • Tax scraper: cd apps/scraper && npm run dev"
echo ""
echo "Web app will be available at: http://localhost:3000"
echo "API server will be available at: http://localhost:3001"
echo "Database will be available at: localhost:5432"
