# Docker Deployment Guide for E-Commerce Backend

## Prerequisites

1. **Docker Installation**
   - Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop
   - Verify installation: `docker --version`

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Fill in your actual environment variables (Cloudinary, Stripe, Email credentials)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

### Option 2: Docker Only (API + External Database)

```bash
# Build the image
docker build -t ecommerce-api .

# Run with external MongoDB
docker run -d \
  --name ecommerce-api \
  -p 3000:3000 \
  -e MONGO_URI=mongodb://your-mongo-host:27017/ecommerce \
  -e JWT_SECRET=your-jwt-secret \
  --env-file .env \
  ecommerce-api
```

## Services Overview

### 1. **API Service** (Port 3000)
- Main E-commerce backend
- Built from current directory
- Includes health checks
- Volume mapping for uploads

### 2. **MongoDB** (Port 27017)
- Database with authentication
- Persistent data storage
- Auto-initialization script

### 3. **Redis** (Port 6379)
- Caching and session storage
- Persistent data

### 4. **Nginx** (Port 80/443)
- Reverse proxy
- Load balancing
- Security headers
- Rate limiting

## Health Monitoring

The API includes comprehensive health checks:

```bash
# Check API health
curl http://localhost:3000/health

# Docker health check
docker ps  # Shows health status
```

## Environment Variables

### Required Variables
```env
MONGO_URI=mongodb://connection-string
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
STRIPE_SECRET_KEY=your-stripe-key
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

### Docker Compose Environment
The docker-compose.yml includes production-ready defaults. Update these for production:

```yaml
environment:
  - MONGO_URI=mongodb://admin:password123@mongodb:27017/ecommerce?authSource=admin
  - JWT_SECRET=change-this-in-production
```

## Production Deployment

### 1. **Update Environment Variables**
```bash
# Create production .env
cp .env.example .env.production

# Edit with production values
nano .env.production
```

### 2. **Build for Production**
```bash
# Build with production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

### 3. **Security Considerations**
- Change default MongoDB passwords
- Use strong JWT secret (minimum 32 characters)
- Enable SSL/TLS in production
- Configure firewall rules
- Regular security updates

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "3001:3000"  # Use different host port
   ```

2. **MongoDB Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   
   # Restart MongoDB
   docker-compose restart mongodb
   ```

3. **Environment Variables Not Loading**
   ```bash
   # Verify .env file exists
   ls -la .env
   
   # Check variable loading
   docker-compose config
   ```

### Useful Commands

```bash
# View all containers
docker ps -a

# Container logs
docker-compose logs [service_name]

# Execute commands in container
docker-compose exec api npm run test

# Clean up
docker system prune -f
docker volume prune -f

# Rebuild specific service
docker-compose up --build api

# Scale services
docker-compose up --scale api=3
```

## Data Persistence

### Database Backup
```bash
# Create backup
docker-compose exec mongodb mongodump --out /backup

# Restore backup
docker-compose exec mongodb mongorestore /backup
```

### Volume Management
```bash
# List volumes
docker volume ls

# Backup volume
docker run --rm -v ecommerce_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data
```

## Development vs Production

### Development (docker-compose.yml)
- Exposed database ports
- Development environment variables
- Volume mounting for hot reload
- Debug logging enabled

### Production Considerations
- Remove exposed database ports
- Use secrets management
- Enable SSL/TLS
- Configure monitoring
- Set up log aggregation
- Implement backup strategies

## API Endpoints

After deployment, your API will be available at:

- **Health Check**: `GET /health`
- **Authentication**: `POST /api/auth/register`, `POST /api/auth/login`
- **Products**: `GET /api/products`, `POST /api/products`
- **Cart**: `GET /api/cart`, `POST /api/cart`
- **Orders**: `GET /api/orders`, `POST /api/orders`
- **Payments**: `POST /api/payment/create-payment-intent`

## Support

For issues or questions:
1. Check Docker logs: `docker-compose logs`
2. Verify environment variables
3. Ensure all required services are running
4. Check network connectivity between containers
