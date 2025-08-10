#!/bin/bash

# E-Commerce Backend Docker Setup Script
echo "🚀 Setting up E-Commerce Backend with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📄 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual credentials before running the application"
    echo "   Required: CLOUDINARY_*, STRIPE_*, EMAIL_* variables"
else
    echo "✅ .env file exists"
fi

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir -p uploads
    touch uploads/.gitkeep
    echo "✅ Uploads directory created"
fi

# Build and start services
echo "🔨 Building and starting Docker services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is running"
else
    echo "❌ Redis failed to start"
fi

# Check API
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ API is running and healthy"
else
    echo "❌ API failed to start or is unhealthy"
fi

echo ""
echo "🎉 Docker setup complete!"
echo ""
echo "📋 Service URLs:"
echo "   API: http://localhost:3000"
echo "   Health Check: http://localhost:3000/health"
echo "   MongoDB: mongodb://localhost:27017"
echo "   Redis: redis://localhost:6379"
echo ""
echo "📖 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo ""
echo "⚠️  Don't forget to update your .env file with actual credentials!"
echo "📚 Read DOCKER.md for detailed documentation"
