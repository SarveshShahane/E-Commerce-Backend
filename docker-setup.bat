@echo off
REM E-Commerce Backend Docker Setup Script for Windows
echo 🚀 Setting up E-Commerce Backend with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Check if .env file exists
if not exist .env (
    echo 📄 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual credentials before running the application
    echo    Required: CLOUDINARY_*, STRIPE_*, EMAIL_* variables
) else (
    echo ✅ .env file exists
)

REM Create uploads directory if it doesn't exist
if not exist uploads (
    echo 📁 Creating uploads directory...
    mkdir uploads
    echo. > uploads\.gitkeep
    echo ✅ Uploads directory created
)

REM Build and start services
echo 🔨 Building and starting Docker services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🔍 Checking service health...

REM Check API health
curl -f http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API is running and healthy
) else (
    echo ❌ API failed to start or is unhealthy
)

echo.
echo 🎉 Docker setup complete!
echo.
echo 📋 Service URLs:
echo    API: http://localhost:3000
echo    Health Check: http://localhost:3000/health
echo    MongoDB: mongodb://localhost:27017
echo    Redis: redis://localhost:6379
echo.
echo 📖 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart: docker-compose restart
echo.
echo ⚠️  Don't forget to update your .env file with actual credentials!
echo 📚 Read DOCKER.md for detailed documentation
pause
